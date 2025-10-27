import { GoogleGenAI } from "@google/genai";

export async function GET(req) {
  try {
    const ai = new GoogleGenAI({});

    const prompt = `
You are a professional career assessment quiz creator. Generate a comprehensive career assessment quiz with exactly 5 questions that help determine a person's ideal career path.

Create questions that assess:
1. Professional interests and passions
2. Preferred work environment
3. Career priorities (salary, growth, balance, etc.)
4. Educational background
5. Learning preferences

Return the response in JSON format with this exact structure:
{
  "questions": [
    {
      "id": 1,
      "question": "Your question text here?",
      "options": [
        { "text": "Option 1", "value": "value1" },
        { "text": "Option 2", "value": "value2" },
        { "text": "Option 3", "value": "value3" },
        { "text": "Option 4", "value": "value4" }
      ]
    }
  ]
}

Make the questions diverse, insightful, and focused on career discovery. Ensure there are exactly 4 options for each question.
Return ONLY the JSON object, no additional text or markdown formatting.
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
      // Fallback to default questions if parsing fails
      parsedResponse = {
        questions: [
          {
            id: 1,
            question: "What type of work environment do you prefer?",
            options: [
              { text: "Fast-paced startup with rapid growth", value: "startup" },
              { text: "Stable corporate environment", value: "corporate" },
              { text: "Remote work with flexibility", value: "remote" },
              { text: "Team collaboration and networking", value: "team" },
            ],
          },
          {
            id: 2,
            question: "What motivates you most in your career?",
            options: [
              { text: "High earning potential", value: "salary" },
              { text: "Creative freedom and expression", value: "creative" },
              { text: "Helping others and making impact", value: "helping" },
              { text: "Problem-solving and innovation", value: "problem" },
            ],
          },
          {
            id: 3,
            question: "How do you prefer to acquire new skills?",
            options: [
              { text: "Hands-on projects and practice", value: "hands-on" },
              { text: "Online courses and certifications", value: "online" },
              { text: "Traditional education and degrees", value: "formal" },
              { text: "Mentorship and learning from experts", value: "mentor" },
            ],
          },
          {
            id: 4,
            question: "What type of problems do you enjoy solving?",
            options: [
              { text: "Technical and logical challenges", value: "technical" },
              { text: "Design and user experience issues", value: "design" },
              { text: "Business strategy and planning", value: "business" },
              { text: "Human and social problems", value: "social" },
            ],
          },
          {
            id: 5,
            question: "Where do you see yourself in 5 years?",
            options: [
              { text: "Senior specialist in my field", value: "specialist" },
              { text: "Leading a team or department", value: "leader" },
              { text: "Running my own business", value: "entrepreneur" },
              { text: "Freelancer with diverse projects", value: "freelancer" },
            ],
          },
        ],
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
    
    // Return default questions as fallback
    const fallbackData = {
      questions: [
        {
          id: 1,
          question: "What type of work environment do you prefer?",
          options: [
            { text: "Fast-paced startup with rapid growth", value: "startup" },
            { text: "Stable corporate environment", value: "corporate" },
            { text: "Remote work with flexibility", value: "remote" },
            { text: "Team collaboration and networking", value: "team" },
          ],
        },
        {
          id: 2,
          question: "What motivates you most in your career?",
          options: [
            { text: "High earning potential", value: "salary" },
            { text: "Creative freedom and expression", value: "creative" },
            { text: "Helping others and making impact", value: "helping" },
            { text: "Problem-solving and innovation", value: "problem" },
          ],
        },
        {
          id: 3,
          question: "How do you prefer to acquire new skills?",
          options: [
            { text: "Hands-on projects and practice", value: "hands-on" },
            { text: "Online courses and certifications", value: "online" },
            { text: "Traditional education and degrees", value: "formal" },
            { text: "Mentorship and learning from experts", value: "mentor" },
          ],
        },
        {
          id: 4,
          question: "What type of problems do you enjoy solving?",
          options: [
            { text: "Technical and logical challenges", value: "technical" },
            { text: "Design and user experience issues", value: "design" },
            { text: "Business strategy and planning", value: "business" },
            { text: "Human and social problems", value: "social" },
          ],
        },
        {
          id: 5,
          question: "Where do you see yourself in 5 years?",
          options: [
            { text: "Senior specialist in my field", value: "specialist" },
            { text: "Leading a team or department", value: "leader" },
            { text: "Running my own business", value: "entrepreneur" },
            { text: "Freelancer with diverse projects", value: "freelancer" },
          ],
        },
      ],
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

