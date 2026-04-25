import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getJobRoles } from '../services/api';
import api from '../services/api';

function HRLeaderboard() {
    const { jobRoleId } = useParams();
    const navigate = useNavigate();
    const [candidates, setCandidates] = useState([]);
    const [jobRole, setJobRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, [jobRoleId]);

    const fetchLeaderboard = async () => {
        try {
            const response = await api.get(`/resume/leaderboard/${jobRoleId}`);
            const sorted = response.data.sort((a, b) => b.atsScore - a.atsScore);
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
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-xl text-blue-600 font-medium">Loading leaderboard...</p>
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
                <p className="text-gray-500 text-center mb-8">
                    {jobRole?.title} Position — Ranked by ATS Score
                </p>

                {candidates.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No candidates yet!</h3>
                        <p className="text-gray-500 mb-6">Upload resumes from HR Dashboard first</p>
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
                                    <div className={`text-3xl font-bold ${getMedalColor(index)} w-12 text-center`}>
                                        {getMedal(index)}
                                    </div>

                                    {/* Candidate Info */}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">
                                            {candidate.resume?.filePath}
                                        </h3>
                                        <div className="flex gap-4 mt-1">
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
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${getScoreColor(candidate.atsScore)}`}>
                                            {candidate.atsScore}
                                        </div>
                                        <div className="text-xs text-gray-500">ATS Score</div>
                                    </div>
                                </div>

                                {/* Score Bar */}
                                <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${
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