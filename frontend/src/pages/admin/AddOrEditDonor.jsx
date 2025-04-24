import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddDonorForm2 from "../../components/AddDonorForm2";
import axios from "axios";
import { Droplet } from "lucide-react";

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeInOut", delayChildren: 0.2 },
  },
  exit: { opacity: 0, transition: { duration: 0.4, ease: "easeInOut" } },
};

const formWrapperVariants = {
  initial: { y: 20, opacity: 0, scale: 0.95 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  exit: { y: -20, opacity: 0, scale: 0.98, transition: { duration: 0.3 } },
};

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
};

const textVariants = {
  initial: {},
  hover: {},
};

const subheadingVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const bloodGroupColors = {
  "A+": "#FFCDD2",
  "A-": "#EF9A9A",
  "B+": "#C8E6C9",
  "B-": "#A5D6A7",
  "O+": "#FFF9C4",
  "O-": "#FFF59D",
  "AB+": "#D1C4E9",
  "AB-": "#B39DDB",
};

const AddOrEditDonor = ({
  setShowForm,
  setDonors,
  editingDonor,
  setEditingDonor,
}) => {
  const [stats, setStats] = useState({
    totalDonors: 0,
    approvedDonors: 0,
    pendingDonors: 0,
    rejectedDonors: 0,
    bloodGroupStats: [],
  });

  const textColor = "black";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/donors/stats/blood-groups"
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 flex items-center justify-center px-4 py-8 rounded-xl"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex flex-row w-full max-w-7xl space-x-8">
        {/* Left - Stats */}
        <motion.div className="w-1/4 flex flex-col space-y-6">
          <motion.h2 className="text-2xl font-bold text-white mb-4">
            Overall Statistics
          </motion.h2>

          {[
            { label: "Total Donors", count: stats.totalDonors, border: "red" },
            {
              label: "Approved Donors",
              count: stats.approvedDonors,
              border: "green",
            },
            {
              label: "Pending Donors",
              count: stats.pendingDonors,
              border: "yellow",
            },
            {
              label: "Rejected Donors",
              count: stats.rejectedDonors,
              border: "gray",
            },
          ].map((item) => (
            <motion.div
              key={item.label}
              className={`bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center border-l-4 border-${item.border}-400`}
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.h3
                className="text-lg font-semibold"
                style={{ color: textColor }}
              >
                {item.label}
              </motion.h3>
              <motion.p className="text-3xl font-bold text-gray-800">
                {item.count}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Middle - Form */}
        <motion.div
          className="w-1/2 flex justify-center"
          variants={formWrapperVariants}
        >
          <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-xl">
            <AddDonorForm2
              setShowForm={setShowForm}
              setDonors={setDonors}
              editingDonor={editingDonor}
              setEditingDonor={setEditingDonor}
            />
          </div>
        </motion.div>

{/* Right - Blood Group Stats */}
<div className="w-1/4">
  <motion.h3
    className="text-2xl font-bold mb-3 text-center text-white"
    variants={subheadingVariants}
    initial="initial"
    animate="animate"
  >
    Blood Type Breakdown
  </motion.h3>

  <motion.div
    className="grid grid-cols-2 gap-5"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 0.6 }}
  >
    {stats.bloodGroupStats && stats.bloodGroupStats.length > 0 ? (
      stats.bloodGroupStats.map((group) => {
        const shortGroup = group._id.split(' ')[0];

        return (
          <motion.div
            key={group._id}
            className="bg-white border-2 border-red-400 rounded-lg shadow-sm flex flex-col items-center justify-center px-4 py-8 transition-all text-m"
            variants={cardVariants}
            initial="initial"
            whileHover={{
              scale: 1.05,
              backgroundColor: '#fff5f5',
              boxShadow: '0 8px 20px rgba(255, 0, 0, 0.2)',
              transition: { duration: 0.2 },
            }}
          >
            <motion.div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-2 bg-red-500"
              whileHover={{
                scale: 1.2,
                rotate: 10,
                backgroundColor: '#b91c1c',
              }}
            >
              <Droplet color="#fff" size={20} />
            </motion.div>

            <motion.p
              className="font-bold text-center text-gray-800"
              whileHover={{ color: '#dc2626' }}
            >
              {group._id}
            </motion.p>

            <p className="text-xs text-gray-500">
              {group.count} donors
            </p>
          </motion.div>
        );
      })
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
    </motion.div>
  );
};

export default AddOrEditDonor;
