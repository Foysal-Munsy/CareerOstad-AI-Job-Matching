import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { careerTitle, category, skills, goals } = body;

    // Validate input
    if (!careerTitle) {
      return new Response(
        JSON.stringify({ error: "Career title is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({});

    const prompt = `
You are a professional career mentor. Create a comprehensive 6-month career roadmap for someone aspiring to become a ${careerTitle}.

User Context:
- Career Goal: ${careerTitle}
- Category: ${category || "General"}
- Existing Skills: ${skills || "Beginner level"}
- Goals: ${goals || "Career transition"}

Generate a detailed roadmap in JSON format with this exact structure:
{
  "careerTitle": "${careerTitle}",
  "overview": "A brief 2-3 sentence overview of what this roadmap will help achieve",
  "timeline": "6 months",
  "roadmap": [
    {
      "month": 1,
      "title": "Foundation Building",
      "weeks": [
        {
          "week": "Week 1-2",
          "focus": "Specific focus area",
          "tasks": [
            "Task 1",
            "Task 2",
            "Task 3"
          ],
          "resources": [
            "Resource name with link format"
          ]
        },
        {
          "week": "Week 3-4",
          "focus": "Specific focus area",
          "tasks": [
            "Task 1",
            "Task 2"
          ],
          "resources": [
            "Resource name"
          ]
        }
      ]
    },
    {
      "month": 2,
      "title": "Skill Development",
      "weeks": [
        {
          "week": "Week 5-6",
          "focus": "Specific focus area",
          "tasks": [
            "Task 1",
            "Task 2"
          ],
          "resources": [
            "Resource name"
          ]
        },
        {
          "week": "Week 7-8",
          "focus": "Specific focus area",
          "tasks": [
            "Task 1",
            "Task 2"
          ],
          "resources": [
            "Resource name"
          ]
        }
      ]
    }
  ],
  "tools": [
    "Tool name 1 - Description",
    "Tool name 2 - Description"
  ],
  "certifications": [
    {
      "name": "Certification name",
      "provider": "Provider name",
      "difficulty": "Beginner/Intermediate/Advanced",
      "duration": "Course duration"
    }
  ],
  "nextSteps": [
    "Next step 1",
    "Next step 2",
    "Next step 3"
  ]
}

Make it practical, actionable, and tailored to help transition into ${careerTitle}. 
Generate exactly 3 months of roadmap (provide weeks for 3 months), with realistic tasks and resources.
Return ONLY the JSON object, no markdown formatting.
`;

    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });

    // Extract JSON from the response
    let response = responses.text || "{}";
    
    // Clean the response to extract JSON
    if (response.includes("```json")) {
      response = response.split("```json")[1].split("```")[0].trim();
    } else if (response.includes("```")) {
      response = response.split("```")[1].split("```")[0].trim();
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Fallback roadmap
      parsedResponse = {
        careerTitle: careerTitle,
        overview: `A comprehensive 6-month roadmap to launch your career as a ${careerTitle}. This plan includes essential skills, projects, and resources to build your expertise.`,
        timeline: "6 months",
        roadmap: [
          {
            month: 1,
            title: "Foundation",
            weeks: [
              {
                week: "Week 1-2",
                focus: "Core Concepts",
                tasks: ["Study fundamentals", "Set up development environment", "Complete beginner tutorial"],
                resources: ["Official documentation", "YouTube tutorials"]
              }
            ]
          }
        ],
        tools: ["Essential tools for development"],
        certifications: [],
        nextSteps: ["Start with basics", "Build a portfolio", "Network with professionals"]
      };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gemini API error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Failed to generate roadmap",
        data: {
          careerTitle: body.careerTitle,
          overview: "Unable to generate roadmap at this time. Please try again later.",
          timeline: "6 months",
          roadmap: []
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

