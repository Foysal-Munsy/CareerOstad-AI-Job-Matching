import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  const ai = new GoogleGenAI({});

  try {
    const body = await req.json();
    const {
      // Personal info
      name,
      email,
      phone,
      location,
      bio,
      professionalTitle,
      experienceYears,
      // Links
      socialLinks = {},
      profilePicture,
      portfolio = [],
      // Sections
      skills = [],
      experience = [],
      projects = [],
      education = [],
      certifications = [],
      achievements = [],
      volunteer = [],
      references = [],
      languages = [],
      // Alternate schema from resume-builder page
      techSkills = [],
      softSkills = [],
      work = [],
      // Job targeting (optional)
      targetRole,
      targetCompany,
      jobDescription,
      // Style
      style = {},
    } = body || {};

    // Normalize Skills
    const normalizedTechSkills = Array.isArray(techSkills)
      ? techSkills.map((s) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
      : [];
    const normalizedSoftSkills = Array.isArray(softSkills)
      ? softSkills.map((s) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
      : [];
    const normalizedSkills = Array.isArray(skills) && skills.length
      ? skills
      : [...normalizedTechSkills, ...normalizedSoftSkills];
    const skillsText = normalizedSkills.length ? normalizedSkills.join(", ") : "";

    // Normalize Languages (name + optional level)
    const normalizedLanguages = Array.isArray(languages) && languages.length
      ? languages
          .map((l) => {
            if (typeof l === "string") return l;
            const name = l?.name;
            const level = l?.level;
            if (!name) return null;
            return level ? `${name} (${level})` : name;
          })
          .filter(Boolean)
      : [];
    const languagesText = normalizedLanguages.length ? normalizedLanguages.join(", ") : "";

    // Normalize Experience (accepts both experience[] or work[])
    const experienceSource = (Array.isArray(experience) && experience.length) ? experience : work;
    const experienceText = Array.isArray(experienceSource) && experienceSource.length
      ? experienceSource
          .map((exp) => {
            const position = exp.position || exp.title || "Position";
            const duration = exp.duration || [exp.startDate, exp.endDate || (exp.present ? "Present" : "")] 
              .filter(Boolean)
              .join(" - ");
            const items = [
              position,
              exp.company ? ` at ${exp.company}` : "",
              exp.location ? `, ${exp.location}` : "",
              duration ? ` (${duration})` : "",
            ].join("");
            const summary = exp.description || exp.responsibilities || "";
            return `${items}${summary ? `: ${summary}` : ""}`;
          })
          .join("; ")
      : "";

    // Normalize Projects
    const projectsText = Array.isArray(projects) && projects.length
      ? projects
          .map((p) => {
            const name = p.name || p.title || "Project";
            const tech = p.tech || p.tools;
            const items = [name, tech ? ` [${tech}]` : ""].join("");
            const summary = p.description ? `: ${p.description}` : "";
            const link = p.link ? ` (${p.link})` : "";
            return `${items}${summary}${link}`;
          })
          .join("; ")
      : "";

    // Normalize Education
    const educationText = Array.isArray(education) && education.length
      ? education
          .map((ed) => {
            const degree = ed.degree || "Degree";
            const field = ed.field || ed.department || "";
            const institution = ed.institution || "";
            const duration = ed.duration || [ed.startYear, ed.endYear].filter(Boolean).join(" - ");
            const result = ed.result ? `, Result: ${ed.result}` : "";
            const desc = ed.description ? `: ${ed.description}` : "";
            return `${degree}${field ? ` in ${field}` : ""}${institution ? ` from ${institution}` : ""}${duration ? ` (${duration})` : ""}${result}${desc}`;
          })
          .join("; ")
      : "";

    const certificationsText = Array.isArray(certifications) && certifications.length
      ? certifications.map((c) => (typeof c === "string" ? c : c.name)).join(", ")
      : "";

    const linksText = [
      socialLinks.linkedin ? `LinkedIn: ${socialLinks.linkedin}` : "",
      socialLinks.github ? `GitHub: ${socialLinks.github}` : "",
      socialLinks.website ? `Website: ${socialLinks.website}` : "",
      socialLinks.twitter ? `Twitter: ${socialLinks.twitter}` : "",
      ...portfolio.map((p) => (typeof p === "string" ? p : p.url)).filter(Boolean),
    ]
      .filter(Boolean)
      .join(" | ");

    const targetingText = [
      targetRole ? `Target Role: ${targetRole}` : "",
      targetCompany ? `Target Company: ${targetCompany}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const jdText = jobDescription || "";

    const prompt = `Create an ATS-friendly, professional resume in clean Markdown for the candidate below. Optimize content to match the target role/company and job description when provided. Keep the resume to approximately one page.

CANDIDATE
- Name: ${name || ""}
- Title: ${professionalTitle || ""}
- Email: ${email || ""}
- Phone: ${phone || ""}
- Location: ${location || ""}
- Summary: ${bio || ""}
- Experience Years: ${experienceYears || ""}
- Links: ${linksText || ""}
- Skills: ${skillsText || ""}
- Languages: ${languagesText || ""}
 - Profile Picture Provided: ${profilePicture ? 'Yes' : 'No'}

EXPERIENCE
${experienceText || ""}

PROJECTS
${projectsText || ""}

EDUCATION
${educationText || ""}

CERTIFICATIONS
${certificationsText || ""}

 ACHIEVEMENTS
 ${(Array.isArray(achievements) && achievements.length) ? achievements.map(a => `${a.title || ''}${a.year ? ` (${a.year})` : ''}: ${a.description || ''}`).join('; ') : ''}

 VOLUNTEER
 ${(Array.isArray(volunteer) && volunteer.length) ? volunteer.map(v => `${v.role || ''} at ${v.organization || ''}${v.duration ? ` (${v.duration})` : ''}: ${v.description || ''}`).join('; ') : ''}

 REFERENCES
 ${(Array.isArray(references) && references.length) ? references.map(r => `${r.name || ''}, ${r.position || ''} ${r.company ? `- ${r.company}` : ''} | ${r.email || ''} ${r.phone ? `| ${r.phone}` : ''}`).join('; ') : ''}

JOB TARGETING (optional)
${targetingText || ""}

JOB DESCRIPTION (optional)
${jdText || ""}

OUTPUT REQUIREMENTS
1. Format as clean Markdown only (no code fences). No backticks.
2. Start with the candidate name and title as a single clear header line.
3. Sections (use these exact section names if content exists): Summary, Skills, Experience, Projects, Education, Certifications, Achievements, Volunteer, References.
4. Use concise bullet points. Begin bullets with strong action verbs and include quantifiable impact (metrics, percentages, timelines) where possible.
5. Tailor bullets to align with the target role/company and job description, prioritizing relevant keywords and accomplishments.
6. Keep content tight and scannable for ATS: avoid first-person pronouns, avoid fluff, avoid long paragraphs.
7. Do NOT include placeholders like [Your Name]. Always use provided values. Omit any empty sections.
8. Inline any URLs naturally (no raw angle brackets). Include repository and portfolio links where relevant.
9. Imply a style consistent with ${style.templateStyle || 'Modern'}; accent color ${style.accentColor || '#6b21a8'}; font ${style.fontFamily || 'Inter'} when hinting at heading levels.
10. Return ONLY the Markdown content.`;

    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });

    const resume = responses.text || "No resume generated.";

    return new Response(
      JSON.stringify({ success: true, resume }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Resume generation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to generate resume" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


