import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const CERTIFICATE_COLLECTION = 'certificates';
const PROGRESS_COLLECTION = 'course-progress';

function generateCertificateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CO-';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = session.user.email || session.user._id;
    
    const collection = await dbConnect(CERTIFICATE_COLLECTION);
    
    let query = { userId };
    if (courseId) {
      query.courseId = new ObjectId(courseId);
    }
    
    const certificates = await collection.find(query).toArray();
    
    return NextResponse.json({ 
      success: true, 
      certificates 
    });
    
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ 
      error: "Failed to fetch certificates" 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { courseId } = body;
    const userId = session.user.email || session.user._id;
    const userName = session.user.name || 'User';
    const userEmail = session.user.email || '';
    
    if (!courseId) {
      return NextResponse.json({ 
        error: "Course ID is required" 
      }, { status: 400 });
    }
    
    const progressCollection = await dbConnect(PROGRESS_COLLECTION);
    const certificateCollection = await dbConnect(CERTIFICATE_COLLECTION);
    const courseCollection = await dbConnect('courses');
    
    // Check if course is 100% complete
    const progress = await progressCollection.findOne({
      userId,
      courseId: new ObjectId(courseId)
    });
    
    if (!progress || !progress.isCompleted) {
      return NextResponse.json({ 
        error: "Course must be completed before issuing certificate" 
      }, { status: 400 });
    }
    
    // Check if certificate already exists
    const existingCertificate = await certificateCollection.findOne({
      userId,
      courseId: new ObjectId(courseId)
    });
    
    if (existingCertificate) {
      return NextResponse.json({ 
        success: true, 
        certificate: existingCertificate 
      });
    }
    
    // Get course details
    const course = await courseCollection.findOne({ _id: new ObjectId(courseId) });
    
    if (!course) {
      return NextResponse.json({ 
        error: "Course not found" 
      }, { status: 404 });
    }
    
    // Generate certificate
    const certificateId = generateCertificateId();
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-certificate/${certificateId}`;
    
    const certificate = {
      certificateId,
      userId,
      userName,
      userEmail,
      courseId: new ObjectId(courseId),
      courseTitle: course.title,
      courseCategory: course.category,
      issuedAt: new Date(),
      verificationUrl,
      isVerified: true,
      issuerName: 'CareerOstad',
      issuerLogo: ''
    };
    
    const result = await certificateCollection.insertOne(certificate);
    
    // Update progress to mark certificate as issued
    await progressCollection.updateOne(
      { userId, courseId: new ObjectId(courseId) },
      { 
        $set: { 
          certificateIssued: true,
          certificateId
        }
      }
    );
    
    return NextResponse.json({ 
      success: true, 
      certificate: { ...certificate, _id: result.insertedId }
    });
    
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json({ 
      error: "Failed to generate certificate" 
    }, { status: 500 });
  }
}

