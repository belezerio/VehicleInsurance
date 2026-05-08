import { useEffect, useState } from 'react';
import { getAllProposals, updateProposalStatus } from '../api/proposals';
import { generateQuote } from '../api/quotes';
import { toast } from 'react-toastify';
import type { Proposal } from '../types';
import { motion } from 'framer-motion';
import { Search, FileText, X, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';

const statusStyles: Record<string, string> = {
  ProposalSubmitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  QuoteGenerated: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const ManageProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => { fetchProposals(); }, []);
  const fetchProposals = async () => {
    try {
      const res = await getAllProposals();
      const r = res.data;
      setProposals(Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : []);
    } catch { toast.error('Failed to load proposals'); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateProposalStatus(id, { status, officerRemarks: remarks[id] || '' });
      toast.success(`Proposal ${status} successfully!`);
      fetchProposals();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to update'); }
  };

  const handleGenerateQuote = async (id: number) => {
    try {
      const res = await generateQuote(id);
      toast.success(`Quote generated! Premium: ₹${res.data.premiumAmount}`);
      fetchProposals();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Failed to generate quote'); }
  };

  const statuses = ['All', ...new Set(proposals.map(p => p.status))];
  const filtered = proposals.filter(p =>
    (filter === 'All' || p.status === filter) &&
    (search === '' || p.policyName.toLowerCase().includes(search.toLowerCase()) || p.userName.toLowerCase().includes(search.toLowerCase()) || p.vehicleNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold gradient-text">Manage Proposals</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">{proposals.length} total proposals</p>
          </div>
        </ScrollReveal>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by policy, customer, vehicle..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === s ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border-glass)] hover:text-[var(--text-secondary)]'}`}>{s}</button>
            ))}
          </div>
        </div>

        {loading ? <ShimmerLoader variant="card" count={4} /> : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No proposals found</p>
            <p className="text-[var(--text-secondary)]">Adjust your search or filter.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filtered.map((p, idx) => (
              <motion.div key={p.proposalId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <GlassCard className="overflow-hidden" hoverScale={false}>
                  {/* Header Row */}
                  <button onClick={() => setExpanded(expanded === p.proposalId ? null : p.proposalId)} className="w-full p-5 flex items-center gap-4 text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0"><FileText size={18} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[var(--text-primary)]">{p.policyName}</h3>
                        <span className="text-xs text-[var(--text-muted)]">#{p.proposalId}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] truncate">{p.userName} • {p.vehicleModel} • {p.vehicleNumber}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex-shrink-0 ${statusStyles[p.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>{p.status}</span>
                    {expanded === p.proposalId ? <ChevronUp size={18} className="text-[var(--text-muted)]" /> : <ChevronDown size={18} className="text-[var(--text-muted)]" />}
                  </button>

                  {/* Expanded Details */}
                  {expanded === p.proposalId && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-[var(--border-glass)]">
                      <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          {[['Year', p.vehicleYear], ['Category', p.vehicleCategory], ['Submitted', new Date(p.submittedAt).toLocaleDateString()], ['Customer', p.userName]].map(([k, v]) => (
                            <div key={k as string}><p className="text-[var(--text-muted)] text-xs">{k}</p><p className="font-medium text-[var(--text-primary)]">{v}</p></div>
                          ))}
                        </div>

                        {p.selectedAddOns.length > 0 && (
                          <div>
                            <p className="text-xs text-[var(--text-muted)] mb-2">Add-ons</p>
                            <div className="flex flex-wrap gap-1.5">{p.selectedAddOns.map(a => (
                              <span key={a.addOnId} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium">{a.addOnName} (+₹{a.addOnPrice})</span>
                            ))}</div>
                          </div>
                        )}

                        {p.status === 'ProposalSubmitted' && (
                          <div className="pt-3 border-t border-[var(--border-glass)] space-y-3">
                            <textarea rows={2} placeholder="Officer remarks (optional)..." value={remarks[p.proposalId] || ''} onChange={e => setRemarks(prev => ({ ...prev, [p.proposalId]: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                            <div className="flex gap-2">
                              <GradientButton onClick={() => handleGenerateQuote(p.proposalId)} icon={<Zap size={14} />} size="sm">Generate Quote</GradientButton>
                              <GradientButton variant="outline" onClick={() => handleStatusUpdate(p.proposalId, 'Rejected')} icon={<X size={14} />} size="sm" className="!border-red-500/30 !text-red-400 hover:!bg-red-500/10">Reject</GradientButton>
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

export default ManageProposals;