import { NextResponse } from 'next/server';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// Public profile by email - no auth required, returns sanitized info
export async function GET(request, context) {
  try {
    const { email } = await context.params;
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const userCollection = dbConnect(collectionNamesObj.userCollection);
    const applicationsCollection = dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = dbConnect(collectionNamesObj.jobsCollection);

    const user = await userCollection.findOne({ email });

    // Build base profile
    const profile = {
      personalInfo: {
        name: user?.name || '',
        email,
        phone: user?.phone || '',
        location: user?.location || '',
        bio: user?.bio || '',
        avatar: user?.image || '',
        professionalTitle: user?.professionalTitle || '',
        availability: user?.availability || '',
      },
      socialLinks: {
        linkedin: user?.linkedin || '',
        github: user?.github || '',
        website: user?.website || '',
        twitter: user?.twitter || ''
      },
      skills: user?.skills || [],
      experience: user?.experience || [],
      education: user?.education || [],
      certifications: user?.certifications || [],
      languages: user?.languages || [],
      portfolio: user?.portfolio || [],
      verification: {
        isVerified: user?.isVerified || false,
        verifiedAt: user?.verifiedAt || null,
        verificationType: user?.verificationType || null
      }
    };

    // Recent applications (public-safe summary)
    const apps = await applicationsCollection.find({ candidateEmail: email }).sort({ appliedAt: -1 }).limit(5).toArray();
    const jobIds = apps.map(a => a.jobId).filter(Boolean);
    const jobs = jobIds.length ? await jobsCollection.find({ _id: { $in: jobIds.map(id => new ObjectId(id)) } }).toArray() : [];
    const jobsMap = new Map(jobs.map(j => [j._id.toString(), j]));
    const recentApplications = apps.map(a => ({
      appliedAt: a.appliedAt,
      status: a.status,
      job: jobsMap.get(a.jobId) ? {
        title: jobsMap.get(a.jobId).title,
        companyName: jobsMap.get(a.jobId).companyName,
        location: jobsMap.get(a.jobId).location
      } : null
    }));

    return NextResponse.json({ success: true, profile, recentApplications });
  } catch (e) {
    console.error('Public profile fetch error', e);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}


