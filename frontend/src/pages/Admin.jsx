// Admin.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDonorCard from '../components/AdminDonorCard';
import PendingDonorCard from './admin/PendingRequests';
import AddDonorForm2 from '../components/AddDonorForm2';
import AdminDashboard from '../components/AdminDashboard'; // Import AdminDashboard component
import { Search } from 'lucide-react'; // Import the Search icon

const Admin = () => {
  const [donors, setDonors] = useState([]);
  const [pendingDonors, setPendingDonors] = useState([]);
  const [rejectedDonors, setRejectedDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDonor, setEditingDonor] = useState(null);
  const [showDashboard, setShowDashboard] = useState(true); // State for dashboard visibility
  const [showPending, setShowPending] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [filteredDonors, setFilteredDonors] = useState([]); // State for filtered approved donors

  useEffect(() => {
    fetchDonors();
    fetchPendingDonors();
    fetchRejectedDonors();
  }, []);

  useEffect(() => {
    // Filter approved donors based on searchQuery
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = donors.filter(donor => {
      return (
        donor.name.toLowerCase().includes(lowerCaseQuery) ||
        donor.phone.includes(lowerCaseQuery) ||
        donor.bloodGroup.toLowerCase().includes(lowerCaseQuery) ||
        `${donor.thana} ${donor.district} ${donor.division}`.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredDonors(filtered);
  }, [donors, searchQuery]);

  const fetchDonors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donors');
      setDonors(res.data.filter(donor => donor.status === 'approved'));
    } catch (err) {
      setError('Failed to load donors.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingDonors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donors/pending');
      setPendingDonors(res.data);
    } catch (err) {
      setError('Failed to load pending donors.');
    }
  };

  const fetchRejectedDonors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donors/rejected');
      setRejectedDonors(res.data);
    } catch (err) {
      setError('Failed to load rejected donors.');
    }
  };

  const handleDeleteDonor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/donors/${id}`);
      setDonors(donors.filter((donor) => donor._id !== id));
      setFilteredDonors(filteredDonors.filter((d) => d._id !== id)); // Update filtered list as well
    } catch (err) {
      console.error('Error deleting donor:', err);
    }
  };

  const handleApproveDonor = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/donors/${id}/approve`);
      fetchDonors();
      fetchPendingDonors();
    } catch (err) {
      console.error('Error approving donor:', err);
    }
  };

  const handleRejectDonor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/donors/${id}/reject`);
      fetchPendingDonors();
      fetchRejectedDonors();
    } catch (err) {
      console.error('Error rejecting donor:', err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="font-bold text-xl mb-6">Admin Panel</h2>
        <button onClick={() => { setShowForm(true); setShowDashboard(false); setShowPending(false); setShowRejected(false); }} className="w-full mb-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">+ Add New Donor</button>
        <button onClick={() => { setShowDashboard(true); setShowPending(false); setShowRejected(false); setShowForm(false); }} className={`w-full mb-3 ${showDashboard ? "font-semibold" : ""} bg-gray-500 text-white py-2 rounded hover:bg-gray-600`}>Dashboard</button>
        <button onClick={() => { setShowPending(false); setShowDashboard(false); setShowRejected(false); setShowForm(false); }} className={`w-full mb-3 ${!showPending ? "font-semibold" : ""} bg-green-500 text-white py-2 rounded hover:bg-green-600`}>View All Donors</button>
        <button onClick={() => { setShowPending(true); setShowDashboard(false); setShowRejected(false); setShowForm(false); }} className={`w-full ${showPending ? "font-semibold" : ""} bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600`}>View Pending Requests</button>
        <button onClick={() => { setShowRejected(true); setShowDashboard(false); setShowPending(false); setShowForm(false); }} className={`w-full ${showRejected ? "font-semibold" : ""} bg-red-500 text-white py-2 rounded hover:bg-red-600`}>View Rejected Donors</button>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        {showForm ? (
          <AddDonorForm2 setShowForm={setShowForm} setDonors={setDonors} editingDonor={editingDonor} setEditingDonor={setEditingDonor} />
        ) : showDashboard ? (
          <AdminDashboard />
        ) : (
          <>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search by name, phone, blood group, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>

            <h2 className="text-2xl font-semibold mb-4">
              {showPending
                ? "Pending Donor Requests"
                : showRejected
                ? "Rejected Donor List"
                : "Approved Donor List"}
            </h2>
            {loading ? (
              <p>Loading donors...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : showPending ? (
              pendingDonors.length === 0 ? (
                <p>No pending donor requests.</p>
              ) : (
                pendingDonors.map((donor) => (
                  <PendingDonorCard
                    key={donor._id}
                    donor={donor}
                    onApprove={handleApproveDonor}
                    onReject={handleRejectDonor}
                  />
                ))
              )
            ) : showRejected ? (
              rejectedDonors.length === 0 ? (
                <p>No rejected donor requests.</p>
              ) : (
                rejectedDonors.map((donor) => (
                  <AdminDonorCard
                    key={donor._id}
                    donor={donor}
                    onDelete={handleDeleteDonor}
                    onEdit={() => {}}
                    onAvailabilityChange={() => {}}
                    searchQuery="" // We don't need to filter rejected donors here for now
                  />
                ))
              )
            ) : filteredDonors.length === 0 && searchQuery !== "" ? (
              <p>No approved donors found matching your search.</p>
            ) : filteredDonors.length === 0 && searchQuery === "" && donors.length === 0 ? (
              <p>No approved donors yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonors.map((donor) => (
                  <AdminDonorCard
                    key={donor._id}
                    donor={donor}
                    onDelete={handleDeleteDonor}
                    onEdit={() => {}}
                    onAvailabilityChange={handleAvailabilityChange}
                    searchQuery={searchQuery} // Pass the searchQuery prop
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;