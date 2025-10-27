import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }
    
    const courseCollection = await dbConnect('courses');
    const progressCollection = await dbConnect('course-progress');
    const certificateCollection = await dbConnect('certificates');
    
    // Get all stats - use aggregation to calculate average instead of loading all records
    const [totalCourses, activeLearners, certificatesIssued, avgStats] = await Promise.all([
      courseCollection.countDocuments({}),
      progressCollection.distinct('userId'),
      certificateCollection.countDocuments({}),
      progressCollection.aggregate([
        {
          $group: {
            _id: null,
            avgProgress: { $avg: '$progressPercent' },
            totalProgress: { $sum: 1 }
          }
        }
      ]).toArray()
    ]);
    
    const averageCompletionRate = avgStats.length > 0 && avgStats[0].totalProgress > 0
      ? Math.round(avgStats[0].avgProgress * 100) / 100
      : 0;
    
    const coursesByCategory = await courseCollection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    const topEnrolledCourses = await courseCollection
      .find({})
      .sort({ enrolledStudents: -1 })
      .limit(5)
      .project({ _id: 1, title: 1, enrolledStudents: 1, category: 1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        activeLearners: activeLearners.length,
        certificatesIssued,
        averageCompletionRate: averageCompletionRate,
        coursesByCategory,
        topEnrolledCourses
      }
    });
    
  } catch (error) {
    console.error("Error fetching learning stats:", error);
    return NextResponse.json({
      error: "Failed to fetch learning stats"
    }, { status: 500 });
  }
}

