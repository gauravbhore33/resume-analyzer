import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <h1 className="text-5xl font-bold text-blue-700 mb-4">
                    Resume Analyzer 🎯
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                    Get your resume analyzed by AI. Know your ATS score,
                    matched skills, missing skills and improvement suggestions instantly!
                </p>
                <div className="flex gap-4">
                    <Link to="/register"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700">
                        Get Started Free
                    </Link>
                    <Link to="/login"
                        className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border border-blue-600 hover:bg-blue-50">
                        Login
                    </Link>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-16 max-w-5xl mx-auto">
                <div className="bg-white rounded-xl p-6 shadow text-center">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">ATS Score</h3>
                    <p className="text-gray-600">Get your resume scored out of 100 for ATS compatibility</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Skill Analysis</h3>
                    <p className="text-gray-600">See exactly which skills match and which are missing</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow text-center">
                    <div className="text-4xl mb-3">💡</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">AI Suggestions</h3>
                    <p className="text-gray-600">Get personalized improvement tips powered by AI</p>
                </div>
            </div>

        </div>
    );
}

export default LandingPage;