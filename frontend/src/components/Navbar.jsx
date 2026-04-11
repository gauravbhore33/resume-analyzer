import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-2xl font-bold">
                Resume Analyzer 🎯
            </Link>
            <div className="flex gap-4">
                {!token ? (
                    <>
                        <Link to="/login"
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
                            Login
                        </Link>
                        <Link to="/register"
                            className="bg-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/upload"
                            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
                            Upload Resume
                        </Link>
                        <Link to="/history"
                            className="bg-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                            History
                        </Link>
                        <button onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;