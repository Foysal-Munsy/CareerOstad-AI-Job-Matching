import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import { collectionNamesObj } from "@/lib/dbConnect";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userCollection;
    let user;
    
    try {
      userCollection = dbConnect(collectionNamesObj.userCollection);
      const identifier = session.user.providerAccountId 
        ? { providerAccountId: session.user.providerAccountId } 
        : { email: session.user.email };
      
      user = await userCollection.findOne(identifier);
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return default profile data if DB connection fails
      return NextResponse.json({
        personalInfo: {
          name: session.user.name || '',
          email: session.user.email || '',
          phone: '',
          location: '',
          bio: '',
          avatar: session.user.image || '',
          professionalTitle: '',
          availability: 'Available for new opportunities',
          experience: '0+ years'
        },
        resumeUrl: '',
        socialLinks: {
          linkedin: '',
          github: '',
          website: '',
          twitter: ''
        },
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        languages: [],
        portfolio: [],
        verification: {
          isVerified: false,
          verifiedAt: null,
          verificationType: null
        }
      });
    }
    
    if (!user) {
      // Return default profile data if user not found
      return NextResponse.json({
        personalInfo: {
          name: session.user.name || '',
          email: session.user.email || '',
          phone: '',
          location: '',
          bio: '',
          avatar: session.user.image || '',
          professionalTitle: '',
          availability: 'Available for new opportunities',
          experience: '0+ years'
        },
        resumeUrl: '',
        socialLinks: {
          linkedin: '',
          github: '',
          website: '',
          twitter: ''
        },
        skills: [],
        experience: [],
        education: [],
        certifications: [],
        languages: [],
        portfolio: [],
        verification: {
          isVerified: false,
          verifiedAt: null,
          verificationType: null
        }
      });
    }

    // Return user profile data
    const profileData = {
      personalInfo: {
        name: user.name || session.user.name,
        email: user.email || session.user.email,
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.image || session.user.image || '',
        professionalTitle: user.professionalTitle || '',
        availability: user.availability || 'Available for new opportunities',
        experience: user.experienceYears || '0+ years'
      },
      resumeUrl: user.resumeUrl || '',
      socialLinks: {
        linkedin: user.linkedin || '',
        github: user.github || '',
        website: user.website || '',
        twitter: user.twitter || ''
      },
      skills: user.skills || [],
      experience: user.experience || [],
      education: user.education || [],
      certifications: user.certifications || [],
      languages: user.languages || [],
      portfolio: user.portfolio || [],
      verification: {
        isVerified: user.isVerified || false,
        verifiedAt: user.verifiedAt || null,
        verificationType: user.verificationType || null
      }
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let userCollection;
    
    try {
      userCollection = dbConnect(collectionNamesObj.userCollection);
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Database connection failed. Please try again later.",
        success: false 
      }, { status: 503 });
    }
    
    const identifier = session.user.providerAccountId 
      ? { providerAccountId: session.user.providerAccountId } 
      : { email: session.user.email };

    // Update user profile data
    const updateData = {
      $set: {
        name: body.personalInfo?.name || session.user.name,
        email: body.personalInfo?.email || session.user.email,
        phone: body.personalInfo?.phone || '',
        location: body.personalInfo?.location || '',
        bio: body.personalInfo?.bio || '',
        professionalTitle: body.personalInfo?.professionalTitle || '',
        availability: body.personalInfo?.availability || 'Available for new opportunities',
        experienceYears: body.personalInfo?.experience || '0+ years',
        image: body.personalInfo?.avatar || session.user.image || '',
        avatar: body.personalInfo?.avatar || session.user.image || '',
        resumeUrl: body.resumeUrl || '',
        linkedin: body.socialLinks?.linkedin || '',
        github: body.socialLinks?.github || '',
        website: body.socialLinks?.website || '',
        twitter: body.socialLinks?.twitter || '',
        skills: body.skills || [],
        experience: body.experience || [],
        education: body.education || [],
        certifications: body.certifications || [],
        languages: body.languages || [],
        portfolio: body.portfolio || [],
        updatedAt: new Date()
      }
    };

    let result;
    try {
      result = await userCollection.updateOne(identifier, updateData, { upsert: true });
    } catch (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json({ 
        error: "Failed to update profile. Please try again.",
        success: false 
      }, { status: 500 });
    }
    
    if (result.acknowledged) {
      return NextResponse.json({ 
        message: "Profile updated successfully",
        success: true 
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to update profile" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      error: "Internal server error. Please try again later.",
      success: false 
    }, { status: 500 });
  }
}
