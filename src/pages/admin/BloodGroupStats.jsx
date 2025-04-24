import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

const BloodGroupStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Blood group color mappings for card background (light red/pink)
  const bloodGroupColors = {
    'A+': '#ffebee',
    'A-': '#ffebee',
    'B+': '#ffebee',
    'B-': '#ffebee',
    'O+': '#ffebee',
    'O-': '#ffebee',
    'AB+': '#ffebee',
    'AB-': '#ffebee',
  };

  // Text color (dark red)
  const textColor = '#d32f2f';

  const cardVariants = {
    initial: { scale: 0.95, opacity: 0, y: 10, rotate: -2 },
    animate: { scale: 1, opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 150, damping: 20, duration: 0.3 } },
    hover: {
      scale: 1.03,
      rotate: 3,
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.2 },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.2, rotate: 15, color: textColor, transition: { duration: 0.2 } }, // Icon becomes darker red and bigger
  };

  const textVariants = {
    initial: { y: 0, color: null },
    hover: { y: -2, color: textColor, transition: { duration: 0.15 } }, // Text becomes darker red and moves up
  };

  const headingVariants = {
    initial: { y: -15, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  const subheadingVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4, ease: "easeOut" } },
  };

  useEffect(() => {
    const fetchBloodGroupStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/donors/stats/blood-groups');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load blood group stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchBloodGroupStats();
  }, []);

  if (loading) {
    return <p className="text-center py-12 text-xl text-gray-600 animate-pulse">Loading Donor Statistics...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center py-12">{error}</p>;
  }

  return (
    <div className="py-40 bg-gradient-to-br from-red-100 to-pink-100 rounded-lg shadow-xl overflow-hidden">
      <motion.h2
        className="text-4xl font-extrabold mb-8 text-center text-red-700 tracking-tight"
        variants={headingVariants}
        initial="initial"
        animate="animate"
      >
        Blood Donor Insights
      </motion.h2>

      {/* Overall Statistics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-l-4 border-red-400"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.h3 className="text-lg font-semibold" style={{ color: textColor }} variants={textVariants} whileHover="hover">
            Total Donors
          </motion.h3>
          <motion.p className="text-3xl font-bold text-gray-800" variants={textVariants} whileHover="hover">
            {stats.totalDonors}
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-l-4 border-red-400"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.h3 className="text-lg font-semibold" style={{ color: textColor }} variants={textVariants} whileHover="hover">
            Approved Donors
          </motion.h3>
          <motion.p className="text-3xl font-bold text-gray-800" variants={textVariants} whileHover="hover">
            {stats.approvedDonors}
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-l-4 border-red-400"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.h3 className="text-lg font-semibold" style={{ color: textColor }} variants={textVariants} whileHover="hover">
            Pending Donors
          </motion.h3>
          <motion.p className="text-3xl font-bold text-gray-800" variants={textVariants} whileHover="hover">
            {stats.pendingDonors}
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-l-4 border-red-400"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.h3 className="text-lg font-semibold" style={{ color: textColor }} variants={textVariants} whileHover="hover">
            Rejected Donors
          </motion.h3>
          <motion.p className="text-3xl font-bold text-gray-800" variants={textVariants} whileHover="hover">
            {stats.rejectedDonors}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Blood Group Distribution */}
      <div className="px-4 sm:px-6 lg:px-8">
        <motion.h3
          className="text-2xl font-semibold mb-4 text-gray-800 text-center"
          variants={subheadingVariants}
          initial="initial"
          animate="animate"
          style={{ color: textColor }}
        >
          Blood Type Breakdown
        </motion.h3>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          {stats.bloodGroupStats && stats.bloodGroupStats.length > 0 ? (
            stats.bloodGroupStats.map((group) => (
              <motion.div
                key={group._id}
                className="rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-opacity-60 transition-all duration-300"
                style={{ backgroundColor: bloodGroupColors[group._id] || '#f8f8f8', borderColor: textColor }}
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: textColor }}
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <Droplet color="#fff" size={32} />
                </motion.div>
                <motion.h3
                  className="text-xl font-semibold text-center mb-1"
                  style={{ color: textColor }}
                  variants={textVariants}
                  whileHover="hover"
                >
                  {group._id}
                </motion.h3>
                <motion.p
                  className="text-lg text-gray-700 text-center"
                  variants={textVariants}
                  whileHover="hover"
                >
                  {group.count} Donors
                </motion.p>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-gray-600 text-center col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              No blood group data available.
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BloodGroupStats;