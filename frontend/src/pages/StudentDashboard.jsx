import { useEffect, useState } from "react";

function StudentDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/student/challenges/submissions?student_id=65fdc2a1e4b0c2e3d1a7b123");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data); // Debugging ✅
        setSubmissions(data?.data || []);
      } catch (err) {
        setError("Failed to fetch submissions");
        console.error("Fetch Error:", err); // Debugging ✅
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col items-center space-y-2">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-600 font-medium">Loading your challenges...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-center text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const getStatusStyles = (status) => {
    switch(status) {
      case "Shortlisted":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 relative">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-indigo-500 rounded-full opacity-20"></div>
          <div className="bg-white rounded-2xl shadow-md p-6 relative z-10 border-l-4 border-blue-500">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Challenge Journey</h1>
                <p className="text-gray-500 mt-1">Track your progress and grow your skills</p>
              </div>
              <div className="mt-4 md:mt-0">
                <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300" href="/challenges">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Challenge
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Unique Element: Motivation Tracker */}
        {/* <div className="bg-white rounded-2xl shadow-md p-6 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-1">Your Coding Streak</h2>
              <p className="text-gray-500">Keep the momentum going!</p>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    i < 5 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i < 5 ? '✓' : ''}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '71%' }}></div>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-600">5/7 days this week</span>
            <span className="text-blue-600 font-medium">71% Complete</span>
          </div>
        </div> */}
        
        {/* Submission Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Your Submissions</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                {submissions.length} Total
              </span>
            </div>
          </div>

          {submissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                    <th className="py-4 px-6 font-medium">#</th>
                    <th className="py-4 px-6 font-medium">Challenge</th>
                    <th className="py-4 px-6 font-medium">Date</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={submission._id} className="border-t border-gray-100 hover:bg-gray-50 transition duration-150">
                      <td className="py-4 px-6 text-gray-800">{index + 1}</td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">{submission.challenge?.title || "Unknown Challenge"}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`py-1 px-3 rounded-full text-xs font-medium border ${getStatusStyles(submission.status)}`}>
                          {submission.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No submissions yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Start your journey by submitting your first challenge solution!
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                Browse Challenges
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;