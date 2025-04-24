import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import AddDonorForm from './AddDonorForm';

const FilterPanel = ({ selectedGroup, setSelectedGroup, clearFilters, donors }) => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  const [showAddDonorModal, setShowAddDonorModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchData = async (file) => {
          const res = await fetch(`/locations/${file}.json`);
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status} while fetching ${file}.json`);
          }
          const json = await res.json();
          return json.find(item => item.type === 'table')?.data || [];
        };

        const [dvs, dts, ups] = await Promise.all([
          fetchData('division'),
          fetchData('district'),
          fetchData('upazila'),
        ]);

        setDivisions(dvs);
        setDistricts(dts);
        setUpazilas(ups);

        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Ensure donors is always an array
  const filteredDonors = (donors || []).filter((donor) => {
    return (
      (!selectedGroup || donor.bloodGroup === selectedGroup) &&
      (!selectedDivision || donor.division === selectedDivision) &&
      (!selectedDistrict || donor.district === selectedDistrict) &&
      (!selectedUpazila || donor.upazila === selectedUpazila)
    );
  });

  const filteredDistricts = districts.filter(
    (d) => selectedDivision && String(d.division_id) === String(selectedDivision)
  );

  const filteredUpazilas = upazilas.filter(
    (u) => selectedDistrict && String(u.district_id) === String(selectedDistrict)
  );

  const resetFrom = (level) => {
    if (level === 'division') {
      setSelectedDistrict('');
      setSelectedUpazila('');
    } else if (level === 'district') {
      setSelectedUpazila('');
    }
  };

  const handleAddDonorClick = () => {
    setShowAddDonorModal(true);
  };

  // Render loading state
  if (loading) {
    return (
      <aside className="w-full sm:w-64 bg-gray-50 dark:bg-gray-900 p-5 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="text-center text-gray-500 dark:text-gray-400">Loading filters...</div>
      </aside>
    );
  }

  // Render error state
  if (error) {
    return (
      <aside className="w-full sm:w-64 bg-gray-50 dark:bg-gray-900 p-5 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <p className="text-red-600 dark:text-red-400">Error loading location data.</p>
        <p className="text-xs text-gray-500">{error.message}</p>
      </aside>
    );
  }

  // Render the main filter panel
  return (
    <>
      <aside className="w-full sm:w-64 bg-gray-50 dark:bg-gray-900 p-5 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        {/* Add Donor Button */}
        <div className="mb-6">
          <button
            onClick={handleAddDonorClick}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-gray-100 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform duration-150 ease-in-out dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:ring-red-600"
          >
            <PlusCircle size={20} className="mr-2 text-red-600" />
            Add New Donor
          </button>
        </div>

        {/* Blood Group Section */}
        <div className="mb-4 p-2 bg-red-600 rounded-md shadow-sm">
          <h3 className="text-lg text-white font-semibold text-center">Blood Group</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'O+ Positive', 'O- Negative', 'AB+ Positive', 'AB- Negative'].map(group => (
            <button
              key={group}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border duration-150 active:scale-95 shadow-sm
                ${selectedGroup === group
                  ? 'bg-red-500 text-white border-red-600 ring-2 ring-offset-1 ring-red-400 dark:ring-offset-gray-900'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              onClick={() => setSelectedGroup(group === selectedGroup ? '' : group)}
            >
              {group}
            </button>
          ))}
        </div>

        {/* Division Selection */}
        <div className="mb-4 p-2 bg-blue-600 rounded-md shadow-sm">
          <h3 className="text-lg text-white font-semibold text-center">Division</h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {divisions.map(division => (
            <button
              key={division.id}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border duration-150 active:scale-95 shadow-sm
                ${String(selectedDivision) === String(division.id)
                  ? 'bg-blue-500 text-white border-blue-600 ring-2 ring-offset-1 ring-blue-400 dark:ring-offset-gray-900'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}
              onClick={() => {
                const newSelection = String(selectedDivision) === String(division.id) ? '' : String(division.id);
                setSelectedDivision(newSelection);
                if (newSelection) resetFrom('division');
              }}
            >
              {division.name}
            </button>
          ))}
        </div>

        {/* District Selection */}
        {selectedDivision && (
          <>
            <div className="mb-4 p-2 bg-green-600 rounded-md shadow-sm">
              <h3 className="text-lg text-white font-semibold text-center">District</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {filteredDistricts.length > 0 ? filteredDistricts.map(district => (
                <button
                  key={district.id}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border duration-150 active:scale-95 shadow-sm
                    ${String(selectedDistrict) === String(district.id)
                      ? 'bg-green-500 text-white border-green-600 ring-2 ring-offset-1 ring-green-400 dark:ring-offset-gray-900'
                      : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                  onClick={() => {
                    const newSelection = String(selectedDistrict) === String(district.id) ? '' : String(district.id);
                    setSelectedDistrict(newSelection);
                    if (newSelection) resetFrom('district');
                  }}
                >
                  {district.name}
                </button>
              )) : <p className="text-sm text-gray-500 dark:text-gray-400">No districts in this division.</p>}
            </div>
          </>
        )}

        {/* Upazila Selection */}
        {selectedDistrict && (
          <>
            <div className="mb-4 p-2 bg-yellow-600 rounded-md shadow-sm">
              <h3 className="text-lg text-white font-semibold text-center">Upazila</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {filteredUpazilas.length > 0 ? filteredUpazilas.map(upazila => (
                <button
                  key={upazila.id}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border duration-150 active:scale-95 shadow-sm
                    ${String(selectedUpazila) === String(upazila.id)
                      ? 'bg-yellow-500 text-white border-yellow-600 ring-2 ring-offset-1 ring-yellow-400 dark:ring-offset-gray-900'
                      : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700'}`}
                  onClick={() => {
                    const newSelection = String(selectedUpazila) === String(upazila.id) ? '' : String(upazila.id);
                    setSelectedUpazila(newSelection);
                  }}
                >
                  {upazila.name}
                </button>
              )) : <p className="text-sm text-gray-500 dark:text-gray-400">No upazilas in this district.</p>}
            </div>
          </>
        )}

        {/* Reset Filters Button */}
        {(selectedGroup || selectedDivision || selectedDistrict || selectedUpazila) && (
          <button
            className="w-full bg-gray-200 mt-4 px-4 py-2 text-sm rounded-lg hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white transition-all duration-150 active:scale-95"
            onClick={() => {
              clearFilters();
              setSelectedDivision('');
              setSelectedDistrict('');
              setSelectedUpazila('');
            }}
          >
            ⟳ Reset All Filters
          </button>
        )}
      </aside>

      {/* Add Donor Form Modal */}
      {showAddDonorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up">
            <button
              onClick={() => setShowAddDonorModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-2xl leading-none font-bold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Register as a New Donor</h2>
            <AddDonorForm setShowForm={setShowAddDonorModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
