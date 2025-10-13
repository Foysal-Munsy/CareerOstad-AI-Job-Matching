import { NextResponse } from "next/server";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

export async function GET() {
  try {
    const col = await dbConnect(collectionNamesObj.adviceCollection);
    const items = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, category, image, status, author } = body || {};
    if (!title || !content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }
    const col = await dbConnect(collectionNamesObj.adviceCollection);
    const now = new Date();
    const baseSlug = String(title).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${now.getTime()}`;
    const doc = {
      title,
      content,
      category: category || "General",
      image: image || "",
      status: status || "draft",
      author: author || "Admin",
      slug,
      createdAt: now,
      updatedAt: now,
    };
    const result = await col.insertOne(doc);
    return NextResponse.json({ success: true, data: { ...doc, _id: result.insertedId } });
  } catch (e) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


