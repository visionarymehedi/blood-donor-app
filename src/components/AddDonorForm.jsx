import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPopup from './CustomPopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

const AddDonorForm = ({ setShowForm, setDonors, editingDonor, setEditingDonor }) => {
  const [newDonor, setNewDonor] = useState({
    name: editingDonor?.name || '',
    phone: editingDonor?.phone || '',
    bloodGroup: editingDonor?.bloodGroup || '',
    division: editingDonor?.division || '',
    district: editingDonor?.district || '',
    thana: editingDonor?.thana || '',
    village: editingDonor?.village || '',
    note: editingDonor?.note || 'No notes provided',
    lastDonation: editingDonor?.lastDonation ? new Date(editingDonor.lastDonation).toISOString().split('T')[0] : '',
    gender: editingDonor?.gender || '',
    available: editingDonor?.available !== undefined ? editingDonor.available : true,
    image: editingDonor?.image || '',
    status: editingDonor?.status || 'pending',
    addedByAdmin: editingDonor?.addedByAdmin !== undefined ? editingDonor.addedByAdmin : false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [popup, setPopup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);

  const bloodGroups = ['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'];
  const genders = ['male', 'female', 'other'];

  // Load divisions
  useEffect(() => {
    const loadData = async () => {
      const res = await fetch('/locations/division.json');
      const json = await res.json();
      setDivisions(json.find(item => item.type === 'table')?.data || []);
    };
    loadData();
  }, []);

  // Load districts
  useEffect(() => {
    if (newDonor.division) {
      const load = async () => {
        const res = await fetch('/locations/district.json');
        const json = await res.json();
        const data = json.find(item => item.type === 'table')?.data || [];
        setDistricts(data.filter(d => String(d.division_id) === String(newDonor.division)));
      };
      load();
    } else {
      setDistricts([]);
    }
  }, [newDonor.division]);

  // Load thanas
  useEffect(() => {
    if (newDonor.district) {
      const load = async () => {
        const res = await fetch('/locations/upazila.json');
        const json = await res.json();
        const data = json.find(item => item.type === 'table')?.data || [];
        setThanas(data.filter(t => String(t.district_id) === String(newDonor.district)));
      };
      load();
    } else {
      setThanas([]);
    }
  }, [newDonor.district]);

  const validatePhone = phone => /^(013|014|015|016|017|018|019)[0-9]{8}$/.test(phone);

  const validateForm = () => {
    const errors = {};
    if (!newDonor.name) errors.name = 'Name is required';
    if (!validatePhone(newDonor.phone)) errors.phone = 'Invalid BD phone number';
    if (!newDonor.bloodGroup) errors.bloodGroup = 'Blood group is required';
    if (!newDonor.division) errors.division = 'Division is required';
    if (!newDonor.district) errors.district = 'District is required';
    if (!newDonor.thana) errors.thana = 'Thana is required';
    if (!newDonor.gender) errors.gender = 'Gender is required';
    if (!newDonor.lastDonation) errors.lastDonation = 'Last donation date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setNewDonor(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = e => {
    const value = e.target.value;
    if (/^[0-9]{0,11}$/.test(value)) {
      setNewDonor(prev => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const divisionName = divisions.find(d => d.id == newDonor.division)?.name || '';
    const districtName = districts.find(d => d.id == newDonor.district)?.name || '';
    const thanaName = thanas.find(t => t.id == newDonor.thana)?.name || '';

    const payload = {
      ...newDonor,
      division: divisionName,
      district: districtName,
      thana: thanaName,
    };

    try {
      const url = editingDonor
        ? `http://localhost:5000/api/donors/${editingDonor._id}`
        : 'http://localhost:5000/api/donors';
      const method = editingDonor ? 'put' : 'post';

      const res = await axios[method](url, payload);

      setPopup({
        message: editingDonor ? 'Donor updated successfully!' : 'Donor added successfully!',
        subMessage: 'Thank you for contributing!',
      });

      if (setDonors) {
        setDonors(prev =>
          editingDonor
            ? prev.map(d => (d._id === editingDonor._id ? res.data : d))
            : [res.data, ...prev]
        );
      }

      // ⏳ Delay form closing to allow popup to show
      setTimeout(() => {
        setPopup(null);
        setEditingDonor?.(null);
        setShowForm?.(false);
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg?.includes('already registered')) {
        setPopup({
          message: 'Phone number already exists!',
          subMessage: 'Please try a different number.',
        });
      } else {
        setPopup({
          message: 'Submission failed!',
          subMessage: 'Please try again later.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="max-w-xl mx-auto mt-4 bg-white shadow-md rounded-xl p-4">
    <h2 className="text-xl font-semibold text-blue-600 mb-3">
      {editingDonor ? "Edit Donor" : "Add New Donor"}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="name"
        value={newDonor.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 border rounded-md text-sm"
      />
      <input
        name="phone"
        value={newDonor.phone}
        onChange={handlePhoneChange}
        placeholder="Phone (BD)"
        className="w-full p-2 border rounded-md text-sm"
      />

      <select
        name="bloodGroup"
        value={newDonor.bloodGroup}
        onChange={handleChange}
        className="w-full p-2 border rounded-md text-sm"
      >
        <option value="">Select Blood Group</option>
        {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <select
        name="division"
        value={newDonor.division}
        onChange={handleChange}
        className="w-full p-2 border rounded-md text-sm"
      >
        <option value="">Select Division</option>
        {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select
        name="district"
        value={newDonor.district}
        onChange={handleChange}
        className="w-full p-2 border rounded-md text-sm"
      >
        <option value="">Select District</option>
        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <select
        name="thana"
        value={newDonor.thana}
        onChange={handleChange}
        className="w-full p-2 border rounded-md text-sm"
      >
        <option value="">Select Thana</option>
        {thanas.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <input
        name="village"
        value={newDonor.village}
        onChange={handleChange}
        placeholder="Village (Optional)"
        className="w-full p-2 border rounded-md text-sm"
      />

      <label className="block text-xs font-medium text-gray-700">Last Donation Date</label>
      <DatePicker
        selected={newDonor.lastDonation ? new Date(newDonor.lastDonation) : null}
        onChange={(date) =>
          setNewDonor((prev) => ({
            ...prev,
            lastDonation: date ? date.toISOString().split('T')[0] : '',
          }))
        }
        dateFormat="yyyy-MM-dd"
        placeholderText="Choose date"
        maxDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 transition text-sm"
      />
      {formErrors.lastDonation && (
        <p className="text-red-500 text-xs">{formErrors.lastDonation}</p>
      )}

      <select
        name="gender"
        value={newDonor.gender}
        onChange={handleChange}
        className="w-full p-2 border rounded-md text-sm"
      >
        <option value="">Select Gender</option>
        {genders.map(g => <option key={g} value={g}>{g}</option>)}
      </select>

      <label className="flex items-center gap-1 text-sm">
        <input type="checkbox" name="available" checked={newDonor.available} onChange={handleChange} className="h-4 w-4" />
        Available
      </label>

      <textarea
        name="note"
        value={newDonor.note}
        onChange={handleChange}
        placeholder="Important Information: Please Note Any Medical Conditions. (Optional)"
        className="w-full p-2 border rounded-md text-sm"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : editingDonor ? "Update" : "Add"}
      </button>
    </form>

    {popup && (
      <CustomPopup
        show={!!popup}
        message={popup.message}
        subMessage={popup.subMessage}
        onClose={() => setPopup(null)}
      />
    )}
  </div>
  );
};

export default AddDonorForm;
