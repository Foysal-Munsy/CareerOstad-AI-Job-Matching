import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import dbConnect, { collectionNamesObj } from '@/lib/dbConnect';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'candidate') {
      return NextResponse.json({ error: 'Only candidates can access recommended jobs' }, { status: 403 });
    }

    // Get user profile for matching
    const profileResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile`, {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });

    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const userProfile = await profileResponse.json();

    // Get all open jobs
    const jobsCollection = await dbConnect(collectionNamesObj.jobsCollection);
    const jobs = await jobsCollection.find({ 
      status: 'open',
      public: true 
    }).sort({ createdAt: -1 }).limit(50).toArray();

    if (jobs.length === 0) {
      return NextResponse.json({ 
        success: true, 
        jobs: [],
        message: 'No jobs available'
      });
    }

    // Calculate matching percentages for each job
    const jobsWithMatches = await Promise.all(
      jobs.map(async (job) => {
        try {
          // Prepare text for matching
          const userText = prepareUserText(userProfile);
          const jobText = prepareJobText(job.overview, job.requirements, job.toolsTechnologies);

          // Calculate matching percentage
          const matchingPercentage = await calculateJobMatching(userText, jobText);

          return {
            ...job,
            matchingPercentage: Math.round(matchingPercentage)
          };
        } catch (error) {
          console.error(`Error calculating match for job ${job._id}:`, error);
          return {
            ...job,
            matchingPercentage: 0
          };
        }
      })
    );

    // Filter jobs with at least 30% match and sort by matching percentage
    const recommendedJobs = jobsWithMatches
      .filter(job => job.matchingPercentage >= 30)
      .sort((a, b) => b.matchingPercentage - a.matchingPercentage)
      .slice(0, 20); // Limit to top 20 recommendations

    return NextResponse.json({
      success: true,
      jobs: recommendedJobs,
      total: recommendedJobs.length
    });

  } catch (error) {
    console.error('Recommended jobs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function prepareUserText(userProfile) {
  const parts = [];
  
  // Add skills
  if (userProfile.skills && userProfile.skills.length > 0) {
    const skillNames = userProfile.skills
      .map(skill => typeof skill === 'string' ? skill : (skill.name || skill.skill || skill.value || skill.title || ''))
      .filter(skill => skill.trim().length > 0);
    if (skillNames.length > 0) {
      parts.push(`Skills: ${skillNames.join(', ')}`);
    }
  }
  
  // Add professional title and bio
  if (userProfile.personalInfo?.professionalTitle) {
    parts.push(`Professional Title: ${userProfile.personalInfo.professionalTitle}`);
  }
  
  if (userProfile.personalInfo?.bio) {
    parts.push(`Bio: ${userProfile.personalInfo.bio}`);
  }
  
  // Add experience
  if (userProfile.experience && userProfile.experience.length > 0) {
    const experienceText = userProfile.experience.map(exp => 
      `${exp.position} at ${exp.company} - ${exp.description || ''}`
    ).join('. ');
    parts.push(`Experience: ${experienceText}`);
  }
  
  // Add education
  if (userProfile.education && userProfile.education.length > 0) {
    const educationText = userProfile.education.map(edu => 
      `${edu.degree} in ${edu.field} from ${edu.institution}`
    ).join('. ');
    parts.push(`Education: ${educationText}`);
  }
  
  // Add certifications
  if (userProfile.certifications && userProfile.certifications.length > 0) {
    parts.push(`Certifications: ${userProfile.certifications.join(', ')}`);
  }
  
  return parts.join('. ');
}

function prepareJobText(jobDescription, jobRequirements, jobSkills) {
  const parts = [];
  
  if (jobDescription) {
    parts.push(`Job Description: ${jobDescription}`);
  }
  
  if (jobRequirements) {
    parts.push(`Requirements: ${jobRequirements}`);
  }
  
  if (jobSkills && jobSkills.length > 0) {
    parts.push(`Required Skills: ${jobSkills.join(', ')}`);
  }
  
  return parts.join('. ');
}

async function calculateJobMatching(userText, jobText) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found, using fallback calculation');
      return calculateFallbackMatching(userText, jobText);
    }

    // Use Hugging Face sentence-transformers API for semantic similarity
    const response = await fetch('https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GEMINI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          source_sentence: userText,
          sentences: [jobText]
        }
      }),
    });

    if (!response.ok) {
      console.warn('Hugging Face API failed, using fallback calculation');
      return calculateFallbackMatching(userText, jobText);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result.length > 0) {
      // The API returns similarity scores between 0 and 1
      // Convert to percentage and ensure it's between 0-100
      const similarity = result[0];
      return Math.max(0, Math.min(100, similarity * 100));
    }
    
    return calculateFallbackMatching(userText, jobText);
    
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return calculateFallbackMatching(userText, jobText);
  }
}

function calculateFallbackMatching(userText, jobText) {
  // Simple keyword-based matching as fallback
  const userWords = userText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const jobWords = jobText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Common technical terms and skills
  const technicalTerms = [
    'javascript', 'python', 'java', 'react', 'node', 'mongodb', 'mysql', 'sql',
    'html', 'css', 'bootstrap', 'tailwind', 'express', 'django', 'flask',
    'git', 'github', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
    'api', 'rest', 'graphql', 'typescript', 'angular', 'vue', 'next',
    'machine learning', 'ai', 'data science', 'analytics', 'backend', 'frontend',
    'full stack', 'devops', 'agile', 'scrum', 'testing', 'cypress', 'jest'
  ];
  
  let matchCount = 0;
  let totalRelevantWords = 0;
  
  // Count matches for technical terms
  technicalTerms.forEach(term => {
    if (userText.toLowerCase().includes(term) && jobText.toLowerCase().includes(term)) {
      matchCount += 2; // Weight technical terms higher
    }
    if (jobText.toLowerCase().includes(term)) {
      totalRelevantWords += 2;
    }
  });
  
  // Count general word matches
  const userSet = new Set(userWords);
  const jobSet = new Set(jobWords);
  
  const commonWords = [...userSet].filter(word => jobSet.has(word));
  matchCount += commonWords.length;
  totalRelevantWords += jobWords.length;
  
  if (totalRelevantWords === 0) return 25; // Default minimum match
  
  const percentage = (matchCount / totalRelevantWords) * 100;
  return Math.max(15, Math.min(95, percentage)); // Keep between 15-95%
}
