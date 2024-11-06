import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './WelcomeScreen.css'; // Import a CSS file for styling

function WelcomeScreen({ userid, username, usertype, isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate(); 
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'You have not logged in.' } }); // Navigate to login with a message
    }
  }, [username, userid, usertype, isAuthenticated, navigate]); // Dependencies array


  const handleLogout = () => {
    setIsAuthenticated(false); // Clear the isAuthenticated flag
    navigate('/login', { state: { message: 'You have been logged out.' } }); 
  };

  return (
    <div>
      <h1>Welcome {username}!</h1>
      <h2>Your are a {usertype}.</h2>
      <h3>What would you like to do next?</h3>
     
      <div className="tile-container">
        {usertype === 'Tenant' && (
          <>
            <Link to="/submit-maintenance" className="tile">Submit a Maintenance Request</Link>
            <Link to="/view-maintenance-history" className="tile">View Maintenance Request History</Link>
          </>
        )}
        {usertype === 'Manager' && (
          <>
            <Link to="/add-tenant" state={{ username }} className="tile">Add Tenant</Link>
            <Link to="/browse-tenants" className="tile">Browse Tenants</Link>
          </>
        )}
        {usertype === 'Maintenance Staff' && (
          <Link to="/browse-maintenance-requests" className="tile">Browse Maintenance Requests</Link>
        )}
      </div>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Logout
      </button> 
    </div>
  );
}

export default WelcomeScreen;
