import { useEffect, useState } from 'react';
import { getAllClaims, updateClaimStatus } from '../api/claims';
import { toast } from 'react-toastify';
import type { Claim } from '../types';
import { motion } from 'framer-motion';
import { Search, Activity, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
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

const ManageClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => { fetchClaims(); }, []);
  const fetchClaims = async () => {
    try {
      const res = await getAllClaims();
      const r = res.data;
      setClaims(Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : []);
    } catch { toast.error('Failed to load claims'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateClaimStatus(id, { status, officerRemarks: remarks[id] || '' });
      toast.success(`Claim ${status} successfully!`);
      fetchClaims();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update claim'); }
  };

  const statuses = ['All', ...new Set(claims.map(c => c.status))];
  const filtered = claims.filter(c =>
    (filter === 'All' || c.status === filter) &&
    (search === '' || c.claimDescription.toLowerCase().includes(search.toLowerCase()) || c.userName.toLowerCase().includes(search.toLowerCase()) || String(c.claimId).includes(search))
  );

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold gradient-text">Manage Claims</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{claims.length} total claims</p>
          </div>
        </ScrollReveal>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer, description..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === s ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border-glass)] hover:text-[var(--text-secondary)]'}`}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? <ShimmerLoader variant="card" count={4} /> : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No claims found</p>
            <p className="text-[var(--text-secondary)]">Adjust your search or filter.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filtered.map((claim, idx) => (
              <motion.div key={claim.claimId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <GlassCard className="overflow-hidden" hoverScale={false}>
                  {/* Header */}
                  <button onClick={() => setExpanded(expanded === claim.claimId ? null : claim.claimId)} className="w-full p-5 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0"><Activity size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[var(--text-primary)]">Claim #{claim.claimId}</h3>
                        <span className="text-xs text-[var(--text-muted)]">Policy #{claim.proposalId}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] truncate">{claim.userName} • ₹{claim.claimAmount.toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex-shrink-0 ${statusStyles[claim.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{claim.status}</span>
                    {expanded === claim.claimId ? <ChevronUp size={18} className="text-[var(--text-muted)]" /> : <ChevronDown size={18} className="text-[var(--text-muted)]" />}
                  </button>

                  {/* Expanded */}
                  {expanded === claim.claimId && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-[var(--border-glass)]">
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          <div><p className="text-[var(--text-muted)] text-xs">Customer</p><p className="font-medium text-[var(--text-primary)]">{claim.userName}</p></div>
                          <div><p className="text-[var(--text-muted)] text-xs">Amount</p><p className="font-bold gradient-text text-lg">₹{claim.claimAmount.toLocaleString()}</p></div>
                          <div><p className="text-[var(--text-muted)] text-xs">Filed</p><p className="font-medium text-[var(--text-primary)]">{new Date(claim.filedAt).toLocaleDateString()}</p></div>
                        </div>

                        <div>
                          <p className="text-xs text-[var(--text-muted)] mb-1">Description</p>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{claim.claimDescription}</p>
                        </div>

                        {claim.status === 'Filed' && (
                          <div className="pt-3 border-t border-[var(--border-glass)] space-y-3">
                            <textarea rows={2} placeholder="Officer remarks..." value={remarks[claim.claimId] || ''} onChange={e => setRemarks(prev => ({ ...prev, [claim.claimId]: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                            <div className="flex gap-2">
                              <GradientButton variant="secondary" onClick={() => handleStatusUpdate(claim.claimId, 'Approved')} icon={<Check size={14} />} size="sm">Approve</GradientButton>
                              <GradientButton variant="outline" onClick={() => handleStatusUpdate(claim.claimId, 'Rejected')} icon={<X size={14} />} size="sm" className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10">Reject</GradientButton>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
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

export default ManageClaims;