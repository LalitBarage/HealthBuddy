import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Context } from "../main";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    toast.success("Logout successful!");

    // Reset auth state
    setIsAuthenticated(false);
    setUser(null); // Use `null` instead of `{}` for clarity

    // Optionally, if you're using cookies or sessions, call the backend to log out
    // axios.get("https://healthbuddy-ozon.onrender.com/api/auth/logout", { withCredentials: true });

    // Navigate to login page
    navigate("/login");
  };

  return (
    <nav className="bg-white text-[#0ba9bb] px-10 py-4 shadow-md relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl font-bold">Admin</div>

        {/* Center: Nav Links (Hidden on small screens) */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/request" className="hover:underline">
            Scheme Requests
          </Link>
          <Link to="/scheme" className="hover:underline">
            Schemes
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
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-[#0ba9bb] text-white font-semibold px-4 py-2 rounded hover:bg-[#0a9aaa] transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-[#0ba9bb] text-white font-semibold px-4 py-2 rounded hover:bg-[#0a9aaa] transition">
                Login
              </button>
            </Link>
          )}
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
            Scheme Requests
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
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full bg-[#0ba9bb] text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="block"
              onClick={() => setMenuOpen(false)}
            >
              <button className="w-full bg-[#0ba9bb] text-white px-4 py-2 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
