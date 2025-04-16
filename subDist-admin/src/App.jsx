import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Campaign from "./Pages/Campaign";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import { Context } from "./main";
import Request from "./Pages/Request";
import Alert from "./Pages/Alert";
import HospitalRequest from "./Pages/HospitalRequest";
import axios from "axios";

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  // Fetch user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/auth/profileSubDistAdmin/${user.id}`,
            { withCredentials: true }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAuthenticated(false);
          setUser(null);
        }
      };

      fetchUser();
    }
  }, [isAuthenticated, user, setIsAuthenticated, setUser]);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/hosprequest"
          element={isAuthenticated ? <HospitalRequest /> : <Login />}
        />
        <Route
          path="/request"
          element={isAuthenticated ? <Request /> : <Login />}
        />
        <Route
          path="/campaign"
          element={isAuthenticated ? <Campaign /> : <Login />}
        />
        <Route
          path="/alert"
          element={isAuthenticated ? <Alert /> : <Login />}
        />
      </Routes>
    </Router>
  );
}

export default App;
