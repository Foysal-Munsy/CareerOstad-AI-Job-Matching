import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { collectionNamesObj } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    // Validate input
    if (!userId || !role) {
      return NextResponse.json({ 
        error: "User ID and role are required",
        success: false 
      }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'company', 'candidate'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ 
        error: "Invalid role. Must be admin, company, or candidate",
        success: false 
      }, { status: 400 });
    }

    // Convert userId to ObjectId if it's a string
    let userObjectId;
    try {
      userObjectId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    } catch (error) {
      return NextResponse.json({ 
        error: "Invalid user ID format",
        success: false 
      }, { status: 400 });
    }

    // Prevent admin from changing their own role
    if (session.user._id === userId && role !== 'admin') {
      return NextResponse.json({ 
        error: "You cannot change your own role",
        success: false 
      }, { status: 400 });
    }

    let userCollection;
    let result;
    
    try {
      userCollection = await dbConnect(collectionNamesObj.userCollection);
      
      // Check if user exists
      const existingUser = await userCollection.findOne({ _id: userObjectId });
      if (!existingUser) {
        return NextResponse.json({ 
          error: "User not found",
          success: false 
        }, { status: 404 });
      }

      // Update user role
      result = await userCollection.updateOne(
        { _id: userObjectId },
        { 
          $set: { 
            role: role,
            updatedAt: new Date()
          } 
        }
      );

    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later.",
        success: false 
      }, { status: 503 });
    }

    if (result.acknowledged && result.modifiedCount > 0) {
      return NextResponse.json({ 
        message: "User role updated successfully",
        success: true,
        updatedUser: {
          _id: userObjectId,
          role: role
        }
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to update user role",
        success: false 
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ 
      error: "Internal server error. Please try again later.",
      success: false 
    }, { status: 500 });
  }
}
