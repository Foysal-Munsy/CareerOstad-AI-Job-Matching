import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const PROGRESS_COLLECTION = 'course-progress';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = session.user.email || session.user._id;
    
    const collection = await dbConnect(PROGRESS_COLLECTION);
    
    let query = { userId };
    if (courseId) {
      query.courseId = new ObjectId(courseId);
    }
    
    const progress = await collection.find(query).toArray();
    
    return NextResponse.json({ 
      success: true, 
      progress 
    });
    
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ 
      error: "Failed to fetch progress" 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { courseId, lessonOrder, timeSpent } = body;
    const userId = session.user.email || session.user._id;
    
    if (!courseId || lessonOrder === undefined) {
      return NextResponse.json({ 
        error: "Course ID and lesson order are required" 
      }, { status: 400 });
    }
    
    const collection = await dbConnect(PROGRESS_COLLECTION);
    
    // Find progress record
    const progress = await collection.findOne({
      userId,
      courseId: new ObjectId(courseId)
    });
    
    if (!progress) {
      return NextResponse.json({ 
        error: "Progress not found. Please enroll in the course first." 
      }, { status: 404 });
    }
    
    // Check if lesson already completed
    const isAlreadyCompleted = progress.completedLessons.some(
      lesson => lesson.lessonOrder === lessonOrder
    );
    
    let updateData;
    if (!isAlreadyCompleted) {
      // Add lesson to completed list
      const updatedCompletedLessons = [
        ...progress.completedLessons,
        {
          lessonOrder,
          completedAt: new Date()
        }
      ];
      
      const progressPercent = progress.totalLessons > 0 
        ? Math.round((updatedCompletedLessons.length / progress.totalLessons) * 100) 
        : 0;
      
      const isCompleted = progressPercent === 100;
      
      updateData = {
        $set: {
          completedLessons: updatedCompletedLessons,
          progressPercent,
          lastAccessedAt: new Date(),
          isCompleted,
          ...(isCompleted && { completedAt: new Date() })
        }
      };
      
      if (timeSpent) {
        updateData.$inc = { timeSpent: timeSpent || 0 };
      }
    } else {
      // Just update last accessed
      updateData = {
        $set: {
          lastAccessedAt: new Date()
        }
      };
      
      if (timeSpent) {
        updateData.$inc = { timeSpent: timeSpent || 0 };
      }
    }
    
    await collection.updateOne(
      { userId, courseId: new ObjectId(courseId) },
      updateData
    );
    
    const updatedProgress = await collection.findOne({
      userId,
      courseId: new ObjectId(courseId)
    });
    
    return NextResponse.json({ 
      success: true, 
      progress: updatedProgress 
    });
    
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json({ 
      error: "Failed to update progress" 
    }, { status: 500 });
  }
}

