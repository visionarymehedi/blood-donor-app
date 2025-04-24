import { useEffect, useState } from "react";

const LocationSelectorToggle = ({ onLocationChange }) => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [unions, setUnions] = useState([]);

  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedUpazila, setSelectedUpazila] = useState(null);
  const [selectedUnion, setSelectedUnion] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const fetchData = async (file) => {
        const res = await fetch(`/locations/${file}.json`);
        const json = await res.json();
        return json.find(item => item.type === 'table')?.data || [];
      };

      const [dvs, dts, ups, uns] = await Promise.all([
        fetchData("division"),
        fetchData("district"),
        fetchData("upazila"),
        fetchData("union"),
      ]);

      setDivisions(dvs);
      setDistricts(dts);
      setUpazilas(ups);
      setUnions(uns);
    };

    loadData();
  }, []);

  const filteredDistricts = districts.filter(d => String(d.division_id) === String(selectedDivision));
  const filteredUpazilas = upazilas.filter(u => String(u.district_id) === String(selectedDistrict));
  const filteredUnions = unions.filter(u => String(u.upazilla_id) === String(selectedUpazila));

  const resetFrom = (level) => {
    if (level === "division") {
      setSelectedDistrict(null);
      setSelectedUpazila(null);
      setSelectedUnion(null);
    } else if (level === "district") {
      setSelectedUpazila(null);
      setSelectedUnion(null);
    } else if (level === "upazila") {
      setSelectedUnion(null);
    }
  };

  useEffect(() => {
    if (selectedDivision && selectedDistrict && selectedUpazila && selectedUnion) {
      // Send selected location data to parent component
      onLocationChange(selectedDivision, selectedDistrict, selectedUpazila, selectedUnion);
    } else if (selectedDivision && selectedDistrict && selectedUpazila && selectedUnion === "") {
      // Send data even if "Select Union" is chosen (empty string) - adjust if needed
      onLocationChange(selectedDivision, selectedDistrict, selectedUpazila, selectedUnion);
    }
  }, [selectedDivision, selectedDistrict, selectedUpazila, selectedUnion, onLocationChange]);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Division */}
      <div>
        <label htmlFor="division" className="block text-sm font-medium text-gray-700">Select Division</label>
        <select
          id="division"
          value={selectedDivision || ""}
          onChange={(e) => {
            setSelectedDivision(e.target.value);
            resetFrom("division");
          }}
          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Division</option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>{div.name}</option>
          ))}
        </select>
      </div>

      {/* District */}
      {selectedDivision && (
        <div className="mt-4">
          <label htmlFor="district" className="block text-sm font-medium text-gray-700">Select District</label>
          <select
            id="district"
            value={selectedDistrict || ""}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              resetFrom("district");
            }}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select District</option>
            {filteredDistricts.map((dis) => (
              <option key={dis.id} value={dis.id}>{dis.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Upazila */}
      {selectedDistrict && (
        <div className="mt-4">
          <label htmlFor="upazila" className="block text-sm font-medium text-gray-700">Select Upazila</label>
          <select
            id="upazila"
            value={selectedUpazila || ""}
            onChange={(e) => {
              setSelectedUpazila(e.target.value);
              resetFrom("upazila");
            }}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Upazila</option>
            {filteredUpazilas.map((upz) => (
              <option key={upz.id} value={upz.id}>{upz.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Union */}
      {selectedUpazila && (
        <div className="mt-4">
          <label htmlFor="union" className="block text-sm font-medium text-gray-700">Select Union</label>
          <select
            id="union"
            value={selectedUnion || ""}
            onChange={(e) => setSelectedUnion(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Union</option>
            {filteredUnions.map((un) => (
              <option key={un.id} value={un.id}>{un.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelectorToggle;