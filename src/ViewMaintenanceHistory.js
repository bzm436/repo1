// src/ViewMaintenanceHistory.js
import React, { useEffect, useState } from 'react';
import './ViewMaintenanceHistory.css';
import { useNavigate } from 'react-router-dom';
import { db } from './firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore'; 

const ViewMaintenanceHistory = ({ userid, username }) => {
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaintenanceRequests = async () => {
            try {
                const requestsRef = collection(db, 'maintenanceRequests');

                // Query Firestore for requests that match the user's apartment, if applicable
                const q = query(requestsRef, where("userid", "==", userid));
                const result = await getDocs(q);
                // Map over the documents to extract data and set state
                const requests = result.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMaintenanceRequests(requests);
            } catch (error) {
                console.error("Error fetching maintenance requests:", error);
            }
        };

        fetchMaintenanceRequests();
    }, [userid]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="maintenance-history">
            <button onClick={handleBack} className="back-button">Back</button>
            <h1>Maintenance Request History for {username}</h1>

            {maintenanceRequests.length === 0 ? (
                <p>No maintenance requests found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Apartment Number</th>
                            <th>Area of Problem</th>
                            <th>Description</th>
                            <th>Submitted On</th>
                            <th>Completed On</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.requestId}</td>
                                <td>{request.apt_no}</td>
                                <td>{request.areaOfProblem}</td>
                                <td>{request.description}</td>
                                <td>
                                    {
                                        request.submitted.toDate().toLocaleString('en-US',
                                            {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }
                                        )
                                    }
                                </td>
                                <td>
                                    {
                                        request.completed && request.completed.toDate().toLocaleString('en-US',
                                            {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }
                                        )
                                    }
                                </td>
                                <td>{request.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewMaintenanceHistory;
