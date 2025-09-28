import Head from 'next/head';
import Image from 'next/image';
<<<<<<< HEAD
import React from 'react';


=======
const advice = async () => {
    try {
        const res = await fetch('/api/advice'); 
        if (!res.ok) {
            throw new Error('Failed to fetch advice');
        }
        const data = await res.json();
        return data.advice;
    }   
    catch (error) {
        console.error('Error fetching advice:', error);
        return [];
    }   
    
}
>>>>>>> 8bc51115ae0e520130147179eb7442cafd6a8b98

const adviceSections = [
    {
        title: ' Foundational Knowledge',
        image: 'https://i.ibb.co.com/Vp91Jq2G/Gemini-Generated-Image-57p9xt57p9xt57p9.png',
        items: [
            'Mathematics: Linear Algebra, Calculus, Probability',
            'Programming: Python, R, Scikit-learn',
            'Computer Science: Data Structures, Algorithms',
        ],
    },
    {
        title: ' Learning Pathways',
        image: 'https://i.ibb.co.com/kVYfH5Hz/Gemini-Generated-Image-e6h3w8e6h3w8e6h3.png',
        items: [
            'Courses: Coursera, edX, Udacity',
            'Books: Deep Learning by Ian Goodfellow',
            'Roadmaps: Beginner to Advanced ML',
        ],
    },
    {
        title: ' Tools & Technologies',
        image: 'https://i.ibb.co.com/0jpHh8LZ/Gemini-Generated-Image-jl2n5bjl2n5bjl2n.png',
        items: [
            'Frameworks: TensorFlow, PyTorch',
            'Cloud: AWS, GCP, Azure',
            'Version Control: Git, GitHub',
        ],
    },
    {
        title: ' Career Guidance',
        image: 'https://i.ibb.co.com/0VcQvC8N/unnamed.png',
        items: [
            'Roles: Data Scientist, ML Engineer, AI Researcher',
            'Resume Tips: Highlight projects, GitHub, Kaggle',
            'Interview Prep: Coding, ML concepts, case studies',
        ],
    },
    {
        title: ' Projects & Practice',
        image: 'https://i.ibb.co.com/8L5B428r/unnamed.png',
        items: [
            'Mini Projects: Image classification, sentiment analysis',
            'Capstone Ideas: Chatbots, fraud detection',
            'Open Source: Contribute to GitHub AI repos',
        ],
    },
    {
        title: ' Industry Trends',
        image: 'https://i.ibb.co.com/SwtnfXY0/unnamed.png',
        items: [
            'Topics: Generative AI, LLMs, AI ethics',
            'Research: Read and implement papers',
            'Networking: Conferences, LinkedIn, meetups',
        ],
    },
    {
        title: ' Personal Development',
        image: 'https://i.ibb.co.com/dsxm7pQL/unnamed.png',
        items: [
            'Soft Skills: Communication, critical thinking',
            'Ethics: Fairness, bias, transparency',
            'Mindset: Curiosity, resilience, growth',
        ],
    },
];

export default function CareerAdvice() {
    return (
        <>
            <Head>
                <title>AI Career Advice</title>
                <meta name="description" content="Guidance for building a successful career in Artificial Intelligence" />
            </Head>

            <main className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-8 text-gray-800"> AI Career Advice</h1>
                    <p className="text-center text-gray-600 mb-12">
                        Explore essential guidance to kickstart or advance your journey in Artificial Intelligence.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adviceSections.map((section, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300">
                                <div className="mb-4">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        width={400}
                                        height={200}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                                <h2 className="text-xl font-semibold text-indigo-600 mb-4">{section.title}</h2>
                                <ul className="list-disc list-inside text-gray-700 space-y-2">
                                    {section.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                                <button className="mt-4 text-indigo-500 hover:underline">Learn More</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> 8bc51115ae0e520130147179eb7442cafd6a8b98
