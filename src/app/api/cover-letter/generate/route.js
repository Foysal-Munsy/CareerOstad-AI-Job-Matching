import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  // Gemini client
  const ai = new GoogleGenAI({});

  try {
    const body = await req.json();
    const { 
      // Candidate data
      name, email, phone, location, bio, professionalTitle, experienceYears,
      skills = [], experience = [], education = [], certifications = [], 
      languages = [], portfolio = [], socialLinks = {}, resumeUrl,
      // Job data
      jobTitle, companyName, jobDescription, jobRequirements, preferredQualifications,
      toolsTechnologies = [], jobLocation, workMode, salaryRange, perksBenefits,
      // Company data
      companyIndustry, companySize, companyAbout, companyCulture = [], companyTechStack = [],
      // Application date
      applicationDate
    } = body;

    // Format skills as a readable list
    const skillsText = Array.isArray(skills) && skills.length > 0 
      ? skills.join(', ') 
      : 'Relevant technical and soft skills';

    // Format experience with details
    const experienceText = Array.isArray(experience) && experience.length > 0 
      ? experience.map(exp => {
          let expText = `${exp.position || 'Position'} at ${exp.company || 'Company'}`;
          if (exp.duration) expText += ` (${exp.duration})`;
          if (exp.description) expText += `: ${exp.description}`;
          return expText;
        }).join('; ')
      : 'Previous professional experience';

    // Format education
    const educationText = Array.isArray(education) && education.length > 0
      ? education.map(edu => `${edu.degree || 'Degree'} in ${edu.field || 'Field'} from ${edu.institution || 'Institution'}`).join('; ')
      : '';

    // Format certifications
    const certificationsText = Array.isArray(certifications) && certifications.length > 0
      ? certifications.map(cert => cert.name || cert).join(', ')
      : '';

    // Format tools and technologies
    const toolsText = Array.isArray(toolsTechnologies) && toolsTechnologies.length > 0
      ? toolsTechnologies.join(', ')
      : '';

    // Format company culture and perks
    const cultureText = Array.isArray(companyCulture) && companyCulture.length > 0
      ? companyCulture.join(', ')
      : '';

    // Create comprehensive prompt
    const prompt = `Generate a professional, personalized cover letter for the following candidate applying to ${companyName}:

APPLICATION DATE: ${applicationDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

CANDIDATE PROFILE:
- Name: ${name || 'Candidate'} (USE THIS EXACT NAME, NOT PLACEHOLDERS)
- Professional Title: ${professionalTitle || 'Professional'}
- Experience Level: ${experienceYears || 'Experienced'}
- Location: ${location || 'Available for remote work'}
- Bio: ${bio || 'Dedicated professional'}
- Email: ${email || ''}
- Phone: ${phone || ''}

TECHNICAL SKILLS & EXPERTISE:
${skillsText}

PROFESSIONAL EXPERIENCE:
${experienceText}

EDUCATIONAL BACKGROUND:
${educationText || 'Relevant educational qualifications'}

CERTIFICATIONS & ACHIEVEMENTS:
${certificationsText || 'Professional certifications and achievements'}

ADDITIONAL LANGUAGES:
${Array.isArray(languages) && languages.length > 0 ? languages.join(', ') : 'English'}

TARGET POSITION & COMPANY:
- Job Title: ${jobTitle}
- Company: ${companyName}
- Location: ${jobLocation || 'Various locations'}
- Work Mode: ${workMode || 'Full-time'}
- Industry: ${companyIndustry || 'Technology'}

JOB DESCRIPTION:
${jobDescription || 'Exciting opportunity in a dynamic environment'}

JOB REQUIREMENTS:
${jobRequirements || 'Relevant skills and experience'}

PREFERRED QUALIFICATIONS:
${preferredQualifications || 'Additional preferred qualifications'}

TECHNOLOGIES & TOOLS:
${toolsText || 'Modern technologies and tools'}

COMPANY INFORMATION:
${companyAbout || `Leading company in ${companyIndustry || 'technology'} industry`}

COMPANY CULTURE & VALUES:
${cultureText || 'Innovation, collaboration, and growth'}

SALARY & BENEFITS:
${salaryRange || 'Competitive compensation'} - ${perksBenefits || 'Comprehensive benefits package'}

COVER LETTER FORMAT REQUIREMENTS:
1. Start with the application date at the top
2. Include candidate's full name (${name || 'Candidate'}) - DO NOT use [Your Name] or any placeholders
3. Professional business letter format with proper greeting and closing
4. MAXIMUM 3 paragraphs - keep it short and concise
5. Opening paragraph: Show interest in the role and company
6. Middle paragraph: Highlight 1-2 most relevant skills/experiences that match job requirements
7. Closing paragraph: Express enthusiasm and call to action
8. Professional, confident tone without being arrogant
9. Avoid generic phrases - make it specific to this role
10. Keep total length SHORT - no more than 200-250 words
11. IMPORTANT: Use the actual candidate name provided, never use placeholders like [Your Name]

Generate a SHORT, compelling cover letter that gets straight to the point.`;
console.log("Generated prompt:", prompt);
    // Call Gemini API
    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });


    const coverLetter =
      responses.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No cover letter generated.";
      console.log("Cover letter:", coverLetter);

    return new Response(JSON.stringify({ 
      success: true,
      coverLetter: coverLetter
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Failed to generate cover letter" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}