import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const COURSE_COLLECTION = 'courses';
const PROGRESS_COLLECTION = 'course-progress';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { courseId } = body;
    const userId = session.user.email || session.user._id;
    
    if (!courseId) {
      return NextResponse.json({ 
        error: "Course ID is required" 
      }, { status: 400 });
    }
    
    const courseCollection = await dbConnect(COURSE_COLLECTION);
    const progressCollection = await dbConnect(PROGRESS_COLLECTION);
    
    // Check if course exists
    const course = await courseCollection.findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return NextResponse.json({ 
        error: "Course not found" 
      }, { status: 404 });
    }
    
    // Check if already enrolled
    const existingProgress = await progressCollection.findOne({
      userId,
      courseId: new ObjectId(courseId)
    });
    
    if (existingProgress) {
      return NextResponse.json({ 
        success: true, 
        message: "Already enrolled in this course",
        progress: existingProgress
      });
    }
    
    // Create progress entry
    const progress = {
      userId,
      courseId: new ObjectId(courseId),
      completedLessons: [],
      totalLessons: course.lessons ? course.lessons.length : 0,
      progressPercent: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      isCompleted: false,
      certificateIssued: false,
      certificateId: '',
      timeSpent: 0
    };
    
    const result = await progressCollection.insertOne(progress);
    
    // Increment enrolled students count
    await courseCollection.updateOne(
      { _id: new ObjectId(courseId) },
      { $inc: { enrolledStudents: 1 } }
    );
    
    return NextResponse.json({ 
      success: true, 
      message: "Successfully enrolled in course",
      progress: { ...progress, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error("Error enrolling in course:", error);
    return NextResponse.json({ 
      error: "Failed to enroll in course" 
    }, { status: 500 });
  }
}

