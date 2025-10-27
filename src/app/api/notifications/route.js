import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// GET /api/notifications - fetch notifications for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationsCollection = await dbConnect('notifications');
    const usersCollection = await dbConnect('sample-user');
    
    const user = await usersCollection.findOne(
      session.user.providerAccountId 
        ? { providerAccountId: session.user.providerAccountId } 
        : { email: session.user.email }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch notifications for this user
    const notifications = await notificationsCollection
      .find({
        $or: [
          { recipientEmail: session.user.email },
          { recipientRole: user.role },
          { recipientEmail: null, recipientRole: null } // Broadcast notifications
        ]
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Get unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    // Format notifications
    const formattedNotifications = notifications.map(n => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      time: n.createdAt,
      unread: !n.read,
      type: n.type || 'general',
      priority: n.priority || 'normal'
    }));

    return NextResponse.json({
      success: true,
      notifications: formattedNotifications,
      unreadCount
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({
      success: true,
      notifications: [],
      unreadCount: 0
    });
  }
}

// PUT /api/notifications - mark notification as read
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    const notificationsCollection = await dbConnect('notifications');

    if (markAllAsRead) {
      await notificationsCollection.updateMany(
        { 
          $or: [
            { recipientEmail: session.user.email },
            { recipientRole: session.user.role }
          ]
        },
        { $set: { read: true, readAt: new Date() } }
      );
      
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    } else if (notificationId) {
      const result = await notificationsCollection.updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true, readAt: new Date() } }
      );
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, message: "Notification marked as read" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

