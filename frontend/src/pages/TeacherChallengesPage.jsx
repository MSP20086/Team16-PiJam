import React, { useState, useEffect } from "react";
import { Filter, ChevronDown, Grid, List } from "lucide-react";
import Card from "../components/Card";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import SearchBar from "../components/SearchBar";
// import ChallengeCard from "../components/ChallengeCard";
import Pagination from "../components/Pagination";
import Tooltip from "../components/Tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ITEMS_PER_PAGE = 6;

const TeacherChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("deadline");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Paginated challenges
  const [paginatedChallenges, setPaginatedChallenges] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // routes
  const navigate = useNavigate();
  
  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/teacher/challenges');
        const { data } = response.data; // Assuming your ApiResponse structure has a 'data' field
        setChallenges(data);
        setFilteredChallenges(data);
        // console.log(response)
      } catch (error) {
        console.error('Error fetching challenges:', error);
        // Optionally handle error state
      } finally {
        setLoading(false);
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
        default:
          return 0;
      }
    });
    
    setFilteredChallenges(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [challenges, searchQuery, sortBy]);

  // Handle pagination
  useEffect(() => {
    const totalItems = filteredChallenges.length;
    const calculatedTotalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    setTotalPages(calculatedTotalPages || 1);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setPaginatedChallenges(filteredChallenges.slice(startIndex, endIndex));
  }, [filteredChallenges, currentPage]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSortBy("deadline");
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  // Handle view details
  const handleViewDetails = (challengeId) => {
    console.log(`Viewing details for challenge: ${challengeId}`);
    navigate(`/teacher/challenges/${challengeId}/submissions`);
  };

  // Format deadline date
  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Count submissions
  const getSubmissionCount = (submissions) => {
    return submissions ? submissions.length : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Challenge Hub</h1>
          <p className="text-blue-100 mb-6">Manage and review all your created challenges</p>
          
          {/* Search and filter bar */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search challenges by title or description..."
                initialValue={searchQuery}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Filter size={16} />
                Filters
                <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              <div className="flex gap-2 ml-auto">
                <Tooltip content="Grid view">
                  <Button 
                    onClick={() => setViewMode("grid")} 
                    className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <Grid size={16} />
                  </Button>
                </Tooltip>
                <Tooltip content="List view">
                  <Button 
                    onClick={() => setViewMode("list")} 
                    className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
                  >
                    <List size={16} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          </div>
          
          {/* Expanded filters */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select 
                  className="w-full p-2 border border-gray-200 rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="deadline">Deadline (Soonest First)</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <Button onClick={resetFilters} className="text-gray-700 bg-gray-100 hover:bg-gray-200">
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Results info */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {loading ? 'Loading challenges...' : `${filteredChallenges.length} Challenges Found`}
          </h2>
        </div>
        
        {/* Challenge cards */}
        {loading ? (
          // Loading skeletons
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredChallenges.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {paginatedChallenges.map((challenge) => (
              <Card key={challenge._id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{challenge.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{challenge.description}</p>
                    </div>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Deadline:</span>
                        <span className="font-medium">{formatDeadline(challenge.deadline)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Submissions:</span>
                        <span className="font-medium">{getSubmissionCount(challenge.submissions)}</span>
                      </div>
                      
                      {challenge.reference_materials && challenge.reference_materials.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Materials:</span>
                          <span className="font-medium">{challenge.reference_materials.length}</span>
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => handleViewDetails(challenge._id)}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Submissions
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No challenges found"
            description="Try adjusting your search criteria or create a new challenge."
          />
        )}
        
        {/* Pagination */}
        {filteredChallenges.length > 0 && totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherChallengesPage;