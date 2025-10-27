import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect, { collectionNamesObj } from "@/lib/dbConnect";

// GET /api/admin/notifications - fetch all notifications
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const notificationsCollection = await dbConnect('notifications');
    const usersCollection = await dbConnect(collectionNamesObj.userCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);
    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);

    // Get all notifications
    const notifications = await notificationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // Get statistics
    const [totalNotifications, unreadNotifications] = await Promise.all([
      notificationsCollection.countDocuments({}),
      notificationsCollection.countDocuments({ read: false })
    ]);

    // Get recent stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [notificationsLast7Days, notificationsLast30Days] = await Promise.all([
      notificationsCollection.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      notificationsCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Group by type
    const typeBreakdown = await notificationsCollection.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    // Group by status
    const statusBreakdown = await notificationsCollection.aggregate([
      {
        $group: {
          _id: "$read",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    return NextResponse.json({
      success: true,
      notifications: notifications.map(n => ({
        _id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        priority: n.priority,
        read: n.read || false,
        createdAt: n.createdAt,
        readAt: n.readAt,
        recipientEmail: n.recipientEmail,
        recipientRole: n.recipientRole
      })),
      stats: {
        totalNotifications,
        unreadNotifications,
        notificationsLast7Days,
        notificationsLast30Days,
        typeBreakdown,
        statusBreakdown
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ 
      success: true,
      notifications: [],
      stats: {
        totalNotifications: 0,
        unreadNotifications: 0,
        notificationsLast7Days: 0,
        notificationsLast30Days: 0,
        typeBreakdown: [],
        statusBreakdown: []
      }
    });
  }
}

// POST /api/admin/notifications - create a new notification
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, priority, recipientEmail, recipientRole, sendToAll } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const notificationsCollection = await dbConnect('notifications');
    
    if (sendToAll) {
      // Send to all users - process in batches to prevent memory issues
      const usersCollection = await dbConnect(collectionNamesObj.userCollection);
      
      let totalUsers = 0;
      const batchSize = 500;
      let skip = 0;
      
      while (true) {
        const users = await usersCollection.find({}).skip(skip).limit(batchSize).toArray();
        
        if (users.length === 0) break;
        
        const notifications = users.map(user => ({
          title,
          message,
          type: type || "general",
          priority: priority || "normal",
          recipientEmail: user.email,
          recipientRole: user.role,
          read: false,
          createdAt: new Date()
        }));

        await notificationsCollection.insertMany(notifications);
        totalUsers += users.length;
        skip += batchSize;
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Notification sent to ${totalUsers} users`,
        count: totalUsers
      });
    } else {
      // Send to specific recipients
      const notification = {
        title,
        message,
        type: type || "general",
        priority: priority || "normal",
        recipientEmail: recipientEmail || null,
        recipientRole: recipientRole || null,
        read: false,
        createdAt: new Date()
      };

      const result = await notificationsCollection.insertOne(notification);
      
      return NextResponse.json({ 
        success: true, 
        message: "Notification created successfully",
        notificationId: result.insertedId
      });
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}

// PUT /api/admin/notifications - mark notifications as read/unread
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
    const { notificationIds, read, markAllAsRead } = body;

    const notificationsCollection = await dbConnect('notifications');

    if (markAllAsRead) {
      const result = await notificationsCollection.updateMany(
        { read: false },
        { $set: { read: true, readAt: new Date() } }
      );
      
      return NextResponse.json({ 
        success: true, 
        message: `Marked ${result.modifiedCount} notifications as read`
      });
    } else if (Array.isArray(notificationIds)) {
      const { ObjectId } = await import('mongodb');
      const ids = notificationIds.map(id => new ObjectId(id));
      
      const result = await notificationsCollection.updateMany(
        { _id: { $in: ids } },
        { $set: { read, readAt: read ? new Date() : null } }
      );
      
      return NextResponse.json({ 
        success: true, 
        message: `Updated ${result.modifiedCount} notifications`
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}

// DELETE /api/admin/notifications - delete notifications
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const deleteAllRead = searchParams.get('deleteAllRead') === 'true';

    const notificationsCollection = await dbConnect('notifications');

    if (deleteAllRead) {
      const result = await notificationsCollection.deleteMany({ read: true });
      return NextResponse.json({ 
        success: true, 
        message: `Deleted ${result.deletedCount} read notifications`
      });
    } else if (notificationId) {
      const { ObjectId } = await import('mongodb');
      const result = await notificationsCollection.deleteOne({ _id: new ObjectId(notificationId) });
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Notification not found" }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, message: "Notification deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}

