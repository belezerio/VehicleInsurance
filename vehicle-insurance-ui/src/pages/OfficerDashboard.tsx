import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getAllProposals } from '../api/proposals';
import { getAllClaims } from '../api/claims';
import { triggerReminders } from '../api/jobs';
import { motion } from 'framer-motion';
import { FileText, Activity, Users, ArrowRight, Clock, Bell } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import type { Proposal, Claim } from '../types';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const OfficerDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([getAllProposals(), getAllClaims()]);
        const pd = p.data; const cd = c.data;
        setProposals(Array.isArray(pd) ? pd : Array.isArray(pd?.data) ? pd.data : []);
        setClaims(Array.isArray(cd) ? cd : Array.isArray(cd?.data) ? cd.data : []);
      } catch {}
    };
    load();
  }, []);

  const handleTriggerReminders = async () => {
    try {
      await triggerReminders();
      toast.success('Cron job triggered: Premium Reminder emails sent!');
      alert('The simulated email has been saved to the backend container or local directory! Check the VehicleInsurance.API/Emails folder.');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to trigger cron job');
    }
  };

  const pendingP = proposals.filter(p => p.status === 'ProposalSubmitted').length;
  const pendingC = claims.filter(c => c.status === 'Filed').length;

  const chartData = [
    { name: 'Submitted', value: proposals.filter(p => p.status === 'ProposalSubmitted').length },
    { name: 'Quoted', value: proposals.filter(p => p.status === 'QuoteGenerated').length },
    { name: 'Active', value: proposals.filter(p => p.status === 'Active').length },
    { name: 'Rejected', value: proposals.filter(p => p.status === 'Rejected').length },
  ];

  const recent = [
    ...proposals.slice(0, 3).map(p => ({ type: 'Proposal', title: `${p.policyName} — ${p.userName}`, status: p.status, date: p.submittedAt })),
    ...claims.slice(0, 3).map(c => ({ type: 'Claim', title: `Claim #${c.claimId} — ${c.userName}`, status: c.status, date: c.filedAt })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const statCards = [
    { icon: FileText, label: 'Total Proposals', value: proposals.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Clock, label: 'Pending Review', value: pendingP, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Activity, label: 'Total Claims', value: claims.length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Users, label: 'Pending Claims', value: pendingC, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-6">
      <MeshGradientBg variant="subtle" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text">Officer Dashboard</h1>
            <p className="text-[var(--text-secondary)] mt-1">Welcome, {userName}. Manage proposals and claims.</p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.1}>
              <GlassCard className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}><s.icon size={22} /></div>
                  <div>
                    <AnimatedCounter end={s.value} className="text-2xl font-bold text-[var(--text-primary)] block" />
                    <p className="text-xs text-[var(--text-muted)] font-medium">{s.label}</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Actions</h2>
            {[
              { label: 'Manage Proposals', desc: `${pendingP} pending`, icon: FileText, to: '/officer/proposals', color: 'from-blue-500 to-indigo-500' },
              { label: 'Manage Claims', desc: `${pendingC} pending`, icon: Activity, to: '/officer/claims', color: 'from-purple-500 to-pink-500' },
              { label: 'Trigger Reminders', desc: `Send expiration emails`, icon: Bell, action: handleTriggerReminders, color: 'from-amber-500 to-orange-500' },
            ].map((a, i) => (
              <ScrollReveal key={a.label} delay={i * 0.1}>
                <GlassCard className="p-5" glow onClick={a.action ? a.action : () => navigate(a.to!)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-lg`}><a.icon size={24} className="text-white" /></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--text-primary)]">{a.label}</h3>
                      <p className="text-sm text-[var(--text-muted)]">{a.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-[var(--text-muted)]" />
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Proposals by Status</h2>
            <GlassCard className="p-5">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 13 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>
        </div>

        {/* Recent */}
        <ScrollReveal>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Submissions</h2>
          <div className="space-y-2">
            {recent.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-4 flex items-center gap-4" hoverScale={false}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'Proposal' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    {item.type === 'Proposal' ? <FileText size={16} /> : <Activity size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
                    ['Active', 'Approved', 'Completed'].includes(item.status) ? 'bg-emerald-500/10 text-emerald-400' :
                    item.status === 'Rejected' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>{item.status}</span>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default OfficerDashboard;