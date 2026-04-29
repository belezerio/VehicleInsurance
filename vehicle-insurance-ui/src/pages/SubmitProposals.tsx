import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAllPolicies } from '../api/policies';
import { submitProposal } from '../api/proposals';
import { toast } from 'react-toastify';
import type { Policy } from '../types';
import { Box, Button, TextField, Typography, Paper, Container, Grid, MenuItem, Select, FormControl, InputLabel, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { motion } from 'framer-motion';

const SubmitProposal = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { isSubmitting }, setValue } = useForm();
  const watchedPolicyId = watch('policyId');

  useEffect(() => {
    getAllPolicies().then(res => setPolicies(Array.isArray(res.data) ? res.data : []));
  }, []);

  useEffect(() => {
    if (watchedPolicyId) {
      const policy = policies.find(p => p.policyId === parseInt(watchedPolicyId));
      setSelectedPolicy(policy || null);
      setSelectedAddOns([]);
    }
  }, [watchedPolicyId, policies]);

  const toggleAddOn = (addOnId: number) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const onSubmit = async (data: any) => {
    try {
      await submitProposal({
        ...data,
        policyId: parseInt(data.policyId),
        vehicleYear: parseInt(data.vehicleYear),
        selectedAddOnIds: selectedAddOns
      });
      toast.success('Proposal submitted successfully!');
      navigate('/my-proposals');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: '24px' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Submit Insurance Proposal
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
                      {...register('policyId', { required: true })}
                      onChange={(e) => setValue('policyId', e.target.value)}
                    >
                      <MenuItem value="" disabled>-- Select a policy --</MenuItem>
                      {policies.map(p => (
                        <MenuItem key={p.policyId} value={p.policyId}>
                          {p.policyName} - {p.vehicleCategory} (₹{p.basePrice})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-label">Vehicle Category</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Vehicle Category"
                      defaultValue=""
                      {...register('vehicleCategory', { required: true })}
                      onChange={(e) => setValue('vehicleCategory', e.target.value)}
                    >
                      <MenuItem value="" disabled>-- Select category --</MenuItem>
                      <MenuItem value="Car">Car</MenuItem>
                      <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                      <MenuItem value="Truck">Truck</MenuItem>
                      <MenuItem value="CamperVan">CamperVan</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Vehicle Year"
                    type="number"
                    variant="outlined"
                    slotProps={{ htmlInput: { min: 2000, max: new Date().getFullYear() } }}
                    {...register('vehicleYear', { required: true })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Vehicle Number"
                    variant="outlined"
                    placeholder="GJ01AB1234"
                    {...register('vehicleNumber', { required: true })}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Vehicle Model"
                    variant="outlined"
                    placeholder="Honda City 2021"
                    {...register('vehicleModel', { required: true })}
                  />
                </Grid>

                {selectedPolicy && selectedPolicy.addOns.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 2 }}>
                      Select Add-ons
                    </Typography>
                    <FormGroup>
                      {selectedPolicy.addOns.map(addon => (
                        <FormControlLabel
                          key={addon.addOnId}
                          control={
                            <Checkbox
                              checked={selectedAddOns.includes(addon.addOnId)}
                              onChange={() => toggleAddOn(addon.addOnId)}
                              color="primary"
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', minWidth: '200px' }}>
                              <Typography variant="body1">{addon.addOnName}</Typography>
                              <Typography variant="body1" sx={{ color: 'primary.main', fontWeight: 600, ml: 2 }}>
                                +₹{addon.addOnPrice}
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 1, ml: 0, p: 1, borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SubmitProposal;