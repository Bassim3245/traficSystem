import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VehicleRegistration from './components/VehicleRegistration';
import NewViolation from './components/NewViolation';
import ViolationsList from './components/ViolationsList';
import Layout from './components/Layout';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="register-vehicle" element={<VehicleRegistration />} />
          <Route path="new-violation" element={<NewViolation />} />
          <Route path="violations" element={<ViolationsList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
