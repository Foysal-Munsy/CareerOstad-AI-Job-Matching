import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Get all featured jobs
    const featuredJobs = await jobsCollection
      .find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      success: true, 
      featuredJobs 
    });

  } catch (error) {
    console.error("Error fetching featured jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId, isFeatured } = await request.json();

    if (!jobId || typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { error: "Job ID and featured status are required" },
        { status: 400 }
      );
    }

    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Check if job exists
    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Update the job's featured status
    const updatedJob = await jobsCollection.findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: { isFeatured } },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ 
      success: true, 
      message: isFeatured ? "Job featured successfully" : "Job unfeatured successfully",
      job: updatedJob 
    });

  } catch (error) {
    console.error("Error updating featured status:", error);
    return NextResponse.json(
      { error: "Failed to update featured status" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobIds, isFeatured } = await request.json();

    if (!Array.isArray(jobIds) || typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { error: "Job IDs array and featured status are required" },
        { status: 400 }
      );
    }

    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Convert string IDs to ObjectIds
    const objectIds = jobIds.map(id => {
      if (!ObjectId.isValid(id)) {
        throw new Error(`Invalid job ID: ${id}`);
      }
      return new ObjectId(id);
    });

    // Update multiple jobs
    const result = await jobsCollection.updateMany(
      { _id: { $in: objectIds } },
      { $set: { isFeatured } }
    );

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${result.modifiedCount} jobs`,
      modifiedCount: result.modifiedCount 
    });

  } catch (error) {
    console.error("Error bulk updating featured status:", error);
    return NextResponse.json(
      { error: "Failed to bulk update featured status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Check if job ID is valid
    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json(
        { error: "Invalid job ID" },
        { status: 400 }
      );
    }

    // Remove featured status
    const updatedJob = await jobsCollection.findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: { isFeatured: false } },
      { returnDocument: 'after' }
    );

    if (!updatedJob) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Job unfeatured successfully",
      job: updatedJob 
    });

  } catch (error) {
    console.error("Error removing featured status:", error);
    return NextResponse.json(
      { error: "Failed to remove featured status" },
      { status: 500 }
    );
  }
}
