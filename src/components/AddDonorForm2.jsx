import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomPopup from './CustomPopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';
import '../styles/dropdown.css'; // Import the dropdown CSS file
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Phone,
  Droplet,
  MapPin,
  Home,
  Calendar,
  Heart,
  CheckCircle,
  Pencil,
} from 'lucide-react';

const containerVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const headingVariants = {
  initial: { x: -10, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 0.4, ease: 'easeOut' } },
};

const inputVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const selectVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring', stiffness: 100 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const popupVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

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
    addedByAdmin: editingDonor?.addedByAdmin !== undefined ? editingDonor.addedByAdmin : true,
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
      status: 'approved', // Auto-approve non-pending submissions
      addedByAdmin: true,
    };

    try {
      const url = editingDonor
        ? `http://localhost:5000/api/donors/${editingDonor._id}`
        : 'http://localhost:5000/api/donors/admin';
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
    <motion.div
    className='max-w-xl mx-auto mt-4 px-2'
      style={{ backgroundColor: '#red' }} // Professional background color
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.h2
        className="text-2xl font-semibold text-red-500 mb-4 flex items-center gap-2"
        variants={headingVariants}
        initial="initial"
        animate="animate"
      >
        {editingDonor ? <Pencil size={24} className="animate-pulse" /> : <Heart size={24} className="animate-bounce" />}
        {editingDonor ? 'Edit Donor Details' : 'Add New Blood Donor'}
      </motion.h2>

      <motion.form onSubmit={handleSubmit} className="space-y-3" layout>
        <motion.div className="relative" variants={inputVariants}>
          <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            name="name"
            value={newDonor.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 pl-10 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </motion.div>

        <motion.div className="relative" variants={inputVariants}>
          <Phone className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="tel"
            name="phone"
            value={newDonor.phone}
            onChange={handlePhoneChange}
            placeholder="Phone (BD)"
            className="w-full p-3 pl-10 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </motion.div>

        <motion.select
          name="bloodGroup"
          value={newDonor.bloodGroup}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition donor-select blood-group-select" // Added CSS classes
          variants={selectVariants}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </motion.select>

        <motion.select
          name="division"
          value={newDonor.division}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition donor-select division-select" // Added CSS classes
          variants={selectVariants}
        >
          <option value="">Select Division</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </motion.select>

        <motion.select
          name="district"
          value={newDonor.district}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition donor-select district-select" // Added CSS classes
          variants={selectVariants}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </motion.select>

        <motion.select
          name="thana"
          value={newDonor.thana}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition donor-select thana-select" // Added CSS classes
          variants={selectVariants}
        >
          <option value="">Select Thana</option>
          {thanas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </motion.select>

        <motion.div className="relative" variants={inputVariants}>
          <Home className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            name="village"
            value={newDonor.village}
            onChange={handleChange}
            placeholder="Village (Optional)"
            className="w-full p-3 pl-10 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </motion.div>

        <motion.div variants={inputVariants} layout>
          <label className="block text-sm font-medium text-gray-700">Last Donation Date</label>
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
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition text-sm"
          />
          {formErrors.lastDonation && (
            <p className="text-red-500 text-xs">{formErrors.lastDonation}</p>
          )}
        </motion.div>

        <motion.select
          name="gender"
          value={newDonor.gender}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition donor-select gender-select" // Added CSS classes
          variants={selectVariants}
        >
          <option value="">Select Gender</option>
          {genders.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </motion.select>

        <motion.label className="flex items-center gap-2 text-sm" variants={inputVariants} layout>
          <input
            type="checkbox"
            name="available"
            checked={newDonor.available}
            onChange={handleChange}
            className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 transition"
          />
          Available for Donation <CheckCircle size={16} className={newDonor.available ? 'text-green-500 animate-pulse' : 'text-gray-400'} />
        </motion.label>

        <motion.textarea
          name="note"
          value={newDonor.note}
          onChange={handleChange}
          placeholder="Important Information: Please Note Any Medical Conditions. (Optional)"
          className="w-full p-3 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 transition"
          rows="3"
          variants={inputVariants}
        />

        <motion.button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition text-sm font-semibold"
          disabled={isSubmitting}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          layout
        >
          {isSubmitting ? <motion.span className="animate-pulse">Submitting...</motion.span> : editingDonor ? 'Update Donor' : 'Add Donor'}
        </motion.button>
      </motion.form>
      <AnimatePresence>
        {popup && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg rounded-md p-6 z-50"
            variants={popupVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <h3 className="text-lg font-semibold text-green-600 mb-2">{popup.message}</h3>
            {popup.subMessage && <p className="text-sm text-gray-600 mb-3">{popup.subMessage}</p>}
            <motion.button
              onClick={() => setPopup(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm focus:outline-none"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Okay
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddDonorForm;