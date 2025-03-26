import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./common/AdminLayout";
import AdminUpload from "./admin/AdminUpload";
import AdminEngraving from "./admin/AdminEngraving";
// import AdminSettings from "./admin/AdminSettings";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import AdminSettings from "./pages/AdminSettings";
import UserCategories from "./user/UserCategories";
import UserEngraving from "./user/UserEngraving";
import UserPreview from "./user/UserPreview";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="Settings" element={<AdminSettings />}/>
        </Route>
          <Route path="/admin/engraving" element={<AdminEngraving />} />

        
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        <Route path = '/forgot-password' element = {<Auth />} /> 
        <Route path = '/engraving-categories' element = {<UserCategories />} />
        <Route path="/engraving/:id" element={<UserEngraving />} />
        <Route path= '/user-preview' element={<UserPreview />} />

        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
