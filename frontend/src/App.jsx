import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import HRDashboard from './pages/HRDashboard';
import HRLeaderboard from './pages/HRLeaderboard';

function App() {
    return (
        <Router>
            <Toaster
                position="top-right"
                toastOptions={{
                    success: {
                        duration: 3000,
                        style: {
                            background: '#dcfce7',
                            color: '#166534',
                            fontWeight: '500',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#fee2e2',
                            color: '#991b1b',
                            fontWeight: '500',
                        },
                    },
                }}
            />
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/results/:id" element={<ResultsPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/hr/dashboard" element={<HRDashboard />} />
                <Route path="/hr/leaderboard/:jobRoleId" element={<HRLeaderboard />} />
            </Routes>
        </Router>
    );
}

export default App;