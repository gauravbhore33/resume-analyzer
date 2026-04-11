import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResultById } from '../services/api';

function ResultsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [id]);

    const fetchResult = async () => {
        try {
            const response = await getResultById(id);
            setResult(response.data);
        } catch (err) {
            console.error('Failed to fetch result');
        }
        setLoading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 70) return 'bg-green-50 border-green-200';
        if (score >= 40) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    const getScoreLabel = (score) => {
        if (score >= 70) return '🎉 Excellent!';
        if (score >= 40) return '👍 Good';
        return '⚠️ Needs Work';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">🤖</div>
                    <p className="text-xl text-blue-600 font-medium">Loading your results...</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <p className="text-xl text-red-600">Results not found!</p>
                    <button onClick={() => navigate('/upload')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const matchedSkills = result.matchedSkills ? result.matchedSkills.split(',').filter(s => s.trim()) : [];
    const missingSkills = result.missingSkills ? result.missingSkills.split(',').filter(s => s.trim()) : [];
    const suggestions = result.suggestions ? result.suggestions.split(';').filter(s => s.trim()) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
                    Analysis Results 📊
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    {result.jobRole?.title} Position
                </p>

                {/* ATS Score Card */}
                <div className={`bg-white rounded-2xl shadow-lg p-8 mb-6 border-2 ${getScoreBg(result.atsScore)}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-medium text-gray-600 mb-1">ATS Score</h2>
                            <div className={`text-7xl font-bold ${getScoreColor(result.atsScore)}`}>
                                {result.atsScore}
                                <span className="text-3xl">/100</span>
                            </div>
                            <p className={`text-lg font-medium mt-2 ${getScoreColor(result.atsScore)}`}>
                                {getScoreLabel(result.atsScore)}
                            </p>
                        </div>
                        <div className="text-8xl">
                            {result.atsScore >= 70 ? '🎯' : result.atsScore >= 40 ? '📈' : '📉'}
                        </div>
                    </div>

                    {/* Score Bar */}
                    <div className="mt-6">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className={`h-4 rounded-full transition-all duration-1000 ${
                                    result.atsScore >= 70 ? 'bg-green-500' :
                                    result.atsScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${result.atsScore}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* Matched Skills */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                            ✅ Matched Skills
                            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full">
                                {matchedSkills.length}
                            </span>
                        </h2>
                        {matchedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {matchedSkills.map((skill, index) => (
                                    <span key={index}
                                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                        ✓ {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No matched skills found</p>
                        )}
                    </div>

                    {/* Missing Skills */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                            ❌ Missing Skills
                            <span className="bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full">
                                {missingSkills.length}
                            </span>
                        </h2>
                        {missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {missingSkills.map((skill, index) => (
                                    <span key={index}
                                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                        ✗ {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">No missing skills!</p>
                        )}
                    </div>
                </div>

                {/* AI Suggestions */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-blue-700 mb-4">
                        💡 AI Improvement Suggestions
                    </h2>
                    {suggestions.length > 0 ? (
                        <div className="space-y-3">
                            {suggestions.map((suggestion, index) => (
                                <div key={index}
                                    className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 text-sm">{suggestion.trim()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">No suggestions available</p>
                    )}
                </div>

                {/* Resume Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-700 mb-3">📄 Resume Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">File Name</p>
                            <p className="font-medium text-gray-800">{result.resume?.filePath}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Job Role</p>
                            <p className="font-medium text-gray-800">{result.jobRole?.title}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Required Skills</p>
                            <p className="font-medium text-gray-800">{result.jobRole?.requiredSkills}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Analyzed On</p>
                            <p className="font-medium text-gray-800">
                                {new Date(result.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/upload')}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                        🔄 Analyze Another Resume
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="flex-1 bg-white text-blue-600 py-3 rounded-xl font-bold border-2 border-blue-600 hover:bg-blue-50">
                        📋 View History
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ResultsPage;