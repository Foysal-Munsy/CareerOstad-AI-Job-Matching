import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/admin/settings - fetch current settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    // Check if a settings collection exists, otherwise return defaults
    const settingsCollection = await dbConnect('settings');
    
    let settings = await settingsCollection.findOne({ _id: "platform_settings" });
    
    if (!settings) {
      // Return default settings
      settings = {
        general: {
          platformName: "CareerOstad",
          platformDescription: "AI-Powered Career Platform",
          maintenanceMode: false,
          allowRegistration: true,
          requireEmailVerification: false
        },
        jobs: {
          allowJobPosting: true,
          autoApproveJobs: true,
          maxJobsPerCompany: 50,
          jobExpiryDays: 90,
          requireJobModeration: false
        },
        applications: {
          allowApplications: true,
          autoRespond: false,
          maxApplicationsPerUser: 100,
          applicationStatusNotification: true
        },
        verification: {
          candidateVerificationPrice: 20,
          companyVerificationPrice: 50,
          enableVerification: true
        },
        notifications: {
          emailEnabled: true,
          pushEnabled: false,
          applicationNotifications: true,
          jobNotifications: true
        },
        security: {
          maxLoginAttempts: 5,
          sessionTimeout: 24, // hours
          passwordMinLength: 8,
          enableTwoFactor: false
        },
        features: {
          aiJobMatching: true,
          aiCoverLetter: true,
          aiResumeGenerator: true,
          careerAdvisor: true,
          blogSystem: true
        }
      };
    }

    return NextResponse.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    // Return default settings on error
    return NextResponse.json({
      success: true,
      settings: {
        general: {
          platformName: "CareerOstad",
          platformDescription: "AI-Powered Career Platform",
          maintenanceMode: false,
          allowRegistration: true,
          requireEmailVerification: false
        },
        jobs: {
          allowJobPosting: true,
          autoApproveJobs: true,
          maxJobsPerCompany: 50,
          jobExpiryDays: 90,
          requireJobModeration: false
        },
        applications: {
          allowApplications: true,
          autoRespond: false,
          maxApplicationsPerUser: 100,
          applicationStatusNotification: true
        },
        verification: {
          candidateVerificationPrice: 20,
          companyVerificationPrice: 50,
          enableVerification: true
        },
        notifications: {
          emailEnabled: true,
          pushEnabled: false,
          applicationNotifications: true,
          jobNotifications: true
        },
        security: {
          maxLoginAttempts: 5,
          sessionTimeout: 24,
          passwordMinLength: 8,
          enableTwoFactor: false
        },
        features: {
          aiJobMatching: true,
          aiCoverLetter: true,
          aiResumeGenerator: true,
          careerAdvisor: true,
          blogSystem: true
        }
      }
    });
  }
}

// PUT /api/admin/settings - update settings
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const settings = body.settings;

    if (!settings) {
      return NextResponse.json({ error: "Settings data required" }, { status: 400 });
    }

    const settingsCollection = await dbConnect('settings');
    
    const result = await settingsCollection.updateOne(
      { _id: "platform_settings" },
      { 
        $set: { 
          ...settings,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully"
      });
    }

    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

