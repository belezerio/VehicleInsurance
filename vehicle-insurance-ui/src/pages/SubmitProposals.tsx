import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAllPolicies } from '../api/policies';
import { submitProposal } from '../api/proposals';
import { toast } from 'react-toastify';
import type { Policy } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Car, Bike, Truck, Caravan, Hash, Type, Calendar } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import ScrollReveal from '../components/ui/ScrollReveal';

const STEPS = ['Select Policy', 'Vehicle Details', 'Add-ons', 'Review'];
const categoryIcons: Record<string, any> = { Car, Motorcycle: Bike, Truck, CamperVan: Caravan };

const SubmitProposal = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { isSubmitting }, setValue } = useForm();
  const watchedPolicyId = watch('policyId');
  const watchedCategory = watch('vehicleCategory');
  const watchedYear = watch('vehicleYear');
  const watchedNumber = watch('vehicleNumber');
  const watchedModel = watch('vehicleModel');

  useEffect(() => { getAllPolicies().then(r => setPolicies(Array.isArray(r.data) ? r.data : [])); }, []);
  useEffect(() => {
    if (watchedPolicyId) {
      const p = policies.find(p => p.policyId === parseInt(watchedPolicyId));
      setSelectedPolicy(p || null);
      setSelectedAddOns([]);
    }
  }, [watchedPolicyId, policies]);

  const toggleAddOn = (id: number) => setSelectedAddOns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const onSubmit = async (data: any) => {
    try {
      await submitProposal({ ...data, policyId: parseInt(data.policyId), vehicleYear: parseInt(data.vehicleYear), selectedAddOnIds: selectedAddOns });
      toast.success('Proposal submitted successfully!');
      navigate('/my-proposals');
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to submit'); }
  };

  const canProceed = () => {
    if (step === 0) return !!watchedPolicyId;
    if (step === 1) return !!(watchedCategory && watchedYear && watchedNumber && watchedModel);
    return true;
  };

  const total = selectedPolicy ? selectedPolicy.basePrice + selectedPolicy.addOns.filter(a => selectedAddOns.includes(a.addOnId)).reduce((s, a) => s + a.addOnPrice, 0) : 0;

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl font-extrabold gradient-text mb-2">Submit Insurance Proposal</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
        </ScrollReveal>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${i <= step ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-muted)]'}`}>{i < step ? <Check size={14} /> : i + 1}</div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 rounded-full transition-all ${i < step ? 'bg-indigo-500' : 'bg-[var(--border-glass)]'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <GlassCard className="p-6 sm:p-8 mb-6">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                {/* Step 0: Policy */}
                {step === 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Choose a Policy</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {policies.map(p => {
                        const Icon = categoryIcons[p.vehicleCategory] || Car;
                        const selected = watchedPolicyId === String(p.policyId);
                        return (
                          <label key={p.policyId} className={`relative flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${selected ? 'border-indigo-500 bg-indigo-500/10 shadow-glow-sm' : 'border-[var(--border-glass)] bg-[var(--bg-glass)] hover:border-indigo-500/30'}`}>
                            <input type="radio" value={p.policyId} {...register('policyId', { required: true })} className="sr-only" />
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}><Icon size={20} /></div>
                            <div>
                              <p className="font-semibold text-[var(--text-primary)] text-sm">{p.policyName}</p>
                              <p className="text-xs text-[var(--text-muted)]">{p.vehicleCategory} • ₹{p.basePrice}/yr</p>
                            </div>
                            {selected && <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 1: Vehicle Details */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Vehicle Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Category</label>
                        <select {...register('vehicleCategory', { required: true })} onChange={e => setValue('vehicleCategory', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50">
                          <option value="">Select</option>
                          <option value="Car">Car</option><option value="Motorcycle">Motorcycle</option><option value="Truck">Truck</option><option value="CamperVan">CamperVan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Vehicle Year</label>
                        <div className="relative"><Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input type="number" min={2000} max={new Date().getFullYear()} {...register('vehicleYear', { required: true })} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50" placeholder="2024" /></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Vehicle Number</label>
                        <div className="relative"><Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input {...register('vehicleNumber', { required: true })} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50" placeholder="GJ01AB1234" /></div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Vehicle Model</label>
                        <div className="relative"><Type size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input {...register('vehicleModel', { required: true })} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50" placeholder="Honda City 2024" /></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Add-ons */}
                {step === 2 && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Select Add-ons</h2>
                    {selectedPolicy && selectedPolicy.addOns.length > 0 ? (
                      <div className="space-y-2">
                        {selectedPolicy.addOns.map(a => (
                          <label key={a.addOnId} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedAddOns.includes(a.addOnId) ? 'border-indigo-500 bg-indigo-500/10' : 'border-[var(--border-glass)] bg-[var(--bg-glass)] hover:border-indigo-500/30'}`}>
                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedAddOns.includes(a.addOnId) ? 'bg-indigo-500 border-indigo-500' : 'border-[var(--text-muted)]'}`}>
                              {selectedAddOns.includes(a.addOnId) && <Check size={12} className="text-white" />}
                            </div>
                            <span className="flex-1 text-sm text-[var(--text-primary)]">{a.addOnName}</span>
                            <span className="text-sm font-semibold text-indigo-400">+₹{a.addOnPrice}</span>
                            <input type="checkbox" checked={selectedAddOns.includes(a.addOnId)} onChange={() => toggleAddOn(a.addOnId)} className="sr-only" />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[var(--text-secondary)] text-center py-8">No add-ons available for this policy.</p>
                    )}
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && selectedPolicy && (
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Review & Submit</h2>
                    <div className="space-y-3">
                      {[
                        ['Policy', selectedPolicy.policyName],
                        ['Category', watchedCategory],
                        ['Vehicle', `${watchedModel} (${watchedYear})`],
                        ['Number', watchedNumber],
                      ].map(([k, v]) => (
                        <div key={k as string} className="flex justify-between py-2 border-b border-[var(--border-glass)]">
                          <span className="text-sm text-[var(--text-muted)]">{k}</span>
                          <span className="text-sm font-medium text-[var(--text-primary)]">{v}</span>
                        </div>
                      ))}
                      {selectedAddOns.length > 0 && (
                        <div className="py-2 border-b border-[var(--border-glass)]">
                          <span className="text-sm text-[var(--text-muted)]">Add-ons</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">{selectedPolicy.addOns.filter(a => selectedAddOns.includes(a.addOnId)).map(a => (
                            <span key={a.addOnId} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium">{a.addOnName} (+₹{a.addOnPrice})</span>
                          ))}</div>
                        </div>
                      )}
                      <div className="flex justify-between items-baseline pt-4">
                        <span className="text-lg font-semibold text-[var(--text-primary)]">Estimated Total</span>
                        <span className="text-3xl font-extrabold gradient-text">₹{total.toLocaleString()}/yr</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </GlassCard>

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && <GradientButton type="button" variant="outline" onClick={() => setStep(s => s - 1)} icon={<ArrowLeft size={16} />}>Back</GradientButton>}
            {step < 3 ? (
              <GradientButton type="button" fullWidth onClick={(e: any) => { e.preventDefault(); setStep(s => s + 1); }} disabled={!canProceed()} iconRight={<ArrowRight size={16} />}>Continue</GradientButton>
            ) : (
              <GradientButton type="submit" fullWidth loading={isSubmitting} iconRight={!isSubmitting ? <Check size={16} /> : undefined}>{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</GradientButton>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;