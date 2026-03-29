import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OfficerDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Officer Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {userName}. Manage proposals and claims.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/officer/proposals')}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-blue-800"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Proposals</h3>
          <p className="text-gray-500 text-sm mt-1">Review, approve or reject policy proposals</p>
        </div>

        <div
          onClick={() => navigate('/officer/claims')}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-purple-500"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-gray-800">Manage Claims</h3>
          <p className="text-gray-500 text-sm mt-1">Review and process insurance claims</p>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;