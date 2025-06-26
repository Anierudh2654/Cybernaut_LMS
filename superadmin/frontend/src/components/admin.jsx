import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaChalkboardTeacher, FaEdit, FaTrash
} from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';

export default function Admins() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    salary: '',
    specialisation: '',
    upi: '',
    dob: ''
  });
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    const res = await axios.get('http://localhost:5000/api/admins');
    setAdmins(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/admins/${id}`);
    fetchAdmins();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    salary: formData.salary,
    specialisation: formData.specialisation.split(',').map(s => s.trim()),
    upi: formData.upi,
    dob: formData.dob
  };

  try {
    if (isEditing) {
      await axios.put(`http://localhost:5000/api/admins/${editingId}`, payload);
      alert("Lecturer updated.");
    } else {
      const res = await axios.post('http://localhost:5000/api/admins', payload);
      setGeneratedPassword(res.data.generatedPassword);
      alert(`Lecturer added. Temporary password: ${res.data.generatedPassword}`);
    }

    setFormData({ name: '', email: '', phone: '', salary: '', specialisation: '', upi: '', dob: '' });
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    fetchAdmins();
  } catch (err) {
    alert("Error: " + (err.response?.data?.error || err.message));
  }
};
  const handleEdit = (admin) => {
  setFormData({
    name: admin.user?.name || '',
    email: admin.user?.email || '',
    phone: admin.phone || '',
    salary: admin.salary || '',
    specialisation: (admin.specialisation || []).join(', '),
    upi: admin.upi || '',
    dob: admin.dob ? admin.dob.split('T')[0] : ''
  });
  setEditingId(admin._id);
  setIsEditing(true);
  setShowModal(true);
};


  const filteredAdmins = admins.filter(admin =>
    admin.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lecturer Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <MdPersonAdd className="mr-2" /> Add Lecturer
        </button>
      </div>

      <input
        type="text"
        placeholder="Search lecturers..."
        className="border px-4 py-2 rounded w-full mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-6">
        {filteredAdmins.map((admin) => (
          <div
            key={admin._id}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">{admin.user?.name}</h3>
            <p className="text-gray-600">{admin.specialisation?.join(', ')}</p>
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <div><FaEnvelope className="inline mr-2 text-gray-500" /> {admin.user?.email}</div>
              <div><FaPhone className="inline mr-2 text-gray-500" /> {admin.phone}</div>
              <div><FaChalkboardTeacher className="inline mr-2 text-gray-500" /> {admin.batchCount || 0} Batches</div>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-blue-600 font-bold">₹{admin.salary}</span>
              <div className="space-x-4">
                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(admin)}><FaEdit /></button>
                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(admin._id)}><FaTrash /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Lecturer' : 'Add New Lecturer'}</h3>
              <button onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setEditingId(null);
                }} className="text-gray-600 text-lg">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border px-4 py-2 rounded"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-4 py-2 rounded"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border px-4 py-2 rounded"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Specialisation (comma separated)"
                className="w-full border px-4 py-2 rounded"
                value={formData.specialisation}
                onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="UPI"
                className="w-full border px-4 py-2 rounded"
                value={formData.upi}
                onChange={(e) => setFormData({ ...formData, upi: e.target.value })}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                className="w-full border px-4 py-2 rounded"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Monthly Salary"
                className="w-full border px-4 py-2 rounded"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {isEditing ? 'Update Lecturer' : 'Add Lecturer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
