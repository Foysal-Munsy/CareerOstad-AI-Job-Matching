import { NextResponse } from 'next/server';

// Function to convert AI-generated text to structured questions
function convertTextToQuestions(aiText, role) {
  const questions = [];
  const lines = aiText.split('\n').filter(line => line.trim());
  
  let questionId = 1;
  let currentQuestion = '';
  let difficulty = 'Medium';
  let skills = [role];
  let timeLimit = 300;
  let answerPoints = ['Technical knowledge', 'Problem-solving approach', 'Experience', 'Best practices'];
  
  for (let i = 0; i < lines.length && questions.length < 5; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.includes('Interview Questions') || line.includes('Generate') || line.match(/^\d+\./)) {
      continue;
    }
    
    // Look for question patterns
    if (line.includes('?') || line.length > 20) {
      // Extract question text
      let questionText = line;
      
      // Clean up the question text
      questionText = questionText.replace(/^\d+\.\s*/, ''); // Remove numbering
      questionText = questionText.replace(/^-\s*/, ''); // Remove bullet points
      questionText = questionText.replace(/^•\s*/, ''); // Remove bullet points
      
      if (questionText.length > 10) {
        // Determine difficulty based on keywords
        if (questionText.toLowerCase().includes('explain') || questionText.toLowerCase().includes('describe') || questionText.toLowerCase().includes('what')) {
          difficulty = 'Easy';
          timeLimit = 250;
        } else if (questionText.toLowerCase().includes('how would you') || questionText.toLowerCase().includes('approach') || questionText.toLowerCase().includes('design')) {
          difficulty = 'Medium';
          timeLimit = 300;
        } else if (questionText.toLowerCase().includes('complex') || questionText.toLowerCase().includes('optimize') || questionText.toLowerCase().includes('architecture')) {
          difficulty = 'Hard';
          timeLimit = 400;
        }
        
        // Extract skills from question text
        const skillKeywords = {
          'react': 'React',
          'javascript': 'JavaScript',
          'python': 'Python',
          'database': 'Database',
          'api': 'API Design',
          'frontend': 'Frontend Development',
          'backend': 'Backend Development',
          'design': 'System Design',
          'testing': 'Testing',
          'performance': 'Performance',
          'security': 'Security',
          'cloud': 'Cloud Computing',
          'docker': 'Docker',
          'kubernetes': 'Kubernetes',
          'aws': 'AWS',
          'git': 'Git',
          'agile': 'Agile',
          'scrum': 'Scrum',
          'machine learning': 'Machine Learning',
          'data analysis': 'Data Analysis'
        };
        
        const extractedSkills = [];
        for (const [keyword, skill] of Object.entries(skillKeywords)) {
          if (questionText.toLowerCase().includes(keyword)) {
            extractedSkills.push(skill);
          }
        }
        
        if (extractedSkills.length === 0) {
          extractedSkills.push(role);
        }
        
        questions.push({
          id: `ai_${questionId}`,
          question: questionText,
          difficulty: difficulty,
          skills: extractedSkills,
          time_limit_seconds: timeLimit,
          ideal_answer_points: answerPoints
        });
        
        questionId++;
      }
    }
  }
  
  // If we don't have enough questions, generate some based on the role
  while (questions.length < 5) {
    const fallbackQuestions = [
      `What are the key responsibilities of a ${role}?`,
      `How do you stay updated with the latest trends in ${role}?`,
      `Describe a challenging project you worked on as a ${role}.`,
      `What tools and technologies are essential for a ${role}?`,
      `How do you ensure quality in your work as a ${role}?`
    ];
    
    const questionText = fallbackQuestions[questions.length] || `What makes a successful ${role}?`;
    const difficultyLevels = ['Easy', 'Medium', 'Medium', 'Hard', 'Easy'];
    const timeLimits = [250, 300, 350, 400, 250];
    
    questions.push({
      id: `ai_${questionId}`,
      question: questionText,
      difficulty: difficultyLevels[questions.length] || 'Medium',
      skills: [role],
      time_limit_seconds: timeLimits[questions.length] || 300,
      ideal_answer_points: answerPoints
    });
    
    questionId++;
  }
  
  return questions.slice(0, 5); // Ensure exactly 5 questions
}

