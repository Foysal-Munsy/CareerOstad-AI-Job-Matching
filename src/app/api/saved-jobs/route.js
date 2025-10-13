import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET: list saved jobs for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedCollection = await dbConnect(collectionNamesObj.savedJobsCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    const saved = await savedCollection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    const jobIds = saved.map((s) => new ObjectId(s.jobId)).filter(Boolean);
    const jobs = jobIds.length
      ? await jobsCollection.find({ _id: { $in: jobIds } }).toArray()
      : [];

    const jobsMap = new Map(jobs.map((j) => [j._id.toString(), j]));
    const result = saved.map((s) => ({
      ...s,
      job: jobsMap.get(s.jobId) || null,
    }));

    return NextResponse.json({ success: true, saved: result });
  } catch (e) {
    console.error("GET /saved-jobs error", e);
    return NextResponse.json(
      { error: "Failed to load saved jobs" },
      { status: 500 }
    );
  }
}

// POST: save a job
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { jobId } = body || {};
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const savedCollection = await dbConnect(collectionNamesObj.savedJobsCollection);

    const exists = await savedCollection.findOne({
      userEmail: session.user.email,
      jobId: jobId,
    });
    if (exists) {
      return NextResponse.json({ success: true, saved: true });
    }

    await savedCollection.insertOne({
      userEmail: session.user.email,
      jobId,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, saved: true });
  } catch (e) {
    console.error("POST /saved-jobs error", e);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

// DELETE: unsave a job
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const savedCollection = await dbConnect(collectionNamesObj.savedJobsCollection);
    await savedCollection.deleteOne({ userEmail: session.user.email, jobId });
    return NextResponse.json({ success: true, saved: false });
  } catch (e) {
    console.error("DELETE /saved-jobs error", e);
    return NextResponse.json(
      { error: "Failed to remove saved job" },
      { status: 500 }
    );
  }
}
