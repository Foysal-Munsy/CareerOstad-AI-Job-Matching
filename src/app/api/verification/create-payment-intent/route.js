import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userType } = await request.json();
    
    // Validate user type
    if (!userType || !['candidate', 'company'].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    // Check if user is already verified
    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const identifier = session.user.providerAccountId 
      ? { providerAccountId: session.user.providerAccountId } 
      : { email: session.user.email };
    
    const user = await userCollection.findOne(identifier);
    
    if (user?.isVerified) {
      return NextResponse.json({ error: "User is already verified" }, { status: 400 });
    }

    // Set amount based on user type
    const amount = userType === 'candidate' ? 2000 : 5000; // $20 for candidate, $50 for company (in cents)

    // Create payment intent with metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userEmail: session.user.email,
        userType: userType,
        verificationType: 'profile_verification'
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: amount / 100 // Return amount in dollars for display
    });
  } catch (error) {
    console.error("Verification payment intent error:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
