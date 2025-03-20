import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminUpload from "./admin/AdminUpload";
import AdminEngraving from "./admin/AdminEngraving";
import AdminDashboard from "./admin/AdminDashboard";
import Auth from "./pages/Auth";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path = "/admin/upload" element={<AdminUpload />} />
        <Route path="/admin/engraving" element={<AdminEngraving />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/login" element= {<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;