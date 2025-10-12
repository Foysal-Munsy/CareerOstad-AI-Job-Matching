import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const identifier = session.user.providerAccountId 
      ? { providerAccountId: session.user.providerAccountId } 
      : { email: session.user.email };
    
    const user = await userCollection.findOne(identifier);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      isVerified: user.isVerified || false,
      verifiedAt: user.verifiedAt || null,
      verificationType: user.verificationType || null,
      userRole: user.role || 'candidate'
    });
  } catch (error) {
    console.error("Error checking verification status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


