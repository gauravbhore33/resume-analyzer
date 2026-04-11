import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResumesByUser, getResults } from '../services/api';

function HistoryPage() {
    const navigate = useNavigate();
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const userId = localStorage.getItem('userId') || '1';
            const resumesResponse = await getResumesByUser(userId);
            const resumes = resumesResponse.data;

            const allAnalyses = [];
            for (const resume of resumes) {
                const resultsResponse = await getResults(resume.id);
                const results = resultsResponse.data;
                results.forEach(result => {
                    allAnalyses.push(result);
                });
            }

            allAnalyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAnalyses(allAnalyses);
        } catch (err) {
            console.error('Failed to fetch history');
        }
        setLoading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 70) return 'bg-green-100 text-green-700';
        if (score >= 40) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl text-blue-600 font-medium">Loading history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
                    Analysis History 📋
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    All your previous resume analyses
                </p>

                {analyses.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No analyses yet!</h3>
                        <p className="text-gray-500 mb-6">Upload your resume to get started</p>
                        <button
                            onClick={() => navigate('/upload')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">
                            🚀 Analyze Resume
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {analyses.map((analysis) => (
                            <div key={analysis.id}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => navigate(`/results/${analysis.id}`)}>

                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">
                                            {analysis.jobRole?.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {analysis.resume?.filePath}
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            {new Date(analysis.createdAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getScoreColor(analysis.atsScore)}`}>
                                            {analysis.atsScore}
                                        </div>
                                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreBadge(analysis.atsScore)}`}>
                                            ATS Score
                                        </div>
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                                    <div
                                        className={`h-2 rounded-full ${
                                            analysis.atsScore >= 70 ? 'bg-green-500' :
                                            analysis.atsScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${analysis.atsScore}%` }}>
                                    </div>
                                </div>

                                {/* Skills Preview */}
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">✅ Matched</p>
                                        <p className="text-sm text-green-600 font-medium truncate">
                                            {analysis.matchedSkills || 'None'}
                                        </p>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 mb-1">❌ Missing</p>
                                        <p className="text-sm text-red-600 font-medium truncate">
                                            {analysis.missingSkills || 'None'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 text-right">
                                    <span className="text-blue-600 text-sm font-medium hover:underline">
                                        View Full Results →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {analyses.length > 0 && (
                    <button
                        onClick={() => navigate('/upload')}
                        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                        🚀 Analyze Another Resume
                    </button>
                )}

            </div>
        </div>
    );
}

export default HistoryPage;