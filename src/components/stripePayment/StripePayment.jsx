"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import CheckoutPage from "./CheckoutPage";
if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function StripePayment() {
  const amount = 29.99;
  return (
    <div>
      <div className="container mx-auto p-10 text-secondary-text  text-center border-base-200 m-10 rounded-md bg-base-300">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Foysal</h1>
          <h2 className="text-2xl">
            has requested
            <span className="font-bold"> ${amount}</span>
          </h2>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
    </div>
  );
}
