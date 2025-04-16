import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Campaign from "./Pages/Campaign";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

import Request from "./Pages/Request";
import Alert from "./Pages/Alert";
import HospitalRequest from "./Pages/HospitalRequest";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hosprequest" element={<HospitalRequest />} />
        <Route path="/request" element={<Request />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/alert" element={<Alert />} />
      </Routes>
    </Router>
  );
}

export default App;
