import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, DollarSign, Calendar, Layers, ChevronLeft, ChevronRight, Menu, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={20} /> },
  { name: 'Students', path: '/students', icon: <Users size={20} /> },
  { name: 'Fee', path: '/fee', icon: <DollarSign size={20} /> },
  { name: 'Attendance', path: '/attendence', icon: <Calendar size={20} /> },
  { name: 'Batches', path: '/batch', icon: <Layers size={20} /> },
];

const NAVBAR_HEIGHT = 64; // px

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Responsive sidebar: show as drawer on mobile
  return (
    <>
      {/* Hamburger for mobile (toggle open/close) */}
      <button
        className="fixed top-2 right-2 z-40 md:hidden bg-[#1b6896] p-2 rounded-full shadow-lg text-white"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
      >
        {mobileOpen ? <ChevronLeft size={26} /> : <Menu size={26} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
     <div
  className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
  onClick={() => setMobileOpen(false)}
/>

      )}

      <aside
        className={`
          transition-all duration-300 h-screen md:h-auto
          bg-[#1b6896] shadow-xl
          fixed md:top-[${NAVBAR_HEIGHT}px] left-0 z-40 top-0
          ${collapsed ? 'w-20' : 'w-56'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:top-0
          flex flex-col
        `}
        style={{
          height: '100vh - NAVBAR_HEIGHT',
          maxHeight: '100vh ',
          minWidth: collapsed ? '60px' : '200px',
        }}
      >
        {/* Collapse Button (desktop only) */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute top-[50%] right-[-10px] bg-[#fff7f2] text-[#1b6896] rounded-md shadow p-1 hover:bg-[#a16f55] hover:text-white transition-all border border-[#a16f55] z-10 hidden md:block"
          style={{ width: 32, height: 32 }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Scrollable nav area */}
        <div className="flex-1 overflow-y-auto py-8">
          <nav className="flex flex-col gap-2 pl-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-tl-md rounded-bl-md font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'bg-[#fff7f2] text-[#1b6896] shadow'
                      : 'text-white hover:bg-[#d6cfcb27] hover:text-white'
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="transition-colors">{item.icon}</span>
                <span className={`transition-all duration-200 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto ml-2'}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
        {/* Logout Button at bottom */}
        <div className={`pl-2 ${collapsed ? 'justify-center' : ''} flex flex-col items-center mb-2`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-2 w-full px-4 py-2 rounded-tl-md rounded-bl-md font-medium
              bg-[#fff7f2] text-[#1b6896] hover:bg-red-800 hover:text-[#a16f55]
              transition-all duration-200 shadow
              ${collapsed ? 'justify-center px-2' : ''}
            `}
          >
            <LogOut size={20} />
            <span className={`${collapsed ? 'hidden' : 'inline'}`}>Logout</span>
          </button>
        </div>
        {/* Optional: Footer or version */}
        <div className={`text-xs text-[#fff7f2] font-bold text-center mb-2 opacity-70 transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>
          <span className=" text-white-900">© 2025</span> ZenithPanther
        </div>
      </aside>
    </>
  );
};

export default Sidebar;