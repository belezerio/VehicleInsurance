import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const UserDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(to right, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome, {userName}!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
            Manage your insurance policies and claims
          </Typography>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card 
                  onClick={() => navigate('/submit-proposal')}
                  sx={{ 
                    borderRadius: '24px', 
                    cursor: 'pointer',
                    borderTop: '4px solid #6366f1',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>📋</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#f8fafc' }}>
                      New Proposal
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Apply for a new vehicle insurance policy in minutes.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card 
                  onClick={() => navigate('/my-proposals')}
                  sx={{ 
                    borderRadius: '24px', 
                    cursor: 'pointer',
                    borderTop: '4px solid #10b981',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>🛡️</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#f8fafc' }}>
                      My Policies
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      Track your policy proposals, active plans, and pending quotes.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <motion.div variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card 
                  onClick={() => navigate('/my-claims')}
                  sx={{ 
                    borderRadius: '24px', 
                    cursor: 'pointer',
                    borderTop: '4px solid #ec4899',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h2" sx={{ mb: 3 }}>📝</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: '#f8fafc' }}>
                      My Claims
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      File new claims and track the status of existing ones easily.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UserDashboard;