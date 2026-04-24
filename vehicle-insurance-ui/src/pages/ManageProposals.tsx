import { useEffect, useState } from 'react';
import { getAllProposals, updateProposalStatus } from '../api/proposals';
import { generateQuote } from '../api/quotes';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Proposal } from '../types';
import { Box, Button, TextField, Typography, Paper, Container, Grid, CircularProgress, Stack, Card, CardContent, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const ManageProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await getAllProposals();
      setProposals(res.data);
    } catch {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId: number, status: string) => {
    try {
      await updateProposalStatus(proposalId, {
        status,
        officerRemarks: remarks[proposalId] || ''
      });
      toast.success(`Proposal ${status} successfully!`);
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleGenerateQuote = async (proposalId: number) => {
    try {
      const res = await generateQuote(proposalId);
      toast.success(`Quote generated! Premium: ₹${res.data.premiumAmount}`);
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate quote');
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
          Manage Proposals
        </Typography>

        {proposals.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '24px' }}>
            <Typography variant="h6" color="text.secondary">No proposals yet.</Typography>
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
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {proposal.policyName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            #{proposal.proposalId}
                          </Typography>
                          <StatusBadge status={proposal.status} />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Customer: {proposal.userName} • {proposal.vehicleModel} • {proposal.vehicleNumber}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                          Year: {proposal.vehicleYear} • Category: {proposal.vehicleCategory}
                        </Typography>

                        {proposal.selectedAddOns.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              Selected Add-ons:
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {proposal.selectedAddOns.map(addon => (
                                <Chip 
                                  key={addon.addOnId} 
                                  label={`${addon.addOnName} (+₹${addon.addOnPrice})`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Grid>

                      {proposal.status === 'ProposalSubmitted' && (
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', borderLeft: { sm: '1px solid rgba(255,255,255,0.1)' }, pl: { sm: 3 } }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              label="Officer Remarks (optional)"
                              variant="outlined"
                              value={remarks[proposal.proposalId] || ''}
                              onChange={e => setRemarks(prev => ({
                                ...prev,
                                [proposal.proposalId]: e.target.value
                              }))}
                              sx={{ mb: 2 }}
                            />
                            <Stack direction="row" spacing={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => handleGenerateQuote(proposal.proposalId)}
                              >
                                Generate Quote
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                onClick={() => handleStatusUpdate(proposal.proposalId, 'Rejected')}
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

export default ManageProposals;