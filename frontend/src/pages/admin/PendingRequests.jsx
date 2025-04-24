import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UserX, Users } from 'lucide-react';
import PendingDonorCard from '../../components/PendingDonorCard';

const PendingRequests = () => {
  const [pendingDonors, setPendingDonors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPendingDonors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/donors/pending');
        setPendingDonors(response.data);
      } catch (err) {
        setError('Failed to load pending donors.');
      }
    };

    fetchPendingDonors();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/donors/${id}/approve`);
      setPendingDonors((prev) => prev.filter((donor) => donor._id !== id));
    } catch (err) {
      console.error('Error approving donor:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/donors/${id}/reject`);
      setPendingDonors((prev) => prev.filter((donor) => donor._id !== id));
    } catch (err) {
      console.error('Error rejecting donor:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen py-10 px-6 sm:px-12 lg:px-24"
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <div className="flex items-center justify-between mb-">
          <motion.h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight">
            <UserPlus className="inline-block mr-2 text-indigo-500" size={32} />
            Pending Requests
          </motion.h2>
          <motion.span className="inline-flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full px-3 py-1">
            <Users className="mr-1" size={16} />
            {pendingDonors.length} Pending
          </motion.span>
        </div>

        {error && <motion.p className="text-red-600 mb-4">{error}</motion.p>}

        {pendingDonors.length === 0 ? (
          <motion.p className="text-lg text-gray-600">No pending donor requests.</motion.p>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <AnimatePresence>
              {pendingDonors.map((donor) => (
                <PendingDonorCard
                  key={donor._id}
                  donor={donor}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PendingRequests;