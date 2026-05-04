import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import Departments from './pages/admin/Departments';
import LeaveApprovals from './pages/admin/LeaveApprovals';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyProfile from './pages/employee/MyProfile';
import LeaveRequests from './pages/employee/LeaveRequests';
import Attendance from './pages/employee/Attendance';
import SalaryDetails from './pages/employee/SalaryDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roleRequired="admin">
            <Layout title="Admin Dashboard" />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="departments" element={<Departments />} />
          <Route path="leaves" element={<LeaveApprovals />} />
        </Route>
        
        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute roleRequired="employee">
            <Layout title="Employee Portal" />
          </ProtectedRoute>
        }>
          <Route index element={<EmployeeDashboard />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="leaves" element={<LeaveRequests />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="salary" element={<SalaryDetails />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
