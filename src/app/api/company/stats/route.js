import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/company/stats - counts scoped to the authenticated company
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "company" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);
    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);

    const companyQuery = {
      $or: [
        { companyEmail: session.user.email },
        { companyProviderAccountId: session.user.providerAccountId },
      ],
    };

    const companyJobs = await jobsCollection.find(companyQuery).project({ _id: 1, status: 1 }).toArray();
    const jobIds = companyJobs.map((j) => j._id.toString());

    const [activeJobs, applications] = await Promise.all([
      Promise.resolve(companyJobs.filter((j) => j.status === "open").length),
      applicationsCollection.countDocuments({ jobId: { $in: jobIds } }),
    ]);

    // Interviews can be derived from application status
    const interviews = await applicationsCollection.countDocuments({
      jobId: { $in: jobIds },
      status: "Interview Scheduled",
    });

    return NextResponse.json({
      success: true,
      stats: {
        activeJobs,
        applications,
        interviews,
      },
    });
  } catch (error) {
    console.error("Error fetching company stats:", error);
    return NextResponse.json({ error: "Failed to fetch company stats" }, { status: 500 });
  }
}


