import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Droplet, MapPin, Phone, Clock, UserPlus } from 'lucide-react';

const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0 },
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  exit: { opacity: 0, y: -10, scale: 0.98 },
  hover: {
    scale: 1.02,
    backgroundColor: '#f0f8ff',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
};

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const formatDateTime = (date) => new Date(date).toLocaleString('en-US');

const getAvatar = (donor) => {
  if (donor.image) return donor.image;
  if (donor.gender === 'female') return '../avatars/female.png';
  if (donor.gender === 'male') return '../avatars/male.png';
  const name = donor.name?.split(' ').join('+') || 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=F43F5E&color=fff`;
};

const RejectedDonors = () => {
  const [rejectedDonors, setRejectedDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRejectedDonors();
  }, []);

  const fetchRejectedDonors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donors/rejected');
      setRejectedDonors(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load rejected donors.');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen py-10 px-6 sm:px-12 lg:px-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 className="text-3xl font-extrabold text-red-700 tracking-tight">
            <XCircle className="inline-block mr-2 text-red-500" size={32} />
            Rejected Donors
          </motion.h2>
          <motion.span className="inline-flex items-center bg-red-100 text-red-800 text-sm font-medium rounded-full px-3 py-1">
            <UserPlus className="mr-1" size={16} />
            {rejectedDonors.length} Rejected
          </motion.span>
        </div>

        {loading ? (
          <motion.p className="text-lg text-gray-600 animate-pulse">Loading rejected donors...</motion.p>
        ) : error ? (
          <motion.p className="text-red-500 text-lg">{error}</motion.p>
        ) : rejectedDonors.length === 0 ? (
          <motion.p className="text-lg text-gray-600 text-center py-10">No rejected donors found.</motion.p>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {rejectedDonors.map((donor) => (
                <motion.div
                  key={donor._id}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="relative p-6 rounded-xl shadow-md border bg-white cursor-grab"
                  whileHover="hover"
                  drag
                  dragConstraints={{ top: -20, left: -20, right: 20, bottom: 20 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getAvatar(donor)}
                        alt="avatar"
                        className="w-14 h-14 rounded-full border"
                      />
                      <div>
                        <h4 className="text-lg font-semibold">{donor.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                          <span className="bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-medium text-xs flex items-center">
                            <Droplet size={16} className="mr-1" />
                            {donor.bloodGroup}
                          </span>
                          {donor.division && (
                            <span className="flex items-center gap-1">
                              <MapPin size={16} className="text-blue-500" />
                              {`${donor.thana}, ${donor.district}, ${donor.division}`}
                            </span>
                          )}
                        </div>
                        {donor.note && (
                          <p className="text-sm text-gray-500 italic mt-1">{donor.note}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-sm">
                    <p className="flex items-center justify-end gap-2">
                      <Phone size={16} className="text-green-600" />
                      <a href={`tel:${donor.phone}`} className="text-blue-600 hover:underline">
                        {donor.phone}
                      </a>
                    </p>
                    {donor.lastDonation && (
                      <div className="flex items-center justify-end gap-2 text-gray-500 mt-1">
                        <Clock size={16} />
                        <span>Last Donated: {formatDate(donor.lastDonation)}</span>
                      </div>
                    )}
                    {donor.createdAt && (
                      <div className="flex items-center justify-end gap-2 text-gray-500 mt-1">
                        <UserPlus size={16} />
                        <span>Added: {formatDateTime(donor.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RejectedDonors;
