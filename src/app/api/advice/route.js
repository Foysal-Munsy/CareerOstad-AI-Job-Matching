import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// Public advice feed: published posts
export async function GET() {
  try {
    const adviceCollection = await dbConnect(collectionNamesObj.adviceCollection);
    const adviceList = await adviceCollection
      .find({ status: { $in: ['published', 'public'] } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: adviceList });
  } catch (error) {
    console.error("Error fetching advice:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}