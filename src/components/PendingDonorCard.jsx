import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, MapPin, Phone, Clock, UserPlus, CheckCircle, XCircle, Info, Wifi } from 'lucide-react'; // Added Clock and Wifi icons

const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9, backgroundColor: '#f9f9f9', border: '1px solid #e5e5e5' },
    animate: { opacity: 1, y: 0, scale: 1, backgroundColor: '#fff', border: '1px solid #e5e5e5', transition: { type: 'spring', stiffness: 80, damping: 15 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    hover: {
        scale: 1.02,
        backgroundColor: '#f0f0f0', // Very light gray
        // color: '#424242', // Darker gray text if needed
        borderColor: '#bdbdbd', // Medium gray border
        boxShadow: "0px 7px 18px rgba(0, 0, 0, 0.08)", // Even softer shadow
        transition: { duration: 0.1, scale: { type: "spring", stiffness: 150, damping: 8 } },
    },
};

const textHover = {
    hover: { scale: 1.05, color: '#1976d2', fontWeight: 'bold' }, // Dark blue
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

const PendingDonorCard = ({ donor, onApprove, onReject }) => {
    const getAvatar = () => {
        if (donor.image) return donor.image;
        if (donor.gender === 'female') return '../avatars/female.png';
        if (donor.gender === 'male') return '../avatars/male.png';
        const name = donor.name?.split(' ').join('+') || 'User';
        return `https://ui-avatars.com/api/?name=${name}&background=64B5F6&color=fff`; // Blue background
    };

    return (
      <motion.div
        className="rounded-xl shadow transition mb-3 cursor-pointer"
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
        whileHover="hover"
      >
        <div className="flex justify-between items-start p-3">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <motion.img
              src={getAvatar()}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover border border-gray-300 cursor-pointer"
              whileHover={{ scale: 1.1, borderColor: "#03a9f4" }} // Light blue border
              transition={{ duration: 0.1 }}
            />
            <div>
              <motion.h4
                className="text-base font-semibold cursor-pointer"
                variants={textHover}
                whileHover="hover"
              >
                {donor.name}
              </motion.h4>
              <div className="flex flex-wrap gap-1 mt-0.5 text-xs text-gray-600">
                <motion.span
                  className={`px-1.5 py-0.5 rounded-full text-white text-xs font-bold cursor-pointer`}
                  style={{ backgroundColor: "red" }} // Force red background
                >
                  <Droplet size={14} className="inline mr-1 text-white" />{" "}
                  {/* White logo */}
                  {donor.bloodGroup}
                </motion.span>
                {donor.division && (
                  <motion.span
                    className="flex items-center gap-1 cursor-pointer"
                    variants={textHover}
                    whileHover="hover"
                  >
                    <MapPin size={14} className="text-blue-500" />
                    {`${donor.thana}, ${donor.district}, ${donor.division}`}
                  </motion.span>
                )}
              </div>
              {donor.note && (
                <motion.p
                  className="text-xs text-gray-500 mt-0.5 italic cursor-pointer flex items-center gap-1"
                  variants={textHover}
                  whileHover="hover"
                >
                  <Info size={14} /> {donor.note}
                </motion.p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="text-right text-xs min-w-[160px]">
            {" "}
            {/* Increased min-width */}
            <motion.p
              className="flex items-center justify-end gap-1 cursor-pointer"
              variants={textHover}
              whileHover="hover"
            >
              <Phone size={14} className="text-green-600" />
              <a
                href={`tel:${donor.phone}`}
                className="text-blue-600 hover:underline"
              >
                {donor.phone}
              </a>
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
            <motion.div className="flex items-center justify-end gap-1 text-gray-500 text-xs mt-1 cursor-pointer">
              <Wifi
                size={14}
                className={donor.available ? "text-green-500" : "text-red-500"}
              />
              <span>Available: {donor.available ? "Yes" : "No"}</span>
            </motion.div>
            {donor.createdAt && (
              <motion.div
                className="flex items-center justify-end gap-1 text-gray-500 text-xs mt-1 cursor-pointer"
                variants={textHover}
                whileHover="hover"
              >
                <UserPlus size={14} />
                <span>Submitted: {formatDateTime(donor.createdAt)}</span>
              </motion.div>
            )}
            <div className="flex justify-end mt-2 gap-2">
              <motion.button
                onClick={() => onApprove(donor._id)}
                className="flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle size={16} /> Approve
              </motion.button>
              <motion.button
                onClick={() => onReject(donor._id)}
                className="flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <XCircle size={16} /> Reject
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
};

export default PendingDonorCard;