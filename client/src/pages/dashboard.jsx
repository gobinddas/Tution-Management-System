import React from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar at the top */}
      <Navbar />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#fff7f2]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;