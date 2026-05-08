import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMyClaims, fileClaim } from '../api/claims';
import { getMyProposals } from '../api/proposals';
import { toast } from 'react-toastify';
import type { Claim, Proposal } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, AlertCircle, Activity, Search } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';

const statusStyles: Record<string, string> = {
  Filed: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  UnderReview: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const MyClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset, formState: { isSubmitting }, setValue } = useForm();

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try {
      const [c, p] = await Promise.all([getMyClaims(), getMyProposals()]);
      setClaims(Array.isArray(c.data) ? c.data : []);
      const props = Array.isArray(p.data) ? p.data : [];
      setActiveProposals(props.filter((p: Proposal) => p.status === 'Active'));
    } catch { toast.error('Failed to load claims'); }
    finally { setLoading(false); }
  };

  const onSubmit = async (data: any) => {
    try {
      await fileClaim({ ...data, proposalId: parseInt(data.proposalId), claimAmount: parseFloat(data.claimAmount) });
      toast.success('Claim filed successfully!');
      setShowForm(false); reset(); fetchData();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to file claim'); }
  };

  const filtered = claims.filter(c => search === '' || c.claimDescription.toLowerCase().includes(search.toLowerCase()) || String(c.claimId).includes(search));

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold gradient-text">My Claims</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">{claims.length} total claims</p>
            </div>
            {activeProposals.length > 0 && (
              <GradientButton variant={showForm ? 'outline' : 'primary'} icon={showForm ? <X size={16} /> : <Plus size={16} />} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Cancel' : 'File Claim'}
              </GradientButton>
            )}
          </div>
        </ScrollReveal>

        {/* File Claim Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-6">
              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">File a New Claim</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Select Policy</label>
                    <select {...register('proposalId', { required: true })} onChange={e => setValue('proposalId', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50">
                      <option value="">Select active policy</option>
                      {activeProposals.map(p => <option key={p.proposalId} value={p.proposalId}>{p.policyName} - {p.vehicleNumber}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Description</label>
                    <textarea rows={3} placeholder="Describe the incident..." {...register('claimDescription', { required: true })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 resize-none" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Claim Amount (₹)</label>
                      <input type="number" min={0} placeholder="15000" {...register('claimAmount', { required: true })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50" />
                    </div>
                    <div className="flex items-end">
                      <GradientButton type="submit" fullWidth size="lg" loading={isSubmitting}>{isSubmitting ? 'Filing...' : 'Submit Claim'}</GradientButton>
                    </div>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search claims..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" />
        </div>

        {loading ? <ShimmerLoader variant="card" count={3} /> : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No claims found</p>
            <p className="text-[var(--text-secondary)]">File your first claim when needed.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filtered.map((claim, idx) => (
              <motion.div key={claim.claimId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <GlassCard className="p-5" hoverScale={false}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)]">Claim #{claim.claimId}</h3>
                        <p className="text-xs text-[var(--text-muted)]">Filed {new Date(claim.filedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusStyles[claim.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{claim.status}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-3">{claim.claimDescription}</p>
                  <p className="text-2xl font-extrabold gradient-text mb-3">₹{claim.claimAmount.toLocaleString()}</p>
                  {claim.officerRemarks && (
                    <div className="p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] flex items-start gap-2">
                      <AlertCircle size={14} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[var(--text-secondary)]"><span className="font-semibold">Remarks:</span> {claim.officerRemarks}</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims;