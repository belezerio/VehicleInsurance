import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Paper, Container, Link } from '@mui/material';
import { motion } from 'framer-motion';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data);
      authLogin(res.data.token);
      toast.success('Login successful!');
      const role = localStorage.getItem('userRole');
      navigate(role === 'Officer' ? '/officer' : '/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', py: 8 }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper sx={{ p: { xs: 4, md: 6 }, borderRadius: '24px' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome Back
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Box>
            </form>
            
            <Typography variant="body2" sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                Register here
              </Link>
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;