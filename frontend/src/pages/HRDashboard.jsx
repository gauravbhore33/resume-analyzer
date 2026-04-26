import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobRoles, uploadResume, analyzeResume } from '../services/api';
import toast from 'react-hot-toast';

function HRDashboard() {
    const navigate = useNavigate();
    const [jobRoles, setJobRoles] = useState([]);
    const [selectedJobRole, setSelectedJobRole] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [completed, setCompleted] = useState(false);
    const [sessionResultIds, setSessionResultIds] = useState([]);

    useEffect(() => {
        fetchJobRoles();
    }, []);

    const fetchJobRoles = async () => {
        try {
            const response = await getJobRoles();
            setJobRoles(response.data);
        } catch (err) {
            toast.error('Failed to load job roles!');
            console.error('Failed to fetch job roles');
        }
    };

    const handleFilesChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            f => f.type === 'application/pdf'
        );
        if (selectedFiles.length === 0) {
            toast.error('Please select PDF files only!');
            return;
        }
        setFiles(prev => [...prev, ...selectedFiles]);
        toast.success(`${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} added! 📄`);
    };

    const removeFile = (index) => {
        const removed = files[index].name;
        setFiles(files.filter((_, i) => i !== index));
        toast.success(`Removed: ${removed}`);
    };

    const handleBatchAnalyze = async () => {
        if (files.length === 0) {
            toast.error('Please select at least one resume!');
            return;
        }
        if (!selectedJobRole) {
            toast.error('Please select a job role!');
            return;
        }

        setLoading(true);
        setCompleted(false);
        setSessionResultIds([]);
        let successCount = 0;
        let failCount = 0;
        const newResultIds = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            setProgress(`Analyzing ${i + 1} of ${files.length}: ${file.name}`);

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('userId', localStorage.getItem('userId') || '2');

                const uploadResponse = await uploadResume(formData);
                const resumeId = uploadResponse.data.id;

                const analysisResponse = await analyzeResume({
                    resumeId: resumeId,
                    jobRoleId: parseInt(selectedJobRole)
                });
                newResultIds.push(analysisResponse.data.id);
                successCount++;
            } catch (err) {
                failCount++;
                console.error(`Failed to analyze ${file.name}`);
                toast.error(`Failed to analyze: ${file.name}`);
            }
        }

        setLoading(false);
        setCompleted(true);
        setProgress('');
        setFiles([]);
        setSessionResultIds(newResultIds);

        if (successCount > 0 && failCount === 0) {
            toast.success(`Successfully analyzed all ${successCount} resumes! 🏆`);
        } else if (successCount > 0 && failCount > 0) {
            toast.success(`Analyzed ${successCount} resumes successfully!`);
            toast.error(`${failCount} resumes failed!`);
        } else {
            toast.error('All resumes failed to analyze. Please try again!');
        }
    };

    const handleNewSession = () => {
        setCompleted(false);
        setSessionResultIds([]);
        setSelectedJobRole('');
        setFiles([]);
        toast.success('New session started! 🔄');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
                    HR Dashboard 👔
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Upload multiple resumes and rank candidates by ATS score
                </p>

                {/* Session Info Banner */}
                {completed && sessionResultIds.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-green-700 font-medium">
                                ✅ Session Complete — {sessionResultIds.length} resumes analyzed
                            </p>
                            <p className="text-green-600 text-sm mt-1">
                                Leaderboard shows only this session's candidates
                            </p>
                        </div>
                        <button
                            onClick={handleNewSession}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                            🔄 New Session
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

                    {/* Job Role Selector */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Job Role
                        </label>
                        <select
                            value={selectedJobRole}
                            onChange={(e) => setSelectedJobRole(e.target.value)}
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                            <option value="">-- Select a Job Role --</option>
                            {jobRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Multiple File Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Multiple Resumes (PDF)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={handleFilesChange}
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 disabled:opacity-50"
                        />

                        {/* File Count Badge */}
                        {files.length > 0 && (
                            <div className="mt-2 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                                    {files.length} file{files.length > 1 ? 's' : ''} selected
                                </span>
                                <button
                                    onClick={() => {
                                        setFiles([]);
                                        toast.success('All files cleared!');
                                    }}
                                    className="text-red-500 text-sm hover:text-red-700 font-medium">
                                    Clear all
                                </button>
                            </div>
                        )}

                        {/* File List with Remove Button */}
                        {files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {files.map((file, index) => (
                                    <div key={index}
                                        className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-600">📄</span>
                                            <span className="text-sm text-gray-700 truncate max-w-xs">
                                                {file.name}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 text-sm hover:text-red-700 font-medium ml-2 flex-shrink-0">
                                            ✕ Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    {progress && (
                        <div className="bg-blue-50 text-blue-600 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                            </svg>
                            {progress}
                        </div>
                    )}

                    {/* Analyze Button */}
                    <button
                        onClick={handleBatchAnalyze}
                        disabled={loading || files.length === 0}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading
                            ? `Analyzing ${files.length} resumes...`
                            : `🚀 Analyze All Resumes (${files.length})`}
                    </button>
                </div>

                {/* View Leaderboard Button - Only shows after analysis */}
                {completed && sessionResultIds.length > 0 && (
                    <button
                        onClick={() => navigate(`/hr/leaderboard/${selectedJobRole}`, {
                            state: { sessionResultIds }
                        })}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700">
                        🏆 View Session Leaderboard ({sessionResultIds.length} candidates)
                    </button>
                )}

            </div>
        </div>
    );
}

export default HRDashboard;