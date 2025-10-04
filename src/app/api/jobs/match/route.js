import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobId, jobDescription, jobRequirements, jobSkills } = body;

    if (!jobId || !jobDescription) {
      return NextResponse.json({ error: 'Job ID and description are required' }, { status: 400 });
    }

    // Get user profile data for matching
    const profileResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/profile`, {
      headers: {
        'Cookie': request.headers.get('cookie') || ''
      }
    });

    if (!profileResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }

    const userProfile = await profileResponse.json();

    // Prepare text for similarity matching
    const userText = prepareUserText(userProfile);
    const jobText = prepareJobText(jobDescription, jobRequirements, jobSkills);

    // Calculate matching percentage using Hugging Face API
    const matchingPercentage = await calculateJobMatching(userText, jobText);

    return NextResponse.json({
      success: true,
      matchingPercentage: Math.round(matchingPercentage),
      jobId
    });

  } catch (error) {
    console.error('Job matching error:', error);
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
  // Gemini client
  const ai = new GoogleGenAI({});

  try {
    console.log('Calculating job matching using Gemini...');
    
    // Create comprehensive prompt for job matching analysis
    const prompt = `You are an expert HR analyst. Analyze the job description and candidate profile to calculate job matching percentage.

JOB DESCRIPTION:
${jobText}

CANDIDATE PROFILE:
${userText}

ANALYSIS REQUIREMENTS:
1. Calculate match percentage (0-100) based on:
   - Skills alignment and technical expertise
   - Experience relevance and years of experience
   - Educational background and qualifications
   - Industry knowledge and domain expertise
   - Soft skills and cultural fit indicators

2. Consider the following factors:
   - Exact skill matches (high weight)
   - Related/similar skills (medium weight)
   - Experience level alignment
   - Educational background relevance
   - Industry experience
   - Technology stack familiarity

3. Provide ONLY a single number between 0-100 representing the match percentage.

RESPONSE FORMAT:
Respond with ONLY the match percentage number (e.g., 85) without any additional text or explanation.`;

    console.log("Generated matching prompt:", prompt);
    
    // Call Gemini API
    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });

    const generatedText = responses.text || "0";
    console.log("Generated matching result:", generatedText);

    // Extract numeric score from response
    const matchScore = parseInt(generatedText.replace(/\D/g, '')) || 0;
    const finalScore = Math.max(0, Math.min(100, matchScore));
    
    console.log('Gemini Analysis Result - Match Score:', finalScore);
    
    return finalScore;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    return calculateFallbackMatching(userText, jobText);
  }
}

function calculateFallbackMatching(userText, jobText) {
  // Enhanced keyword-based matching with better accuracy
  const userWords = userText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const jobWords = jobText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  
  // Extended technical terms and skills with variations
  const technicalTerms = [
    'javascript', 'js', 'ecmascript', 'node.js', 'nodejs', 'node',
    'python', 'py', 'django', 'flask', 'fastapi',
    'java', 'spring', 'spring boot', 'hibernate',
    'react', 'reactjs', 'react.js', 'next.js', 'nextjs',
    'vue', 'vue.js', 'vuejs', 'nuxt', 'nuxt.js',
    'angular', 'angularjs', 'angular.js',
    'typescript', 'ts',
    'html', 'html5', 'css', 'css3', 'scss', 'sass', 'less',
    'bootstrap', 'tailwind', 'tailwindcss',
    'mongodb', 'mongo', 'nosql',
    'mysql', 'sql', 'postgresql', 'postgres', 'database',
    'git', 'github', 'gitlab', 'bitbucket', 'version control',
    'docker', 'containerization', 'containers',
    'kubernetes', 'k8s', 'orchestration',
    'aws', 'amazon web services', 'cloud',
    'azure', 'gcp', 'google cloud',
    'express', 'express.js', 'fastify', 'koa',
    'api', 'rest', 'restful', 'graphql', 'grpc',
    'machine learning', 'ml', 'ai', 'artificial intelligence',
    'data science', 'analytics', 'big data',
    'backend', 'back-end', 'server-side',
    'frontend', 'front-end', 'client-side',
    'full stack', 'fullstack', 'full-stack',
    'devops', 'dev-ops', 'ci/cd', 'cicd',
    'agile', 'scrum', 'kanban',
    'testing', 'unit testing', 'integration testing',
    'cypress', 'jest', 'mocha', 'chai', 'enzyme',
    'webpack', 'vite', 'parcel', 'rollup',
    'npm', 'yarn', 'pnpm', 'package manager',
    'linux', 'unix', 'ubuntu', 'centos',
    'microservices', 'microservice', 'monolith',
    'redis', 'memcached', 'caching',
    'elasticsearch', 'elastic', 'search',
    'kafka', 'rabbitmq', 'message queue',
    'terraform', 'ansible', 'infrastructure as code',
    'jenkins', 'github actions', 'gitlab ci',
    'nginx', 'apache', 'web server'
  ];
  
  let matchCount = 0;
  let totalRelevantWords = 0;
  let skillMatches = 0;
  let totalSkills = 0;
  
  // Extract skills from job text more accurately
  const jobSkills = jobText.match(/(?:skills?|technologies?|tools?|languages?|frameworks?)[:\s]*([^.]+)/gi);
  if (jobSkills) {
    jobSkills.forEach(skillGroup => {
      const skills = skillGroup.split(/[,;|&]/).map(s => s.trim().toLowerCase());
      skills.forEach(skill => {
        if (skill.length > 2) {
          totalSkills++;
          if (userText.toLowerCase().includes(skill)) {
            skillMatches++;
          }
        }
      });
    });
  }
  
  // Count matches for technical terms with higher weight
  technicalTerms.forEach(term => {
    const userHasTerm = userText.toLowerCase().includes(term);
    const jobHasTerm = jobText.toLowerCase().includes(term);
    
    if (userHasTerm && jobHasTerm) {
      matchCount += 3; // Higher weight for technical terms
      skillMatches++;
    }
    if (jobHasTerm) {
      totalRelevantWords += 3;
      totalSkills++;
    }
  });
  
  // Count general word matches with lower weight
  const userSet = new Set(userWords);
  const jobSet = new Set(jobWords);
  const commonWords = [...userSet].filter(word => jobSet.has(word));
  matchCount += commonWords.length;
  totalRelevantWords += jobWords.length;
  
  // Calculate skill-based percentage
  const skillPercentage = totalSkills > 0 ? (skillMatches / totalSkills) * 100 : 0;
  
  // Calculate overall percentage
  const overallPercentage = totalRelevantWords > 0 ? (matchCount / totalRelevantWords) * 100 : 0;
  
  // Combine both percentages with skill percentage having higher weight
  const finalPercentage = (skillPercentage * 0.7) + (overallPercentage * 0.3);
  
  // Ensure minimum 20% and maximum 98% for realistic results
  return Math.max(20, Math.min(98, Math.round(finalPercentage)));
}
