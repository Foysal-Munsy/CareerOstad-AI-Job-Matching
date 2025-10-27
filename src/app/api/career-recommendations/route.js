import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const body = await req.json();
    const { answers } = body;

    // Validate that we have answers
    if (!answers || Object.keys(answers).length === 0) {
      return new Response(
        JSON.stringify({ error: "No answers provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const ai = new GoogleGenAI({});

    // Create a descriptive prompt based on the user's answers
    const answerSummary = Object.entries(answers).map(([key, value]) => {
      return `${key}: ${value}`;
    }).join(', ');

    const prompt = `
You are a professional career advisor using AI. Based on the following user preferences, suggest 5 best-fit careers with detailed information.

User Preferences: ${answerSummary}

Provide the response in JSON format with this exact structure:
{
  "recommendations": [
    {
      "title": "Career Name",
      "match": 95,
      "category": "Tech/Design/Business/etc",
      "salary": "$80K - $150K",
      "growth": "+22%",
      "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
      "description": "A brief 1-sentence description of what this career involves",
      "demand": "Very High/High/Medium",
      "icon": "💻"
    }
  ]
}

Return ONLY the JSON object, no additional text or markdown formatting. Ensure each recommendation has realistic match percentage (85-95%), salary ranges, growth rates, and skill requirements. Use relevant emoji icons for each career.
`;

    const responses = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt}`,
    });

    // Extract JSON from the response
    let advice = responses.text || "{}";
    
    // Clean the response to extract JSON
    if (advice.includes("```json")) {
      advice = advice.split("```json")[1].split("```")[0].trim();
    } else if (advice.includes("```")) {
      advice = advice.split("```")[1].split("```")[0].trim();
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(advice);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Fallback to sample data if parsing fails
      parsedResponse = {
        recommendations: [
          {
            title: "Full-Stack Developer",
            match: 95,
            category: "Tech",
            salary: "$80K - $150K",
            growth: "+22%",
            skills: ["JavaScript", "React", "Node.js", "Database"],
            description: "Build web applications from front-end to back-end, working with modern frameworks and APIs.",
            demand: "Very High",
            icon: "💻"
          }
        ]
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
    
    // Return sample data as fallback
    const fallbackData = {
      recommendations: [
        {
          title: "Full-Stack Developer",
          match: 92,
          category: "Tech",
          salary: "$80K - $150K",
          growth: "+22%",
          skills: ["JavaScript", "React", "Node.js", "Database"],
          description: "Build web applications from front-end to back-end, working with modern frameworks and APIs.",
          demand: "Very High",
          icon: "💻"
        },
        {
          title: "UX/UI Designer",
          match: 88,
          category: "Design",
          salary: "$65K - $120K",
          growth: "+18%",
          skills: ["Design Thinking", "Figma", "User Research", "Prototyping"],
          description: "Create intuitive and beautiful user experiences for digital products.",
          demand: "High",
          icon: "🎨"
        }
      ]
    };
    
    return new Response(
      JSON.stringify({ success: true, data: fallbackData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

