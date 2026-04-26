import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getJobRoles } from '../services/api';
import api from '../services/api';

function HRLeaderboard() {
    const { jobRoleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const sessionResultIds = location.state?.sessionResultIds || [];
    const [candidates, setCandidates] = useState([]);
    const [jobRole, setJobRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [jobRoleId]);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`/resume/leaderboard/${jobRoleId}`);
            let results = response.data;

            // Filter to only show this session's results
            if (sessionResultIds.length > 0) {
                results = results.filter(r => sessionResultIds.includes(r.id));
            }

            const sorted = results.sort((a, b) => b.atsScore - a.atsScore);
            setCandidates(sorted);

            const rolesResponse = await getJobRoles();
            const role = rolesResponse.data.find(r => r.id === parseInt(jobRoleId));
            setJobRole(role);
        } catch (err) {
            console.error('Failed to fetch leaderboard');
        }
        setLoading(false);
    };

    const getMedalColor = (index) => {
        if (index === 0) return 'text-yellow-500';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-orange-600';
        return 'text-blue-600';
    };

    const getMedal = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    const getScoreColor = (score) => {
        if (score >= 70) return 'text-green-600';
        if (score >= 40) return 'text-yellow-600';
        return 'text-red-600';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🏆</div>
                    <p className="text-xl text-blue-600 font-medium">Loading leaderboard...</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
                    Candidate Leaderboard 🏆
                </h1>
                <p className="text-gray-500 text-center mb-2">
                    {jobRole?.title} Position — Ranked by ATS Score
                </p>

                {/* Session Info */}
                {sessionResultIds.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 mb-6 text-center">
                        <p className="text-blue-700 text-sm font-medium">
                            📋 Showing {candidates.length} candidates from current session only
                        </p>
                    </div>
                )}

                {candidates.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            No candidates in this session!
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Upload and analyze resumes from HR Dashboard first
                        </p>
                        <button
                            onClick={() => navigate('/hr/dashboard')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">
                            Go to HR Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {candidates.map((candidate, index) => (
                            <div key={candidate.id}
                                className={`bg-white rounded-2xl shadow-lg p-6 ${
                                    index === 0 ? 'ring-2 ring-yellow-400' :
                                    index === 1 ? 'ring-2 ring-gray-300' :
                                    index === 2 ? 'ring-2 ring-orange-400' : ''
                                }`}>
                                <div className="flex items-center gap-4">

                                    {/* Rank */}
                                    <div className={`text-3xl font-bold ${getMedalColor(index)} w-12 text-center flex-shrink-0`}>
                                        {getMedal(index)}
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-800 truncate">
                                            {candidate.resume?.filePath}
                                        </h3>
                                        <div className="mt-1">
                                            <span className="text-xs text-green-600">
                                                ✅ {candidate.matchedSkills || 'None'}
                                            </span>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-xs text-red-600">
                                                ❌ {candidate.missingSkills || 'None'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ATS Score */}
                                    <div className="text-center flex-shrink-0">
                                        <div className={`text-3xl font-bold ${getScoreColor(candidate.atsScore)}`}>
                                            {candidate.atsScore}
                                        </div>
                                        <div className="text-xs text-gray-500">/ 100</div>
                                        <div className="text-xs text-gray-400">ATS Score</div>
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            candidate.atsScore >= 70 ? 'bg-green-500' :
                                            candidate.atsScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{ width: `${candidate.atsScore}%` }}>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/results/${candidate.id}`)}
                                    className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                                    View Full Analysis →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary Card */}
                {candidates.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                        <h3 className="font-bold text-gray-700 mb-3">📊 Session Summary</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-blue-50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-blue-700">{candidates.length}</div>
                                <div className="text-xs text-gray-500">Total Candidates</div>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-green-700">
                                    {Math.max(...candidates.map(c => c.atsScore))}
                                </div>
                                <div className="text-xs text-gray-500">Highest Score</div>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-3">
                                <div className="text-2xl font-bold text-yellow-700">
                                    {Math.round(candidates.reduce((sum, c) => sum + c.atsScore, 0) / candidates.length)}
                                </div>
                                <div className="text-xs text-gray-500">Average Score</div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/hr/dashboard')}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">
                    ← Back to HR Dashboard
                </button>

            </div>
        </div>
    );
}

export default HRLeaderboard;