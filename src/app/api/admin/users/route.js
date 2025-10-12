import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { collectionNamesObj } from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is admin
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    let userCollection;
    let users;
    
    try {
      userCollection = await dbConnect(collectionNamesObj.userCollection);
      users = await userCollection.find({}).toArray();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later.",
        success: false 
      }, { status: 503 });
    }

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      _id: user._id,
      name: user.name || 'Unknown User',
      email: user.email,
      role: user.role || 'candidate',
      createdAt: user.createdAt || new Date(),
      lastLogin: user.lastLogin || null,
      image: user.image || null
    }));

    return NextResponse.json({ 
      users: sanitizedUsers,
      total: sanitizedUsers.length,
      success: true 
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ 
      error: "Internal server error. Please try again later.",
      success: false 
    }, { status: 500 });
  }
}
