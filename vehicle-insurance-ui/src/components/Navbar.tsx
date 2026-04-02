import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, FileText, Activity, LogOut, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/sound';

const Navbar = () => {
  const { token, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    soundManager.playClick();
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => (
    <Link
      to={to}
      onMouseEnter={() => soundManager.playHover()}
      onClick={() => soundManager.playClick()}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
        isActive(to) 
          ? 'bg-blue-600/10 text-blue-700 shadow-sm' 
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" onClick={() => soundManager.playClick()} onMouseEnter={() => soundManager.playHover()} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Shield size={24} />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800">
            SecureDrive
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {!token ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-4 py-2 transition-colors"
              >
                <LogIn size={18} /> Login
              </Link>
              <Link
                to="/register"
                onClick={() => soundManager.playClick()}
                onMouseEnter={() => soundManager.playHover()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5"
              >
                <UserPlus size={18} /> Register
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {userRole === 'User' && (
                  <>
                    <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/my-proposals" icon={FileText}>Policies</NavLink>
                    <NavLink to="/my-claims" icon={Activity}>Claims</NavLink>
                  </>
                )}
                {userRole === 'Officer' && (
                  <>
                    <NavLink to="/officer" icon={LayoutDashboard}>Dashboard</NavLink>
                    <NavLink to="/officer/proposals" icon={FileText}>Proposals</NavLink>
                    <NavLink to="/officer/claims" icon={Activity}>Claims</NavLink>
                  </>
                )}
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500">Welcome back,</span>
                  <span className="font-semibold text-gray-800">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  onMouseEnter={() => soundManager.playHover()}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors font-medium hover:shadow-sm"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;