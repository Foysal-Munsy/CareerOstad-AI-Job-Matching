const features = [
    {
        title: "🔍 Career Path Navigator",
        description: "Explore career tracks based on your education, interests, and local job demand.",
        button: "Explore My Path",
    },
    {
        title: "📊 Skill Gap & Salary Benchmarking",
        description: "Identify missing skills and compare salary benchmarks across industries.",
        button: "Check My Skills",
    },
    {
        title: "🎤 AI Interview Coach (Bangla + English)",
        description: "Practice interviews with bilingual AI feedback and downloadable reports.",
        button: "Practice Interview",
    },
    {
        title: "📄 CV & LinkedIn Analyzer",
        description: "Get achievement-based suggestions and bilingual CV formatting tips.",
        button: "Optimize Profile",
    },
    {
        title: "📈 Career Progress Tracker",
        description: "Track your growth, readiness score, and share certificates on LinkedIn.",
        button: "Track My Growth",
    },
    {
        title: "🗣️ Local HR Insights & Expert Tips",
        description: "Weekly tips from HR leaders and AI-curated job market updates.",
        button: "Get Insights",
    },
];


export default function CareerAdvice() {
    return (
        <section className="p-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-4">AI-Driven Career Advice</h1>
            <p className="text-center text-lg mb-10">
                Personalized guidance to help you grow your career with confidence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                    <div key={index} className="card bg-white shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">{feature.title}</h2>
                            <p>{feature.description}</p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">{feature.button}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card my-6 bg-white shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">📥 CV Upload & Instant Feedback</h2>
                    <p>Upload your resume and get AI-powered suggestions to improve keywords, formatting, and achievements.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Upload CV</button>
                    </div>
                </div>
            </div>
                <div className="divider">OR</div>

            <section>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* ATS Score */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                ATS Score
                            </h3>
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-2xl font-bold bg-green-100 text-green-600">
                                    92
                                </div>
                                <p className="text-gray-600 mt-2">Excellent</p>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Format Score</span>
                                    <span className="font-semibold">95/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Keywords</span>
                                    <span className="font-semibold">88/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Content Quality</span>
                                    <span className="font-semibold">92/100</span>
                                </div>
                            </div>
                        </div>

                        {/* Optimization Tips */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Optimization Tips
                            </h3>
                            <div className="space-y-3 text-sm">
                                {[
                                    "Add more quantifiable achievements (increase by 15%)",
                                    "Include 2 more industry keywords",
                                    "Expand technical skills section",
                                    "Add project outcomes and metrics",
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-start space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Detected Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["React", "TypeScript", "JavaScript", "AWS", "Node.js"].map(
                                    (k, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                                        >
                                            {k}
                                        </span>
                                    )
                                )}
                            </div>
                            <button className="text-blue-600 text-sm font-medium mt-3 hover:text-blue-700">
                                + Add more keywords
                            </button>
                        </div>
                    </div>

                    {/* Resume Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Template Selection */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Choose Template
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    {
                                        name: "Professional",
                                        preview: "📄",
                                        rating: 4.9,
                                        downloads: "2.3k",
                                    },
                                    {
                                        name: "Modern",
                                        preview: "📋",
                                        rating: 4.8,
                                        downloads: "1.8k",
                                    },
                                    {
                                        name: "Creative",
                                        preview: "🎨",
                                        rating: 4.7,
                                        downloads: "1.2k",
                                    },
                                    {
                                        name: "Minimal",
                                        preview: "📝",
                                        rating: 4.6,
                                        downloads: "900",
                                    },
                                ].map((t, i) => (
                                    <button
                                        key={i}
                                        className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="text-4xl mb-2">{t.preview}</div>
                                        <h4 className="font-medium text-gray-900">{t.name}</h4>
                                        <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-gray-500">
                                            {/* <Star className="w-3 h-3 text-yellow-500" /> */}
                                            <span>{t.rating}</span>
                                            <span>•</span>
                                            <span>{t.downloads}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resume Content */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Resume Content
                                </h3>
                                <button className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    {/* <Plus className="w-4 h-4" /> */}
                                    <span>Add Section</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Personal Info */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">
                                            Personal Information
                                        </h4>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            {/* <Edit className="w-4 h-4" /> */}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Full Name"
                                        />
                                        <input
                                            type="email"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Email"
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Phone"
                                        />
                                        <input
                                            type="text"
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Location"
                                        />
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium text-gray-900">
                                            Professional Summary
                                        </h4>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            {/* <Edit className="w-4 h-4" /> */}
                                        </button>
                                    </div>
                                    <textarea
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Write a compelling professional summary..."
                                    />
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 text-xs text-gray-500 gap-2">
                                        <span>AI suggestions available</span>
                                        <button className="text-blue-600 hover:text-blue-700">
                                            Generate with AI
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        {/* <Plus className="w-4 h-4" /> */}
                                        <span>Add Experience</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        {/* <Award className="w-4 h-4" /> */}
                                        <span>Add Skills</span>
                                    </button>
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                        {/* <FileText className="w-4 h-4" /> */}
                                        <span>Import from LinkedIn</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </section>

        </section>
    );
}
