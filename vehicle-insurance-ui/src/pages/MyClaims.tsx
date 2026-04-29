import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMyClaims, fileClaim } from '../api/claims';
import { getMyProposals } from '../api/proposals';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Claim, Proposal } from '../types';
import { Box, Button, TextField, Typography, Paper, Container, CircularProgress, Stack, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const MyClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting }, setValue } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [claimsRes, proposalsRes] = await Promise.all([
        getMyClaims(),
        getMyProposals()
      ]);
      setClaims(Array.isArray(claimsRes.data) ? claimsRes.data : []);
      const proposals = Array.isArray(proposalsRes.data) ? proposalsRes.data : [];
      setActiveProposals(proposals.filter((p: Proposal) => p.status === 'Active'));
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await fileClaim({
        ...data,
        proposalId: parseInt(data.proposalId),
        claimAmount: parseFloat(data.claimAmount)
      });
      toast.success('Claim filed successfully!');
      setShowForm(false);
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to file claim');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} thickness={4} />
    </Box>
  );

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            My Claims
          </Typography>
          {activeProposals.length > 0 && (
            <Button
              variant={showForm ? 'outlined' : 'contained'}
              color={showForm ? 'error' : 'primary'}
              onClick={() => setShowForm(!showForm)}
              sx={{ borderRadius: '12px' }}
            >
              {showForm ? 'Cancel' : '+ File Claim'}
            </Button>
          )}
        </Box>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <Paper sx={{ p: 4, mb: 6, borderRadius: '24px' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  File a New Claim
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel id="policy-label">Select Policy</InputLabel>
                        <Select
                          labelId="policy-label"
                          label="Select Policy"
                          defaultValue=""
                          {...register('proposalId', { required: true })}
                          onChange={(e) => setValue('proposalId', e.target.value)}
                        >
                          <MenuItem value="" disabled>-- Select active policy --</MenuItem>
                          {activeProposals.map(p => (
                            <MenuItem key={p.proposalId} value={p.proposalId}>
                              {p.policyName} - {p.vehicleNumber}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Claim Description"
                        variant="outlined"
                        placeholder="Describe the incident..."
                        {...register('claimDescription', { required: true })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Claim Amount (₹)"
                        variant="outlined"
                        slotProps={{ htmlInput: { min: 0 } }}
                        placeholder="15000"
                        {...register('claimAmount', { required: true })}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={isSubmitting}
                        sx={{ height: '56px' }}
                      >
                        {isSubmitting ? 'Filing...' : 'Submit Claim'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {claims.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
            <Typography variant="h1" sx={{ mb: 2 }}>📝</Typography>
            <Typography variant="h6" color="text.secondary">No claims filed yet.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {claims.map((claim, idx) => (
              <motion.div
                key={claim.claimId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Claim #{claim.claimId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Filed: {new Date(claim.filedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <StatusBadge status={claim.status} />
                    </Box>
                    
                    <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                      {claim.claimDescription}
                    </Typography>
                    
                    <Typography variant="h5" color="primary.light" sx={{ fontWeight: 700, mb: 2 }}>
                      ₹{claim.claimAmount.toLocaleString()}
                    </Typography>

                    {claim.officerRemarks && (
                      <Box sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}>
                        <Typography variant="body2">
                          <span style={{ fontWeight: 600 }}>Remarks:</span> {claim.officerRemarks}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default MyClaims;