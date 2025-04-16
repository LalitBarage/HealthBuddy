import React, { useState, useContext } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/loginSubDistAdmin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { subDistAdmin, token, message } = response.data;

      if (subDistAdmin && token) {
        // Just store data in context (no localStorage)
        setUser(subDistAdmin);
        setIsAuthenticated(true);

        console.log("Login success:", subDistAdmin);
        navigate("/");
      } else {
        alert(message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        <h2 className="text-4xl font-extrabold text-center text-[#0ba9bb] mb-8">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-[#0ba9bb]" />
            <input
              type="email"
              required
              placeholder="Email"
              className="pl-10 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba9bb] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-[#0ba9bb]" />
            <input
              type="password"
              required
              placeholder="Password"
              className="pl-10 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0ba9bb] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#0ba9bb] to-[#99ccff] hover:from-[#0990a5] hover:to-[#7fbfff] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
