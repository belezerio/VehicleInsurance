import { useEffect, useState } from 'react';
import { getAllClaims, updateClaimStatus } from '../api/claims';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Claim } from '../types';

const ManageClaims = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await getAllClaims();
      setClaims(res.data);
    } catch {
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (claimId: number, status: string) => {
    try {
      await updateClaimStatus(claimId, {
        status,
        officerRemarks: remarks[claimId] || ''
      });
      toast.success(`Claim ${status} successfully!`);
      fetchClaims();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update claim');
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Manage Claims</h1>

      {claims.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No claims yet.</div>
      ) : (
        <div className="space-y-4">
          {claims.map(claim => (
            <div key={claim.claimId} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Claim #{claim.claimId}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      Policy #{claim.proposalId}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm">Customer: {claim.userName}</p>
                  <p className="text-gray-600 text-sm mt-1">{claim.claimDescription}</p>
                  <p className="text-blue-800 font-bold mt-1">
                    ₹{claim.claimAmount.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Filed: {new Date(claim.filedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={claim.status} />
              </div>

              {claim.status === 'Filed' && (
                <div className="mt-4 space-y-3">
                  <textarea
                    placeholder="Add remarks"
                    value={remarks[claim.claimId] || ''}
                    onChange={e => setRemarks(prev => ({
                      ...prev,
                      [claim.claimId]: e.target.value
                    }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate(claim.claimId, 'Approved')}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(claim.claimId, 'Rejected')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageClaims;