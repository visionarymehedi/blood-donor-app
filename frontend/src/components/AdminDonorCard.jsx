/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Droplet, MapPin, Phone, Clock, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDonorCard = ({ donor, onDelete, onEdit, onAvailabilityChange }) => {
  const [isAvailable, setIsAvailable] = useState(donor.available);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const getAvatar = () => {
    if (donor.image) return donor.image;
    if (donor.gender === 'female') return '../avatars/female.png';
    if (donor.gender === 'male') return '../avatars/male.png';
    const name = donor.name?.split(' ').join('+') || 'User';
    return `https://ui-avatars.com/api/?name=${name}&background=F43F5E&color=fff`;
  };

  useEffect(() => {
    setIsAvailable(donor.available);
  }, [donor]);

  const handleAvailabilityChange = (e) => {
    const newAvailability = e.target.checked;
    setIsAvailable(newAvailability);
    if (onAvailabilityChange) {
      onAvailabilityChange(donor._id, { available: newAvailability });
    }
  };

  const handleEditClick = () => {
    navigate(`/admin/edit-donor/${donor._id}`);
  };

  const cardVariants = {
    initial: { scale: 1, opacity: 0.9, backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' },
    hover: {
      scale: 1.05, // Larger scale on hover
      opacity: 1,
      backgroundColor: '#e0f7fa', // Light cyan for a quick change
      color: '#1a237e', // Dark indigo text on hover
      borderColor: '#1a237e',
      boxShadow: "0px 7px 18px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.1, // Very short duration for an instant color change
        scale: { type: "spring", stiffness: 150, damping: 8 }, // Spring for a slight bounce on scale
      },
    },
    transition: { type: "spring", stiffness: 200, damping: 10 },
  };

  const iconButtonVariants = {
    initial: { scale: 1, opacity: 0.7, color: '#555' },
    hover: { scale: 1.2, opacity: 1, color: '#007bff' }, // Larger scale and blue color
    tap: { scale: 0.9 },
    transition: { duration: 0.1 }, // Instant color change
  };

  const availabilityVariants = {
    available: { backgroundColor: "#4CAF50", color: "#fff" },
    unavailable: { backgroundColor: "#f44336", color: "#fff" },
    hover: { scale: 1.1 },
    transition: { duration: 0.1 }, // Instant scale change
  };

  const bloodGroupVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
    transition: { duration: 0.1 }, // Instant scale change
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
    hover: { scale: 1.05, color: '#009688', fontWeight: 'bold' }, // Slight scale and teal color
    transition: { duration: 0.1 },
  };

  return (
    <div className="px-5 md:px-20"> {/* Added outer padding on left and right */}
      <motion.div
        className="flex justify-between items-start p-3 rounded-xl shadow transition mb-3 cursor-pointer"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        transition="transition"
      >
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <motion.img
            src={getAvatar()}
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
                variants={bloodGroupVariants}
                whileHover="hover"
                transition="transition"
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
            <motion.p className="text-xs text-gray-500 mt-0.5 italic cursor-pointer" variants={textHover} whileHover="hover">
              {donor.note}
            </motion.p>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-right text-xs min-w-[120px]">
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

          {/* Availability (Checkbox with animation) */}
          <motion.p
            className="text-xs font-semibold mt-1 flex items-center justify-end gap-1 cursor-pointer"
            variants={availabilityVariants}
            animate={isAvailable ? "available" : "unavailable"}
            transition="transition"
            whileHover="hover"
            whileTap={{ scale: 0.9 }}
          >
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={handleAvailabilityChange}
              className="mr-1 h-4 w-4 cursor-pointer"
            />
            Available
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

          {/* Edit and Delete Buttons with animation */}
          <motion.div className="flex justify-end mt-2 gap-2">
            <motion.button
              onClick={handleEditClick}
              className="cursor-pointer"
              variants={iconButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Pencil size={16} />
            </motion.button>
            <motion.button
              onClick={() => onDelete(donor._id)}
              className="cursor-pointer"
              variants={iconButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <Trash2 size={16} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDonorCard;
