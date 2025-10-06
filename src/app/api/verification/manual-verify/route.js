import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userType } = await request.json();
    
    if (!userType || !['candidate', 'company'].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 });
    }

    const userCollection = dbConnect(collectionNamesObj.userCollection);
    const identifier = session.user.providerAccountId 
      ? { providerAccountId: session.user.providerAccountId } 
      : { email: session.user.email };
    
    // Update user verification status manually
    const updateResult = await userCollection.updateOne(
      identifier,
      { 
        $set: { 
          isVerified: true,
          verifiedAt: new Date(),
          verificationType: userType,
          verificationPaymentId: 'manual_verification_' + Date.now()
        }
      }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ error: "Failed to update user verification" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: "User verified successfully",
      isVerified: true,
      verifiedAt: new Date(),
      verificationType: userType
    });
  } catch (error) {
    console.error("Manual verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
