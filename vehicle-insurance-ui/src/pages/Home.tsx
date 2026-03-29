import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllPolicies } from '../api/policies';
import { getStats } from '../api/stats';
import type { Policy, Stats } from '../types';

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
    <div className="flex justify-center items-center h-64">
      <div className="text-blue-600 text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-blue-800 text-white rounded-2xl p-10 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Vehicle Insurance System</h1>
        <p className="text-blue-200 text-lg mb-6">
          Protect your vehicle with our comprehensive insurance plans
        </p>
        <button
            onClick={() => navigate(token ? '/dashboard' : '/register')}
            className="bg-white text-blue-800 px-8 py-3 rounded-full font-semibold hover:bg-blue-100"
        >
            Get Started
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-blue-800">{stats.activePolicies}</div>
            <div className="text-gray-500 mt-1">Active Policies</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-green-600">{stats.claimsServed}</div>
            <div className="text-gray-500 mt-1">Claims Served</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</div>
            <div className="text-gray-500 mt-1">Happy Customers</div>
          </div>
        </div>
      )}

      {/* Policies */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Insurance Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map(policy => (
          <div key={policy.policyId} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{policy.policyName}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {policy.vehicleCategory}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-4">{policy.description}</p>
            <div className="text-2xl font-bold text-blue-800 mb-3">
              ₹{policy.basePrice.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">/year</span>
            </div>
            {policy.addOns.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Available Add-ons:</p>
                {policy.addOns.map(addon => (
                  <div key={addon.addOnId} className="flex justify-between text-sm">
                    <span className="text-gray-600">{addon.addOnName}</span>
                    <span className="text-blue-600">+₹{addon.addOnPrice}</span>
                  </div>
                ))}
              </div>
            )}
            <button
                onClick={() => navigate(token ? '/submit-proposal' : '/register')}
                className="mt-4 w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;