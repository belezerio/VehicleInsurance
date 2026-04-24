import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const OfficerDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Officer Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
            Welcome, {userName}. Manage proposals and claims.
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                onClick={() => navigate('/officer/proposals')}
                sx={{ 
                  borderRadius: '24px', 
                  cursor: 'pointer',
                  borderLeft: '4px solid #3b82f6',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>📋</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Manage Proposals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review, approve or reject policy proposals
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card 
                onClick={() => navigate('/officer/claims')}
                sx={{ 
                  borderRadius: '24px', 
                  cursor: 'pointer',
                  borderLeft: '4px solid #a855f7',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h2" sx={{ mb: 2 }}>🔍</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Manage Claims
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Review and process insurance claims
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OfficerDashboard;