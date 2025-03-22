import React, { useState, useEffect } from "react";
import {
  FaSort,
  FaCalendarAlt,
  FaClipboardList,
  FaUser,
  FaTrophy,
  FaCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ChallengeSubmissionsPage = () => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { challengeId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch challenge details and submissions
        const [challengeResponse, submissionsResponse] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/teacher/challenge/${challengeId}`
          ),
          axios.get(
            `http://localhost:5000/api/teacher/${challengeId}/submissions`
          ),
        ]);

        setChallenge(challengeResponse.data.data);
        setSubmissions(submissionsResponse.data.data);
        console.log(submissionsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [challengeId]);

  const sortedSubmissions =
    submissions.length > 0
      ? [...submissions]
          .filter((sub) => filter === "all" || sub.classification === filter)
          .sort((a, b) =>
            sortOrder === "asc"
              ? a.final_score - b.final_score
              : b.final_score - a.final_score
          )
      : [];

  const getStatusColor = (status) => {
    switch (status) {
      case "selected":
        return "text-green-600 bg-green-100";
      case "not selected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const daysRemaining = () => {
    if (!challenge?.deadline) return 0;

    const today = new Date();
    const deadline = new Date(challenge.deadline);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const viewSubmission = (submissionId) => {
    navigate(`/teacher/submissions/${submissionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading challenge data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Challenge Not Found</h2>
          <p className="text-gray-600 mb-4">
            The requested challenge could not be found.
          </p>
          <button
            onClick={() => navigate("/teacher/challenges")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with background */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-md text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="mr-2" />
            <span className="text-blue-100">
              Deadline: {challenge.deadline}
              {daysRemaining() > 0
                ? ` (${daysRemaining()} days remaining)`
                : " (Expired)"}
            </span>
          </div>
          <p className="text-white">{challenge.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-center mb-4">
                <FaClipboardList className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Evaluation Criteria</h2>
              </div>
              <div className="space-y-4">
                {challenge.rubric.criteria.map((item, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 p-4 rounded-lg border border-blue-100"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-blue-800">
                        {item.parameter}
                      </span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {item.weight * 100}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <FaTrophy className="text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold">Submission Stats</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {submissions.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Submissions</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {submissions.filter((s) => s.status === "selected").length}
                  </div>
                  <div className="text-sm text-gray-600">Selected</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-700">
                    {submissions.filter((s) => s.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {
                      submissions.filter((s) => s.status === "not selected")
                        .length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Not Selected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <FaUser className="text-blue-600 mr-2" />
                  <h2 className="text-xl font-bold">Submissions</h2>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200"
                  >
                    <FaSort className="mr-2" />
                    {sortOrder === "asc" ? "Lowest First" : "Highest First"}
                  </button>
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Classifications</option>
                    <option value="high">High Scores</option>
                    <option value="medium">Medium Scores</option>
                    <option value="low">Low Scores</option>
                  </select>
                </div>
              </div>

              {sortedSubmissions.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">
                    No submissions match your filters.
                  </p>
                </div>
              ) : (
                <motion.div className="space-y-4">
                  {sortedSubmissions.map((submission, index) => (
                    <motion.div
                      key={submission._id}
                      className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ${activeSubmission === index ? "ring-2 ring-blue-500" : ""}`}
                      whileHover={{ scale: 1.01 }}
                      onClick={() =>
                        setActiveSubmission(
                          activeSubmission === index ? null : index
                        )
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="text-lg font-medium mr-2">
                              {submission.student}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}
                            >
                              {submission.status}
                            </span>
                          </div>
                          <div className="flex items-center mt-1 text-gray-600 text-sm">
                            <span>
                              Submitted:{" "}
                              {new Date(
                                submission.updatedAt
                              ).toLocaleDateString()}
                            </span>
                            <div className="mx-2 text-gray-400">•</div>
                            <div className="flex items-center">
                              <FaCircle
                                className={`text-xs mr-1 ${getClassificationColor(submission.classification)}`}
                              />
                              <span className="capitalize">
                                {submission.classification} classification
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <div className="text-2xl font-bold text-right">
                            {submission.final_score}
                            <span className="text-sm text-gray-500">/100</span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {activeSubmission === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t"
                        >
                          <h3 className="font-medium mb-2">Detailed Scores</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {submission.teacher_scores &&
                              Object.entries(submission.teacher_scores).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="bg-gray-50 p-3 rounded"
                                  >
                                    <div className="text-sm text-gray-600">
                                      {key}
                                    </div>
                                    <div className="font-bold">
                                      {Math.round(value * 100)}/100
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${value * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )
                              )}
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button
                              onClick={() => viewSubmission(submission._id)}
                            >
                              View Full Submission
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSubmissionsPage;
