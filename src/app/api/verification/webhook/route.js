import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      
      // Check if this is a verification payment
      if (paymentIntent.metadata?.verificationType === 'profile_verification') {
        const { userEmail, userType } = paymentIntent.metadata;
        
        if (!userEmail) {
          console.error("No user email in payment metadata");
          return NextResponse.json({ error: "Missing user email" }, { status: 400 });
        }

        // Update user verification status
        const userCollection = dbConnect(collectionNamesObj.userCollection);
        
        const updateResult = await userCollection.updateOne(
          { email: userEmail },
          { 
            $set: { 
              isVerified: true,
              verifiedAt: new Date(),
              verificationType: userType,
              verificationPaymentId: paymentIntent.id
            }
          }
        );

        if (updateResult.modifiedCount === 0) {
          console.error(`Failed to update verification status for user: ${userEmail}`);
          return NextResponse.json({ error: "Failed to update user verification" }, { status: 500 });
        }

        console.log(`User ${userEmail} verified successfully as ${userType}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

