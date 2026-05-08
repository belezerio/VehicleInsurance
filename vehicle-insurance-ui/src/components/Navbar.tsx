import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, FileText, Activity, LogOut, UserPlus, LogIn, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ui/ThemeToggle';

const Navbar = () => {
  const { token, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = token
    ? userRole === 'Officer'
      ? [
          { to: '/officer', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/officer/proposals', icon: FileText, label: 'Proposals' },
          { to: '/officer/claims', icon: Activity, label: 'Claims' },
        ]
      : [
          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { to: '/my-proposals', icon: FileText, label: 'Policies' },
          { to: '/my-claims', icon: Activity, label: 'Claims' },
        ]
    : [];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-glass)] shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all">
                <Shield size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold gradient-text hidden sm:block">SecureDrive</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-glass)]'
                  }`}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {!token ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 transition-all"
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <div className="h-8 w-px bg-[var(--border-glass)]" />
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">Welcome,</p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{userName}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-secondary)]"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-[var(--bg-primary)] border-l border-[var(--border-glass)] z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold gradient-text">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-9 h-9 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-center justify-center text-[var(--text-secondary)]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-2 mb-8">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive(link.to)
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass)]'
                        }`}
                      >
                        <link.icon size={18} />
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {!token ? (
                  <div className="space-y-3">
                    <Link to="/login" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-[var(--border-glass)] text-[var(--text-primary)] font-medium text-sm">
                      <LogIn size={16} /> Login
                    </Link>
                    <Link to="/register" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm">
                      <UserPlus size={16} /> Register
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
                      <p className="font-semibold text-[var(--text-primary)]">{userName}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;