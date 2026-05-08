import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProposals } from '../api/proposals';
import { getQuoteByProposalId } from '../api/quotes';
import { processPayment } from '../api/payments';
import { toast } from 'react-toastify';
import type { Proposal, Quote } from '../types';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, CreditCard } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';

const statusStyles: Record<string, string> = {
  ProposalSubmitted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  QuoteGenerated: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  Expired: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const MyProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [quotes, setQuotes] = useState<Record<number, Quote>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    try {
      const res = await getMyProposals();
      const data = Array.isArray(res.data) ? res.data : [];
      setProposals(data);
      for (const p of data) {
        if (p.status === 'QuoteGenerated') {
          try { const q = await getQuoteByProposalId(p.proposalId); setQuotes(prev => ({ ...prev, [p.proposalId]: q.data })); } catch {}
        }
      }
    } catch { toast.error('Failed to load proposals'); }
    finally { setLoading(false); }
  };

  const handlePayment = async (proposalId: number, amount: number) => {
    try {
      await processPayment({ proposalId, amount });
      toast.success('Payment successful! Policy is now active.');
      fetchProposals();
    } catch (error: any) { toast.error(error.response?.data?.message || 'Payment failed'); }
  };

  const statuses = ['All', ...new Set(proposals.map(p => p.status))];
  const filtered = proposals.filter(p =>
    (filter === 'All' || p.status === filter) &&
    (search === '' || p.policyName.toLowerCase().includes(search.toLowerCase()) || p.vehicleNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold gradient-text">My Policies</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">{proposals.length} total proposals</p>
            </div>
            <GradientButton icon={<Plus size={16} />} onClick={() => navigate('/submit-proposal')}>New Proposal</GradientButton>
          </div>
        </ScrollReveal>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policies..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === s ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-[var(--bg-glass)] text-[var(--text-muted)] border border-[var(--border-glass)] hover:text-[var(--text-secondary)]'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ShimmerLoader variant="card" count={3} />
        ) : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-2">No proposals found</p>
            <p className="text-[var(--text-secondary)] mb-6">Submit your first proposal to get started!</p>
            <GradientButton onClick={() => navigate('/submit-proposal')} icon={<Plus size={16} />}>Submit Proposal</GradientButton>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {filtered.map((proposal, idx) => (
              <motion.div key={proposal.proposalId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <GlassCard className="p-5" hoverScale={false}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{proposal.policyName}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{proposal.vehicleModel} • {proposal.vehicleNumber}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Submitted {new Date(proposal.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${statusStyles[proposal.status] || statusStyles.Expired}`}>
                      {proposal.status}
                    </span>
                  </div>

                  {proposal.officerRemarks && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-3">
                      <p className="text-sm text-amber-300"><span className="font-semibold">Officer:</span> {proposal.officerRemarks}</p>
                    </div>
                  )}

                  {proposal.status === 'QuoteGenerated' && quotes[proposal.proposalId] && (
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Premium Amount</p>
                        <p className="text-2xl font-extrabold gradient-text">₹{quotes[proposal.proposalId].premiumAmount.toLocaleString()}</p>
                        <p className="text-xs text-[var(--text-muted)]">Valid until {new Date(quotes[proposal.proposalId].validUntil).toLocaleDateString()}</p>
                      </div>
                      <GradientButton variant="secondary" icon={<CreditCard size={16} />} onClick={() => handlePayment(proposal.proposalId, quotes[proposal.proposalId].premiumAmount)}>
                        Pay Now
                      </GradientButton>
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

export default MyProposals;