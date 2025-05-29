import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BloodGroupStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBloodGroupStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/donors/stats/blood-group');
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
    return <p>Loading Blood Group Statistics...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Blood Group Distribution</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.length > 0 ? (
          stats.map((group) => (
            <div className="bg-blue-100 p-4 rounded-md shadow" key={group._id}>
              <h3 className="text-lg font-semibold">{group._id}</h3>
              <p className="text-xl">{group.count} Donors</p>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
};

export default BloodGroupStats;
