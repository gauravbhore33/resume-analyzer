import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, analyzeResume, getJobRoles } from '../services/api';

function UploadPage() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jobRoles, setJobRoles] = useState([]);
    const [selectedJobRole, setSelectedJobRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState('upload');
    const [message, setMessage] = useState('');
    const [dragOver, setDragOver] = useState(false);

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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setMessage('');
            toast.success('Resume selected successfully! 📄');
        } else {
            setMessage('Please select a PDF file only!');
            toast.error('Please select a PDF file only!');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === 'application/pdf') {
            setFile(droppedFile);
            setMessage('');
            toast.success('Resume dropped successfully! 📄');
        } else {
            setMessage('Please drop a PDF file only!');
            toast.error('Please drop a PDF file only!');
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            setMessage('Please select a resume file!');
            toast.error('Please select a resume file!');
            return;
        }
        if (!selectedJobRole) {
            setMessage('Please select a job role!');
            toast.error('Please select a job role!');
            return;
        }

        setLoading(true);
        setStep('uploading');

        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setMessage('Please login first!');
                setStep('upload');
                setLoading(false);
                toast.error('Please login first!');
                navigate('/login');
                return;
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', userId);

            setMessage('Uploading resume...');
            const uploadResponse = await uploadResume(formData);
            const resumeId = uploadResponse.data.id;

            setStep('analyzing');
            setMessage('AI is analyzing your resume...');

            const analysisResponse = await analyzeResume({
                resumeId: resumeId,
                jobRoleId: parseInt(selectedJobRole)
            });

            const resultId = analysisResponse.data.id;
            toast.success('Resume analyzed successfully! 🎯');
            navigate(`/results/${resultId}`);

        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setMessage('Invalid file or job role. Please try again!');
                    toast.error('Invalid file or job role. Please try again!');
                } else if (err.response.status === 401) {
                    setMessage('Session expired! Please login again.');
                    toast.error('Session expired! Please login again.');
                    navigate('/login');
                } else if (err.response.status === 500) {
                    setMessage('Server error! Please try again in a moment.');
                    toast.error('Server error! Please try again in a moment.');
                } else {
                    setMessage(`Error: ${err.response.data || 'Something went wrong!'}`);
                    toast.error('Something went wrong!');
                }
            } else if (err.request) {
                setMessage('Cannot connect to server! Make sure backend is running.');
                toast.error('Cannot connect to server! Make sure backend is running.');
            } else {
                setMessage('Something went wrong. Please try again.');
                toast.error('Something went wrong. Please try again.');
            }
            setStep('upload');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
                    Analyze Your Resume 🎯
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    Upload your PDF resume and select a job role to get AI analysis
                </p>

                {/* Upload Box */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">

                    {/* Drag and Drop Area */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                            dragOver ? 'border-blue-500 bg-blue-50' :
                            file ? 'border-green-400 bg-green-50' :
                            'border-gray-300 hover:border-blue-400'
                        }`}
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        {file ? (
                            <>
                                <div className="text-5xl mb-3">📄</div>
                                <p className="text-green-600 font-medium text-lg">{file.name}</p>
                                <p className="text-gray-400 text-sm mt-1">Click to change file</p>
                            </>
                        ) : (
                            <>
                                <div className="text-5xl mb-3">📁</div>
                                <p className="text-gray-600 font-medium text-lg">
                                    Drag & drop your resume here
                                </p>
                                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                                <p className="text-gray-400 text-xs mt-2">PDF files only</p>
                            </>
                        )}
                    </div>

                    <input
                        id="fileInput"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {/* Job Role Selector */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Job Role
                        </label>
                        <select
                            value={selectedJobRole}
                            onChange={(e) => setSelectedJobRole(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Select a Job Role --</option>
                            {jobRoles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mt-4 px-4 py-3 rounded-lg text-sm ${
                            step === 'analyzing' || step === 'uploading'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-red-50 text-red-600'
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Analyze Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                {step === 'uploading' ? 'Uploading...' : 'AI Analyzing...'}
                            </span>
                        ) : (
                            '🚀 Analyze My Resume'
                        )}
                    </button>
                </div>

                {/* Steps Info */}
                <div className="grid grid-cols-3 gap-4">
                    <div className={`bg-white rounded-xl p-4 text-center shadow ${step === 'upload' ? 'ring-2 ring-blue-400' : ''}`}>
                        <div className="text-2xl mb-1">📤</div>
                        <p className="text-xs font-medium text-gray-600">Upload Resume</p>
                    </div>
                    <div className={`bg-white rounded-xl p-4 text-center shadow ${step === 'uploading' ? 'ring-2 ring-blue-400' : ''}`}>
                        <div className="text-2xl mb-1">🤖</div>
                        <p className="text-xs font-medium text-gray-600">AI Analysis</p>
                    </div>
                    <div className={`bg-white rounded-xl p-4 text-center shadow ${step === 'analyzing' ? 'ring-2 ring-blue-400' : ''}`}>
                        <div className="text-2xl mb-1">📊</div>
                        <p className="text-xs font-medium text-gray-600">View Results</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UploadPage;