// src/pages/admin/AdminLayout.jsx
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-6 border-r">
        <h2 className="font-bold text-xl mb-6">Admin Panel</h2>

        {/* Sidebar Links */}
        <NavLink to="/admin/dashboard" className="block mb-3">
          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            View All Donors
          </button>
        </NavLink>

        <NavLink to="/admin/pending" className="block mb-3">
          <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
            View Pending Requests
          </button>
        </NavLink>

        <NavLink to="/admin/stats" className="block mb-3">
          <button className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600">
            📊 Blood Group Stats
          </button>
        </NavLink>

        <NavLink to="/admin/add" className="block">
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            + Add New Donor
          </button>
        </NavLink>
        <NavLink to="/admin/rejected"> {/* Add this Link */}
          <button className="w-full mb-3 bg-red-500 text-white py-2 rounded hover:bg-red-600">
            View Rejected Donors
          </button>
        </NavLink>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
