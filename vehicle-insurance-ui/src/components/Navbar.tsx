import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-xl font-bold">
        🚗 Vehicle Insurance
      </Link>
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <Link to="/login" className="hover:text-blue-200">Login</Link>
            <Link
              to="/register"
              className="bg-white text-blue-800 px-4 py-1 rounded hover:bg-blue-100"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-blue-200">Hello, {userName}</span>
            {userRole === 'User' && (
              <>
                <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/my-proposals" className="hover:text-blue-200">My Policies</Link>
                <Link to="/my-claims" className="hover:text-blue-200">My Claims</Link>
              </>
            )}
            {userRole === 'Officer' && (
              <>
                <Link to="/officer" className="hover:text-blue-200">Dashboard</Link>
                <Link to="/officer/proposals" className="hover:text-blue-200">Proposals</Link>
                <Link to="/officer/claims" className="hover:text-blue-200">Claims</Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;