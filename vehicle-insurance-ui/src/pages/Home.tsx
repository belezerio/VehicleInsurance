import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPolicies } from '../api/policies';
import { getStats } from '../api/stats';
import type { Policy, Stats } from '../types';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Car, Bike, Truck, Caravan,
  FileCheck, BarChart3, Zap, Lock, Bell, Upload, Download,
  Star, ChevronDown, ShieldCheck, Users, CheckCircle, Clock,
  Sparkles
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import ScrollReveal from '../components/ui/ScrollReveal';
import MeshGradientBg from '../components/ui/MeshGradientBg';
import GradientButton from '../components/ui/GradientButton';
import ShimmerLoader from '../components/ui/ShimmerLoader';
import Footer from '../components/Footer';

/* ============ DATA ============ */
const CATEGORIES = [
  { icon: Car, label: 'Car Insurance', desc: 'Comprehensive coverage for sedans, SUVs, and hatchbacks', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  { icon: Bike, label: 'Bike Insurance', desc: 'Two-wheeler protection with roadside assistance', color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/20' },
  { icon: Caravan, label: 'CamperVan Insurance', desc: 'Travel worry-free with full campervan coverage', color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
  { icon: Truck, label: 'Truck Insurance', desc: 'Commercial vehicle coverage for fleets and individuals', color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
];

const FEATURES = [
  { icon: FileCheck, label: 'Claim Management', desc: 'File and track claims with real-time status updates', span: 'md:col-span-2' },
  { icon: BarChart3, label: 'Policy Tracking', desc: 'Monitor all your policies in one dashboard', span: '' },
  { icon: Zap, label: 'Instant Quotes', desc: 'Get premium estimates in seconds', span: '' },
  { icon: Lock, label: 'Secure Authentication', desc: 'Enterprise-grade JWT security for your data', span: '' },
  { icon: Bell, label: 'Premium Reminders', desc: 'Never miss a payment with smart notifications', span: '' },
  { icon: Upload, label: 'Document Upload', desc: 'Upload and manage documents seamlessly', span: '' },
  { icon: Download, label: 'Policy Downloads', desc: 'Download policy documents anytime, anywhere', span: 'md:col-span-2' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar', role: 'Business Owner', text: 'SecureDrive made insuring my entire fleet incredibly simple. The dashboard is intuitive and claims are processed lightning fast.', rating: 5 },
  { name: 'Priya Sharma', role: 'Software Engineer', text: 'The best insurance platform I\'ve used. Got my quote in seconds and the whole process was digital. No paperwork at all!', rating: 5 },
  { name: 'Amit Patel', role: 'Freelancer', text: 'Filed a claim after a minor accident — got approved within 48 hours. The transparency and speed are unmatched.', rating: 5 },
  { name: 'Sneha Reddy', role: 'Doctor', text: 'Love the policy tracking dashboard. I can see all my vehicles\' coverage status at a glance. Premium reminders are super helpful.', rating: 4 },
];

const FAQS = [
  { q: 'How do I get an instant quote?', a: 'Simply register on our platform, select your vehicle type, and submit a proposal. Our system generates a personalized premium quote within seconds based on your vehicle details and coverage needs.' },
  { q: 'What types of vehicles do you cover?', a: 'We provide comprehensive coverage for Cars, Motorcycles/Bikes, Trucks, and CamperVans. Each category has tailored plans with relevant add-ons for maximum protection.' },
  { q: 'How fast is the claims process?', a: 'Most claims are reviewed within 24–48 hours. Our dedicated officers review each claim promptly, and you can track the status in real-time through your dashboard.' },
  { q: 'Can I add extra coverage to my policy?', a: 'Yes! We offer various add-ons like roadside assistance, zero depreciation, engine protection, and more. You can select add-ons during the proposal submission process.' },
  { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade JWT authentication, encrypted data transmission, and follow industry best practices to ensure your personal and financial information stays protected.' },
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  Car: [
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
  ],
  Motorcycle: [
    'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800',
  ],
  Truck: [
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1586191552066-f52af82f05fa?auto=format&fit=crop&q=80&w=800',
  ],
  CamperVan: [
    'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513311067232-2374e2aee29e?auto=format&fit=crop&q=80&w=800',
  ]
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1502877338535-775e0508dca0?auto=format&fit=crop&q=80&w=800';

/* ============ COMPONENT ============ */
const Home = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [policiesRes, statsRes] = await Promise.all([
          getAllPolicies(),
          getStats()
        ]);
        setPolicies(policiesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <MeshGradientBg variant="hero" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-20">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">Premium Auto Coverage</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)] mb-6">
              Protect Your Drive,{' '}
              <span className="gradient-text">Secure Your Future.</span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed">
              Experience next-generation vehicle insurance. Fast claims, comprehensive
              coverage, and 24/7 premium support tailored for modern drivers.
            </p>

            <div className="flex flex-wrap gap-4">
              <GradientButton
                size="lg"
                iconRight={<ArrowRight size={18} />}
                onClick={() => navigate(token ? '/dashboard' : '/register')}
              >
                {token ? 'Go to Dashboard' : 'Get a Quote Now'}
              </GradientButton>
              <GradientButton
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Plans
              </GradientButton>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[var(--border-glass)]">
              {[
                { icon: ShieldCheck, label: '256-bit SSL' },
                { icon: Clock, label: '24/7 Support' },
                { icon: Zap, label: 'Instant Claims' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                  <badge.icon size={16} className="text-indigo-400" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Floating cards */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Hero image */}
              <div className="absolute inset-4 rounded-3xl overflow-hidden border border-[var(--border-glass)] shadow-glass-lg">
                <img
                  src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"
                  alt="Premium Car"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
              </div>

              {/* Floating stat card */}
              <motion.div
                className="absolute -bottom-4 -left-4 glass rounded-2xl p-4 min-w-[180px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">Active Policies</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats ? stats.activePolicies.toLocaleString() : '—'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400">Live</span>
                </div>
              </motion.div>

              {/* Floating satisfaction card */}
              <motion.div
                className="absolute -top-4 -right-4 glass rounded-2xl p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <p className="text-xs text-[var(--text-muted)] mb-1">Satisfaction</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">98%</p>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="text-[var(--text-muted)]" size={24} />
        </motion.div>
      </section>

      {/* ========== STATS ========== */}
      {stats && (
        <section className="relative py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Active Policies', value: stats.activePolicies },
                { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Claims Served', value: stats.claimsServed },
                { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Happy Customers', value: stats.totalCustomers },
              ].map((stat, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <GlassCard className="p-6" glow>
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>
                        <stat.icon size={28} />
                      </div>
                      <div>
                        <AnimatedCounter
                          end={stat.value}
                          className="text-3xl font-extrabold text-[var(--text-primary)] block"
                        />
                        <p className="text-sm text-[var(--text-muted)] font-medium uppercase tracking-wider">{stat.label}</p>
                      </div>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CATEGORIES ========== */}
      <section id="categories" className="relative py-24 px-6">
        <MeshGradientBg variant="subtle" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                Insurance for <span className="gradient-text">Every Vehicle</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Choose from our comprehensive range of coverage options designed for every type of vehicle on the road.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <ScrollReveal key={cat.label} delay={idx * 0.1}>
                <GlassCard className="p-6 h-full group" tilt glow>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 shadow-lg ${cat.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon size={26} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{cat.label}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{cat.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-indigo-400 text-sm font-medium group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <ArrowRight size={14} />
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES BENTO ========== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                Everything You Need, <span className="gradient-text">Built In</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                A complete insurance management platform with powerful features designed for both customers and administrators.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, idx) => (
              <ScrollReveal key={f.label} delay={idx * 0.08} className={f.span}>
                <GlassCard className="p-6 h-full group" hoverScale={false}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                      <f.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">{f.label}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== POLICIES ========== */}
      <section className="relative py-24 px-6">
        <MeshGradientBg variant="subtle" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                Curated <span className="gradient-text">Insurance Plans</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Choose from our premium selection of coverage options designed to provide maximum protection and peace of mind on the road.
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <ShimmerLoader variant="card" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((policy, idx) => {
                const catImages = CATEGORY_IMAGES[policy.vehicleCategory] || [DEFAULT_IMAGE];
                const image = catImages[idx % catImages.length];
                return (
                  <ScrollReveal key={policy.policyId} delay={idx * 0.1}>
                    <GlassCard className="h-full overflow-hidden group" glow>
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={image}
                          alt={policy.policyName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
                        <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900">
                          {policy.vehicleCategory}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{policy.policyName}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed line-clamp-2">{policy.description}</p>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-4 p-3 rounded-xl bg-[var(--bg-glass)] border border-[var(--border-glass)]">
                          <span className="text-3xl font-extrabold gradient-text">₹{policy.basePrice.toLocaleString()}</span>
                          <span className="text-sm text-[var(--text-muted)] font-medium">/year</span>
                        </div>

                        {/* Add-ons */}
                        {policy.addOns.length > 0 && (
                          <div className="mb-5">
                            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Popular Add-ons</p>
                            <div className="space-y-1.5">
                              {policy.addOns.map(addon => (
                                <div key={addon.addOnId} className="flex items-center gap-2 text-sm">
                                  <Check size={14} className="text-emerald-400 flex-shrink-0" />
                                  <span className="text-[var(--text-secondary)] flex-1">{addon.addOnName}</span>
                                  <span className="font-semibold text-[var(--text-primary)]">+₹{addon.addOnPrice}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <GradientButton
                          fullWidth
                          iconRight={<ArrowRight size={16} />}
                          onClick={() => navigate(token ? '/submit-proposal' : '/register')}
                        >
                          Apply for Coverage
                        </GradientButton>
                      </div>
                    </GlassCard>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                Trusted by <span className="gradient-text">Thousands</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                See what our customers have to say about their experience with SecureDrive.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.1}>
                <GlassCard className="p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-muted)]'} />
                    ))}
                  </div>
                  <p className="text-[var(--text-secondary)] leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{t.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="relative py-24 px-6">
        <MeshGradientBg variant="subtle" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-primary)] mb-4">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.08}>
                <div className="glass rounded-2xl overflow-hidden glass-hover transition-all duration-300">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-semibold text-[var(--text-primary)] pr-4">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown size={20} className="text-[var(--text-muted)]" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === idx ? 'auto' : 0,
                      opacity: openFaq === idx ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 text-center" glow>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4">
                Ready to <span className="gradient-text">Get Started?</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
                Join thousands of satisfied customers who trust SecureDrive for their vehicle insurance needs.
              </p>
              <GradientButton
                size="lg"
                iconRight={<ArrowRight size={18} />}
                onClick={() => navigate(token ? '/dashboard' : '/register')}
              >
                {token ? 'Go to Dashboard' : 'Create Free Account'}
              </GradientButton>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <Footer />
    </div>
  );
};

export default Home;