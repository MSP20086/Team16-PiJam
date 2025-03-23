import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function Challenges() {
  // Dummy challenges data with all required fields and realistic image URLs
  // const dummyChallenges = [
  //   {
  //     _id: "6405a9c1b89d423f8c242255",
  //     title: "AI Ethics Challenge",
  //     description: "Develop a framework addressing ethical concerns in AI applications for healthcare, focusing on privacy, bias, and transparency.",
  //     deadline: "2025-03-25T23:59:59Z",
  //     rubric_id: "6405a9c1b89d423f8c242111",
  //     created_at: "2025-03-18T10:00:00Z",
  //     submissions: ["6405a9c1b89d423f8c242001", "6405a9c1b89d423f8c242002"],
  //     reference_materials: ["https://ethics.ai/resource1", "https://ethics.ai/resource2"],
  //     criteria: { mid: 75, high: 90 },
  //     difficulty: "Advanced",
  //     category: "Ethics & Society",
  //     image: "/api/placeholder/400/200"
  //   },
  //   {
  //     _id: "6405a9c1b89d423f8c242256",
  //     title: "Machine Learning Hackathon",
  //     description: "Build an ML model to predict crop yields based on climate data, helping farmers make informed decisions in challenging conditions.",
  //     deadline: "2025-04-10T23:59:59Z",
  //     rubric_id: "6405a9c1b89d423f8c242112",
  //     created_at: "2025-03-15T08:30:00Z",
  //     submissions: ["6405a9c1b89d423f8c242003"],
  //     reference_materials: ["https://ml.org/resource1", "https://ml.org/resource2"],
  //     criteria: { mid: 70, high: 85 },
  //     difficulty: "Intermediate",
  //     category: "Machine Learning",
  //     image: "/api/placeholder/400/200"
  //   },
  //   {
  //     _id: "6405a9c1b89d423f8c242257",
  //     title: "Web Development Sprint",
  //     description: "Create an accessible web application that helps connect local volunteers with community service opportunities in real-time.",
  //     deadline: "2025-03-30T23:59:59Z",
  //     rubric_id: "6405a9c1b89d423f8c242113",
  //     created_at: "2025-03-10T14:15:00Z",
  //     submissions: [],
  //     reference_materials: ["https://webdev.org/resource1", "https://accessibility.org/guide"],
  //     criteria: { mid: 65, high: 80 },
  //     difficulty: "Beginner",
  //     category: "Web Development",
  //     image: "/api/placeholder/400/200"
  //   },
  //   {
  //     _id: "6405a9c1b89d423f8c242258",
  //     title: "Natural Language Processing Challenge",
  //     description: "Develop a sentiment analysis tool for social media posts that can identify emotional nuances across multiple languages.",
  //     deadline: "2025-04-15T23:59:59Z",
  //     rubric_id: "6405a9c1b89d423f8c242114",
  //     created_at: "2025-03-05T09:00:00Z",
  //     submissions: ["6405a9c1b89d423f8c242004", "6405a9c1b89d423f8c242005"],
  //     reference_materials: ["https://nlp.org/resource1", "https://linguistics.org/guide"],
  //     criteria: { mid: 80, high: 95 },
  //     difficulty: "Advanced",
  //     category: "Natural Language Processing",
  //     image: "/api/placeholder/400/200"
  //   }
  // ];

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/student/challenges");
        if (!response.ok) throw new Error("Failed to fetch challenges");
        const data = await response.json();
        console.log(data)
        setChallenges(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Handle search and filtering
  const getFilteredChallenges = () => {
    let result = challenges;
    
    // Apply category/difficulty filter first
    if (filter !== "all") {
      result = result.filter(challenge => 
        challenge.category === filter || challenge.difficulty === filter
      );
    }
    
    // Then apply search query if it exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(challenge => 
        challenge.title.toLowerCase().includes(query) || 
        challenge.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  };

  const filteredChallenges = getFilteredChallenges();
  const categories = [...new Set(challenges.map(challenge => challenge.category))];
  const difficulties = [...new Set(challenges.map(challenge => challenge.difficulty))];

  // Clear search and filters
  const clearSearch = () => {
    setSearchQuery("");
    setFilter("all");
  };

  // Calculate days remaining for deadline
  const getDaysRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header with Dashboard Button */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Challenges</h1>
            <p className="text-gray-500">Explore and participate in our latest challenges</p>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Search challenges by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-gray-700">Filter by:</span>
          
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            All Challenges
          </button>
          
          {/* Category filters */}
          {categories.map(category => (
            <button 
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg transition ${filter === category ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              {category}
            </button>
          ))}
          
          {/* Difficulty filters */}
          {difficulties.map(difficulty => (
            <button 
              key={difficulty}
              onClick={() => setFilter(difficulty)}
              className={`px-4 py-2 rounded-lg transition ${filter === difficulty ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              {difficulty}
            </button>
          ))}
          
          {/* Clear filters button - only show when filters are active */}
          {(filter !== "all" || searchQuery) && (
            <button 
              onClick={clearSearch}
              className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition ml-auto"
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Search Results Summary - show when search is active */}
      {searchQuery && !loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <p className="text-blue-800">
            <span className="font-semibold">Search results for "{searchQuery}":</span> {filteredChallenges.length} {filteredChallenges.length === 1 ? 'challenge' : 'challenges'} found
          </p>
        </div>
      )}

      {/* Challenges Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <Link 
                to={`/challenges/${challenge._id}`} 
                key={challenge._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full"
              >
                {/* Using SVG placeholders with relevant visual cues based on challenge category */}
                {challenge.category === "Ethics & Society" && (
                  <div className="w-full h-48 bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
                
                {challenge.category === "Machine Learning" && (
                  <div className="w-full h-48 bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                )}
                
                {challenge.category === "Web Development" && (
                  <div className="w-full h-48 bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                )}
                
                {challenge.category === "Natural Language Processing" && (
                  <div className="w-full h-48 bg-yellow-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      challenge.difficulty === "Beginner" 
                      ? "bg-green-100 text-green-800" 
                      : challenge.difficulty === "Intermediate" 
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-red-100 text-red-800"
                    }`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {challenge.category}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-3">{challenge.title}</h2>
                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{challenge.description}</p>
                  
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-gray-500">Submissions: </span>
                        <span className="font-semibold text-gray-700">{challenge.submissions.length}</span>
                      </div>
                      
                      <div className={`text-sm font-medium ${
                        getDaysRemaining(challenge.deadline) <= 3 
                        ? "text-red-600" 
                        : getDaysRemaining(challenge.deadline) <= 7 
                        ? "text-yellow-600" 
                        : "text-green-600"
                      }`}>
                        {getDaysRemaining(challenge.deadline)} days left
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center p-12 bg-white rounded-xl shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700">No challenges found</h3>
              <p className="text-gray-500 mt-2">
                {searchQuery 
                  ? `No results match "${searchQuery}" with the current filters.` 
                  : "Try adjusting your filters or check back later."}
              </p>
              <button 
                onClick={clearSearch}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View all challenges
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Featured Challenge Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
            <h2 className="text-2xl font-bold mb-4">Featured Challenge</h2>
            <h3 className="text-xl font-semibold mb-2">Computer Vision Competition</h3>
            <p className="mb-4">Develop an algorithm to identify and classify different plant species from images to help conservation efforts</p>
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Deadline: April 30, 2025</span>
            </div>
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <span>Prize Pool: $5,000</span>
            </div>
            <Link to="/challenges/featured" className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Details
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="h-full flex items-center justify-center bg-gray-100 p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Info Section */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">How Challenges Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">1. Choose a Challenge</h3>
              <p className="text-gray-600 mt-1">Browse and select a challenge that matches your interests and skills</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2. Submit Your Work</h3>
              <p className="text-gray-600 mt-1">Complete the challenge and submit your solution before the deadline</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-full p-2 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">3. Get Feedback</h3>
              <p className="text-gray-600 mt-1">Receive feedback and recognition for your work</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating button to go back to dashboard (mobile-friendly) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <Link 
          to="/"
          className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default Challenges;  