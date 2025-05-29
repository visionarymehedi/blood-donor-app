import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, UserX, Users, Heart, Droplet, MapPin, Phone, Info, Pencil, Trash2, Clock, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9, backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' },
  animate: { opacity: 1, y: 0, scale: 1, backgroundColor: '#fff', border: '1px solid #e5e5e5', transition: { type: 'spring', stiffness: 80, damping: 15 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
  hover: {
    scale: 1.02,
    backgroundColor: '#e0f7fa',
    color: '#1a237e',
    borderColor: '#1a237e',
    boxShadow: "0px 7px 18px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.1, scale: { type: "spring", stiffness: 150, damping: 8 } },
  },
};

const bloodGroupColors = {
  'A+': '#FF6B6B',
  'A-': '#E53E3E',
  'B+': '#4299E1',
  'B-': '#2B6CB0',
  'O+': '#68D391',
  'O-': '#48BB78',
  'AB+': '#A371F7',
  'AB-': '#805AD5',
};

const textHover = {
  hover: { scale: 1.05, color: '#009688', fontWeight: 'bold' },
  transition: { duration: 0.1 },
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const Dashboard = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/donors')
      .then(res => {
        setDonors(res.data.filter(donor => donor.status === 'approved'));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load donors.');
        setLoading(false);
      });
  }, []);

  const handleDeleteDonor = (id) => {
    axios.delete(`http://localhost:5000/api/donors/${id}`)
      .then(() => {
        setDonors(prevDonors => prevDonors.filter(donor => donor._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting donor:', error);
      });
  };

  const handleAvailabilityChange = (id, updatedData) => {
    axios.patch(`http://localhost:5000/api/donors/${id}/availability`, updatedData)
      .then(() => {
        setDonors(prevDonors => prevDonors.map(donor => (
          donor._id === id ? { ...donor, available: updatedData.available } : donor
        )));
      })
      .catch(err => {
        console.error('Error updating availability:', err);
      });
  };

  const handleEditClick = (id) => {
    navigate(`/admin/edit-donor/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-red-100 to-pink-100 min-h-screen py-10 px-6 sm:px-12 lg:px-24"
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2 className="text-3xl font-extrabold text-red-700 tracking-tight">
            <Users className="inline-block mr-2 text-red-500" size={32} />
            Active Donors
          </motion.h2>
          <motion.span className="inline-flex items-center bg-green-100 text-green-800 text-sm font-medium rounded-full px-3 py-1">
            <UserCheck className="mr-1" size={16} />
            {donors.length} Active
          </motion.span>
        </div>

        {loading ? (
          <motion.p className="text-lg text-gray-600 animate-pulse">Fetching active donors...</motion.p>
        ) : error ? (
          <motion.p className="text-red-500 text-lg">{error}</motion.p>
        ) : donors.length === 0 ? (
          <motion.p className="text-lg text-gray-600">No approved donors found at the moment.</motion.p>
        ) : (
          <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            <AnimatePresence>
              {donors.map(donor => (
                <motion.div
                  key={donor._id}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="rounded-xl shadow transition mb-3 cursor-pointer"
                  whileHover="hover"
                >
                  <div className="flex justify-between items-start p-3">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                      <motion.img
                        src={donor.image || (donor.gender === 'female' ? '../avatars/female.png' : donor.gender === 'male' ? '../avatars/male.png' : `https://ui-avatars.com/api/?name=${donor.name?.split(' ').join('+') || 'User'}&background=F43F5E&color=fff`)}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
                        whileHover={{ scale: 1.1, borderColor: '#00bcd4' }}
                        transition={{ duration: 0.1 }}
                      />
                      <div>
                        <motion.h4 className="text-base font-semibold cursor-pointer" variants={textHover} whileHover="hover">
                          {donor.name}
                        </motion.h4>
                        <div className="flex flex-wrap gap-1 mt-0.5 text-xs text-gray-600">
                          <motion.span
                            className={`px-1.5 py-0.5 rounded-full text-white text-xs font-bold cursor-pointer`}
                            style={{ backgroundColor: bloodGroupColors[donor.bloodGroup] || '#6B7280' }}
                          >
                            <Droplet size={14} className="inline mr-1" />
                            {donor.bloodGroup}
                          </motion.span>
                          {donor.division && (
                            <motion.span className="flex items-center gap-1 cursor-pointer" variants={textHover} whileHover="hover">
                              <MapPin size={14} className="text-blue-500" />
                              {`${donor.thana}, ${donor.district}, ${donor.division}`}
                            </motion.span>
                          )}
                        </div>
                        {donor.note && (
                          <motion.p className="text-xs text-gray-500 mt-0.5 italic cursor-pointer flex items-center gap-1" variants={textHover} whileHover="hover">
                            <Info size={14} /> {donor.note}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="text-right text-xs min-w-[140px]"> {/* Increased min-width */}
                      <motion.p
                        className="flex items-center justify-end gap-1 cursor-pointer"
                        variants={textHover}
                        whileHover="hover"
                      >
                        <Phone size={14} className="text-green-600" />
                        <a href={`tel:${donor.phone}`} className="text-blue-600 hover:underline">
                          {donor.phone}
                        </a>
                      </motion.p>

                      {/* Availability */}
                      <motion.p className="text-xs font-semibold mt-1 flex items-center justify-end gap-1">
                        Available:
                        <input
                          type="checkbox"
                          checked={donor.available}
                          onChange={() => handleAvailabilityChange(donor._id, { available: !donor.available })}
                          className="ml-1 h-4 w-4 cursor-pointer"
                        />
                      </motion.p>

                      {donor.lastDonation && (
                        <motion.div
                          className="flex items-center justify-end gap-1 text-gray-500 text-xs mt-1 cursor-pointer"
                          variants={textHover}
                          whileHover="hover"
                        >
                          <Clock size={14} />
                          <span>Last Donated: {formatDate(donor.lastDonation)}</span>
                        </motion.div>
                      )}
                      {donor.createdAt && (
                        <motion.div
                          className="flex items-center justify-end gap-1 text-gray-500 text-xs mt-1 cursor-pointer"
                          variants={textHover}
                          whileHover="hover"
                        >
                          <UserPlus size={14} />
                          <span>Added: {formatDateTime(donor.createdAt)}</span>
                        </motion.div>
                      )}

                      <div className="flex justify-end mt-2 gap-2">
                        <motion.button
                          onClick={() => handleEditClick(donor._id)}
                          className="cursor-pointer text-blue-600 hover:text-blue-800"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Pencil size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteDonor(donor._id)}
                          className="cursor-pointer text-red-600 hover:text-red-800"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
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

export default Dashboard;