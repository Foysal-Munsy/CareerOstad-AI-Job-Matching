// src/app/api/career/route.js
import { GoogleGenAI } from "@google/genai";


export async function POST(req) {





  // The client gets the API key from the environment variable `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({});



  //main();


  try {
    const body = await req.json()
    const { name, role, skills, goals } = body

    const prompt = `
    You are a career coach.
    Candidate:
    - Name: ${name}
    - Role: ${role}
    - Skills: ${skills}
    - Goals: ${goals}
    Give one concise piece of advice in plain text in a paragraph. And the paragraph should look like this.
    {
  userId: "abcd1234",
  name: "Naeem Haider",
  role: "Frontend Developer",
  skills: ["React", "Next.js", "Tailwind", "Firebase"],
  goals: "Become a senior frontend engineer and contribute to open-source projects",
  advice: {
    summary: "Focus on mastering TypeScript and system design.",
    detailed:
      "To progress toward a senior role, strengthen your understanding of TypeScript, component architecture, and state management. Contribute to open-source React libraries to gain visibility and improve collaboration skills.",
    recommendedActions: [
      "Build 1 open-source project using Next.js and TypeScript",
      "Study component design patterns and testing",
      "Mentor junior developers or document your learning on a blog"
    ],
    suggestedSkills: ["TypeScript", "Redux Toolkit", "Testing Library"],
    jobMarketInsights:
      "Front-end roles increasingly demand strong TypeScript skills and testing experience. Developers with open-source contributions tend to get higher interview callbacks."
  },
  createdAt: "2025-10-05T08:30:00.000Z",
  source: "gemini-1.5-flash",
  metadata: {
    tokensUsed: 1200,
    version: "v1.0"
  }
}
`

    
    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });
    console.log("Responses", responses.text);
    const advice = responses.text || "No advice available."

    return new Response(JSON.stringify({ advice }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Gemini API error:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch advice" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}




// Tanim Vai code
