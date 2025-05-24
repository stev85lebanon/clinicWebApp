import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, AuthContext } from './contexts/AuthContext'; // also import AuthContext
import { DoctorContext } from './contexts/DoctorContext';

import ProtectedRoute from './user/ProtectedRoute';
import Header from './user/Header';
import Home from './user/Home';
import Book from './user/Book';
import Login from './user/Login';
import Register from './user/Register';
import Notfoundpage from './user/Notfoundpage';
import PaymentPage from './user/PaymentPage';
import AboutDoctor from './user/AboutDoctor';
import DoctorDetails from './user/DoctorDetails';
import AdminDashboard from './admin/AdminDashboard';
import AppointmentsPage from './admin/AppointmentsPage';
import AdminAddDoctor from './admin/AdminAddDoctor';
import StripeWrapper from './user/StripeWrapper';
import DoctorDashboard from './doctor/DoctorDashboard';
import DoctorAppintment from './doctor/DoctorAppintment';

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext); // 👈 Get auth state
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDoctors();
    }
  }, [isAuthenticated]); // 👈 Only refetch when user is logged in

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch('https://clinikapp.onrender.com/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch doctors');

      const data = await res.json();
      setDoctors(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load doctors');
    } finally {
      setLoading(false);
    }
  };
  console.log(doctors)
  return (
    <DoctorContext.Provider value={{ doctors, loading, error, refetch: fetchDoctors }}>
      <Box sx={{ minHeight: '100vh', p: 3 }}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/book" element={<ProtectedRoute><Book /></ProtectedRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/admin-appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
            <Route path="/doctor-appointments" element={<ProtectedRoute><DoctorAppintment /></ProtectedRoute>} />
            <Route path="/admin-add-doctors" element={<ProtectedRoute><AdminAddDoctor /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/details">
              <Route index element={<ProtectedRoute><AboutDoctor /></ProtectedRoute>} />
              <Route path=":id" element={<ProtectedRoute><DoctorDetails /></ProtectedRoute>} />
            </Route>
            {/* <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} /> */}
            <Route path="/payment" element={<ProtectedRoute><StripeWrapper /></ProtectedRoute>} />
            <Route path="*" element={<Notfoundpage />} />
          </Routes>
        </Router>
      </Box>
    </DoctorContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
