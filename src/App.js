import React, { useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import './App.css';
import WelcomeScreen from './WelcomeScreen';
import LoginForm from './LoginForm';
import SubmitMaintenanceRequest from './SubmitMaintenanceRequest';
import ViewMaintenanceHistory from './ViewMaintenanceHistory';
import AddTenant from './AddTenant';
import BrowseTenants from './BrowseTenants';
import BrowseMaintenanceRequests from './BrowseMaintenanceRequests';

function App() {
  const [username, setUsername] = useState('');
  const [userid, setUserid] = useState('');
  const [usertype, setUsertype] = useState('');
  const [apt, setApt] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setUserid(user.userid);
    setUsername(user.username);
    setUsertype(user.userType);
    setApt(user.apt_no);
    setIsAuthenticated(true);
    navigate('/welcome',);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/welcome" element={<WelcomeScreen userid={userid} username={username} usertype={usertype} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/submit-maintenance" element={<SubmitMaintenanceRequest userid={userid} apt={apt} />} />
        <Route path="/view-maintenance-history" element={<ViewMaintenanceHistory userid={userid} username={username}/>} />
        <Route path="/add-tenant" element={<AddTenant />} />
        <Route path="/browse-tenants" element={<BrowseTenants />} />
        <Route path="/browse-maintenance-requests" element={<BrowseMaintenanceRequests />} />
      </Routes>
    </div>
  );
}

export default App;
