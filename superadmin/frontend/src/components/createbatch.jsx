import React, { useState } from "react";
import axios from "axios";
import { FaUpload, FaUserPlus, FaDownload } from "react-icons/fa";
import Topbar from './topbar';

export default function CreateBatch({ batchId, course }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState({});
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/upload/upload", formData);
      setStudents(res.data.students);
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (email) => {
    setSelected((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  const handleSave = async () => {
  const selectedList = students
    .filter((stu) => selected[stu.email])
    .map((stu) => ({
      ...stu,
      course,
      batch: batchId,
    }));

  setSaving(true);
  try {
    const res = await axios.post("http://localhost:5000/api/students/save-selected", selectedList);
    setCredentials(res.data.credentials);
    alert("Students added successfully");
  } catch (err) {
    alert("Error saving students");
  } finally {
    setSaving(false);
  }
};


  const handleDownloadCSV = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/students/download-credentials",
        credentials,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "credentials.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download CSV");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-white via-blue-50 to-white min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-10 flex items-center gap-4">
          <FaUserPlus className="text-blue-500" /> Upload & Assign Students
        </h2>

        <div className="flex justify-center mb-10">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-3 px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 cursor-pointer transition"
          >
            <FaUpload /> {loading ? "Uploading..." : "Upload Excel"}
          </label>
          <input id="file-upload" type="file" className="hidden" onChange={handleUpload} accept=".xlsx, .xls, .csv" />
        </div>

        {students.length > 0 && (
          <>
            <div className="overflow-x-auto mb-6 rounded-xl border border-blue-100 shadow">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-blue-100 text-blue-900 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 text-left">Select</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu, i) => (
                    <tr key={i} className="border-t border-gray-200 hover:bg-blue-50 transition">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          onChange={() => toggleSelect(stu.email)}
                          checked={!!selected[stu.email]}
                        />
                      </td>
                      <td className="p-4">{stu.name}</td>
                      <td className="p-4">{stu.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition ${
                saving ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {saving ? "Saving..." : "Add Selected Students"}
            </button>

            {credentials.length > 0 && (
              <button
                onClick={handleDownloadCSV}
                className="w-full py-3 mt-4 text-lg font-semibold text-white rounded-xl bg-yellow-500 hover:bg-yellow-600 transition"
              >
                <FaDownload className="inline mr-2" /> Download Credentials CSV
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

