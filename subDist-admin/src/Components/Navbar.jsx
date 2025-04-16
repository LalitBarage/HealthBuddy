import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optional icons, use any

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white text-[#0ba9bb] px-6 py-4 shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-bold">HospitalAdmin</div>

        {/* Center: Nav Links (Hidden on small screens) */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/request" className="hover:underline">
            Requests
          </Link>
          <Link to="/hosprequest" className="hover:underline">
            Hospital Request
          </Link>
          <Link to="/campaign" className="hover:underline">
            Campaign
          </Link>
          <Link to="/alert" className="hover:underline">
            Alert
          </Link>
        </div>

        {/* Right: Login Button */}
        <div className="hidden md:block">
          <Link to="/login">
            <button className="bg-[#0ba9bb] text-white font-semibold px-4 py-2 rounded hover:bg-[#0a9aaa] transition">
              Login
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 px-6 space-y-4 text-lg font-medium">
          <Link to="/" className="block" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/request"
            className="block"
            onClick={() => setMenuOpen(false)}
          >
            Requests
          </Link>
          <Link
            to="/hosprequest"
            className="block"
            onClick={() => setMenuOpen(false)}
          >
            Hospital Requests
          </Link>
          <Link
            to="/campaign"
            className="block"
            onClick={() => setMenuOpen(false)}
          >
            Campaign
          </Link>
          <Link
            to="/alert"
            className="block"
            onClick={() => setMenuOpen(false)}
          >
            Alert
          </Link>
          <Link
            to="/login"
            className="block"
            onClick={() => setMenuOpen(false)}
          >
            <button className="w-full bg-[#0ba9bb] text-white px-4 py-2 rounded">
              Login
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
