import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET - Fetch all applications for a candidate
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationsCollection = dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

    // Get applications for this user
    const applications = await applicationsCollection.find({ 
      candidateEmail: session.user.email 
    }).sort({ createdAt: -1 }).toArray();

    // Get job details for each application
    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = await jobsCollection.findOne({ _id: new ObjectId(app.jobId) });
        return {
          ...app,
          job: job || null
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      applications: applicationsWithJobs 
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch applications' 
    }, { status: 500 });
  }
}

// POST - Create new job application
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, coverLetter, resumeUrl, expectedSalary } = body;

    if (!jobId) {
      return NextResponse.json({ 
        error: 'Job ID is required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(jobId)) {
      return NextResponse.json({ 
        error: 'Invalid job ID' 
      }, { status: 400 });
    }

    const applicationsCollection = dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

    // Check if job exists
    const job = await jobsCollection.findOne({ _id: new ObjectId(jobId) });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await applicationsCollection.findOne({
      candidateEmail: session.user.email,
      jobId: jobId
    });

    if (existingApplication) {
      return NextResponse.json({ 
        error: 'You have already applied to this job' 
      }, { status: 400 });
    }

    // Create new application
    const application = {
      candidateEmail: session.user.email,
      candidateName: session.user.name || '',
      jobId: jobId,
      coverLetter: coverLetter || '',
      resumeUrl: resumeUrl || '',
      expectedSalary: expectedSalary || '',
      status: 'Applied',
      appliedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await applicationsCollection.insertOne(application);
    
    // Add the job details to the response
    const applicationWithJob = {
      ...application,
      _id: result.insertedId,
      job: job
    };

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      application: applicationWithJob 
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ 
      error: 'Failed to submit application' 
    }, { status: 500 });
  }
}
