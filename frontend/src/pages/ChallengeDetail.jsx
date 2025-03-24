import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function ChallengeDetail() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/student/challenges/${id}`);
        if (!response.ok) throw new Error("Failed to fetch challenge details");

        const data = await response.json();
        setChallenge(data.data);
      } catch (error) {
        setSubmitError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  // useEffect(() => {
  //   // For demo purposes, creating a dummy fetch function similar to the Challenges component
  //   const fetchChallenge = () => {
  //     // Simulate API delay
  //     setTimeout(() => {
  //       // This would be replaced with a real API call in production
  //       // Find the challenge that matches the ID from the URL parameter
  //       const dummyChallenges = [
  //         {
  //           _id: "6405a9c1b89d423f8c242255",
  //           title: "AI Ethics Challenge",
  //           description: "Develop a framework addressing ethical concerns in AI applications for healthcare, focusing on privacy, bias, and transparency.",
  //           deadline: "2025-03-25T23:59:59Z",
  //           rubric_id: "6405a9c1b89d423f8c242111",
  //           created_at: "2025-03-18T10:00:00Z",
  //           submissions: ["6405a9c1b89d423f8c242001", "6405a9c1b89d423f8c242002"],
  //           reference_materials: ["https://ethics.ai/resource1", "https://ethics.ai/resource2"],
  //           criteria: { mid: 75, high: 90 },
  //           difficulty: "Advanced",
  //           category: "Ethics & Society",
  //           image: "/api/placeholder/400/200",
  //           detailed_description: "This challenge focuses on creating an ethical framework for AI applications in healthcare. Participants are required to address key concerns including patient data privacy, algorithmic bias in diagnostics, and transparency of AI decision-making processes. Your framework should include practical guidelines for developers, healthcare providers, and regulatory bodies. Consider including case studies that demonstrate how your framework would be applied in real-world scenarios."
  //         },
  //         {
  //           _id: "6405a9c1b89d423f8c242256",
  //           title: "Machine Learning Hackathon",
  //           description: "Build an ML model to predict crop yields based on climate data, helping farmers make informed decisions in challenging conditions.",
  //           deadline: "2025-04-10T23:59:59Z",
  //           rubric_id: "6405a9c1b89d423f8c242112",
  //           created_at: "2025-03-15T08:30:00Z",
  //           submissions: ["6405a9c1b89d423f8c242003"],
  //           reference_materials: ["https://ml.org/resource1", "https://ml.org/resource2"],
  //           criteria: { mid: 70, high: 85 },
  //           difficulty: "Intermediate",
  //           category: "Machine Learning",
  //           image: "/api/placeholder/400/200",
  //           detailed_description: "In this hackathon, you'll build a machine learning model that predicts crop yields using various climate and environmental data points. Your solution should incorporate historical weather patterns, soil quality metrics, and seasonal variations to provide accurate yield forecasts. The model should be able to adapt to different regions and crop types. Your submission should include the model, documentation explaining your approach, and a demo showing how farmers can use your solution to make planting and harvesting decisions."
  //         },
  //         {
  //           _id: "6405a9c1b89d423f8c242257",
  //           title: "Web Development Sprint",
  //           description: "Create an accessible web application that helps connect local volunteers with community service opportunities in real-time.",
  //           deadline: "2025-03-30T23:59:59Z",
  //           rubric_id: "6405a9c1b89d423f8c242113",
  //           created_at: "2025-03-10T14:15:00Z",
  //           submissions: [],
  //           reference_materials: ["https://webdev.org/resource1", "https://accessibility.org/guide"],
  //           criteria: { mid: 65, high: 80 },
  //           difficulty: "Beginner",
  //           category: "Web Development",
  //           image: "/api/placeholder/400/200",
  //           detailed_description: "This sprint challenges you to develop a web application that connects volunteers with local community service opportunities in real-time. The application should allow organizations to post opportunities and volunteers to search and sign up based on their interests, skills, and availability. Your solution must be fully accessible, following WCAG 2.1 AA standards, and should work seamlessly on both desktop and mobile devices. Bonus points for implementing real-time notifications and a feedback system."
  //         },
  //         {
  //           _id: "6405a9c1b89d423f8c242258",
  //           title: "Natural Language Processing Challenge",
  //           description: "Develop a sentiment analysis tool for social media posts that can identify emotional nuances across multiple languages.",
  //           deadline: "2025-04-15T23:59:59Z",
  //           rubric_id: "6405a9c1b89d423f8c242114",
  //           created_at: "2025-03-05T09:00:00Z",
  //           submissions: ["6405a9c1b89d423f8c242004", "6405a9c1b89d423f8c242005"],
  //           reference_materials: ["https://nlp.org/resource1", "https://linguistics.org/guide"],
  //           criteria: { mid: 80, high: 95 },
  //           difficulty: "Advanced",
  //           category: "Natural Language Processing",
  //           image: "/api/placeholder/400/200",
  //           detailed_description: "This NLP challenge asks you to create a sentiment analysis tool capable of identifying emotional nuances in social media posts across multiple languages. Your solution should be able to detect not just positive/negative sentiment but also identify specific emotions like joy, anger, fear, and surprise. The tool should work with at least three languages and account for cultural and linguistic differences in expressing emotions. Include a demonstration of your solution processing real-world social media data."
  //         }
  //       ];

        // const foundChallenge = dummyChallenges.find(c => c._id === id);
        
        // if (foundChallenge) {
        //   setChallenge(foundChallenge);
        // } else {
        //   setSubmitError("Challenge not found");
        // }
        
  //       setLoading(false);
  //     }, 800);
  //   };

  //   fetchChallenge();
  // }, [id]);

  // Calculate days remaining for deadline
  const getDaysRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  const handleFileUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setSubmitError("Please select a file to upload");
      return;
    }
  
    const formData = new FormData();
    formData.append("submissionFile", file);
  
    setIsSubmitting(true);
    setSubmitError(null);
  
    try {
      const response = await fetch(`http://localhost:5000/api/student/challenges/${id}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
  
      if (!response.ok) throw new Error("Failed to submit solution");
  
      setSubmitSuccess(true);
      setFile(null);
    } catch (error) {
      setSubmitError("Submission failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // const handleFileUpload = async (e) => {
  //   e.preventDefault();
    
  //   if (!file) {
  //     setSubmitError("Please select a file to upload");
  //     return;
  //   }
    
  //   setIsSubmitting(true);
  //   setSubmitError(null);
    
  //   try {
  //     // In a real app, this would be an actual API call
  //     // Simulating API call
  //     await new Promise(resolve => setTimeout(resolve, 1500));
      
  //     // Simulating successful upload
  //     setSubmitSuccess(true);
  //     setFile(null);
  //   } catch (error) {
  //     console.error("Error submitting file:", error);
  //     setSubmitError("Failed to submit solution. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-8">
      {/* Back to Challenges Link */}
      <Link to="/challenges" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Challenges
      </Link>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : challenge ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenge Details Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Category-specific header */}
              <div className={`w-full h-48 flex items-center justify-center ${
                challenge.category === "Ethics & Society" ? "bg-blue-100" :
                challenge.category === "Machine Learning" ? "bg-green-100" :
                challenge.category === "Web Development" ? "bg-purple-100" :
                "bg-yellow-100"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${
                  challenge.category === "Ethics & Society" ? "text-blue-500" :
                  challenge.category === "Machine Learning" ? "text-green-500" :
                  challenge.category === "Web Development" ? "text-purple-500" :
                  "text-yellow-500"
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {challenge.category === "Ethics & Society" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  )}
                  {challenge.category === "Machine Learning" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  )}
                  {challenge.category === "Web Development" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  )}
                  {challenge.category === "Natural Language Processing" && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  )}
                </svg>
              </div>
              
              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    challenge.difficulty === "Beginner" ? "bg-green-100 text-green-800" : 
                    challenge.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {challenge.category}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{challenge.title}</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700">Created: {formatDate(challenge.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`${
                      getDaysRemaining(challenge.deadline) <= 3 ? "text-red-600" : 
                      getDaysRemaining(challenge.deadline) <= 7 ? "text-yellow-600" : 
                      "text-green-600"
                    } font-medium`}>
                      Deadline: {formatDate(challenge.deadline)} ({getDaysRemaining(challenge.deadline)} days left)
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Challenge Description</h2>
                  <p className="text-gray-700 mb-6 leading-relaxed">{challenge.detailed_description || challenge.description}</p>
                </div>
                
                {challenge.reference_materials && challenge.reference_materials.length > 0 && (
                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Reference Materials</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      {challenge.reference_materials.map((material, index) => (
                        <li key={index} className="text-gray-700">
                          <a href={material} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
                            Reference {index + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Evaluation Criteria</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Basic Criteria</div>
                      <div className="text-gray-700">Min Score: {challenge.criteria?.mid || 70}%</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Advanced Criteria</div>
                      <div className="text-gray-700">High Score: {challenge.criteria?.high || 90}%</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Submissions</div>
                      <div className="text-gray-700">{challenge.submissions.length} solutions submitted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submission Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Your Solution</h2>
              
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-green-700">
                      Your solution has been submitted successfully!
                    </div>
                  </div>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Submit another solution
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="solution-file" className="block text-sm font-medium text-gray-700">
                      Upload your solution file
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      {file ? (
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                          <span className="text-xs text-gray-500 mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                            }}
                            className="mt-2 text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center" onClick={() => document.getElementById('solution-file').click()}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">Click to upload or drag and drop</span>
                          <span className="text-xs text-gray-500 mt-1">
                            ZIP, PDF, DOC, DOCX, or other relevant files
                          </span>
                        </div>
                      )}
                      <input
                        type="file"
                        id="solution-file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={!file || isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                      !file || isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors flex justify-center items-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Solution'
                    )}
                  </button>
                </form>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Submission Guidelines</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Include a README file with setup instructions
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Document any external libraries or resources used
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Maximum file size: 50MB
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Challenge Not Found</h2>
          <p className="text-gray-600 mb-6">The challenge you're looking for doesn't exist or has been removed.</p>
          <Link to="/challenges" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View All Challenges
          </Link>
        </div>
      )}
    </div>
  );
}

export default ChallengeDetail;