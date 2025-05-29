import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Components imports
import AdminLayout from './common/AdminLayout';
import AdminUpload from './admin/AdminUpload';
import AdminEngraving from './admin/AdminEngraving';
import Auth from './pages/Auth';
import Home from './pages/Home';
import AdminSettings from './pages/AdminSettings';
import UserCategories from './user/UserCategories';
import UserEngraving from './user/UserEngraving';
import UserPreview from './user/UserPreview';
import AdminMenageMessages from './pages/AdminMenageMessages';
import AdminDashboard from './admin/AdminDashboard';
import AdminEditEngraving from './admin/AdminEditEngraving';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role } = useSelector((state) => state.auth);
  // console.log()

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const ReverseProtectedRoute = ({ children }) => {
  const { role } = useSelector((state) => state.auth);

  if (role) {
    const redirectPath = ['admin', 'super_admin'].includes(role)
      ? '/admin/home'
      : '/engraving-categories';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="upload" element={<AdminUpload />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="manage-messages" element={<AdminMenageMessages />} />
          <Route path="admin-dashboard" element={<AdminDashboard/>} />
        </Route>
        <Route path="/admin/engraving" element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminEngraving />
            </ProtectedRoute>
          }
        />
        <Route path="/edit/engraving/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminEditEngraving />
          </ProtectedRoute>
        } />


        <Route path="/login" element={
          <ReverseProtectedRoute>
            <Auth />
          </ReverseProtectedRoute>
        } />
        <Route path="/signup" element={
          <ReverseProtectedRoute>
            <Auth />
          </ReverseProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ReverseProtectedRoute>
            <Auth />
          </ReverseProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />


        <Route path="/engraving-categories" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserCategories />
          </ProtectedRoute>
        } />
        <Route path="/engraving/:id" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserEngraving />
          </ProtectedRoute>
        } />
        <Route path="/user-preview" element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserPreview />
          </ProtectedRoute>
        } />

        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
};

export default App;