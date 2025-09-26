import { NextResponse } from 'next/server';

// Function to generate AI feedback using Hugging Face API
async function generateAIFeedback(question, userAnswer) {
  if (!process.env.HUGGINGFACE_API_KEY) {
    console.log('No Hugging Face API key found for feedback generation');
    return null;
  }

  try {
    console.log('Generating AI feedback...');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2-large",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Evaluate this interview answer:

Question: ${question.question || question}

Answer: ${userAnswer}

Provide constructive feedback including:
- Overall score (0-100)
- Strengths of the answer
- Areas for improvement
- Specific suggestions
- Rating (Excellent/Good/Fair/Needs Improvement)

Format your evaluation as detailed feedback:`,
          parameters: {
            max_new_tokens: 800,
            temperature: 0.7,
            return_full_text: false,
            do_sample: true,
            top_p: 0.9
          }
        }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      let responseText = '';
      
      if (Array.isArray(result) && result[0]?.generated_text) {
        responseText = result[0].generated_text;
      } else if (result.generated_text) {
        responseText = result.generated_text;
      }
      
      if (responseText) {
        console.log('AI feedback generated:', responseText.substring(0, 200) + '...');
        return parseAIFeedback(responseText);
      }
    }
  } catch (error) {
    console.log('AI feedback generation failed:', error.message);
  }
  
  return null;
}

// Function to parse AI feedback into structured format
function parseAIFeedback(aiText) {
  const lines = aiText.split('\n').filter(line => line.trim());
  
  let score = 70; // Default score
  let feedback = [];
  let strengths = [];
  let weaknesses = [];
  let suggestions = [];
  let overallRating = 'Good';
  
  // Extract score if mentioned
  const scoreMatch = aiText.match(/(\d+)\/100|score[:\s]*(\d+)/i);
  if (scoreMatch) {
    score = parseInt(scoreMatch[1] || scoreMatch[2]) || 70;
  }
  
  // Extract feedback points
  for (const line of lines) {
    const cleanLine = line.trim().replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
    
    if (cleanLine.toLowerCase().includes('strength') || cleanLine.toLowerCase().includes('good') || cleanLine.toLowerCase().includes('excellent')) {
      strengths.push(cleanLine);
    } else if (cleanLine.toLowerCase().includes('improve') || cleanLine.toLowerCase().includes('weakness') || cleanLine.toLowerCase().includes('better')) {
      weaknesses.push(cleanLine);
    } else if (cleanLine.toLowerCase().includes('suggest') || cleanLine.toLowerCase().includes('recommend') || cleanLine.toLowerCase().includes('should')) {
      suggestions.push(cleanLine);
    } else if (cleanLine.length > 20) {
      feedback.push(cleanLine);
    }
  }
  
  // Determine rating based on score
  if (score >= 80) overallRating = 'Excellent';
  else if (score >= 60) overallRating = 'Good';
  else if (score >= 40) overallRating = 'Fair';
  else overallRating = 'Needs Improvement';
  
  // Fallback if no specific feedback found
  if (feedback.length === 0) {
    feedback.push("Thank you for your answer. Consider providing more specific examples and details.");
  }
  if (strengths.length === 0) {
    strengths.push("Good attempt at answering the question");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Could provide more detailed explanations");
  }
  if (suggestions.length === 0) {
    suggestions.push("Add more specific examples and technical details");
  }
  
  return {
    score: score,
    breakdown: {
      correctness: Math.min(score + Math.floor(Math.random() * 10) - 5, 100),
      clarity: Math.min(score + Math.floor(Math.random() * 10) - 5, 100),
      problem_solving: Math.min(score + Math.floor(Math.random() * 10) - 5, 100)
    },
    feedback: feedback,
    strengths: strengths,
    weaknesses: weaknesses,
    suggestions: suggestions,
    sample_improved_answer: generateSampleAnswer(question, score),
    overallRating: overallRating
  };
}

// Default evaluation for error cases
function getDefaultEvaluation() {
  return {
    score: 50,
    breakdown: {
      correctness: 50,
      clarity: 50,
      problem_solving: 50
    },
    feedback: ["Unable to evaluate answer properly due to technical issues"],
    strengths: ["Attempted to answer"],
    weaknesses: ["Evaluation incomplete"],
    suggestions: ["Please try again"],
    sample_improved_answer: "Please provide a more detailed answer and try again.",
    overallRating: "Unable to Evaluate"
  };
}

// Fallback evaluation function
function evaluateAnswerFallback(question, userAnswer) {
  // Handle case where question might be undefined or have different structure
  if (!question) {
    console.error('Question is undefined');
    return getDefaultEvaluation();
  }
  
  // Handle different question structures
  const questionText = question.question || question.text || question || 'Technical question';
  const questionSkills = question.skills || [];
  
  const answerLength = userAnswer.trim().length;
  const wordCount = userAnswer.trim().split(/\s+/).length;
  
  // Basic scoring based on answer length and content
  let score = 0;
  let feedback = [];
  
  // Length-based scoring
  if (answerLength > 100) score += 20;
  else if (answerLength > 50) score += 15;
  else if (answerLength > 20) score += 10;
  else score += 5;
  
  // Word count scoring
  if (wordCount > 20) score += 15;
  else if (wordCount > 10) score += 10;
  else if (wordCount > 5) score += 5;
  
  // Content analysis (basic keyword matching)
  const questionLower = questionText.toLowerCase();
  const answerLower = userAnswer.toLowerCase();
  
  // Check for relevant skills mentioned
  if (questionSkills && questionSkills.length > 0) {
    questionSkills.forEach(skill => {
      if (answerLower.includes(skill.toLowerCase())) {
        score += 10;
        feedback.push(`Good mention of ${skill}`);
      }
    });
  }
  
  // Check for technical terms
  const technicalTerms = ['experience', 'project', 'technology', 'skill', 'problem', 'solution', 'approach', 'method', 'tool', 'framework', 'library', 'database', 'api', 'code', 'development', 'design', 'implementation', 'testing', 'deployment'];
  technicalTerms.forEach(term => {
    if (answerLower.includes(term)) {
      score += 2;
    }
  });
  
  // Check for code examples
  const codeTerms = ['function', 'class', 'const', 'let', 'var', 'if', 'for', 'while', 'return', 'async', 'await', 'promise', 'callback'];
  codeTerms.forEach(term => {
    if (answerLower.includes(term)) {
      score += 5;
      feedback.push('Good use of technical examples');
    }
  });
  
  // Check for experience indicators
  const experienceTerms = ['i have', 'my experience', 'i worked', 'i implemented', 'i designed', 'i developed', 'i created'];
  experienceTerms.forEach(term => {
    if (answerLower.includes(term)) {
      score += 8;
      feedback.push('Good reference to personal experience');
    }
  });
  
  // Cap score at 100
  score = Math.min(score, 100);
  
  // Generate feedback based on score
  if (score >= 80) {
    feedback.push("Excellent answer! Shows strong understanding and experience.");
  } else if (score >= 60) {
    feedback.push("Good answer with solid understanding of the topic.");
  } else if (score >= 40) {
    feedback.push("Decent answer, but could be more detailed and specific.");
  } else {
    feedback.push("Answer needs more detail and specific examples.");
  }
  
  // Add improvement suggestions
  if (answerLength < 50) {
    feedback.push("Consider providing more detailed explanations with examples.");
  }
  if (wordCount < 10) {
    feedback.push("Try to elaborate more on your experience and approach.");
  }
  
  // Generate breakdown scores
  const correctness = Math.min(score + Math.floor(Math.random() * 10) - 5, 100);
  const clarity = Math.min(score + Math.floor(Math.random() * 10) - 5, 100);
  const problemSolving = Math.min(score + Math.floor(Math.random() * 10) - 5, 100);
  
  return {
    score: score,
    breakdown: {
      correctness: correctness,
      clarity: clarity,
      problem_solving: problemSolving
    },
    feedback: feedback,
    strengths: score >= 60 ? ["Good understanding", "Relevant experience", "Clear communication"] : ["Basic knowledge", "Attempted to answer"],
    weaknesses: score < 60 ? ["Needs more detail", "Lack of examples", "Limited technical depth"] : score < 80 ? ["Could be more specific", "Missing some details"] : ["Minor improvements possible"],
    suggestions: score < 60 ? ["Provide more examples", "Detail your approach", "Mention specific technologies", "Share relevant experience"] : score < 80 ? ["Add more technical details", "Include specific examples"] : ["Continue building experience", "Stay updated with latest trends"],
    sample_improved_answer: generateSampleAnswer(question, score),
    overallRating: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Improvement"
  };
}

// Generate sample improved answer based on question and current score
function generateSampleAnswer(question, score) {
  const questionText = question.question || question.text || question || 'Technical question';
  const skills = question.skills || [];
  
  if (score < 60) {
    return `Here's an improved version of the answer:\n\n"Based on my experience with ${skills[0] || 'relevant technologies'}, I would approach this by first understanding the requirements and constraints. For example, in a recent project, I ${skills[1] || 'implemented a solution'} that addressed similar challenges. The key steps would be:\n\n1. Analysis and planning\n2. Implementation with best practices\n3. Testing and optimization\n4. Documentation and maintenance\n\nThis approach ensures scalability and maintainability while meeting the project goals."`;
  } else {
    return "Your answer demonstrates good understanding. To make it even stronger, consider adding specific examples, metrics, or outcomes from your experience.";
  }
}

export async function POST(request) {
  let question, userAnswer;
  try {
    const body = await request.json();
    question = body.question;
    userAnswer = body.userAnswer;

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: 'Question and user answer are required' },
        { status: 400 }
      );
    }

    // Try AI feedback generation first
    console.log('Attempting AI feedback generation...');
    let evaluation = await generateAIFeedback(question, userAnswer);
    
    // If AI feedback fails, use fallback system
    if (!evaluation) {
      console.log('AI feedback failed, using fallback system');
      console.log('Question structure:', JSON.stringify(question, null, 2));
      evaluation = evaluateAnswerFallback(question, userAnswer);
    } else {
      console.log('AI feedback generated successfully');
    }
    
    return NextResponse.json({ evaluation });

  } catch (error) {
    console.error('Error evaluating answer:', error);
    
    // Use default evaluation for any errors
    console.log('Using default evaluation due to error');
    const evaluation = getDefaultEvaluation();
    
    return NextResponse.json({ evaluation });
  }
}