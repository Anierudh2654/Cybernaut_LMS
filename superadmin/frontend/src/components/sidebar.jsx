import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaHome, FaBook, FaUser, FaUsers, FaChartBar, FaFolderPlus,
  FaMoneyBill, FaCog, FaEnvelope, FaSignOutAlt
} from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const menuItems = [
  { id: "dashboard", icon: <FaHome />, label: "Dashboard", path: "/" },
  { id: "admins", icon: <FaUser />, label: "Admin Management", path: "/admins" },
  { id: "courses", icon: <FaBook />, label: "Course Management", path: "/courses" },
  { id: "batches", icon: <FaFolderPlus />, label: "Batch Management", path: "/batches" },
  { id: "students", icon: <FaUsers />, label: "Student Management", path: "/students" }, // 👈 Added
  { id: "salary", icon: <FaMoneyBill />, label: "Salary Management", path: "/salary" },
  { id: "communication", icon: <FaEnvelope />, label: "Communication", path: "/communication" },
];


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const path = location.pathname;
    const current = menuItems.find((item) => item.path === path);
    setActive(current?.id || "admin@lms.com");
  }, [location]);

  useEffect(() => {
  const fetchSuperAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users?role=superadmin", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Assuming there's only one super admin for now:
      const superAdmin = res.data?.[0]; 
      if (superAdmin) {
        setUserEmail(superAdmin.email || "admin@lms.com");
      }
    } catch (error) {
      console.error("Error fetching super admin:", error);
    }
  };

  fetchSuperAdmin();
}, []);


  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center gap-2 p-2 border-b">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">LMS</div>
          <div>
            <p className="text-sm text-gray-700">Super Admin</p>
            <h1 className="font-semibold text-gray-800">LMS Portal</h1>
          </div>
        </div>

        {/* Profile Block */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 bg-red-50 px-3 py-2 rounded-lg">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
              <FaUser />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700">Super Admin</p>
              <p className="text-xs text-gray-700">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col px-2 py-4">
          {menuItems.map(({ id, icon, label, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={`flex items-center gap-4 px-4 py-3 my-1 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-blue-700 text-white shadow"
                    : "hover:bg-blue-50 text-gray-700"
                }`}
              >
                <span className={`text-lg ${isActive ? "text-white" : "text-blue-700"}`}>
                  {icon}
                </span>
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex flex-col gap-2">
        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 text-sm text-gray-700 hover:text-blue-600"
        >
          <FaCog className="text-lg" />
          Settings
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-3 text-sm text-red-600 hover:text-red-800"
        >
          <FaSignOutAlt className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
}
