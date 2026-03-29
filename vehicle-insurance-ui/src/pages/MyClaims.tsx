import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getMyClaims, fileClaim } from '../api/claims';
import { getMyProposals } from '../api/proposals';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Claim, Proposal } from '../types';

const MyClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [claimsRes, proposalsRes] = await Promise.all([
        getMyClaims(),
        getMyProposals()
      ]);
      setClaims(claimsRes.data);
      setActiveProposals(proposalsRes.data.filter((p: Proposal) => p.status === 'Active'));
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      await fileClaim({
        ...data,
        proposalId: parseInt(data.proposalId),
        claimAmount: parseFloat(data.claimAmount)
      });
      toast.success('Claim filed successfully!');
      setShowForm(false);
      reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to file claim');
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">My Claims</h1>
        {activeProposals.length > 0 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : '+ File Claim'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">File a New Claim</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Policy</label>
              <select {...register('proposalId', { required: true })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select active policy --</option>
                {activeProposals.map(p => (
                  <option key={p.proposalId} value={p.proposalId}>
                    {p.policyName} - {p.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Claim Description</label>
              <textarea {...register('claimDescription', { required: true })}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3} placeholder="Describe the incident..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Claim Amount (₹)</label>
              <input {...register('claimAmount', { required: true })}
                type="number" min="0"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15000" />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Filing...' : 'Submit Claim'}
            </button>
          </form>
        </div>
      )}

      {claims.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📝</div>
          <p>No claims filed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.claimId} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">Claim #{claim.claimId}</p>
                  <p className="text-gray-500 text-sm mt-1">{claim.claimDescription}</p>
                  <p className="text-blue-800 font-bold mt-2">₹{claim.claimAmount.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Filed: {new Date(claim.filedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={claim.status} />
              </div>
              {claim.officerRemarks && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Remarks:</span> {claim.officerRemarks}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaims;