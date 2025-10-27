import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";

const COLLECTION_NAME = 'courses';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const isActive = searchParams.get('isActive') !== 'false';
    
    const collection = await dbConnect(COLLECTION_NAME);
    
    let query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (isActive !== undefined) query.isActive = isActive;
    
    const courses = await collection.find(query).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ 
      success: true, 
      courses 
    });
    
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch courses" 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    const body = await request.json();
    const collection = await dbConnect(COLLECTION_NAME);
    
    const course = {
      ...body,
      enrolledStudents: 0,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(course);
    
    return NextResponse.json({ 
      success: true, 
      course: { ...course, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create course" 
    }, { status: 500 });
  }
}

