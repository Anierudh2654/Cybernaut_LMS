// BatchForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function BatchForm({ onCreated }) {
  const [form, setForm] = useState({ batchName: "", course: "", startDate: "", admins: [] });
  const [courses, setCourses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [modules, setModules] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then(res =>{ 
      console.log("Courses response:", res.data);
      setCourses(res.data)

    } );
    
    axios.get("http://localhost:5000/api/users?role=admin").then(res => setStaff(res.data));
  }, []);

  const handleCourseChange = (id) => {
    const course = courses.find(c => c._id === id);
    setForm(f => ({ ...f, course: id, admins: [], batchName: "" }));
    setModules(course.modules || []);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/batches", form);
      alert("Batch created!");
      onCreated(res.data); // pass batch info to parent
    } catch (err) {
      alert(err+"Error creating batch");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Create Batch</h2>

      <input
        type="text"
        placeholder="Batch Name"
        value={form.batchName}
        onChange={e => setForm(f => ({ ...f, batchName: e.target.value }))}
        className="border p-2 mb-4 w-full rounded"
      />

      <select
        onChange={e => handleCourseChange(e.target.value)}
        value={form.course}
        className="border p-2 mb-4 w-full rounded"
      >
        <option value="">Select Course</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
      </select>

      <input
        type="date"
        value={form.startDate}
        onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
        className="border p-2 mb-4 w-full rounded"
      />

      {modules.map((mod, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <span className="w-1/3">{mod}</span>
          <select
            onChange={(e) => {
              const updated = [...form.admins];
              updated[i] = { module: mod, admin: e.target.value };
              setForm(f => ({ ...f, admins: updated }));
            }}
            className="border p-1 flex-1 rounded"
          >
            <option value="">Select Admin</option>
            {staff.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
      ))}

      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
        Create Batch
      </button>
    </div>
  );
}
