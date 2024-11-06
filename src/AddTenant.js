import React, { useState } from 'react';
import { db } from './firebaseConfig'; 
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'; 
import './Form.css'; 
import { useNavigate } from 'react-router-dom'; 

const AddTenant = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // input validation
    if (!name || !phone || !email || !checkInDate || !apartmentNumber) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Query to check if apartment number already exists
      const q = query(collection(db, 'tenants'), where('apartmentNumber', '==', apartmentNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError('A tenant already occupies this apartment number.');
        return;
      }

      // Add new tenant document to Firestore
      const tenantData = {
        name,
        phone,
        email,
        checkInDate,
        apartmentNumber,
        tenantId: Date.now()
      };
      await addDoc(collection(db, 'tenants'), tenantData);

      // Add new user document to Firestore
      const userData = {
        userid: tenantData.apartmentNumber,
        password: '123',                        // docRef.id,
        username: tenantData.name,
        apt_no: tenantData.apartmentNumber,
        tenantId: tenantData.tenantId,
        userType: 'Tenant',
      };

      await addDoc(collection(db, 'users'), userData);

      setSuccessMessage(`Success! User ID: ${tenantData.apartmentNumber}`);
      setError('');

      // Clear fields after submission
      setName('');
      setPhone('');
      setEmail('');
      setCheckInDate('');
      setApartmentNumber('');
    } catch (e) {
      console.error('Error adding document: ', e);
      setError('There was an error adding the tenant. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/welcome'); // Navigate back to the previous page
  };

  return (
    <div>
      <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
      <h1>Add New Tenant</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="checkInDate">Check-In Date:</label>
          <input type="date" id="checkInDate" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="apartmentNumber">Apartment Number:</label>
          <input type="text" id="apartmentNumber" value={apartmentNumber} onChange={(e) => setApartmentNumber(e.target.value)} required />
        </div>
        <button type="submit">Add Tenant</button>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default AddTenant;
