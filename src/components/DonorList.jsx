import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Assuming Navbar.js is in the same directory
import DonorCard from './DonorCard'; // Assuming you have a component to display each donor

const DonorList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Replace this with your actual data fetching logic
        const response = await fetch(`/api/donors?q=${searchQuery}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
        setSearchResults([]); // Ensure searchResults is empty on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search for better performance
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        fetchData();
      } else {
        setSearchResults([]); // Clear results when search query is empty
      }
    }, 300);

    return () => clearTimeout(debounceTimer); // Cleanup on unmount or re-render
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto py-8">
        {loading && <p className="text-center text-gray-600">Loading donors...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {/* Display different content based on search results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map(donor => (
              <DonorCard key={donor.id} donor={donor} /> {/* Assuming DonorCard component */}
            ))}
          </div>
        ) : (
          searchQuery.trim() !== '' && !loading && !error ? (
            <p className="text-center text-gray-500">No donors found matching your search.</p>
          ) : (
            <p className="text-center text-gray-500">Search for donors using the bar above.</p>
          )
        )}
      </div>
    </div>
  );
};

export default DonorList;