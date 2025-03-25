import React, { useState, useEffect } from "react";
import { Search, Calendar, Users, FileText, ChevronRight, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isPast, isFuture, differenceInDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  hover: {
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 }
  }
};

const ITEMS_PER_PAGE = 6;

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("deadline");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/teacher/challenges');
        const { data } = response.data;
        setChallenges(data);
        setFilteredChallenges(data);
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setTimeout(() => setLoading(false), 300); // Small delay for smoother transition
      }
    };
    
    fetchChallenges();
  }, []);

  // Filter and sort challenges
  useEffect(() => {
    let result = [...challenges];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        challenge => 
          challenge.title.toLowerCase().includes(query) || 
          challenge.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        // case "submissions":
        //   return (b.submissions?.length || 0) - (a.submissions?.length || 0);
        default:
          return 0;
      }
    });
    
    setFilteredChallenges(result);
    setCurrentPage(1);
    
    // Calculate total pages
    const calculatedTotalPages = Math.ceil(result.length / ITEMS_PER_PAGE) || 1;
    setTotalPages(calculatedTotalPages);
  }, [challenges, searchQuery, sortBy]);

  // Get current page challenges
  const getCurrentPageChallenges = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredChallenges.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Format deadline with status context
  const formatDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const formattedDate = format(deadline, "MMM d, yyyy");
    
    if (isPast(deadline)) {
      return { text: formattedDate, status: "ended" };
    } else if (isFuture(deadline)) {
      const daysLeft = differenceInDays(deadline, new Date());
      if (daysLeft <= 3) {
        return { 
          text: `${daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft} days left`}`, 
          status: "urgent" 
        };
      }
      return { text: formattedDate, status: "active" };
    }
    return { text: formattedDate, status: "active" };
  };

  // Get badge color based on deadline status
  const getStatusColor = (status) => {
    switch (status) {
      case "ended": return "bg-gray-100 text-gray-600 border border-gray-200";
      case "urgent": return "bg-amber-50 text-amber-700 border border-amber-200";
      case "active": return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default: return "bg-blue-50 text-blue-700 border border-blue-200";
    }
  };

  // Handle view details
  const handleViewDetails = (challengeId) => {
    navigate(`/challenges/${challengeId}`);
  };

  // Handle create new challenge
  // const handleCreateNew = () => {
  //   navigate("/teacher/challenges/new");
  // };

  // Loading skeletons
  const renderSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div 
        key={index}
        className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
      >
        <div className="p-5 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="flex justify-between pt-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded mt-4"></div>
        </div>
      </div>
    ));
  };

  // Empty state component
  const EmptyState = () => (
    <div className="text-center p-16 rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
        <Calendar className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchQuery ? 
          "Try adjusting your search terms or filters" : 
          "Create your first challenge to get started"
        }
      </p>
      {/* <button
        onClick={handleCreateNew}
        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        <Plus className="mr-2 h-5 w-5" />
        Create New Challenge
      </button> */}
    </div>
  );

  // Pagination
  const Pagination = () => {
    return (
      <div className="flex items-center justify-center mt-8">
        <nav className="flex gap-1 rounded-lg overflow-hidden shadow-sm bg-white border border-gray-100 p-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded font-medium ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  // Sort options
  const SortOptions = () => {
    const options = [
      { value: "deadline", label: "Deadline (Soonest First)" },
      { value: "title", label: "Title (A-Z)" },
      { value: "newest", label: "Newest First" },
      // { value: "submissions", label: "Most Submissions" }
    ];
    
    return (
      <div className="relative flex items-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none pl-4 pr-8 py-2 rounded-lg border-none bg-gray-50 text-gray-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  // View toggle
  const ViewToggle = () => (
    <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <button
        onClick={() => setViewMode("grid")}
        className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
        aria-label="Grid view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
        aria-label="List view"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );

  // Render grid view
  const renderGridView = () => {
    return (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {getCurrentPageChallenges().map((challenge) => {
          const deadline = formatDeadline(challenge.deadline);
          
          return (
            <motion.div
              key={challenge._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-1">{challenge.title}</h3>
                <p className="text-gray-600 text-sm mb-5 line-clamp-2">{challenge.description}</p>
                
                <div className="space-y-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Deadline
                    </span>
                    <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusColor(deadline.status)}`}>
                      {deadline.text}
                    </span>
                  </div>
                  
                  {/* <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      Submissions
                    </span>
                    <span className="text-sm font-medium">
                      {challenge.submissions?.length || 0}
                    </span>
                  </div> */}
                  
                  {challenge.reference_materials && challenge.reference_materials.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        Materials
                      </span>
                      <span className="text-sm font-medium">
                        {challenge.reference_materials.length}
                      </span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleViewDetails(challenge._id)}
                  className="mt-5 w-full flex items-center justify-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  View Quest
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // Render list view
  const renderListView = () => {
    return (
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {getCurrentPageChallenges().map((challenge) => {
          const deadline = formatDeadline(challenge.deadline);
          
          return (
            <motion.div
              key={challenge._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
              variants={cardVariants}
              whileHover="hover"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-8 flex-1">
                    <h3 className="text-lg font-semibold mb-1 text-gray-800">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-1">{challenge.description}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-5 items-start sm:items-center">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusColor(deadline.status)}`}>
                        {deadline.text}
                      </span>
                    </div>
                    
                    {/* <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm font-medium">
                        {challenge.submissions?.length || 0} submissions
                      </span>
                    </div> */}
                    
                    <button
                      onClick={() => handleViewDetails(challenge._id)}
                      className="sm:ml-2 flex items-center justify-center py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      View
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with clean gradient */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 pt-12 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2"><span className={`text-3xl font-bold transform hover:scale-105 transition-transform  'text-indigo-600'`}>
                π<span className="text-pink-500">Jam</span> Foundation
              </span></h1>
              <p className="text-blue-100 opacity-90">Manage and review your educational challenges</p>
            </div>
            
            {/* <button
              onClick={handleCreateNew}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Challenge
            </button> */}
          </div>
          
          {/* Search bar */}
          <div className="relative mb-5">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            
            <input
              type="text"
              className="block w-full pl-11 pr-10 py-3 border-0 rounded-xl shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700 placeholder-white"
              placeholder="Search challenges by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {/* Filter and view controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-blue-100">Sort by:</span>
              <SortOptions />
            </div>
            
            <ViewToggle />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8 -mt-6">
        {/* Challenge count */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={loading ? 'loading' : 'results'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-100 inline-flex items-center"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin mr-3 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-700 font-medium">Loading challenges...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="font-semibold text-blue-600 mr-1">{filteredChallenges.length}</span>
                <span className="text-gray-700">{filteredChallenges.length === 1 ? 'Challenge' : 'Challenges'} Found</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Challenge cards */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {renderSkeletons()}
            </div>
          ) : filteredChallenges.length > 0 ? (
            viewMode === "grid" ? renderGridView() : renderListView()
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
        
        {/* Pagination */}
        {!loading && filteredChallenges.length > 0 && totalPages > 1 && <Pagination />}
      </div>
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
};

export default Challenges;