// Fallback questions function with role-specific questions
function getFallbackQuestions(role) {
  const roleLower = role.toLowerCase();
  
  // Role-specific question templates
  const roleSpecificQuestions = {
    'frontend developer': [
      {
        id: "fe_1",
        question: "Explain the difference between React hooks and class components. When would you use each approach?",
        difficulty: "Medium",
        skills: ["React", "JavaScript", "Frontend Development"],
        time_limit_seconds: 300,
        ideal_answer_points: ["Hook benefits", "Class component use cases", "Performance differences", "Migration strategies"]
      },
      {
        id: "fe_2", 
        question: "How would you optimize the performance of a React application that's experiencing slow rendering?",
        difficulty: "Hard",
        skills: ["React", "Performance Optimization", "JavaScript"],
        time_limit_seconds: 400,
        ideal_answer_points: ["React.memo", "useMemo/useCallback", "Code splitting", "Bundle optimization"]
      },
      {
        id: "fe_3",
        question: "Describe your experience with responsive web design and CSS frameworks.",
        difficulty: "Easy",
        skills: ["CSS", "Responsive Design", "Frontend Development"],
        time_limit_seconds: 250,
        ideal_answer_points: ["Media queries", "Flexbox/Grid", "CSS frameworks", "Mobile-first approach"]
      }
    ],
    'software engineer': [
      {
        id: "se_1",
        question: "Explain the difference between object-oriented and functional programming paradigms. When would you use each?",
        difficulty: "Medium",
        skills: ["Programming Paradigms", "Software Engineering", "Code Design"],
        time_limit_seconds: 300,
        ideal_answer_points: ["OOP principles", "Functional concepts", "Use cases", "Trade-offs"]
      },
      {
        id: "se_2", 
        question: "How would you approach debugging a complex application with performance issues?",
        difficulty: "Hard",
        skills: ["Debugging", "Performance", "Problem Solving"],
        time_limit_seconds: 400,
        ideal_answer_points: ["Profiling tools", "Systematic approach", "Root cause analysis", "Testing strategies"]
      },
      {
        id: "se_3",
        question: "Describe your experience with version control and collaborative development practices.",
        difficulty: "Easy",
        skills: ["Git", "Collaboration", "Software Engineering"],
        time_limit_seconds: 250,
        ideal_answer_points: ["Git workflows", "Code reviews", "Branching strategies", "Team collaboration"]
      }
    ],
    'product manager': [
      {
        id: "pm_1",
        question: "How would you prioritize features for a new product launch?",
        difficulty: "Medium",
        skills: ["Product Strategy", "Prioritization", "Business Analysis"],
        time_limit_seconds: 300,
        ideal_answer_points: ["User research", "Business impact", "Resource constraints", "Timeline considerations"]
      },
      {
        id: "pm_2", 
        question: "Describe your approach to gathering and analyzing user feedback.",
        difficulty: "Medium",
        skills: ["User Research", "Analytics", "Product Management"],
        time_limit_seconds: 350,
        ideal_answer_points: ["Data collection", "Analysis methods", "Action planning", "Stakeholder communication"]
      },
      {
        id: "pm_3",
        question: "How do you handle competing stakeholder requirements in product development?",
        difficulty: "Hard",
        skills: ["Stakeholder Management", "Conflict Resolution", "Product Strategy"],
        time_limit_seconds: 400,
        ideal_answer_points: ["Communication strategies", "Compromise techniques", "Decision frameworks", "Relationship building"]
      }
    ],
    'ux designer': [
      {
        id: "ux_1",
        question: "Walk me through your user research process and how you validate design decisions.",
        difficulty: "Medium",
        skills: ["User Research", "Design Validation", "UX Process"],
        time_limit_seconds: 300,
        ideal_answer_points: ["Research methods", "Data analysis", "User testing", "Iteration process"]
      },
      {
        id: "ux_2", 
        question: "How do you approach designing for accessibility and inclusive design?",
        difficulty: "Medium",
        skills: ["Accessibility", "Inclusive Design", "UX Principles"],
        time_limit_seconds: 350,
        ideal_answer_points: ["WCAG guidelines", "User personas", "Design considerations", "Testing methods"]
      },
      {
        id: "ux_3",
        question: "Describe your experience with design systems and how you maintain consistency across products.",
        difficulty: "Hard",
        skills: ["Design Systems", "Consistency", "Scalability"],
        time_limit_seconds: 400,
        ideal_answer_points: ["System architecture", "Component libraries", "Documentation", "Team collaboration"]
      }
    ],
    'backend developer': [
      {
        id: "be_1",
        question: "Explain the differences between REST and GraphQL APIs. When would you choose one over the other?",
        difficulty: "Medium",
        skills: ["API Design", "Backend Development", "Database"],
        time_limit_seconds: 350,
        ideal_answer_points: ["REST principles", "GraphQL benefits", "Use cases", "Performance considerations"]
      },
      {
        id: "be_2",
        question: "How would you design a scalable database architecture for a high-traffic application?",
        difficulty: "Hard",
        skills: ["Database Design", "Scalability", "System Architecture"],
        time_limit_seconds: 400,
        ideal_answer_points: ["Database sharding", "Caching strategies", "Load balancing", "Monitoring"]
      },
      {
        id: "be_3",
        question: "What are microservices and how do they differ from monolithic architecture?",
        difficulty: "Medium",
        skills: ["Microservices", "System Architecture", "Backend Development"],
        time_limit_seconds: 300,
        ideal_answer_points: ["Microservices benefits", "Challenges", "When to use", "Implementation considerations"]
      }
    ],
    'data scientist': [
      {
        id: "ds_1",
        question: "Explain the difference between supervised and unsupervised learning. Provide examples of each.",
        difficulty: "Medium",
        skills: ["Machine Learning", "Data Science", "Statistics"],
        time_limit_seconds: 350,
        ideal_answer_points: ["Supervised learning", "Unsupervised learning", "Examples", "Use cases"]
      },
      {
        id: "ds_2",
        question: "How would you handle missing data in a dataset? What are the different approaches and their trade-offs?",
        difficulty: "Hard",
        skills: ["Data Preprocessing", "Statistics", "Data Science"],
        time_limit_seconds: 400,
        ideal_answer_points: ["Missing data types", "Imputation methods", "Trade-offs", "Best practices"]
      },
      {
        id: "ds_3",
        question: "Describe your experience with data visualization tools and techniques.",
        difficulty: "Easy",
        skills: ["Data Visualization", "Data Science", "Communication"],
        time_limit_seconds: 250,
        ideal_answer_points: ["Visualization tools", "Chart types", "Storytelling", "Audience considerations"]
      }
    ]
  };

  // Role aliases for better matching
  const roleAliases = {
    'frontend engineer': 'frontend developer',
    'frontend dev': 'frontend developer',
    'react developer': 'frontend developer',
    'javascript developer': 'frontend developer',
    'software engineer': 'software engineer',
    'software developer': 'software engineer',
    'full stack developer': 'software engineer',
    'backend engineer': 'backend developer',
    'backend dev': 'backend developer',
    'api developer': 'backend developer',
    'data scientist': 'data scientist',
    'data analyst': 'data scientist',
    'ml engineer': 'data scientist',
    'product manager': 'product manager',
    'product owner': 'product manager',
    'pm': 'product manager',
    'ux designer': 'ux designer',
    'ui designer': 'ux designer',
    'user experience designer': 'ux designer',
    'designer': 'ux designer'
  };

  // Get the correct role key
  const roleKey = roleAliases[roleLower] || roleLower;
  
  // Get role-specific questions or use general ones
  const specificQuestions = roleSpecificQuestions[roleKey] || [];
  
  // Combine specific questions with general ones
  const generalQuestions = [
    {
      id: "gen_1",
      question: `What are the key responsibilities and daily tasks of a ${role}?`,
      difficulty: "Easy",
      skills: [role, "Basic Knowledge", "Role Understanding"],
      time_limit_seconds: 300,
      ideal_answer_points: ["Core responsibilities", "Key tasks", "Role scope", "Daily activities"]
    },
    {
      id: "gen_2",
      question: `How do you stay updated with the latest trends and technologies in the ${role} field?`,
      difficulty: "Medium",
      skills: [role, "Continuous Learning", "Industry Knowledge", "Professional Development"],
      time_limit_seconds: 300,
      ideal_answer_points: ["Learning sources", "Industry trends", "Professional development", "Skill updates"]
    }
  ];

  // Return 5 questions: 3 specific (if available) + 2 general, or all general if no specific ones
  const questions = specificQuestions.length >= 3 
    ? [...specificQuestions.slice(0, 3), ...generalQuestions.slice(0, 2)]
    : [...specificQuestions, ...generalQuestions].slice(0, 5);
  
  return questions;
}

