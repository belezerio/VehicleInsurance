import { useEffect, useState } from 'react';
import { getAllProposals, updateProposalStatus } from '../api/proposals';
import { generateQuote } from '../api/quotes';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Proposal } from '../types';

const ManageProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await getAllProposals();
      setProposals(res.data);
    } catch {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId: number, status: string) => {
    try {
      await updateProposalStatus(proposalId, {
        status,
        officerRemarks: remarks[proposalId] || ''
      });
      toast.success(`Proposal ${status} successfully!`);
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleGenerateQuote = async (proposalId: number) => {
    try {
      const res = await generateQuote(proposalId);
      toast.success(`Quote generated! Premium: ₹${res.data.premiumAmount}`);
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate quote');
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Manage Proposals</h1>

      {proposals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No proposals yet.</div>
      ) : (
        <div className="space-y-4">
          {proposals.map(proposal => (
            <div key={proposal.proposalId} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {proposal.policyName}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      #{proposal.proposalId}
                    </span>
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Customer: {proposal.userName} • {proposal.vehicleModel} • {proposal.vehicleNumber}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Year: {proposal.vehicleYear} • Category: {proposal.vehicleCategory}
                  </p>
                </div>
                <StatusBadge status={proposal.status} />
              </div>

              {proposal.selectedAddOns.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Selected Add-ons:</p>
                  <div className="flex gap-2 flex-wrap">
                    {proposal.selectedAddOns.map(addon => (
                      <span key={addon.addOnId} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {addon.addOnName} (+₹{addon.addOnPrice})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {proposal.status === 'ProposalSubmitted' && (
                <div className="mt-4 space-y-3">
                  <textarea
                    placeholder="Add remarks (optional)"
                    value={remarks[proposal.proposalId] || ''}
                    onChange={e => setRemarks(prev => ({
                      ...prev,
                      [proposal.proposalId]: e.target.value
                    }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGenerateQuote(proposal.proposalId)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Generate Quote
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(proposal.proposalId, 'Rejected')}
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

export default ManageProposals;