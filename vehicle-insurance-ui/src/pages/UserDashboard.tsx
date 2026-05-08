import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getMyProposals } from '../api/proposals';
import { getMyClaims } from '../api/claims';
import { motion } from 'framer-motion';
import { FileText, Activity, Plus, Shield, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import type { Proposal, Claim } from '../types';

const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const UserDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([getMyProposals(), getMyClaims()]);
        setProposals(Array.isArray(p.data) ? p.data : []);
        setClaims(Array.isArray(c.data) ? c.data : []);
      } catch {}
    };
    load();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const active = proposals.filter(p => p.status === 'Active').length;
  const pending = proposals.filter(p => ['ProposalSubmitted', 'QuoteGenerated'].includes(p.status)).length;

  const statusData = [
    { name: 'Active', value: active },
    { name: 'Pending', value: pending },
    { name: 'Claims', value: claims.length },
  ].filter(d => d.value > 0);

  const quickActions = [
    { icon: Plus, label: 'New Proposal', desc: 'Apply for a new vehicle insurance policy', color: 'from-indigo-500 to-purple-500', to: '/submit-proposal' },
    { icon: Shield, label: 'My Policies', desc: 'Track proposals, active plans, and quotes', color: 'from-emerald-500 to-teal-500', to: '/my-proposals' },
    { icon: Activity, label: 'My Claims', desc: 'File new claims and track existing ones', color: 'from-pink-500 to-rose-500', to: '/my-claims' },
  ];

  const recentItems = [
    ...proposals.slice(0, 3).map(p => ({ type: 'Proposal' as const, title: p.policyName, sub: `${p.vehicleModel} • ${p.vehicleNumber}`, status: p.status, date: p.submittedAt })),
    ...claims.slice(0, 2).map(c => ({ type: 'Claim' as const, title: `Claim #${c.claimId}`, sub: c.claimDescription.slice(0, 60), status: c.status, date: c.filedAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <p className="text-[var(--text-muted)] text-sm mb-1">{greeting},</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text">{userName}</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage your insurance policies and claims</p>
          </div>
        </ScrollReveal>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, label: 'Active Policies', value: active, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Clock, label: 'Pending', value: pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: TrendingUp, label: 'Total Claims', value: claims.length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          ].map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.1}>
              <GlassCard className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                    <s.icon size={22} />
                  </div>
                  <div>
                    <AnimatedCounter end={s.value} className="text-2xl font-bold text-[var(--text-primary)] block" />
                    <p className="text-xs text-[var(--text-muted)] font-medium">{s.label}</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((a, i) => (
                <ScrollReveal key={a.label} delay={i * 0.1}>
                  <GlassCard className="p-5 h-full" glow onClick={() => navigate(a.to)}>
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <a.icon size={22} className="text-white" />
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-1">{a.label}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-indigo-400 text-sm font-medium">
                      <span>Go</span><ArrowRight size={14} />
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Overview</h2>
            <GlassCard className="p-5">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-[var(--text-muted)] text-sm">No data yet</div>
              )}
              <div className="flex flex-wrap gap-3 mt-2">
                {statusData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Recent Activity */}
        <ScrollReveal>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h2>
          {recentItems.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-[var(--text-secondary)]">No activity yet. Start by submitting a proposal!</p>
              <GradientButton className="mt-4" onClick={() => navigate('/submit-proposal')} icon={<Plus size={16} />}>New Proposal</GradientButton>
            </GlassCard>
          ) : (
            <div className="space-y-2">
              {recentItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <GlassCard className="p-4 flex items-center gap-4" hoverScale={false}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'Proposal' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-pink-500/10 text-pink-400'}`}>
                      {item.type === 'Proposal' ? <FileText size={16} /> : <Activity size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{item.sub}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
                      item.status === 'Active' || item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>{item.status}</span>
                    <span className="text-xs text-[var(--text-muted)] flex-shrink-0 hidden sm:block">{new Date(item.date).toLocaleDateString()}</span>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  );
};

export default UserDashboard;