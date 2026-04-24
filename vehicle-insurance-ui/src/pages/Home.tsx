import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPolicies } from '../api/policies';
import { getStats } from '../api/stats';
import type { Policy, Stats } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, CheckCircle, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { Box, Typography, Button, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Chip, Stack } from '@mui/material';

const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1503376760367-1ac0b1cbae15?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502877338535-775e0508dca0?auto=format&fit=crop&q=80&w=800'
];

const Home = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesRes, statsRes] = await Promise.all([
          getAllPolicies(),
          getStats()
        ]);
        setPolicies(policiesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  return (
    <Box sx={{ pb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ position: 'relative', height: '80vh', minHeight: 600, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Car Background" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6), transparent)' }} />
        </Box>
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, pt: 10 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '700px' }}
          >
            <Chip 
              label="Premium Auto Coverage" 
              sx={{ mb: 3, bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)', backdropFilter: 'blur(4px)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, color: 'white', lineHeight: 1.1, mb: 3 }}>
              Protect Your Drive,<br/>
              <span style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Secure Your Future.
              </span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 5, fontWeight: 400, lineHeight: 1.6 }}>
              Experience the next generation of vehicle insurance. Fast claims, comprehensive coverage, and 24/7 premium support tailored for modern drivers.
            </Typography>
            <Button
              onClick={() => {
                soundManager.playClick();
                navigate(token ? '/dashboard' : '/register');
              }}
              onMouseEnter={() => soundManager.playHover()}
              variant="contained"
              size="large"
              endIcon={<ArrowRight />}
              sx={{ py: 2, px: 4, fontSize: '1.2rem', borderRadius: '30px' }}
            >
              {token ? 'Go to Dashboard' : 'Get a Quote Now'}
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Stats Section */}
      {stats && (
        <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 20 }}>
          <Grid container spacing={4}>
            {[
              { icon: ShieldCheck, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.2)', label: "Active Policies", value: stats.activePolicies },
              { icon: CheckCircle, color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', label: "Claims Served", value: stats.claimsServed },
              { icon: Users, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.2)', label: "Happy Customers", value: stats.totalCustomers }
            ].map((stat, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3, borderRadius: '24px' }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <stat.icon size={32} />
                    </Box>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {stat.value.toLocaleString()}
                      </Typography>
                      <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Policies Section */}
      <Container maxWidth="lg" sx={{ mt: 12 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
              Curated Insurance Plans
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
              Choose from our premium selection of coverage options designed to provide maximum protection and peace of mind on the road.
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {policies.map((policy, idx) => {
            const image = CAR_IMAGES[idx % CAR_IMAGES.length];
            return (
              <Grid size={{ xs: 12, md: 4 }} key={policy.policyId}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  style={{ height: '100%' }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px', '&:hover': { '& .MuiCardMedia-root': { transform: 'scale(1.1)' } } }}>
                    <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={policy.policyName}
                        sx={{ height: '100%', transition: 'transform 0.7s ease' }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent)' }} />
                      <Chip 
                        label={policy.vehicleCategory} 
                        size="small"
                        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a', fontWeight: 800 }}
                      />
                    </Box>
                    
                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
                        {policy.policyName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                        {policy.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 3, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.light' }}>
                          ₹{policy.basePrice.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          /year
                        </Typography>
                      </Box>

                      {policy.addOns.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                            Popular Add-ons
                          </Typography>
                          <Stack spacing={1}>
                            {policy.addOns.map(addon => (
                              <Box key={addon.addOnId} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Check size={16} color="#10b981" />
                                <Typography variant="body2" sx={{ flexGrow: 1, color: 'text.secondary' }}>
                                  {addon.addOnName}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  +₹{addon.addOnPrice}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Button
                        onClick={() => {
                          soundManager.playClick();
                          navigate(token ? '/submit-proposal' : '/register');
                        }}
                        onMouseEnter={() => soundManager.playHover()}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowRight />}
                        sx={{ mt: 'auto', py: 1.5, borderRadius: '12px' }}
                      >
                        Apply for Coverage
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;