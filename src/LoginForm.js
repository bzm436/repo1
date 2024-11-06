// src/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from './firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import './App.css';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setError(location.state.message); // Display logout message
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const q = query(collection(db, 'users'), where('userid', '==', username));
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map(doc => doc.data()).find(user => user.password === password);

      if (user) {
        setError('');
        onLogin(user);
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
      setError('Error logging in. Please try again.');
    }
  };

  return (
    <header className="App-header">
      <h1>Login</h1>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>} {/* Display the error or logout message */}
      </form>
    </header>
  );
}

export default LoginForm;
