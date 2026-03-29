import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-2">Welcome, {userName}!</h1>
      <p className="text-gray-500 mb-8">Manage your insurance policies and claims</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/submit-proposal')}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-blue-800"
        >
          <div className="text-3xl mb-3">📋</div>
          <h3 className="text-lg font-semibold text-gray-800">New Proposal</h3>
          <p className="text-gray-500 text-sm mt-1">Apply for a new vehicle insurance policy</p>
        </div>

        <div
          onClick={() => navigate('/my-proposals')}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-green-500"
        >
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="text-lg font-semibold text-gray-800">My Policies</h3>
          <p className="text-gray-500 text-sm mt-1">Track your policy proposals and status</p>
        </div>

        <div
          onClick={() => navigate('/my-claims')}
          className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition border-l-4 border-purple-500"
        >
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-semibold text-gray-800">My Claims</h3>
          <p className="text-gray-500 text-sm mt-1">View and track your insurance claims</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;