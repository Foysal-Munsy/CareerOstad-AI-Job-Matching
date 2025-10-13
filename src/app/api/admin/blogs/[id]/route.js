import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    const col = await dbConnect(collectionNamesObj.adviceCollection);
    const item = await col.findOne({ _id: new ObjectId(id) });
    if (!item) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    const updates = await request.json();
    const col = await dbConnect(collectionNamesObj.adviceCollection);
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    return NextResponse.json({ success: true, data: result.value });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ success: false, message: "Invalid id" }, { status: 400 });
    const col = await dbConnect(collectionNamesObj.adviceCollection);
    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


