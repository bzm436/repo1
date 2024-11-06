import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig'; 
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'; 
import './Form.css'; 
import { useNavigate } from 'react-router-dom'; 

function BrowseMaintenanceRequests() {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [filters, setFilters] = useState({
        apt_no: '',
        area: '',
        submitted: null,
        completed: null,
        status: 'all',
    });
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchRequests = async () => {
            const querySnapshot = await getDocs(collection(db, 'maintenanceRequests'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(data);
            setFilteredRequests(data);
        };

        fetchRequests();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const applyFilters = () => {
        let filtered = requests;
console.log(filtered);
        if (filters.apt_no) {
            filtered = filtered.filter(request =>
                request.apt_no.includes(filters.apt_no)
            );
        }
        if (filters.area) {
            filtered = filtered.filter(request =>
                request.areaOfProblem.includes(filters.area)
            );
        }
        if (filters.submitted) {
            filtered = filtered.filter(request =>
                request.submitted && (request.submitted.toDate().toISOString().split('T')[0] >= filters.submitted)
            );
        }
        if (filters.completed) {
            filtered = filtered.filter(request =>
                request.completed && (request.completed.toDate().toISOString().split('T')[0] <= filters.completed)
            );
        }
        if (filters.status !== 'all') {
            filtered = filtered.filter(request => request.status === filters.status);
        }

        setFilteredRequests(filtered);
    };

    const handleStatusChange = async (requestId) => {
        const requestDocRef = doc(db, 'maintenanceRequests', requestId);
        await updateDoc(requestDocRef, {
            status: 'completed',
            completed: Timestamp.now()
        });
        setFilteredRequests((prevRequests) =>
            prevRequests.map(request =>
                request.id === requestId ?
                    {
                        ...request,
                        status: 'completed',
                        completed: Timestamp.now()
                    }
                    : request
            )
        );
    };

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    return (
        <div>
            <button onClick={handleBack} className="back-button">Back</button> {/* Back button */}
            <h1>Browse Maintenance Requests</h1>
            <div>
                <input
                    type="text"
                    name="apt_no"
                    placeholder="Filter by Apartment Number"
                    value={filters.apt_no}
                    onChange={handleFilterChange}
                />
                <input
                    type="text"
                    name="area"
                    placeholder="Filter by Area"
                    value={filters.area}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="submitted"
                    value={filters.submitted}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="completed"
                    value={filters.completed}
                    onChange={handleFilterChange}
                />
                <select name="status" value={filters.status} onChange={handleFilterChange}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                </select>
                <button onClick={applyFilters}>Apply Filters</button>
            </div>

            <h2>Requests:</h2>
            <table className="requests-table">
                <thead>
                    <tr>
                        <th>Request ID</th>
                        <th>Apartment</th>
                        <th>Area of Problem</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Submitted On</th>
                        <th>Completed On</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRequests.map(request => (
                        <tr key={request.requestId}>
                            <td>{request.requestId}</td>
                            <td>{request.apt_no}</td>
                            <td>{request.areaOfProblem}</td>
                            <td>{request.description}</td>
                            <td>{request.status}</td>
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
                            request.status === 'pending' ? 
                                ( <button className="complete-button" onClick={() => handleStatusChange(request.id)}> Mark as Completed </button> )
                                : request.completed && request.completed.toDate().toLocaleString('en-US',
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
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default BrowseMaintenanceRequests;
