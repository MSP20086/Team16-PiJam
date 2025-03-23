import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SubmissionDetailPage = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState({});
  const [challengeData, setChallengeData] = useState(null);
  
  // Fetch submission data on component mount
  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/teacher/submissions/${submissionId}`);
        setSubmission(response.data.data);
        setEditedScores({...response.data.data.teacher_scores});
        // Here you would also fetch the challenge data to get rubric information
        const challengeResponse = await axios.get(`http://localhost:5000/api/teacher/challenge/${response.data.data.challenge_id}`);
        setChallengeData(challengeResponse.data.data);
        // This is a simplified example
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching submission");
        setLoading(false);
      }
    };
    
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  // Convert status to appropriate badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "selected": return "bg-green-500";
      case "not selected": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle score changes
  const handleScoreChange = (category, value) => {
    setEditedScores({
      ...editedScores,
      [category]: Math.min(100, Math.max(0, parseInt(value) || 0))
    });
  };
  
  // Save edited scores
  const saveScores = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/submission/evaluate", {
        submissionId: submission._id,
        challengeId: submission.challenge_id, // Assuming this is in the submission data
        score: editedScores
      });
      
      // Update local state with server response
      setSubmission(response.data.data);
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error saving scores");
      setLoading(false);
    }
  };
  
  // Reset to original scores
  const cancelEdit = () => {
    setEditedScores({...submission.teacher_scores});
    setIsEditing(false);
  };

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    try {
      // In a real application, you would have an API endpoint to update status
      // This is a placeholder for that functionality
      setSubmission({...submission, status: newStatus});
    } catch (err) {
      setError("Error updating status");
    }
  };

  // Determine file preview component based on file type
  const FilePreview = () => {
    if (!submission) return null;
    
    // Default placeholder if file type isn't supported for preview
    let preview = (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Preview not available</p>
        </div>
      </div>
    );
    
    if (submission.file_type === "pdf") {
      preview = (
        <object
          data={submission.cloudinary_url}
          type="application/pdf"
          className="w-full h-full rounded-lg"
        >
          <p>Your browser does not support PDF previews. <a href={submission.cloudinary_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">Click here to view</a></p>
        </object>
      );
    } else if (submission.file_type === "image" || submission.cloudinary_url?.match(/\.(jpeg|jpg|gif|png)$/i)) {
      preview = (
        <img
          src={submission.cloudinary_url}
          alt="Submission preview"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
      );
    } else if (submission.file_type === "video" || submission.cloudinary_url?.match(/\.(mp4|webm|ogg|mov)$/i)) {
      preview = (
        <video 
          src={submission.cloudinary_url}
          controls
          className="max-w-full max-h-full object-contain rounded-lg"
          controlsList="nodownload"
        >
          <p>Your browser does not support video playback. <a href={submission.cloudinary_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">Click here to view the video</a></p>
        </video>
      );
    } else if (submission.file_type === "doc" || submission.file_type === "docx") {
      preview = (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(submission.cloudinary_url)}&embedded=true`}
          className="w-full h-full rounded-lg"
          frameBorder="0"
        ></iframe>
      );
    }
    
    return (
      <div className="h-64 md:h-96 bg-white rounded-lg overflow-hidden shadow-inner">
        {preview}
      </div>
    );
  };

  if (loading && !submission) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission data...</p>
        </div>
      </div>
    );
  }

  if (error && !submission) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Not Found: </strong>
          <span className="block sm:inline">Submission data could not be loaded.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Processing...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
          <h1 className="text-2xl font-bold">Submission Details</h1>
          <div className="flex items-center mt-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(submission.status)} text-white mr-2`}>
              {submission.status ? (submission.status.charAt(0).toUpperCase() + submission.status.slice(1)) : 'Unknown'}
            </span>
            <span className="text-indigo-100">
              Submitted {formatDate(submission.submitted_at || submission.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Document Preview Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Submission Preview
            </h2>
            <FilePreview />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Submission Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Student Information
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-lg font-medium">{submission.student_name || 'Student Name Not Available'}</p>
                  <p className="text-gray-500">Classification: {submission.classification?.toUpperCase() || 'Not Classified'}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Submission Summary
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg h-48 overflow-y-auto">
                  <p className="text-gray-700">{submission.extracted_text || 'No summary available'}</p>
                </div>
              </div>
              
              <div className="flex justify-center">
                <a 
                  href={submission.cloudinary_url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center hover:bg-indigo-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  Download Submission
                </a>
              </div>
            </div>
            
            {/* Right Column - Scores */}
            <div className="space-y-6">
              {submission.ai_scores && Object.keys(submission.ai_scores).length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      Score Breakdown
                    </h2>
                    {!isEditing ? (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        Edit Scores
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button 
                          onClick={saveScores}
                          className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Save
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                          disabled={loading}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    {Object.keys(submission.ai_scores).map((key) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{key}</span>
                          <span className="text-sm text-gray-600">
                            AI: {submission.ai_scores[key]}% | Teacher: {isEditing ? (
                              <input 
                                type="number" 
                                min="0" 
                                max="100"
                                value={editedScores[key] || 0} 
                                onChange={(e) => handleScoreChange(key, e.target.value)}
                                className="w-12 border border-gray-300 rounded px-1 py-0 text-center inline-block"
                              />
                            ) : (submission.teacher_scores && submission.teacher_scores[key]) || 0}%
                          </span> 
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div className="flex h-full rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-400" 
                              style={{ width: `${submission.ai_scores[key]}%` }}
                            ></div>
                            <div 
                              className="bg-indigo-600" 
                              style={{ width: `${(isEditing ? (editedScores[key] || 0) : (submission.teacher_scores && submission.teacher_scores[key]) || 0) - submission.ai_scores[key]}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                  </svg>
                  Final Score
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg flex justify-center items-center">
                  <div className="w-32 h-32 rounded-full bg-indigo-100 border-4 border-indigo-600 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-600">
                        {submission.final_score || 0}
                      </div>
                      <div className="text-sm text-gray-500">points</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Status
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={submission.status || ''}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="selected">Selected</option>
                    <option value="not selected">Not Selected</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;