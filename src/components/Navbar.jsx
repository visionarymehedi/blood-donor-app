import React, { useState } from 'react';
import { Search } from 'lucide-react';
// import AddDonorForm from './AddDonorForm'; // Removed import

const Navbar = ({ searchQuery, setSearchQuery }) => {
  // const [showFormModal, setShowFormModal] = useState(false); // Removed state

  // const handleAddDonorClick = () => { // Removed function
  //   setShowFormModal(true);
  // };

  return (
    <>
      {/* Outer Nav container */}
      <nav className="bg-white border-b border-gray-200 shadow-sm py-6 px-4 sm:px-8 lg:px-16 w-full">
        {/* Centered Max-Width Wrapper */}
        {/* Added 'relative' here so the absolute button positions relative to this container */}
        <div className="w-full max-w-screen-lg mx-auto relative flex flex-col items-center gap-6"> {/* Adjust max-w-screen-lg as needed */}

          {/* Centered: Logo + Title */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none hover:opacity-80 transition-opacity duration-200"
            onClick={() => window.location.href = '/'}
          >
            <img src="/logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            <span className="text-2xl sm:text-3xl font-bold text-red-600 flex items-center gap-2">
              Blood Donor
            </span>
          </div>

          {/* Centered Search (within the flex column) */}
          <div className="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2"> {/* Adjusted widths again slightly */}
            <input
              type="text"
              placeholder="Search by name, phone, location, blood group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>

          {/* The entire "Add Donor" section is now completely removed */}

        </div> {/* End of Centered Max-Width Wrapper */}
      </nav>

      {/* Add Donor Form Modal (now also removed as it's no longer triggered here) */}
      {/* {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Register as a New Donor</h2>
            <AddDonorForm
              setShowForm={setShowFormModal}
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export default Navbar;