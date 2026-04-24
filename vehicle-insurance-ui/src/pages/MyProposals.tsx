import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProposals } from '../api/proposals';
import { getQuoteByProposalId } from '../api/quotes';
import { processPayment } from '../api/payments';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Proposal, Quote } from '../types';
import { Box, Button, Typography, Paper, Container, CircularProgress, Stack, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const MyProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [quotes, setQuotes] = useState<Record<number, Quote>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await getMyProposals();
      setProposals(res.data);
      for (const proposal of res.data) {
        if (proposal.status === 'QuoteGenerated') {
          try {
            const quoteRes = await getQuoteByProposalId(proposal.proposalId);
            setQuotes(prev => ({ ...prev, [proposal.proposalId]: quoteRes.data }));
          } catch {}
        }
      }
    } catch (error) {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (proposalId: number, amount: number) => {
    try {
      await processPayment({ proposalId, amount });
      toast.success('Payment successful! Policy is now active.');
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
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
            My Policies
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/submit-proposal')}
            sx={{ borderRadius: '12px' }}
          >
            + New Proposal
          </Button>
        </Box>

        {proposals.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
            <Typography variant="h1" sx={{ mb: 2 }}>📋</Typography>
            <Typography variant="h6" color="text.secondary">No proposals yet. Submit your first proposal!</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {proposals.map((proposal, idx) => (
              <motion.div
                key={proposal.proposalId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card sx={{ borderRadius: '16px' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {proposal.policyName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {proposal.vehicleModel} • {proposal.vehicleNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <StatusBadge status={proposal.status} />
                    </Box>

                    {proposal.officerRemarks && (
                      <Box sx={{ p: 2, mb: 2, bgcolor: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <Typography variant="body2" sx={{ color: '#fcd34d' }}>
                          <span style={{ fontWeight: 600 }}>Officer Remarks:</span> {proposal.officerRemarks}
                        </Typography>
                      </Box>
                    )}

                    {proposal.status === 'QuoteGenerated' && quotes[proposal.proposalId] && (
                      <Paper sx={{ p: 3, mt: 3, bgcolor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '12px' }}>
                        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <Grid size={{ xs: 12, sm: 'auto' }}>
                            <Typography variant="body2" color="text.secondary">
                              Premium Amount
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.light' }}>
                              ₹{quotes[proposal.proposalId].premiumAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Valid until: {new Date(quotes[proposal.proposalId].validUntil).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 'auto' }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="large"
                              onClick={() => handlePayment(
                                proposal.proposalId,
                                quotes[proposal.proposalId].premiumAmount
                              )}
                            >
                              Pay Now
                            </Button>
                          </Grid>
                        </Grid>
                      </Paper>
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

export default MyProposals;