import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProposals } from '../api/proposals';
import { getQuoteByProposalId } from '../api/quotes';
import { processPayment } from '../api/payments';
import { toast } from 'react-toastify';
import StatusBadge from '../components/StatusBadge';
import type { Proposal, Quote } from '../types';

const MyProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [quotes, setQuotes] = useState<Record<number, Quote>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await getMyProposals();
      setProposals(res.data);
      // Fetch quotes for proposals with QuoteGenerated status
      for (const proposal of res.data) {
        if (proposal.status === 'QuoteGenerated') {
          try {
            const quoteRes = await getQuoteByProposalId(proposal.proposalId);
            setQuotes(prev => ({ ...prev, [proposal.proposalId]: quoteRes.data }));
          } catch {}
        }
      }
    } catch (error) {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (proposalId: number, amount: number) => {
    try {
      await processPayment({ proposalId, amount });
      toast.success('Payment successful! Policy is now active.');
      fetchProposals();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-blue-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">My Policies</h1>
        <button
          onClick={() => navigate('/submit-proposal')}
          className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Proposal
        </button>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">📋</div>
          <p>No proposals yet. Submit your first proposal!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map(proposal => (
            <div key={proposal.proposalId} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{proposal.policyName}</h3>
                  <p className="text-gray-500 text-sm">{proposal.vehicleModel} • {proposal.vehicleNumber}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Submitted: {new Date(proposal.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={proposal.status} />
              </div>

              {proposal.officerRemarks && (
                <div className="mt-3 bg-yellow-50 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Officer Remarks:</span> {proposal.officerRemarks}
                  </p>
                </div>
              )}

              {proposal.status === 'QuoteGenerated' && quotes[proposal.proposalId] && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Premium Amount</p>
                    <p className="text-2xl font-bold text-blue-800">
                      ₹{quotes[proposal.proposalId].premiumAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Valid until: {new Date(quotes[proposal.proposalId].validUntil).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePayment(
                      proposal.proposalId,
                      quotes[proposal.proposalId].premiumAmount
                    )}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProposals;