import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"

export const middleware = async (req) => {
    const token = await getToken({req});
    //console.log("From Middleware", token)
    const isTokenOk = Boolean(token)

    if(token){
        return NextResponse.next();
    }
    else{
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
        return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl.origin))
        //return NextResponse.redirect(`/login?callbackUrl=${callbackUrl}`, req.url);
    }
    
    
}
export const config = {
    matcher: [
        '/advice',
        '/dashboard',
        '/jobs/:path*/apply',
    ],
}