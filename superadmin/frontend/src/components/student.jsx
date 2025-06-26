import React, { useState, useEffect } from "react";
import axios from "axios";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [uniqueCourses, setUniqueCourses] = useState([]);
  const [uniqueBatches, setUniqueBatches] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/students");
    const studentList = res.data;

    setStudents(studentList);
    setFilteredStudents(studentList);

    const courses = [...new Set(studentList.map((s) => s.course))];
    const batches = [...new Set(studentList.map((s) => s.batch))];

    setUniqueCourses(courses);
    setUniqueBatches(batches);
  } catch (err) {
    console.error("Failed to fetch students", err);
  }
};

useEffect(() => {
  filterStudents();
}, [searchText, selectedCourse, selectedBatch, students]);

const filterStudents = () => {
  const filtered = students.filter((student) => {
    const nameMatch = student.user?.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase());
    const courseMatch = selectedCourse === "All" || student.course === selectedCourse;
    const batchMatch = selectedBatch === "All" || student.batch === selectedBatch;

    return nameMatch && courseMatch && batchMatch;
  });
  setFilteredStudents(filtered);
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Student Management</h1>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded shadow p-4 text-center">
          <h4 className="text-sm text-gray-500">Total Students</h4>
          <p className="text-xl font-semibold">{filteredStudents.length}</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 px-4 py-2 rounded border bg-white"
          />
          <div className="flex items-center gap-4">
  {/* Course Dropdown */}
  <div className="relative">
    <select
      value={selectedCourse}
      onChange={(e) => setSelectedCourse(e.target.value)}
      className="appearance-none px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All Courses</option>
      {uniqueCourses.map((course, idx) => (
        <option key={idx} value={course}>{course}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>

  {/* Batch Dropdown */}
  <div className="relative">
    <select
      value={selectedBatch}
      onChange={(e) => setSelectedBatch(e.target.value)}
      className="appearance-none px-4 py-2 pr-8 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All Batches</option>
      {uniqueBatches.map((batch, idx) => (
        <option key={idx} value={batch}>{batch}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>

        </div>

        {/* Table */}
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="py-2">Student Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Phone</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
  {filteredStudents.length > 0 ? (
    filteredStudents.map((student, idx) => (
      <tr key={idx} className="border-t hover:bg-gray-50">
        <td className="py-3">{student.user?.name}</td>
        <td>{student.user?.email}</td>
        <td>{student.course}</td>
        <td>{student.batch}</td>
        <td>{student.phone}</td>
        <td>{new Date(student.dob).toLocaleDateString()}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center py-4 text-gray-500">
        No students found.
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Student;
