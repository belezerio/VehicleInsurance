import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getAllPolicies } from '../api/policies';
import { submitProposal } from '../api/proposals';
import { toast } from 'react-toastify';
import type { Policy } from '../types';

const SubmitProposal = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<number[]>([]);
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm();
  const watchedPolicyId = watch('policyId');

  useEffect(() => {
    getAllPolicies().then(res => setPolicies(res.data));
  }, []);

  useEffect(() => {
    if (watchedPolicyId) {
      const policy = policies.find(p => p.policyId === parseInt(watchedPolicyId));
      setSelectedPolicy(policy || null);
      setSelectedAddOns([]);
    }
  }, [watchedPolicyId, policies]);

  const toggleAddOn = (addOnId: number) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const onSubmit = async (data: any) => {
    try {
      await submitProposal({
        ...data,
        policyId: parseInt(data.policyId),
        vehicleYear: parseInt(data.vehicleYear),
        selectedAddOnIds: selectedAddOns
      });
      toast.success('Proposal submitted successfully!');
      navigate('/my-proposals');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit proposal');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">Submit Insurance Proposal</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Policy</label>
          <select {...register('policyId', { required: true })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select a policy --</option>
            {policies.map(p => (
              <option key={p.policyId} value={p.policyId}>
                {p.policyName} - {p.vehicleCategory} (₹{p.basePrice})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Category</label>
          <select {...register('vehicleCategory', { required: true })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Select category --</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Truck">Truck</option>
            <option value="CamperVan">CamperVan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
          <input {...register('vehicleNumber', { required: true })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="GJ01AB1234" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
          <input {...register('vehicleModel', { required: true })}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Honda City 2021" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Year</label>
          <input {...register('vehicleYear', { required: true })}
            type="number" min="2000" max={new Date().getFullYear()}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2021" />
        </div>

        {selectedPolicy && selectedPolicy.addOns.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Add-ons</label>
            <div className="space-y-2">
              {selectedPolicy.addOns.map(addon => (
                <label key={addon.addOnId} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(addon.addOnId)}
                    onChange={() => toggleAddOn(addon.addOnId)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{addon.addOnName}</span>
                  <span className="text-blue-600 ml-auto">+₹{addon.addOnPrice}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Proposal'}
        </button>
      </form>
    </div>
  );
};

export default SubmitProposal;