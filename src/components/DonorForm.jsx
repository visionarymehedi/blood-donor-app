import React, { useState } from 'react';
import axios from 'axios';

const DonorForm = ({ setShowForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    location: '',
    district: '',
    thana: '',
    note: '',
    lastDonation: '',
    available: true,
    gender: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the phone number is already in the system
    const response = await axios.get(`/api/donors/phone/${formData.phone}`);
    if (response.data.exists) {
      alert('This phone number is already registered or pending approval.');
      return;
    }

    try {
      const result = await axios.post('/api/donors', formData);
      if (result.status === 201) {
        setShowForm(false); // Close the form on successful submission
      }
    } catch (error) {
      alert('Failed to submit the donor form.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Add form fields here */}
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      {/* Add more input fields for other donor data */}
      <button type="submit" className="bg-red-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default DonorForm;
