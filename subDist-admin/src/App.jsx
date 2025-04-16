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

function App() {
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Fetching user data...");
      console.log(user.id);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/auth/profileSubDistAdmin/${user.id}`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setUser(response.data);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };

    fetchUser();
  }, [setIsAuthenticated, setUser]);

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
