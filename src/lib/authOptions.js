import { loginUser } from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import dbConnect, { collectionNamesObj } from "./dbConnect";
// import { cookies } from 'next/headers'; // For Next.js app router - causing issues in Next.js 15

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" }
            },
            async authorize(credentials, req) {
                console.log('Credentials received:', credentials)
                // Add logic here to look up the user from the credentials supplied
                const user = await loginUser(credentials)
                console.log('User from login:', user)
                if (user) {
                    // Add role to user object from credentials
                    user.role = credentials.role || user.role || 'candidate';
                    console.log('User with role:', user);
                    // Any object returned will be saved in `user` property of the JWT
                    return user
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })


    ],
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }, req) {
            // Console these to check necessary properites
            console.log({ user, account, profile, email, credentials })
            
            // Get role from various sources
            let role = user.role || 'candidate';
            
            // For social login, check if role is passed in query params
            if (req?.query?.role) {
                role = req.query.role;
            }
            
            console.log('Final role for user:', role);
            
            if (account) {
                const { providerAccountId, provider } = account
                const { email, image, name } = user
                // console.log(email)
                const userCollection = dbConnect(collectionNamesObj.userCollection)
                const isExisted = await userCollection.findOne({ providerAccountId })
                console.log('Existing user:', isExisted);
                
                if (!isExisted) {
                    const payload = { providerAccountId, provider, email, image, name, role }
                    console.log('Creating new user with payload:', payload);
                    await userCollection.insertOne(payload)
                } else {
                    // Update existing user's role if role is provided
                    if (role && role !== isExisted.role) {
                        console.log('Updating existing user role to:', role);
                        await userCollection.updateOne(
                            { providerAccountId }, 
                            { $set: { role: role } }
                        );
                    }
                }
            }
            return true
        },
        async jwt({ token, user, account, profile, trigger, session }) {
            try {
                // On initial sign-in, enrich token with role from DB
                if (user) {
                    const userCollection = dbConnect(collectionNamesObj.userCollection)
                    const identifier = user.providerAccountId ? { providerAccountId: user.providerAccountId } : { email: user.email }
                    const existing = await userCollection.findOne(identifier)
                    console.log('JWT callback - user found:', existing);
                    if (existing?.role) {
                        token.role = existing.role
                        console.log('JWT callback - role set:', existing.role);
                    }
                }
                
                // Always refresh role from DB on each JWT call to get latest role
                if (token?.email || token?.providerAccountId) {
                    const userCollection = dbConnect(collectionNamesObj.userCollection)
                    const identifier = token.providerAccountId ? { providerAccountId: token.providerAccountId } : { email: token.email }
                    const existing = await userCollection.findOne(identifier)
                    if (existing?.role) {
                        token.role = existing.role
                        console.log('JWT callback - refreshed role:', existing.role);
                    }
                }
            } catch (e) {
                console.error('jwt callback error:', e)
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token?.role || session.user.role
                
                // For company users, get the latest company name from database
                if (session.user.role === 'company' || session.user.role === 'admin') {
                    try {
                        const userCollection = dbConnect(collectionNamesObj.userCollection)
                        const identifier = session.user.providerAccountId ? { providerAccountId: session.user.providerAccountId } : { email: session.user.email }
                        const user = await userCollection.findOne(identifier)
                        if (user?.company?.name) {
                            session.user.companyName = user.company.name
                            session.user.name = user.name || user.company.name
                        }
                    } catch (e) {
                        console.error('Error fetching company name in session:', e)
                    }
                }
            }
            return session
        },
    }
}