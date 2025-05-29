import React from 'react';

const DonorCard = ({ donor }) => {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-lg transition">
      <h3 className="font-bold text-lg text-blue-700">{donor.name}</h3>
      <p className="text-sm text-gray-600">📱 {donor.phone}</p>
      <p className="text-sm">🩸 {donor.bloodGroup}</p>
      <p className="text-sm">📍 {donor.thana}, {donor.district}</p>
      <p className="text-sm text-green-600">{donor.available ? '✅ Available' : '❌ Not Available'}</p>
    </div>
  );
};

export default DonorCard;
