import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET - Fetch all applications for company's jobs
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'company' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Get company's jobs first
    const companyJobs = await jobsCollection.find({
      $or: [
        { companyEmail: session.user.email },
        { companyProviderAccountId: session.user.providerAccountId }
      ]
    }).toArray();

    const jobIds = companyJobs.map(job => job._id.toString());

    // Get applications for company's jobs
    const applications = await applicationsCollection.find({ 
      jobId: { $in: jobIds }
    }).sort({ createdAt: -1 }).toArray();

    // Get job details for each application
    const applicationsWithJobs = await Promise.all(
      applications.map(async (app) => {
        const job = companyJobs.find(j => j._id.toString() === app.jobId);
        return {
          ...app,
          job: job || null
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      applications: applicationsWithJobs,
      jobs: companyJobs
    });

  } catch (error) {
    console.error('Error fetching company applications:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch applications' 
    }, { status: 500 });
  }
}

// PUT - Update application status
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'company' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { applicationId, status, notes } = body;

    if (!applicationId || !status) {
      return NextResponse.json({ 
        error: 'Application ID and status are required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json({ 
        error: 'Invalid application ID' 
      }, { status: 400 });
    }

    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Verify the application belongs to company's job
    const application = await applicationsCollection.findOne({ 
      _id: new ObjectId(applicationId) 
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const job = await jobsCollection.findOne({ _id: new ObjectId(application.jobId) });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if job belongs to company
    const isCompanyJob = job.companyEmail === session.user.email || 
                        job.companyProviderAccountId === session.user.providerAccountId;

    if (!isCompanyJob) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update application status
    const updateData = {
      status: status,
      updatedAt: new Date()
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (status === 'Under Review' || status === 'Shortlisted' || status === 'Interview Scheduled') {
      updateData.reviewedAt = new Date();
    }

    const result = await applicationsCollection.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Get updated application
    const updatedApplication = await applicationsCollection.findOne({ 
      _id: new ObjectId(applicationId) 
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json({ 
      error: 'Failed to update application status' 
    }, { status: 500 });
  }
}

// DELETE - Delete application (optional)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'company' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json({ 
        error: 'Application ID is required' 
      }, { status: 400 });
    }

    if (!ObjectId.isValid(applicationId)) {
      return NextResponse.json({ 
        error: 'Invalid application ID' 
      }, { status: 400 });
    }

    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Verify the application belongs to company's job
    const application = await applicationsCollection.findOne({ 
      _id: new ObjectId(applicationId) 
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const job = await jobsCollection.findOne({ _id: new ObjectId(application.jobId) });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if job belongs to company
    const isCompanyJob = job.companyEmail === session.user.email || 
                        job.companyProviderAccountId === session.user.providerAccountId;

    if (!isCompanyJob) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete application
    const result = await applicationsCollection.deleteOne({ 
      _id: new ObjectId(applicationId) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json({ 
      error: 'Failed to delete application' 
    }, { status: 500 });
  }
}
