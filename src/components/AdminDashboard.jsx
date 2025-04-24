import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonorCard from './DonorCard2';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

const AdminDashboard = () => {
  const [groupCounts, setGroupCounts] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchAllDonors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/donors');
        const counts = {};
        bloodGroups.forEach(bg => {
          counts[bg] = res.data.filter(d => d.bloodGroup.includes(bg)).length;
        });
        setGroupCounts(counts);
      } catch (err) {
        console.error('Error fetching donors:', err.message);
      }
    };

    fetchAllDonors();
  }, []);

  const handleGroupClick = async (group) => {
    setSelectedGroup(group);
    try {
      const res = await axios.get(`http://localhost:5000/api/donors?bloodGroup=${encodeURIComponent(group)}`);
      setDonors(res.data);
    } catch (err) {
      console.error('Error fetching donors by group:', err.message);
    }
  };

  const resetFilter = () => {
    setSelectedGroup('');
    setDonors([]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">Admin Blood Group Overview</h1>

      {/* BLOOD GROUP CARDS */}
      {!selectedGroup && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodGroups.map(group => (
            <div
              key={group}
              className="cursor-pointer bg-white shadow-md rounded-xl p-4 hover:shadow-lg border border-blue-100 transition"
              onClick={() => handleGroupClick(group)}
            >
              <h2 className="text-xl font-bold text-blue-600">{group}</h2>
              <p className="text-gray-600">{groupCounts[group] || 0} donors</p>
            </div>
          ))}
        </div>
      )}

      {/* FILTERED DONOR VIEW */}
      {selectedGroup && (
        <div>
          <div className="flex items-center justify-between my-4">
            <h2 className="text-xl font-semibold text-blue-700">Donors with {selectedGroup}</h2>
            <button onClick={resetFilter} className="text-blue-600 underline hover:text-blue-800">
              ← Back to all groups
            </button>
          </div>

          {donors.length === 0 ? (
            <p className="text-gray-500">No donors found for {selectedGroup}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {donors.map(donor => (
                <DonorCard key={donor._id} donor={donor} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