export async function POST(request) {
  let role;
  try {
    const body = await request.json();
    role = body.role;

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    console.log('Generating questions for role:', role);
    
    // Try Hugging Face API first if API key is available
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        console.log('Attempting Hugging Face API call...');
        
        const response = await fetch(
          "https://api-inference.huggingface.co/models/gpt2-large",
          {
            headers: {
              Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              inputs: `Interview Questions for ${role}:\n\n1. What are the key responsibilities of a ${role}?\n2. How would you approach solving a complex problem as a ${role}?\n3. What technical skills are essential for a ${role}?\n4. Describe your experience with relevant tools and technologies for ${role}.\n5. How do you stay updated with industry trends in ${role}?\n\nGenerate 5 comprehensive interview questions for a ${role} position with different difficulty levels:`,
              parameters: {
                max_new_tokens: 1200,
                temperature: 0.7,
                return_full_text: false,
                do_sample: true,
                top_p: 0.9,
                repetition_penalty: 1.1
              }
            }),
          }
        );

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            console.log('Hugging Face API call successful');
            
            let responseText = '';
            if (Array.isArray(result) && result[0]?.generated_text) {
              responseText = result[0].generated_text;
            } else if (result.generated_text) {
              responseText = result.generated_text;
            }
            
            if (responseText) {
              console.log('Generated text from Hugging Face:', responseText.substring(0, 300) + '...');
              
              // Convert AI-generated text to structured questions
              try {
                const aiQuestions = convertTextToQuestions(responseText, role);
                if (aiQuestions && aiQuestions.length >= 3) {
                  console.log('Successfully converted AI text to questions:', aiQuestions.length);
                  return NextResponse.json({ questions: aiQuestions });
                }
    } catch (parseError) {
                console.log('Failed to convert AI response to questions:', parseError.message);
              }
            }
          }
        }
      } catch (apiError) {
        console.log('Hugging Face API failed, using fallback questions:', apiError.message);
      }
    } else {
      console.log('No Hugging Face API key found, using fallback questions');
    }

    // Use fallback questions if AI generation fails
    console.log('Using fallback questions');
    const questions = getFallbackQuestions(role);
    return NextResponse.json({ questions });

  } catch (error) {
    console.error('Error generating interview questions:', error);
    
    // Check for API key errors
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      console.log('API key error, using fallback questions');
      const fallbackQuestions = getFallbackQuestions(role);
      return NextResponse.json({ questions: fallbackQuestions });
    }
    
    // Check for quota/rate limit errors
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      console.log('Rate limit error, using fallback questions');
      const fallbackQuestions = getFallbackQuestions(role);
      return NextResponse.json({ questions: fallbackQuestions });
    }
    
    // For any other error, use fallback questions
    console.log('API error occurred, using fallback questions');
    const fallbackQuestions = getFallbackQuestions(role);
    return NextResponse.json({ questions: fallbackQuestions });
  }
}
