import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const COLLECTION_NAME = 'courses';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const collection = await dbConnect(COLLECTION_NAME);
    
    const course = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!course) {
      return NextResponse.json({ 
        error: "Course not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      course 
    });
    
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ 
      error: "Failed to fetch course" 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    const { id } = params;
    const body = await request.json();
    const collection = await dbConnect(COLLECTION_NAME);
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    };
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: "Course not found" 
      }, { status: 404 });
    }
    
    const updatedCourse = await collection.findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ 
      success: true, 
      course: updatedCourse 
    });
    
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ 
      error: "Failed to update course" 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    const { id } = params;
    const collection = await dbConnect(COLLECTION_NAME);
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: "Course not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Course deleted successfully" 
    });
    
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ 
      error: "Failed to delete course" 
    }, { status: 500 });
  }
}

