import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Container, Link, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  aadhaarNumber: yup.string().length(12, 'Must be 12 digits').required('Aadhaar is required'),
  panNumber: yup.string().length(10, 'Must be 10 characters').required('PAN is required'),
  address: yup.string().required('Address is required'),
});

type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await registerApi(data);
      authLogin(res.data.token);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: '24px' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create Account
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    {...register('fullName')}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    {...register('email')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    {...register('password')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    slotProps={{ inputLabel: { shrink: true } }}
                    {...register('dateOfBirth')}
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Aadhaar Number"
                    variant="outlined"
                    slotProps={{ htmlInput: { maxLength: 12 } }}
                    {...register('aadhaarNumber')}
                    error={!!errors.aadhaarNumber}
                    helperText={errors.aadhaarNumber?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    variant="outlined"
                    slotProps={{ htmlInput: { maxLength: 10 } }}
                    {...register('panNumber')}
                    error={!!errors.panNumber}
                    helperText={errors.panNumber?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Address"
                    variant="outlined"
                    multiline
                    rows={2}
                    {...register('address')}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                </Grid>
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
                    {isSubmitting ? 'Registering...' : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </form>
            
            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Login here
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Register;