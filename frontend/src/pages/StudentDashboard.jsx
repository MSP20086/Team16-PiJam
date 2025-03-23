import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
function StudentDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/student/challenges/submissions");

        console.log("API Response:", response.data); // Debugging ✅
        setSubmissions(response.data?.data || []);
      } catch (err) {
        setError("Failed to fetch submissions");
        console.error("Fetch Error:", err); // Debugging ✅
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">Student Dashboard</h1>
        <p className="text-gray-500">Track your challenge submissions and progress</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Submissions</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-4">#</th>
              <th className="p-4">Challenge</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length > 0 ? (
              submissions.map((submission, index) => (
                <tr key={submission._id} className="border-b">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{submission.challenge?.title || "Unknown Challenge"}</td>
                  <td className="p-4">{new Date(submission.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`py-1 px-3 rounded-full font-medium text-sm ${
                      submission.status === "Shortlisted"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {submission.status || "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No submissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentDashboard;
