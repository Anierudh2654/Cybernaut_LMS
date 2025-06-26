import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';


ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
  totalStudents: 0,
  totalLecturers: 0,
  activeBatches: 0,
});

const [overview, setOverview] = useState(null);

useEffect(() => {
  const fetchOverview = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/system/overview");
      setOverview(res.data);
    } catch (err) {
      console.error("Failed to load overview", err);
    }
  };

  fetchOverview();
}, []);

  

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats')
      .then(response => setStats(response.data))
      .catch(error => console.error('Error fetching stats:', error));

    
  }, []);

  

  return (
  <>
  
  <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen text-black">
    

    <h2 className="text-3xl font-bold text-blue-900 mb-6">Welcome, Super Admin</h2>
    <p className="text-blue-700 mb-8">Manage your institution's learning ecosystem from this central dashboard</p>

    {/* Metric Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-md">
    <h3 className="text-sm text-gray-500">Total Lecturers</h3>
    <p className="text-3xl font-bold text-blue-700">{stats.totalLecturers}</p>
    {/*<p className="text-sm text-green-600 mt-1">+3 this month</p>*/}
  </div>
  <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-md">
    <h3 className="text-sm text-gray-500">Active Batches</h3>
    <p className="text-3xl font-bold text-blue-700">{stats.activeBatches}</p>
    {/*<p className="text-sm text-green-600 mt-1">+2 starting soon</p>*/}
  </div>
  <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-md">
    <h3 className="text-sm text-gray-500">Total Students</h3>
    <p className="text-3xl font-bold text-blue-700">{stats.totalStudents}</p>
    {/*<p className="text-sm text-green-600 mt-1">+89 this week</p>*/}
  </div>
</div>


    {/* Action Buttons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <button onClick={() => navigate("/admins")} className="bg-white border border-blue-200 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition">Add New Lecturer</button>
      <button onClick={() => navigate("/courses")} className="bg-white border border-blue-200 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition">Manage Courses</button>
      <button onClick={() => navigate("/batches")} className="bg-white border border-blue-200 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition">Batch Management</button>
      <button onClick={() => navigate("/salary")} className="bg-white border border-blue-200 text-blue-700 py-3 rounded-xl font-medium hover:bg-blue-50 transition">Pay Salary</button>
    </div>

    {/* System Overview Placeholder */}
    <div className="bg-white border border-blue-100 rounded-xl shadow-md p-6">
      <h3 className="text-xl font-semibold text-blue-900 mb-4">System Overview</h3>
      <div className="text-sm space-y-2">
  <p><strong>Server Status:</strong> 
    <span className="text-green-600">{" "}{overview?.serverStatus}</span>
  </p>
  <p><strong>Database Health:</strong> 
    <span className={`${
      overview?.dbHealth === "healthy" ? "text-green-600" : "text-red-500"
    }`}>
      {overview?.dbHealth === "healthy" ? " Excellent" : " Unhealthy"}
    </span>
  </p>
  <p><strong>Active Sessions : </strong>{" "}{overview?.activeSessions}</p>
  <p><strong>Storage Used:</strong> 
    <span className={overview?.storageUsed > 80 ? "text-red-600" : "text-orange-500"}>
      {" "}{overview?.storageUsed}%
    </span>
  </p>
</div>
    </div>
  </div>
  </>
);

};

export default Home;
