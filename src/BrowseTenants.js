import React, { useState, useEffect } from 'react';
import { db } from './firebaseConfig'; 
import { collection, getDocs, doc, deleteDoc, updateDoc, query, where } from 'firebase/firestore'; 
import './Form.css'; 
import { useNavigate } from 'react-router-dom'; 

const BrowseTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showMoveInput, setShowMoveInput] = useState(null); // Track which tenant is being moved
  const [newApartmentNumber, setNewApartmentNumber] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tenants'));
        const tenantsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTenants(tenantsData);
      } catch (error) {
        console.error("Error fetching tenants: ", error);
        setError('There was an error fetching tenants. Please try again.');
      }
    };

    fetchTenants();
  }, []);

  const handleDelete = async (tenantId) => {
    try {
      await deleteDoc(doc(db, 'tenants', tenantId));
      setSuccessMessage(`Tenant ID ${tenantId} has been deleted.`);
      setTenants(prevTenants => prevTenants.filter(tenant => tenant.id !== tenantId));
    } catch (e) {
      console.error('Error deleting document: ', e);
      setError('There was an error deleting the tenant. Please try again.');
    }
  };

  const handleMove = async (tenantId, tenantName, commonid) => {
    if (!newApartmentNumber) {
      setError('Please enter a new apartment number.');
      return;
    }

    try {
      const tenantDocRef = doc(db, 'tenants', tenantId);
      await updateDoc(tenantDocRef, { apartmentNumber: newApartmentNumber });
      console.log('T1 ' + commonid);
      // Update user's apt_no and userid in the users collection
      const userQuery = query(collection(db, 'users'), where('tenantId', '==', commonid));
      const userDocs = await getDocs(userQuery);

      userDocs.forEach(async (userDoc) => {
        console.log(userDoc.id);
        const userDocRef = doc(db, 'users', userDoc.id);
        await updateDoc(userDocRef, {
          apt_no: newApartmentNumber,
          userid: newApartmentNumber
        });
      });

      setSuccessMessage(`Tenant ${tenantName} has been moved to apartment ${newApartmentNumber}.`);
      setError('');
      setShowMoveInput(null); // Hide input after successful move
      setNewApartmentNumber('');

      // Update local state to reflect the change
      setTenants(prevTenants =>
        prevTenants.map(tenant =>
          tenant.id === tenantId ? { ...tenant, apartmentNumber: newApartmentNumber } : tenant
        )
      );
    } catch (e) {
      console.error('Error updating document: ', e);
      setError('There was an error moving the tenant. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div>
      <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
      <h1>Current Tenants</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <table className="tenants-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Apartment Number</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Check-In Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.name}</td>
              <td>{tenant.apartmentNumber}</td>
              <td>{tenant.phone}</td>
              <td>{tenant.email}</td>
              <td>{tenant.checkInDate}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(tenant.id)}
                >
                  Delete
                </button>
                <button
                  className="move-button"
                  onClick={() => setShowMoveInput(tenant.id)}
                >
                  Move
                </button>
                {showMoveInput === tenant.id && (
                  <div className="move-input">
                    <input
                      type="text"
                      placeholder="New Apartment Number"
                      value={newApartmentNumber}
                      onChange={(e) => setNewApartmentNumber(e.target.value)}
                    />
                    <button onClick={() => handleMove(tenant.id, tenant.name, tenant.tenantId)}>Submit</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrowseTenants;
