import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/admin/stats - aggregate counts for admin dashboard/sidebar
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const usersCollection = dbConnect(collectionNamesObj.userCollection);
    const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);
    const applicationsCollection = dbConnect(collectionNamesObj.applicationsCollection);

    const [totalUsers, totalCompanies, activeJobs, totalApplications] = await Promise.all([
      usersCollection.countDocuments({}),
      usersCollection.countDocuments({ role: "company" }),
      jobsCollection.countDocuments({ status: "open" }),
      applicationsCollection.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        users: totalUsers,
        companies: totalCompanies,
        activeJobs,
        applications: totalApplications,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}


