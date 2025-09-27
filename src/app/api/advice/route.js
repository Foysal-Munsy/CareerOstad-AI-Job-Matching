import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
export async function GET() {
    try {
        const adviceCollection = dbConnect(collectionNamesObj.adviceCollection);
        const adviceList = await adviceCollection.find({}).toArray();
        return NextResponse.json({ advice: adviceList });
    }
    catch (error) {
        console.error("Error fetching advice:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}