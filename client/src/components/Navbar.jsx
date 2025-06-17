import React, {useState, useEffect} from 'react';
import { Bell, Search } from 'lucide-react';
import zenith from '../assets/zenith.webp'; // Make sure the path is correct

const Navbar = () => {
  // Dummy profile image
  const profileImg = "https://i.pravatar.cc/40?img=3";

  const[userName, setUserName] = useState("");
  
  useEffect(()=>{
    const storedUser = localStorage.getItem("userData");
    if(storedUser){
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User")
        
      } catch (error) {
        console.log("Error parsing user data", error)
        setUserName("User");
      }
    }
  },[])


  return (
    <nav className="flex flex-col md:flex-row items-center justify-between bg-[#1b6896] px-4  py-3 shadow-lg  gap-3">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3">
       
        <span className="text-2xl font-extrabold tracking-tight text-[#a16f55] drop-shadow-sm select-none">
          Zenith<span className="text-white">Panther</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 w-full sm:mx-8 max-w-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2 bg-[#fff7f2] text-[#020202] border-none rounded-full focus:outline-none focus:ring-2 focus:ring-[#a16f55] shadow transition"
          />
          <Search className="absolute left-4 top-2.5 text-[#1b6896]" size={20} />
        </div>
      </div>

      {/* Right side: Notification, Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4 mt-2 sm:mt-0">
        <button className="relative p-2 rounded-full bg-[#a16f55] hover:bg-[#020202] transition-colors shadow group">
          <Bell size={22} className="text-white group-hover:text-[#a16f55] transition-colors" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 shadow">3</span>
        </button>
        <h3>{userName}</h3>
        <img
          src={profileImg}
          alt="Profile"
          className="h-10 w-10 rounded-full border-2 border-[#fff7f2] object-cover shadow"
        />
      </div>
    </nav>
  );
};

export default Navbar;