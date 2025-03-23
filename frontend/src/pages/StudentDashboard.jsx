import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
function StudentDashboard() {
  const [submissions, setSubmissions] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:5000/api/student/challenges/submissions', {
      params: { student_id: "67dd4abdf066eeda20539c7c" }
  })
  .then(response => {
      setSubmissions(response.data.data);
      console.log(submissions)
  })
  .catch(error => {
      console.error('Error fetching submissions:', error);
  });
  }, []);
 
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with shadow and improved spacing */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Student Dashboard</h1>
        <p className="text-gray-500">Track your challenge submissions and progress</p>
      </div>
      
      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/challenges" className="bg-blue-600 text-white rounded-lg p-6 shadow-md hover:bg-blue-700 transition duration-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l3 3m0 0l3-3m-3 3V7" />
          </svg>
          Browse Challenges
        </Link>
        
        {/* <Link to="/profile" className="bg-white text-blue-600 rounded-lg p-6 shadow-md hover:bg-gray-50 transition duration-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Your Profile
        </Link> */}
        
        {/* <Link to="/leaderboard" className="bg-white text-blue-600 rounded-lg p-6 shadow-md hover:bg-gray-50 transition duration-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Leaderboard
        </Link> */}
      </div>

      {/* Submissions section with improved card design */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Your Submissions
          </h2>
          {/* <Link to="/challenges" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Submission
          </Link> */}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="py-4 px-6 rounded-tl-lg">#</th>
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr
                  key={submission.id}
                  className={`border-b ${
                    index === submissions.length - 1 ? "border-0" : ""
                  } hover:bg-blue-50 transition duration-200`}
                >
                  <td className="py-4 px-6 text-gray-700 font-medium">
                    <Link
                      to={`/submission/${submission.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      #{submission.id}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-700 font-medium">
                    <Link
                      to={`/submission/${submission.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {submission.title}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {submission.date}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`py-1 px-3 rounded-full font-medium text-sm ${
                        submission.status === "Shortlisted"
                          ? "bg-green-100 text-green-800"
                          : submission.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500 uppercase font-medium">Total Submissions</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">3</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500 uppercase font-medium">Success Rate</p>
          <p className="text-3xl font-bold text-green-600 mt-2">33%</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-sm text-gray-500 uppercase font-medium">Pending Reviews</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">1</p>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;