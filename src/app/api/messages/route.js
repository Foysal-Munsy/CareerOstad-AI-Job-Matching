import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

// GET - Fetch messages for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const peerEmail = searchParams.get('peerEmail');

    const messagesCollection = await dbConnect(collectionNamesObj.messagesCollection);

    let query = {
      $or: [
        { receiverEmail: session.user.email },
        { senderEmail: session.user.email },
      ],
    };

    if (peerEmail) {
      query = {
        $or: [
          { senderEmail: session.user.email, receiverEmail: peerEmail },
          { senderEmail: peerEmail, receiverEmail: session.user.email },
        ],
      };
    }

    const messages = await messagesCollection
      .find(query)
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST - Send a new message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverEmail, subject, body: messageBody, jobId, applicationId, receiverRole } = body || {};

    if (!receiverEmail || !messageBody) {
      return NextResponse.json({ error: 'receiverEmail and body are required' }, { status: 400 });
    }

    const messagesCollection = await dbConnect(collectionNamesObj.messagesCollection);

    const doc = {
      senderEmail: session.user.email,
      senderRole: session.user.role || 'candidate',
      receiverEmail,
      receiverRole: receiverRole || null,
      subject: subject || null,
      body: messageBody,
      jobId: jobId || null,
      applicationId: applicationId || null,
      createdAt: new Date(),
      read: false,
    };

    const result = await messagesCollection.insertOne(doc);

    return NextResponse.json({ success: true, messageId: result.insertedId, message: doc });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}


