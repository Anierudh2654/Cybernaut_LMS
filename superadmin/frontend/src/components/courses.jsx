import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import fullstack from '../assets/fullstack.jpg';
import dataanalytics from '../assets/dataanalytics.jpg';

const courseImages = {
  "Full Stack Development": fullstack,
  "Data Science": dataanalytics,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newModules, setNewModules] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    axios.get("http://localhost:5000/api/courses")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourses(res.data);
        }
      })
      .catch((err) => console.error("Error fetching courses:", err));
  };

  const handleAddCourse = () => {
    const newCourse = {
      courseName: newCourseName.trim(),
      modules: newModules.split(',').map(mod => mod.trim()),
    };
    axios.post("http://localhost:5000/api/courses", newCourse)
      .then(() => {
        fetchCourses();
        setShowModal(false);
        setNewCourseName("");
        setNewModules("");
      })
      .catch(err => console.error("Error adding course:", err));
  };

  return (
    <div className="p-6 space-y-8 text-blue-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Add New Course
        </button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course._id} className="border p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{course.courseName}</h2>
                <p className="text-sm text-gray-500 mt-1">Modules: {course.modules.join(', ')}</p>
                <p className="mt-2 text-sm text-gray-700"><strong>Students:</strong> {course.students}</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Edit</button>
              <button className="px-3 py-1 text-sm bg-red-200 text-red-800 rounded hover:bg-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold text-blue-700">Add New Course</h2>
            <input
              type="text"
              placeholder="Course Name"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Modules (comma separated)"
              value={newModules}
              onChange={(e) => setNewModules(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
