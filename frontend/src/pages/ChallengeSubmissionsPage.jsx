// import React, { useState, useEffect } from "react";
// import {
//   FaSort,
//   FaCalendarAlt,
//   FaClipboardList,
//   FaUser,
//   FaTrophy,
//   FaCircle,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Button from "../components/Button";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";

// const ChallengeSubmissionsPage = () => {
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [filter, setFilter] = useState("all");
//   const [activeSubmission, setActiveSubmission] = useState(null);
//   const [challenge, setChallenge] = useState(null);
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const { challengeId } = useParams();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch challenge details and submissions
//         // const [challengeResponse, submissionsResponse] = await Promise.all([
//         //   axios.get(
//         //     `http://localhost:5000/api/teacher/challenge/${challengeId}`
//         //   ),
//         //   axios.get(
//         //     `http://localhost:5000/api/teacher/${challengeId}/submissions`
//         //   ),
//         // ]);
//         axios.get(
//           `http://localhost:5000/api/teacher/${challengeId}/submissions`
//         ).then((response) => {
//           setSubmissions(response.data.data.submissions);
//           setChallenge(response.data.data.challenge);
//           console.log(response.data.data.challenge,challenge);
//         })
//         // setChallenge(challengeResponse.data.data);
        
//         // console.log(submissionsResponse.data.data);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch data");
//         console.error("Error fetching data:", err);
//       } finally {
//         console.log(challenge)
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [challengeId]);

//   const sortedSubmissions =
//     submissions.length > 0
//       ? [...submissions]
//           .filter((sub) => filter === "all" || sub.classification === filter)
//           .sort((a, b) =>
//             sortOrder === "asc"
//               ? a.final_score - b.final_score
//               : b.final_score - a.final_score
//           )
//       : [];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "selected":
//         return "text-green-600 bg-green-100";
//       case "not selected":
//         return "text-red-600 bg-red-100";
//       case "pending":
//         return "text-yellow-600 bg-yellow-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const getClassificationColor = (classification) => {
//     switch (classification) {
//       case "high":
//         return "text-green-600";
//       case "medium":
//         return "text-yellow-600";
//       case "low":
//         return "text-red-600";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const daysRemaining = () => {
//     if (!challenge?.deadline) return 0;

