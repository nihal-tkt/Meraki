import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorDashboard = () => {
  const pieData = {
    labels: ["React Basics", "Advanced CSS", "JavaScript Essentials"],
    datasets: [
      {
        data: [245, 150, 300],
        backgroundColor: ["#FF9800", "#F44336", "#4CAF50"],
        hoverBackgroundColor: ["#FFA726", "#EF5350", "#66BB6A"],
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false, // Allows controlling the aspect ratio
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-orange-500">Instructor Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your courses and performance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 shadow-md rounded-md">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">Statistics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Total Students:</span>
              <span className="text-white font-bold">1,245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Revenue:</span>
              <span className="text-white font-bold">$12,345</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Courses Published:</span>
              <span className="text-white font-bold">5</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 shadow-md rounded-md lg:col-span-2">
          <h2 className="text-xl font-semibold text-orange-400 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="text-gray-300">
              <span className="font-bold">Jane Doe</span> enrolled in <span className="font-bold">React Basics</span>.
            </li>
            <li className="text-gray-300">
              <span className="font-bold">John Smith</span> left a review for <span className="font-bold">Advanced CSS</span>.
            </li>
            <li className="text-gray-300">
              <span className="font-bold">Emily Davis</span> completed <span className="font-bold">JavaScript Essentials</span>.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gray-800 p-6 shadow-md rounded-md mt-6">
        <h2 className="text-xl font-semibold text-orange-400 mb-4">Enrollment Distribution</h2>
        <div className="flex justify-center items-center h-64">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="mt-6 bg-gray-800 p-6 shadow-md rounded-md">
        <h2 className="text-xl font-semibold text-orange-400 mb-4">Manage Your Courses</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-700 text-gray-300 text-left">
                <th className="p-4">Course Name</th>
                <th className="p-4">Students</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-600">
                <td className="p-4">React Basics</td>
                <td className="p-4">245</td>
                <td className="p-4">$3,450</td>
                <td className="p-4">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Edit
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-600">
                <td className="p-4">Advanced CSS</td>
                <td className="p-4">150</td>
                <td className="p-4">$2,150</td>
                <td className="p-4">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Edit
                  </button>
                </td>
              </tr>
              <tr>
                <td className="p-4">JavaScript Essentials</td>
                <td className="p-4">300</td>
                <td className="p-4">$5,300</td>
                <td className="p-4">
                  <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
