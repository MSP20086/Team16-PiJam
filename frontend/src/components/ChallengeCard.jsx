import React from "react";
import { Calendar, Clock, Users } from "lucide-react";
import Card from "./Card";
import Button from "./Button";
import TagBadge from "./TagBadge";
import Tooltip from "./Tooltip";

// Helper functions
const getDaysRemaining = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusBadge = (status, daysRemaining) => {
  if (status === "upcoming") {
    return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Upcoming</span>;
  } else if (daysRemaining <= 3) {
    return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Ending Soon</span>;
  } else {
    return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>;
  }
};

const getDifficultyBadge = (difficulty) => {
  const colors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800"
  };
  
  return (
    <span className={`px-2 py-1 ${colors[difficulty]} text-xs rounded-full capitalize`}>
      {difficulty}
    </span>
  );
};

const ChallengeCard = ({ 
  challenge, 
  viewMode = "grid",
  onViewDetails,
  className = ""
}) => {
  const daysRemaining = getDaysRemaining(challenge.deadline);
  
  return (
    <Card 
      title={challenge.title}
      className={`${viewMode === "list" ? "flex-col md:flex-row" : ""} transition-all hover:shadow-lg ${className}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            {getStatusBadge(challenge.status, daysRemaining)}
            {getDifficultyBadge(challenge.difficulty)} {/* Uncommented this line */}
          </div>
          
          <p className="text-gray-700 mb-3">{challenge.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {challenge.tags.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <Tooltip content="Challenge deadline">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{challenge.deadline}</span>
              </div>
            </Tooltip>
            
            <Tooltip content="Time remaining">
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{daysRemaining} days left</span>
              </div>
            </Tooltip>
          </div>
          
          <Tooltip content="Number of participants">
            <span className="text-sm text-gray-500 flex items-center">
              <Users size={16} className="mr-1" />
              {challenge.participants}
            </span>
          </Tooltip>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={() => onViewDetails(challenge.id)} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;