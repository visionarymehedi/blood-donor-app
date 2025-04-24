// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import FilterPanel from './components/FilterPanel';
import DonorCard from './components/DonorCard';
import AddDonorForm from './components/AddDonorForm';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PendingRequests from './pages/admin/PendingRequests';
import BloodGroupStats from './pages/admin/BloodGroupStats';
import AddOrEditDonor from './pages/admin/AddOrEditDonor';
import RejectedDonors from './pages/admin/RejectedDonors';

function App() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedThana, setSelectedThana] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);

  const donorsPerPage = 6;

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/donors');
        setDonors(res.data);
      } catch (err) {
        setError('Failed to load donors.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((donor) => {
    const q = searchQuery.toLowerCase();
    return (
      donor.name?.toLowerCase().includes(q) ||
      donor.phone?.includes(q) ||
      donor.bloodGroup?.toLowerCase().includes(q) ||
      donor.district?.toLowerCase().includes(q) ||
      donor.thana?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);
  const startIndex = (currentPage - 1) * donorsPerPage;
  const currentDonors = filteredDonors.slice(startIndex, startIndex + donorsPerPage);

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddDonorClick={() => setShowFormModal(true)}
      />

      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/admin" element={<PrivateRoute element={<AdminLayout />} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pending" element={<PendingRequests />} />
        <Route path="rejected" element={<RejectedDonors />} />
        <Route path="stats" element={<BloodGroupStats />} />
        <Route path="add" element={<AddOrEditDonor />} />
        <Route path="edit-donor/:id" element={<AddOrEditDonor editMode />} />
      </Route>

        <Route
          path="/"
          element={
            <div className="flex justify-center px-4 sm:px-8 lg:px-20 py-8 bg-gray-100">
              <div className="flex w-full max-w-screen-xl bg-white shadow-md rounded-lg overflow-hidden">
                <FilterPanel
                  selectedGroup={selectedGroup}
                  setSelectedGroup={setSelectedGroup}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  selectedThana={selectedThana}
                  setSelectedThana={setSelectedThana}
                  clearFilters={() => {
                    setSelectedGroup("");
                    setSelectedDistrict("");
                    setSelectedThana("");
                    setCurrentPage(1);
                  }}
                />
                <main className="flex-1 px-4 py-6">
                  {loading ? (
                    <p>Loading donors...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : currentDonors.length > 0 ? (
                    currentDonors.map((donor, i) => (
                      <DonorCard key={i} donor={donor} />
                    ))
                  ) : (
                    <p>No donors found.</p>
                  )}

                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 rounded border ${
                            currentPage === i + 1
                              ? "bg-red-500 text-white"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </main>
              </div>
            </div>
          }
        />
      </Routes>

      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            >
              ×
            </button>
            <AddDonorForm
              setShowForm={setShowFormModal}
              setDonors={setDonors}
              editingDonor={null}
              setEditingDonor={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;