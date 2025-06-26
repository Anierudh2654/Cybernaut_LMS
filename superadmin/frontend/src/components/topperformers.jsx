import React, { useState, useEffect } from "react";
import axios from "axios";
import Topbar from './topbar';
export default function TopPerformers() {
  const courses = ["Tech Trio", "Full Stack Development", "Data Analytics"];
  const [data, setData] = useState([]);
  const [course, setCourse] = useState("Tech Trio");

  useEffect(() => {
    fetchData();
  }, [course]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tests/top/${course}`);
      const formattedData = res.data.map(item => ({
        studentName: item.studentName,
        quizAvg: item.quizAvg,
        assignmentAvg: item.assignAvg,
        codeAvg: item.codeAvg,
        totalAvg: item.totalAvg
      }));
      setData(formattedData);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const top3 = data.slice(0, 3);
  const others = data.slice(3);

  const profilePic = "https://cdn-icons-png.flaticon.com/512/847/847969.png"; // Simple profile icon

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 text-white p-8">
      
      <h1 className="text-3xl font-bold mb-8 text-center">Leaderboard</h1>

      {/* Course selector */}
      <div className="flex justify-center gap-4 mb-10">
        {courses.map((c) => (
          <button
            key={c}
            onClick={() => setCourse(c)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 
              ${course === c ? "bg-cyan-400 text-black shadow-md" : "bg-blue-600"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Top 3 */}
      <div className="flex justify-center items-end gap-8 mb-16">
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="border-4 border-cyan-400 rounded-full p-2 mb-2">
              <img src={profilePic} className="w-24 h-24 rounded-full" alt="" />
            </div>
            <div>{top3[1].studentName}</div>
            <div className="text-cyan-300">{top3[1].totalAvg.toFixed(2)}</div>
            <div className="mt-1 text-sm">2</div>
          </div>
        )}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <div className="border-4 border-yellow-400 rounded-full p-2 mb-2">
              <img src={profilePic} className="w-32 h-32 rounded-full" alt="" />
            </div>
            <div className="flex items-center gap-1">
              <div className="font-semibold">{top3[0].studentName}</div>
              <span>👑</span>
            </div>
            <div className="text-yellow-300">{top3[0].totalAvg.toFixed(2)}</div>
            <div className="mt-1 text-sm">1</div>
          </div>
        )}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="border-4 border-cyan-400 rounded-full p-2 mb-2">
              <img src={profilePic} className="w-24 h-24 rounded-full" alt="" />
            </div>
            <div>{top3[2].studentName}</div>
            <div className="text-cyan-300">{top3[2].totalAvg.toFixed(2)}</div>
            <div className="mt-1 text-sm">3</div>
          </div>
        )}
      </div>

      {/* Others */}
      <div className="max-w-xl mx-auto">
        {others.map((stu, idx) => (
          <div key={idx} className="flex items-center bg-blue-500 rounded-full px-5 py-3 mb-3 shadow">
            <div className="text-lg font-semibold w-8">{idx + 4}</div>
            <img src={profilePic} className="w-10 h-10 rounded-full mr-4" alt="" />
            <div className="flex-grow">{stu.studentName}</div>
            <div className="font-bold text-cyan-300">{stu.totalAvg.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
