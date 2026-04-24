import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LayoutDashboard, FileText, Activity, LogOut, UserPlus, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundManager } from '../utils/sound';
import { AppBar, Toolbar, Button, Typography, Box, IconButton, useTheme, Container } from '@mui/material';

const Navbar = () => {
  const { token, userRole, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    soundManager.playClick();
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => {
    const active = isActive(to);
    return (
      <Button
        component={Link}
        to={to}
        onMouseEnter={() => soundManager.playHover()}
        onClick={() => soundManager.playClick()}
        startIcon={<Icon size={18} />}
        sx={{
          color: active ? theme.palette.primary.main : theme.palette.text.secondary,
          backgroundColor: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          borderRadius: '12px',
          px: 2,
          py: 1,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            color: theme.palette.primary.light,
          }
        }}
      >
        {children}
      </Button>
    );
  };

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{ position: 'sticky', top: 0, zIndex: 1000 }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 80, display: 'flex', justifyContent: 'space-between' }}>
            <Box 
              component={Link} 
              to="/" 
              onClick={() => soundManager.playClick()} 
              onMouseEnter={() => soundManager.playHover()}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}
            >
              <Box 
                sx={{
                  width: 40, height: 40, borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                <Shield size={24} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SecureDrive
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {!token ? (
                <>
                  <Button 
                    component={Link} 
                    to="/login"
                    onClick={() => soundManager.playClick()}
                    onMouseEnter={() => soundManager.playHover()}
                    startIcon={<LogIn size={18} />}
                    sx={{ color: theme.palette.text.secondary, textTransform: 'none', fontWeight: 600, '&:hover': { color: theme.palette.primary.light } }}
                  >
                    Login
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register"
                    variant="contained"
                    onClick={() => soundManager.playClick()}
                    onMouseEnter={() => soundManager.playHover()}
                    startIcon={<UserPlus size={18} />}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', gap: 0.5, mr: 2 }}>
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
                  </Box>
                  <Box sx={{ width: '1px', height: 32, bgcolor: 'rgba(255,255,255,0.1)', mr: 2 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 2 }}>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>Welcome back,</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>{userName}</Typography>
                  </Box>
                  <IconButton 
                    onClick={handleLogout}
                    onMouseEnter={() => soundManager.playHover()}
                    sx={{ 
                      bgcolor: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      borderRadius: '12px',
                      '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                    }}
                  >
                    <LogOut size={20} />
                  </IconButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;