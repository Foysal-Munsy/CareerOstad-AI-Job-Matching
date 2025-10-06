import dbConnect, { collectionNamesObj }  from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return Response.json({ message: "Missing id" }, { status: 400 });
    }

    const collection = await dbConnect(collectionNamesObj.userCollection);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    return Response.json(result, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Failed to delete", error: String(error) }, { status: 500 });
  }
}