//     const today = new Date();
//     const deadline = new Date(challenge.deadline);
//     const diffTime = deadline - today;
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const viewSubmission = (submissionId) => {
//     navigate(`/teacher/submissions/${submissionId}`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading challenge data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
//           <div className="text-red-600 text-5xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!challenge) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
//           <h2 className="text-2xl font-bold mb-2">Challenge Not Found</h2>
//           <p className="text-gray-600 mb-4">
//             The requested challenge could not be found.
//           </p>
//           <button
//             onClick={() => navigate("/teacher/challenges")}
//             className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//           >
//             Go to Challenges
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Header with background */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-lg shadow-md text-white mb-6">
//           <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
//           <div className="flex items-center mb-4">
//             <FaCalendarAlt className="mr-2" />
//             <span className="text-blue-100">
//               Deadline: {challenge.deadline}
//               {daysRemaining() > 0
//                 ? ` (${daysRemaining()} days remaining)`
//                 : " (Expired)"}
//             </span>
//           </div>
//           <p className="text-white">{challenge.description}</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Left Section */}
//           <div className="md:col-span-1">
//             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//               <div className="flex items-center mb-4">
//                 <FaClipboardList className="text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold">Evaluation Criteria</h2>
//               </div>
//               <div className="space-y-4">
//                 {challenge.rubric.criteria.map((item, index) => (
//                   <div
//                     key={index}
//                     className="bg-blue-50 p-4 rounded-lg border border-blue-100"
//                   >
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="font-medium text-blue-800">
//                         {item.parameter}
//                       </span>
//                       <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">
//                         {item.weight * 100}%
//                       </span>
//                     </div>
//                     <p className="text-sm text-gray-600">{item.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center mb-4">
//                 <FaTrophy className="text-blue-600 mr-2" />
//                 <h2 className="text-xl font-semibold">Submission Stats</h2>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-blue-50 p-4 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-blue-700">
//                     {submissions.length}
//                   </div>
//                   <div className="text-sm text-gray-600">Total Submissions</div>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-green-700">
//                     {submissions.filter((s) => s.status === "selected").length}
//                   </div>
//                   <div className="text-sm text-gray-600">Selected</div>
//                 </div>
//                 <div className="bg-yellow-50 p-4 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-yellow-700">
//                     {submissions.filter((s) => s.status === "pending").length}
//                   </div>
//                   <div className="text-sm text-gray-600">Pending</div>
//                 </div>
//                 <div className="bg-red-50 p-4 rounded-lg text-center">
//                   <div className="text-2xl font-bold text-red-700">
//                     {
//                       submissions.filter((s) => s.status === "not selected")
//                         .length
//                     }
//                   </div>
//                   <div className="text-sm text-gray-600">Not Selected</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="md:col-span-2">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center">
//                   <FaUser className="text-blue-600 mr-2" />
//                   <h2 className="text-xl font-bold">Submissions</h2>
//                 </div>
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() =>
//                       setSortOrder(sortOrder === "asc" ? "desc" : "asc")
//                     }
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition duration-200"
//                   >
//                     <FaSort className="mr-2" />
//                     {sortOrder === "asc" ? "Lowest First" : "Highest First"}
//                   </button>
//                   <select
//                     onChange={(e) => setFilter(e.target.value)}
//                     className="border border-gray-300 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="all">All Classifications</option>
//                     <option value="high">High Scores</option>
//                     <option value="medium">Medium Scores</option>
//                     <option value="low">Low Scores</option>
//                   </select>
//                 </div>
//               </div>

//               {sortedSubmissions.length === 0 ? (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg">
//                   <p className="text-gray-500">
//                     No submissions match your filters.
//                   </p>
//                 </div>
//               ) : (
//                 <motion.div className="space-y-4">
//                   {sortedSubmissions.map((submission, index) => (
//                     <motion.div
//                       key={submission._id}
//                       className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition duration-200 ${activeSubmission === index ? "ring-2 ring-blue-500" : ""}`}
//                       whileHover={{ scale: 1.01 }}
//                       onClick={() =>
//                         setActiveSubmission(
//                           activeSubmission === index ? null : index
//                         )
//                       }
//                     >
//                       <div className="flex flex-col md:flex-row md:items-center justify-between">
//                         <div>
//                           <div className="flex items-center">
//                             <span className="text-lg font-medium mr-2">
//                               {submission.student}
//                             </span>
//                             <span
//                               className={`px-3 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}
//                             >
//                               {submission.status}
//                             </span>
//                           </div>
//                           <div className="flex items-center mt-1 text-gray-600 text-sm">
//                             <span>
//                               Submitted:{" "}
//                               {new Date(
//                                 submission.updatedAt
//                               ).toLocaleDateString()}
//                             </span>
//                             <div className="mx-2 text-gray-400">•</div>
//                             <div className="flex items-center">
//                               <FaCircle
//                                 className={`text-xs mr-1 ${getClassificationColor(submission.classification)}`}
//                               />
//                               <span className="capitalize">
//                                 {submission.classification} classification
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2 md:mt-0">
//                           <div className="text-2xl font-bold text-right">
//                             {submission.final_score}
//                             <span className="text-sm text-gray-500">/100</span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Expanded Content */}
//                       {activeSubmission === index && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           className="mt-4 pt-4 border-t"
//                         >
//                           <h3 className="font-medium mb-2">Detailed Scores</h3>
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                             {submission.teacher_scores &&
//                               Object.entries(submission.teacher_scores).map(
//                                 ([key, value]) => (
//                                   <div
//                                     key={key}
//                                     className="bg-gray-50 p-3 rounded"
//                                   >
//                                     <div className="text-sm text-gray-600">
//                                       {key}
//                                     </div>
//                                     <div className="font-bold">
//                                       {Math.round(value * 100)}/100
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                                       <div
//                                         className="bg-blue-600 h-2 rounded-full"
//                                         style={{ width: `${value * 100}%` }}
//                                       ></div>
//                                     </div>
//                                   </div>
//                                 )
//                               )}
//                           </div>
//                           <div className="flex justify-end mt-4">
//                             <Button
//                               onClick={() => viewSubmission(submission._id)}
//                             >
//                               View Full Submission
//                             </Button>
//                           </div>
//                         </motion.div>
//                       )}
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChallengeSubmissionsPage;

import React, { useState, useEffect } from "react";
import { 
  FaSort, 
  FaCalendarAlt,
  FaClipboardList, 
  FaChevronDown,
  FaChevronUp,
  FaMedal,
  FaFilter
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Award } from "lucide-react";
const ChallengeSubmissionsPage = () => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [filter, setFilter] = useState("all");
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { challengeId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        axios.get(
          `http://localhost:5000/api/teacher/${challengeId}/submissions`
        ).then((response) => {
          setSubmissions(response.data.data.submissions);
          setChallenge(response.data.data.challenge);
        })
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
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "not selected":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case "high":
        return "text-emerald-600";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-rose-600";
      default:
        return "text-slate-600";
    }
  };

  const getClassificationBg = (classification) => {
    switch (classification) {
      case "high":
        return "bg-emerald-100";
      case "medium":
        return "bg-amber-100";
      case "low":
        return "bg-rose-100";
      default:
        return "bg-slate-100";
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

  // Loading state with subtle animation
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading challenge data...</p>
        </div>
      </div>
    );
  }

  // Error state with clear action
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <div className="text-rose-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-3">Error Loading Data</h2>
          <p className="text-slate-600 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!challenge) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3">Challenge Not Found</h2>
          <p className="text-slate-600 mb-5">
            The requested challenge could not be found.
          </p>
          <button
            onClick={() => navigate("/teacher/challenges")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Go to Challenges
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <a
                        href="/teacher/challenges"
                        className={`block px-3 py-2 rounded-md text-base font-medium  'hover:bg-indigo-100'}`}
                      >
                        <div className="flex items-center">
                          <Award className={`mr-2 h-5 w-5 text-yellow-500`} /> Back to Quests
                        </div>
                      </a>
        {/* Header with clean design */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 sm:p-8 rounded-2xl shadow-md text-white mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
          <div className="flex items-center mb-4 text-indigo-100">
            <FaCalendarAlt className="mr-2 text-indigo-200" />
            <span>
              Deadline: {challenge.deadline}
              {daysRemaining() > 0 ? (
                <span className="ml-1 font-medium bg-indigo-500/30 px-2 py-0.5 rounded-full text-sm">
                  {daysRemaining()} days remaining
                </span>
              ) : (
                <span className="ml-1 font-medium bg-rose-500/30 px-2 py-0.5 rounded-full text-sm">
                  Expired
                </span>
              )}
            </span>
          </div>
          <p className="text-white/90 max-w-3xl">{challenge.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Now in a sticky sidebar format */}
          <div className="lg:col-span-1">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Stats cards - more visual */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <FaMedal className="text-indigo-600 mr-2" />
                  <h2 className="text-xl font-semibold">Submission Stats</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg text-center border border-indigo-100">
                    <div className="text-2xl font-bold text-indigo-700">
                      {submissions.length}
                    </div>
                    <div className="text-sm text-slate-600">Total</div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg text-center border border-emerald-100">
                    <div className="text-2xl font-bold text-emerald-700">
                      {submissions.filter((s) => s.status === "selected").length}
                    </div>
                    <div className="text-sm text-slate-600">Selected</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg text-center border border-amber-100">
                    <div className="text-2xl font-bold text-amber-700">
                      {submissions.filter((s) => s.status === "pending").length}
                    </div>
                    <div className="text-sm text-slate-600">Pending</div>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-lg text-center border border-rose-100">
                    <div className="text-2xl font-bold text-rose-700">
                      {submissions.filter((s) => s.status === "not selected").length}
                    </div>
                    <div className="text-sm text-slate-600">Rejected</div>
                  </div>
                </div>
              </motion.div>

              {/* Evaluation Criteria with accordion style */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-4 cursor-pointer"
                     onClick={() => setShowFilters(!showFilters)}>
                  <div className="flex items-center">
                    <FaClipboardList className="text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold">Evaluation Criteria</h2>
                  </div>
                  {showFilters ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />}
                </div>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {challenge.rubric.criteria.map((item, index) => (
                        <div
                          key={index}
                          className="bg-indigo-50 p-4 rounded-lg border border-indigo-100"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-indigo-800">
                              {item.parameter}
                            </span>
                            <span className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {item.weight * 100}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Right Section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <div className="flex items-center">
                  <div className="mr-3 p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <FaFilter className="text-lg" />
                  </div>
                  <h2 className="text-xl font-bold">Submissions</h2>
                </div>
                
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg flex items-center hover:bg-indigo-50 transition duration-200 text-sm font-medium"
                  >
                    <FaSort className="mr-2" />
                    {sortOrder === "asc" ? "Lowest First" : "Highest First"}
                  </button>
                  
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-indigo-200 p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-700"
                  >
                    <option value="all">All Classifications</option>
                    <option value="high">High Scores</option>
                    <option value="medium">Medium Scores</option>
                    <option value="low">Low Scores</option>
                  </select>
                </div>
              </div>

              {sortedSubmissions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-400 text-5xl mb-3">🔍</div>
                  <p className="text-slate-500 font-medium">
                    No submissions match your filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedSubmissions.map((submission, index) => (
                    <motion.div
                      key={submission._id}
                      className={`p-4 border rounded-xl hover:shadow-md transition-all duration-200 ${
                        activeSubmission === index 
                          ? "ring-2 ring-indigo-300 bg-indigo-50/50" 
                          : "bg-white hover:bg-slate-50/70"
                      }`}
                      whileHover={{ scale: 1.005 }}
                      layout
                    >
                      <div 
                        className="flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                        onClick={() => setActiveSubmission(activeSubmission === index ? null : index)}
                      >
                        <div>
                          <div className="flex items-center">
                            <span className="text-lg font-medium mr-2">
                              {submission.student}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(submission.status)}`}
                            >
                              {submission.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center mt-1 text-slate-500 text-sm">
                            <span>
                              Submitted: {new Date(submission.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="mx-2 text-slate-300">•</div>
                            <div className={`flex items-center px-2 py-0.5 rounded-full ${getClassificationBg(submission.classification)}`}>
                              <span className={`capitalize font-medium ${getClassificationColor(submission.classification)}`}>
                                {submission.classification}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center">
                          <div className="text-2xl font-bold">
                            {submission.final_score}
                            <span className="text-sm text-slate-400">/100</span>
                          </div>
                          <div className="ml-2 text-slate-400">
                            {activeSubmission === index ? <FaChevronUp /> : <FaChevronDown />}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {activeSubmission === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t"
                          >
                            <h3 className="font-medium mb-3 text-indigo-700">Detailed Scores</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {submission.teacher_scores &&
                                Object.entries(submission.teacher_scores).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                                    >
                                      <div className="text-sm text-slate-500 truncate">
                                        {key}
                                      </div>
                                      <div className="font-bold text-slate-700">
                                        {Math.round(value * 100)}/100
                                      </div>
                                      <div className="w-full bg-slate-200 rounded-full h-2 mt-1.5">
                                        <div
                                          className={`h-2 rounded-full ${
                                            value * 100 >= 70 
                                              ? "bg-emerald-500" 
                                              : value * 100 >= 40 
                                                ? "bg-amber-500" 
                                                : "bg-rose-500"
                                          }`}
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
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200"
                              >
                                View Full Submission
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeSubmissionsPage;