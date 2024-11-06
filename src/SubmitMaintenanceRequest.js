import React, { useState } from 'react';
import { db } from './firebaseConfig'; 
import { collection, addDoc } from 'firebase/firestore'; 
import './Form.css';
import { useNavigate } from 'react-router-dom'; 

function SubmitMaintenanceRequest({ userid, apt }) {
  const [apt_no, setAptNo] = useState(apt);
  const [areaOfProblem, setAreaOfProblem] = useState('');
  const [description, setDescription] = useState('');
  const [requestId] = useState(`REQ-${Date.now()}`); 
  const [submitted] = useState(new Date()); 
  const [photo, setPhoto] = useState(null);
  const [status] = useState('pending'); 
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!apt || !areaOfProblem || !description) {
      setError('All fields except photo are required.');
      return;
    }

    // Create maintenance request object
    const maintenanceRequest = {
      requestId,
      apt_no,
      areaOfProblem,
      description,
      submitted,
      photo,
      status,
      userid, // Save the username with the request
    };

    try {
      // Add the new document to the "maintenanceRequests" collection in Firestore
      await addDoc(collection(db, 'maintenanceRequests'), maintenanceRequest);
      setSuccessMessage('Your request has been submitted!');
      setError('');
      resetForm();
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('There was an error submitting your request. Please try again later.');
    }
  };

  const resetForm = () => {
    setAptNo('');
    setAreaOfProblem('');
    setDescription('');
    setPhoto(null);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div>
      <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
      <h1>Submit Maintenance Request</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Apartment Number:</label>
          <input
            type="text"
            id="apt_no"
            value={apt_no}
            required
            readOnly
          />
        </div>
        <div>
          <label>Area of Problem:</label>
          <input
            type="text"
            id="areaOfProblem"
            value={areaOfProblem}
            onChange={(e) => setAreaOfProblem(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Upload a Photo (optional):</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photo && <img src={photo} alt="Preview" style={{ width: '100px', height: 'auto' }} />} 
        </div>
        <button type="submit">Submit Request</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default SubmitMaintenanceRequest;
