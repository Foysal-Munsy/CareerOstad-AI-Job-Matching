import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

// GET - Fetch candidate profile for company view
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'company' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email } = await params;
    const applicationsCollection = await dbConnect(collectionNamesObj.applicationsCollection);
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);

    // Get all applications from this candidate
    const applications = await applicationsCollection.find({ 
      candidateEmail: email 
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

    // Filter applications to only show those for company's jobs
    const companyJobs = await jobsCollection.find({
      $or: [
        { companyEmail: session.user.email },
        { companyProviderAccountId: session.user.providerAccountId }
      ]
    }).toArray();

    const companyJobIds = companyJobs.map(job => job._id.toString());
    const filteredApplications = applicationsWithJobs.filter(app => 
      companyJobIds.includes(app.jobId)
    );

    // Create candidate profile from application data
    const candidate = {
      personalInfo: {
        name: filteredApplications[0]?.candidateName || 'Unknown Candidate',
        email: email,
        phone: '', // Not available in current structure
        location: '', // Not available in current structure
        bio: '', // Not available in current structure
        professionalTitle: '', // Not available in current structure
        availability: '', // Not available in current structure
        avatar: '' // Not available in current structure
      },
      socialLinks: {
        linkedin: '', // Not available in current structure
        github: '', // Not available in current structure
        website: '', // Not available in current structure
        twitter: '' // Not available in current structure
      },
      skills: [], // Not available in current structure
      experience: [], // Not available in current structure
      education: [], // Not available in current structure
      certifications: [], // Not available in current structure
      languages: [], // Not available in current structure
      portfolio: [] // Not available in current structure
    };

    // Try to get more detailed profile from user collection if available
    try {
      const userCollection = await dbConnect(collectionNamesObj.userCollection);
      const userProfile = await userCollection.findOne({ email: email });
      
      if (userProfile) {
        // Merge with available profile data
        candidate.personalInfo = {
          ...candidate.personalInfo,
          name: userProfile.name || candidate.personalInfo.name,
          phone: userProfile.phone || candidate.personalInfo.phone,
          location: userProfile.location || candidate.personalInfo.location,
          bio: userProfile.bio || candidate.personalInfo.bio,
          professionalTitle: userProfile.professionalTitle || candidate.personalInfo.professionalTitle,
          availability: userProfile.availability || candidate.personalInfo.availability,
          avatar: userProfile.image || candidate.personalInfo.avatar
        };

        candidate.socialLinks = {
          linkedin: userProfile.linkedin || candidate.socialLinks.linkedin,
          github: userProfile.github || candidate.socialLinks.github,
          website: userProfile.website || candidate.socialLinks.website,
          twitter: userProfile.twitter || candidate.socialLinks.twitter
        };

        // Add other profile sections if available
        if (userProfile.skills) candidate.skills = userProfile.skills;
        if (userProfile.experience) candidate.experience = userProfile.experience;
        if (userProfile.education) candidate.education = userProfile.education;
        if (userProfile.certifications) candidate.certifications = userProfile.certifications;
        if (userProfile.languages) candidate.languages = userProfile.languages;
        if (userProfile.portfolio) candidate.portfolio = userProfile.portfolio;
      }
    } catch (profileError) {
      console.log('Could not fetch detailed profile:', profileError);
      // Continue with basic profile data
    }

    return NextResponse.json({ 
      success: true, 
      candidate,
      applications: filteredApplications
    });

  } catch (error) {
    console.error('Error fetching candidate profile:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch candidate profile' 
    }, { status: 500 });
  }
}
