import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import MyProposals from './pages/MyProposals';
import SubmitProposal from './pages/SubmitProposals';
import MyClaims from './pages/MyClaims';
import OfficerDashboard from './pages/OfficerDashboard';
import ManageProposals from './pages/ManageProposals';
import ManageClaims from './pages/ManageClaims';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User only routes */}
        <Route element={<ProtectedRoute allowedRoles={['User']} />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/my-proposals" element={<MyProposals />} />
          <Route path="/submit-proposal" element={<SubmitProposal />} />
          <Route path="/my-claims" element={<MyClaims />} />
        </Route>

        {/* Officer only routes */}
        <Route element={<ProtectedRoute allowedRoles={['Officer']} />}>
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/proposals" element={<ManageProposals />} />
          <Route path="/officer/claims" element={<ManageClaims />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;