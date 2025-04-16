import React, { useState } from "react";
import { FaEnvelope, FaLock, FaMapPin } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pincode, setPincode] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password, "Pincode:", pincode);
    // Add your registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-[#0ba9bb] mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-[#0ba9bb]" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba9bb] transition"
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-[#0ba9bb]" />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba9bb] transition"
            />
          </div>
          <div className="relative">
            <FaMapPin className="absolute top-3.5 left-3 text-[#0ba9bb]" />
            <input
              type="text"
              required
              placeholder="Pincode"
              maxLength="6"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="pl-10 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba9bb] transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0ba9bb] to-[#99ccff] hover:from-[#0990a5] hover:to-[#7fbfff] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
          >
            Register
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#0ba9bb] font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
