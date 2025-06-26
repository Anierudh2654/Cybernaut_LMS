import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Topbar from './topbar';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("All");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);

    const uniqueBatches = [...new Set(res.data.map(s => s.batch))];
    setBatches(uniqueBatches);
  };

  const handleBatchChange = async (e) => {
    const batch = e.target.value;
    setSelectedBatch(batch);

    if (batch === "All") {
      fetchStudents();
    } else {
      const res = await axios.get(`http://localhost:5000/api/students/batch/${batch}`);
      setStudents(res.data);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white via-blue-50 to-white min-h-screen text-gray-900">

      <h1 className="text-3xl font-bold text-blue-900 mb-8">🎓 All Students</h1>

      {/* Batch Filter */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="text-lg font-medium text-blue-800">Filter by Batch:</label>
        <select
          value={selectedBatch}
          onChange={handleBatchChange}
          className="px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
        >
          <option value="All">All</option>
          {batches.map((batch, idx) => (
            <option key={idx} value={batch}>{batch}</option>
          ))}
        </select>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto shadow-xl border border-blue-100 rounded-xl">
        <table className="min-w-full text-sm bg-white rounded-xl">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-left uppercase tracking-wider text-xs">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Batch</th>
              <th className="py-4 px-6">Course</th>
              <th className="py-4 px-6">Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr
                key={idx}
                className="border-t border-blue-50 hover:bg-blue-50 transition"
              >
                <td className="py-4 px-6">{s.user?.name}</td>
                <td className="py-4 px-6">{s.user?.email}</td>
                <td className="py-4 px-6">{s.batch}</td>
                <td className="py-4 px-6">{s.course}</td>
                <td className="py-4 px-6">{s.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
