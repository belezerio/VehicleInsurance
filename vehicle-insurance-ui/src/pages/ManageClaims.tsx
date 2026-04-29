import { useEffect, useState } from 'react';
import { getAllClaims, updateClaimStatus } from '../api/claims';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Claim } from '../types';
import { Box, Button, TextField, Typography, Paper, Container, Grid, CircularProgress, Stack, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const ManageClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await getAllClaims();
      const result = res.data;
      setClaims(Array.isArray(result) ? result : Array.isArray(result.data) ? result.data : []);
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimId: number, status: string) => {
    try {
      await updateClaimStatus(claimId, {
        status,
        officerRemarks: remarks[claimId] || ''
      });
      toast.success(`Claim ${status} successfully!`);
      fetchClaims();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update claim');
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
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Manage Claims
        </Typography>

        {claims.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
            <Typography variant="h6" color="text.secondary">No claims yet.</Typography>
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
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Claim #{claim.claimId}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Policy #{claim.proposalId}
                          </Typography>
                          <StatusBadge status={claim.status} />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Customer: {claim.userName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {claim.claimDescription}
                        </Typography>
                        
                        <Typography variant="h6" color="primary.light" sx={{ fontWeight: 700 }}>
                          ₹{claim.claimAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Filed: {new Date(claim.filedAt).toLocaleDateString()}
                        </Typography>
                      </Grid>

                      {claim.status === 'Filed' && (
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', borderLeft: { sm: '1px solid rgba(255,255,255,0.1)' }, pl: { sm: 3 } }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              label="Officer Remarks"
                              variant="outlined"
                              value={remarks[claim.claimId] || ''}
                              onChange={e => setRemarks(prev => ({
                                ...prev,
                                [claim.claimId]: e.target.value
                              }))}
                              sx={{ mb: 2 }}
                            />
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={() => handleStatusUpdate(claim.claimId, 'Approved')}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={() => handleStatusUpdate(claim.claimId, 'Rejected')}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
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

export default ManageClaims;