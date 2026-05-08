import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Shield, ArrowRight, ArrowLeft, User, Mail, Lock, CreditCard, MapPin, Calendar, Check } from 'lucide-react';
import ParticleField from '../components/ui/ParticleField';
import GradientButton from '../components/ui/GradientButton';

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

const STEPS = ['Personal Info', 'Identity', 'Address'];

const Register = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, watch } = useForm<FormData>({
    resolver: yupResolver(schema), mode: 'onChange'
  });

  const password = watch('password', '');
  const getStrength = (p: string) => {
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strength = getStrength(password);
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500', 'bg-emerald-400'];

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ['fullName', 'email', 'password'],
      ['dateOfBirth', 'aadhaarNumber', 'panNumber'],
      ['address'],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep(s => Math.min(s + 1, 2));
  };

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

  const InputField = ({ icon: Icon, label, type = 'text', error, ...props }: any) => (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input type={type} className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-glass)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-[var(--border-glass)] focus:border-indigo-500/50 focus:ring-indigo-500/20'}`} {...props} />
      </div>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30"><ParticleField color="255,255,255" particleCount={30} speed={0.2} /></div>
        <motion.div className="relative z-10 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/30">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Join SecureDrive</h1>
          <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">Create your account and start protecting your vehicles with India's most trusted insurance platform.</p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 opacity-30"><ParticleField particleCount={20} speed={0.15} /></div>
        <motion.div className="relative z-10 w-full max-w-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="glass rounded-3xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Create Account</h2>
              <p className="text-[var(--text-secondary)] text-sm">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((_, i) => (
                <div key={i} className="flex-1 flex items-center gap-2">
                  <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-[var(--border-glass)]'}`} />
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {step === 0 && (
                    <div className="space-y-4">
                      <InputField icon={User} label="Full Name" placeholder="John Doe" {...register('fullName')} error={errors.fullName?.message} />
                      <InputField icon={Mail} label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                          <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" {...register('password')} className={`w-full pl-11 pr-11 py-3 rounded-xl bg-[var(--bg-glass)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all ${errors.password ? 'border-red-500/50 focus:ring-red-500/20' : 'border-[var(--border-glass)] focus:border-indigo-500/50 focus:ring-indigo-500/20'}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                        </div>
                        {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
                        {password && (
                          <div className="mt-2">
                            <div className="flex gap-1 mb-1">{[1,2,3,4,5].map(i => (<div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-[var(--border-glass)]'}`} />))}</div>
                            <p className="text-xs text-[var(--text-muted)]">{strengthLabels[strength]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-4">
                      <InputField icon={Calendar} label="Date of Birth" type="date" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                      <InputField icon={CreditCard} label="Aadhaar Number" placeholder="XXXX XXXX XXXX" maxLength={12} {...register('aadhaarNumber')} error={errors.aadhaarNumber?.message} />
                      <InputField icon={CreditCard} label="PAN Number" placeholder="ABCDE1234F" maxLength={10} {...register('panNumber')} error={errors.panNumber?.message} />
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Address</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-4 text-[var(--text-muted)]" />
                          <textarea rows={3} placeholder="Enter your full address" {...register('address')} className={`w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-glass)] border text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${errors.address ? 'border-red-500/50 focus:ring-red-500/20' : 'border-[var(--border-glass)] focus:border-indigo-500/50 focus:ring-indigo-500/20'}`} />
                        </div>
                        {errors.address && <p className="text-red-400 text-xs mt-1.5">{errors.address.message}</p>}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <GradientButton type="button" variant="outline" onClick={() => setStep(s => s - 1)} icon={<ArrowLeft size={16} />}>
                    Back
                  </GradientButton>
                )}
                {step < 2 ? (
                  <GradientButton type="button" fullWidth onClick={nextStep} iconRight={<ArrowRight size={16} />}>
                    Continue
                  </GradientButton>
                ) : (
                  <GradientButton type="submit" fullWidth loading={isSubmitting} iconRight={!isSubmitting ? <Check size={16} /> : undefined}>
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </GradientButton>
                )}
              </div>
            </form>

            <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
              Already have an account?{' '}
              <RouterLink to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Sign in</RouterLink>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;