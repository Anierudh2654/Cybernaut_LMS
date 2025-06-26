import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Topbar from './components/topbar';
import Home from './components/home';
import Admins from './components/admin';
import Salary from './components/salary';
import Batches from './components/batches';
import Payment from './components/payment';
import CreateBatch from './components/createbatch';
import StudentList from './components/studentlist';
import TopPerformers from './components/topperformers';
import Courses from './components/courses';
import Student from './components/student';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const routeTitles = {
  '/': 'Dashboard',
  '/admins': 'Admin Management',
  '/salary': 'Salary Management',
  '/batches': 'Batch Management',
  '/courses': 'Course Management',
  '/students' : 'Student Management',
};

const AppContent = () => {
  const location = useLocation();
  const pageTitle = routeTitles[location.pathname] || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar pageTitle={pageTitle} />
        <ToastContainer position="top-right" autoClose={3000} />
        <main className="flex-1 transition-all duration-300 ease-in-out p-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/students" element={<Student />} />
            <Route path="/courses" element={<Courses />} />
            <Route path='/salary' element = {<Payment/>} />

          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
