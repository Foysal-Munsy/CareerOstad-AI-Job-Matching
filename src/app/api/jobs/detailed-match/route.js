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

    // Prepare text for LLM analysis
    const userText = prepareUserText(userProfile);
    const jobText = prepareJobText(jobDescription, jobRequirements, jobSkills);

    // Get detailed LLM analysis
    const detailedAnalysis = await getDetailedJobMatching(userText, jobText);

    return NextResponse.json({
      success: true,
      jobId,
      ...detailedAnalysis
    });

  } catch (error) {
    console.error('Detailed job matching error:', error);
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

async function getDetailedJobMatching(userText, jobText) {
  // Gemini client
  const ai = new GoogleGenAI({});

  try {
    console.log('Getting detailed job matching using Gemini...');
    
    // Create comprehensive prompt for detailed job matching analysis
    const prompt = `You are an expert HR analyst. Analyze the job description and candidate profile to provide detailed job matching analysis.

JOB DESCRIPTION:
${jobText}

CANDIDATE PROFILE:
${userText}

ANALYSIS REQUIREMENTS:
1. Calculate match percentage (0-100) based on skills, experience, and qualifications
2. Identify matching skills that both job and candidate have
3. Identify missing skills that job requires but candidate lacks
4. Identify extra skills that candidate has but job doesn't require
5. Provide a brief summary explaining the match

RESPONSE FORMAT:
Respond with ONLY a valid JSON object in this exact format:
{
  "match_score": 85,
  "matching_skills": ["JavaScript", "React", "Node.js"],
  "missing_skills": ["Python", "Docker"],
  "extra_skills": ["Vue.js", "MongoDB"],
  "summary": "Strong match with core frontend skills. Consider learning Python and Docker for better alignment."
}

IMPORTANT: Respond with ONLY the JSON object, no additional text or explanation.`;

    console.log("Generated detailed matching prompt:", prompt);
    
    // Call Gemini API
    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });

    const generatedText = responses.text || "{}";
    console.log("Generated detailed matching result:", generatedText.substring(0, 200) + '...');

    // Try to extract JSON from the response
    let jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('No JSON found in Gemini response, using fallback analysis');
      return getFallbackAnalysis(userText, jobText);
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.warn('Failed to parse Gemini response as JSON, using fallback analysis');
      return getFallbackAnalysis(userText, jobText);
    }

    // Validate and sanitize the response
    const sanitizedResult = {
      matchingPercentage: Math.max(0, Math.min(100, parseInt(parsedResult.match_score) || 0)),
      matchingSkills: Array.isArray(parsedResult.matching_skills) ? parsedResult.matching_skills : [],
      missingSkills: Array.isArray(parsedResult.missing_skills) ? parsedResult.missing_skills : [],
      extraSkills: Array.isArray(parsedResult.extra_skills) ? parsedResult.extra_skills : [],
      summary: typeof parsedResult.summary === 'string' ? parsedResult.summary : "Analysis completed"
    };

    console.log('Gemini Detailed Analysis Result:', sanitizedResult);
    
    return sanitizedResult;
    
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackAnalysis(userText, jobText);
  }
}

function getFallbackAnalysis(userText, jobText) {
  // Simple keyword-based analysis as fallback
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
  const matchingSkills = [];
  const missingSkills = [];
  const extraSkills = [];
  
  // Count matches for technical terms
  technicalTerms.forEach(term => {
    const userHasTerm = userText.toLowerCase().includes(term);
    const jobHasTerm = jobText.toLowerCase().includes(term);
    
    if (userHasTerm && jobHasTerm) {
      matchCount += 3;
      matchingSkills.push(term);
    } else if (jobHasTerm) {
      totalRelevantWords += 3;
      missingSkills.push(term);
    } else if (userHasTerm) {
      extraSkills.push(term);
    }
  });
  
  // Count general word matches
  const userSet = new Set(userWords);
  const jobSet = new Set(jobWords);
  const commonWords = [...userSet].filter(word => jobSet.has(word));
  matchCount += commonWords.length;
  totalRelevantWords += jobWords.length;
  
  const percentage = totalRelevantWords > 0 ? (matchCount / totalRelevantWords) * 100 : 25;
  const finalPercentage = Math.max(20, Math.min(95, Math.round(percentage)));
  
  return {
    matchingPercentage: finalPercentage,
    matchingSkills: matchingSkills.slice(0, 10), // Limit to 10 skills
    missingSkills: missingSkills.slice(0, 10),
    extraSkills: extraSkills.slice(0, 10),
    summary: `Based on keyword analysis: ${finalPercentage}% match with ${matchingSkills.length} matching skills, ${missingSkills.length} missing skills, and ${extraSkills.length} extra skills.`
  };
}
