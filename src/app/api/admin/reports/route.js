import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET /api/admin/reports - comprehensive reports data for admin
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const usersCollection = await dbConnect(collectionNamesObj.userCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);
    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);
    const savedJobsCollection = await dbConnect(collectionNamesObj.savedJobsCollection);
    const adviceCollection = await dbConnect(collectionNamesObj.adviceCollection);

    // Basic counts
    const [
      totalUsers,
      totalCompanies,
      totalCandidates,
      totalJobs,
      activeJobs,
      closedJobs,
      totalApplications,
      totalSavedJobs,
      totalBlogs
    ] = await Promise.all([
      usersCollection.countDocuments({}),
      usersCollection.countDocuments({ role: "company" }),
      usersCollection.countDocuments({ role: "candidate" }),
      jobsCollection.countDocuments({}),
      jobsCollection.countDocuments({ status: "open" }),
      jobsCollection.countDocuments({ status: "closed" }),
      applicationsCollection.countDocuments({}),
      savedJobsCollection.countDocuments({}),
      adviceCollection.countDocuments({})
    ]);

    // User role breakdown
    const rolesBreakdown = await usersCollection.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    // User growth in last 7 days and 30 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      usersLast7Days,
      usersLast30Days,
      jobsLast7Days,
      jobsLast30Days,
      applicationsLast7Days,
      applicationsLast30Days
    ] = await Promise.all([
      usersCollection.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      usersCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      jobsCollection.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      jobsCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      applicationsCollection.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
      applicationsCollection.countDocuments({ appliedAt: { $gte: thirtyDaysAgo } })
    ]);

    // Application status breakdown
    const applicationStatusBreakdown = await applicationsCollection.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Top companies by job count
    const topCompanies = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$companyName",
          jobCount: { $sum: 1 },
          avgVacancies: { $avg: "$numberOfVacancies" }
        }
      },
      { $sort: { jobCount: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Job category breakdown
    const categoryBreakdown = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Employment type breakdown
    const employmentTypeBreakdown = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$employmentType",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Work mode breakdown
    const workModeBreakdown = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$workMode",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Verified users count
    const verifiedUsers = await usersCollection.countDocuments({ isVerified: true });

    // Most applied jobs
    const mostAppliedJobs = await applicationsCollection.aggregate([
      {
        $group: {
          _id: "$jobId",
          applicationCount: { $sum: 1 }
        }
      },
      { $sort: { applicationCount: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Get job details for most applied jobs
    const jobDetails = await Promise.all(
      mostAppliedJobs.map(async (item) => {
        try {
          const job = await jobsCollection.findOne({ _id: new ObjectId(item._id) });
          return {
            jobId: item._id,
            jobTitle: job?.title || "Unknown Job",
            companyName: job?.companyName || "Unknown Company",
            applicationCount: item.applicationCount
          };
        } catch (e) {
          return {
            jobId: item._id,
            jobTitle: "Unknown Job",
            companyName: "Unknown Company",
            applicationCount: item.applicationCount
          };
        }
      })
    );

    // Recent activity (last 10 activities)
    const recentJobs = await jobsCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
    const recentApplications = await applicationsCollection.find({}).sort({ appliedAt: -1 }).limit(10).toArray();
    const recentUsers = await usersCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray();

    // Job level breakdown
    const jobLevelBreakdown = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$jobLevel",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Featured jobs count
    const featuredJobsCount = await jobsCollection.countDocuments({ isFeatured: true });

    // Active vs Inactive jobs
    const jobsByStatus = await jobsCollection.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    return NextResponse.json({
      success: true,
      reports: {
        summary: {
          totalUsers,
          totalCompanies,
          totalCandidates,
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplications,
          totalSavedJobs,
          totalBlogs,
          verifiedUsers,
          featuredJobsCount
        },
        growth: {
          usersLast7Days,
          usersLast30Days,
          jobsLast7Days,
          jobsLast30Days,
          applicationsLast7Days,
          applicationsLast30Days
        },
        breakdowns: {
          roles: rolesBreakdown,
          applicationStatus: applicationStatusBreakdown,
          categories: categoryBreakdown,
          employmentTypes: employmentTypeBreakdown,
          workModes: workModeBreakdown,
          jobLevels: jobLevelBreakdown,
          jobsByStatus
        },
        topPerformers: {
          companies: topCompanies,
          mostAppliedJobs: jobDetails
        },
        recentActivity: {
          jobs: recentJobs,
          applications: recentApplications,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

