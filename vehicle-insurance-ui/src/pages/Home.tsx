import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPolicies } from '../api/policies';
import { getStats } from '../api/stats';
import type { Policy, Stats } from '../types';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, CheckCircle, ArrowRight, Check } from 'lucide-react';
import { soundManager } from '../utils/sound';

const CAR_IMAGES = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1503376760367-1ac0b1cbae15?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502877338535-775e0508dca0?auto=format&fit=crop&q=80&w=800'
];

const Home = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Car Background" 
            className="w-full h-full object-cover zoom-animation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 backdrop-blur-sm font-medium tracking-wider text-sm mb-6 uppercase border border-blue-500/30 shadow-sm">
              Premium Auto Coverage
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Protect Your Drive,<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Secure Your Future.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-light">
              Experience the next generation of vehicle insurance. Fast claims, comprehensive coverage, and 24/7 premium support tailored for modern drivers.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                  onClick={() => {
                    soundManager.playClick();
                    navigate(token ? '/dashboard' : '/register');
                  }}
                  onMouseEnter={() => soundManager.playHover()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/40 transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                  {token ? 'Go to Dashboard' : 'Get a Quote Now'} <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-100/50", border: "border-blue-100", label: "Active Policies", value: stats.activePolicies },
              { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-100/50", border: "border-emerald-100", label: "Claims Served", value: stats.claimsServed },
              { icon: Users, color: "text-purple-500", bg: "bg-purple-100/50", border: "border-purple-100", label: "Happy Customers", value: stats.totalCustomers }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`bg-white/80 backdrop-blur-xl border ${stat.border} rounded-2xl p-8 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}
              >
                <div className={`w-16 h-16 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon size={32} />
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-slate-800">{stat.value.toLocaleString()}</div>
                  <div className="text-slate-500 font-medium mt-1 uppercase tracking-wide text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Policies Section */}
      <div className="max-w-7xl mx-auto px-6 mt-32">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Curated Insurance Plans
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Choose from our premium selection of coverage options designed to provide maximum protection and peace of mind on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy, idx) => {
            const image = CAR_IMAGES[idx % CAR_IMAGES.length];
            return (
              <motion.div 
                key={policy.policyId} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col group cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                  <img 
                    src={image} 
                    alt={policy.policyName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 uppercase tracking-wider shadow-sm">
                    {policy.vehicleCategory}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {policy.policyName}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed flex-1">
                    {policy.description}
                  </p>
                  
                  <div className="flex items-end gap-2 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-4xl font-extrabold text-blue-600">₹{policy.basePrice.toLocaleString()}</span>
                    <span className="text-slate-500 font-medium pb-1">/year</span>
                  </div>

                  {policy.addOns.length > 0 && (
                    <div className="mb-8">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular Add-ons</p>
                      <ul className="space-y-2">
                        {policy.addOns.map(addon => (
                          <li key={addon.addOnId} className="flex items-start gap-2 text-sm">
                            <Check className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                            <span className="text-slate-600 flex-1">{addon.addOnName}</span>
                            <span className="font-semibold text-slate-800">+₹{addon.addOnPrice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                      onClick={() => {
                        soundManager.playClick();
                        navigate(token ? '/submit-proposal' : '/register');
                      }}
                      onMouseEnter={() => soundManager.playHover()}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors mt-auto flex items-center justify-center gap-2 group/btn"
                  >
                      Apply for Coverage <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;