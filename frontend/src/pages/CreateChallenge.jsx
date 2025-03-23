import React, { useState } from 'react';
import { Calendar, Clock, FileText, CheckSquare, AlertTriangle, PlusCircle, X } from 'lucide-react';

const CreateChallengePage = () => {
  const [challenge, setChallenge] = useState({
    title: '',
    description: '',
    deadline: '',
    rubric: [
      { criteria: 'Creativity', weight: 30, lowCutoff: 30, mediumCutoff: 70 },
      { criteria: 'Technical Accuracy', weight: 40, lowCutoff: 30, mediumCutoff: 70 },
      { criteria: 'Presentation', weight: 30, lowCutoff: 30, mediumCutoff: 70 }
    ],
    shortlistCount: 5,
    enablePlagiarism: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChallenge(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRubricChange = (index, field, value) => {
    const updatedRubric = [...challenge.rubric];
    updatedRubric[index][field] = field === 'criteria' ? value : parseInt(value, 10);
    setChallenge(prev => ({
      ...prev,
      rubric: updatedRubric
    }));
  };

  const addRubricCriteria = () => {
    setChallenge(prev => ({
      ...prev,
      rubric: [...prev.rubric, { criteria: '', weight: 0, lowCutoff: 30, mediumCutoff: 70 }]
    }));
  };

  const removeRubricCriteria = (index) => {
    const updatedRubric = challenge.rubric.filter((_, i) => i !== index);
    setChallenge(prev => ({
      ...prev,
      rubric: updatedRubric
    }));
  };

  const togglePlagiarism = () => {
    setChallenge(prev => ({
      ...prev,
      enablePlagiarism: !prev.enablePlagiarism
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/challenges', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(challenge)
      // });
      // const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Challenge created:', challenge);
      
      // Show success message
      alert('Challenge created successfully!');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Error creating challenge. Please try again.');
      setIsSubmitting(false);
    }
  };

  const totalWeight = challenge.rubric.reduce((sum, item) => sum + item.weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Create New Challenge</h1>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
            </div>
          </div>
          <p className="text-blue-100 mt-1">Design your challenge with comprehensive evaluation criteria</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Challenge Basic Information */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Challenge Details
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Challenge Title</label>
              <input
                type="text"
                name="title"
                value={challenge.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter an engaging title for your challenge"
                required
                disabled={previewMode}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={challenge.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Provide detailed instructions for your students"
                required
                disabled={previewMode}
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Deadline Date
                </div>
              </label>
              <input
                type="date"
                name="deadline"
                value={challenge.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
                disabled={previewMode}
              />
            </div>
          </div>
          
          {/* Rubric Section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2">
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-2 text-blue-600" />
                Evaluation Rubric
              </div>
            </h2>
            
            {!isWeightValid && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Total weight must equal 100% (currently {totalWeight}%)
              </div>
            )}
            
            <div className="overflow-x-auto bg-blue-50 p-4 rounded-lg">
              <table className="w-full mb-4">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 rounded-lg">
                    <th className="p-3 text-left rounded-l-lg">Criteria</th>
                    <th className="p-3 text-left">Weight (%)</th>
                    <th className="p-3 text-left">Low Cutoff (%)</th>
                    <th className="p-3 text-left">Medium Cutoff (%)</th>
                    <th className="p-3 text-left rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  {challenge.rubric.map((item, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.criteria}
                          onChange={(e) => handleRubricChange(index, 'criteria', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          placeholder="Enter criteria name"
                          required
                          disabled={previewMode}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.weight}
                          onChange={(e) => handleRubricChange(index, 'weight', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          min="0"
                          max="100"
                          required
                          disabled={previewMode}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.lowCutoff}
                          onChange={(e) => handleRubricChange(index, 'lowCutoff', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          min="0"
                          max="100"
                          required
                          disabled={previewMode}
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={item.mediumCutoff}
                          onChange={(e) => handleRubricChange(index, 'mediumCutoff', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                          min="0"
                          max="100"
                          required
                          disabled={previewMode}
                        />
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => removeRubricCriteria(index)}
                          className="p-2 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                          disabled={challenge.rubric.length <= 1 || previewMode}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button
              type="button"
              onClick={addRubricCriteria}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center transition-colors"
              disabled={previewMode}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Criteria
            </button>
          </div>
          
          {/* Shortlisting Section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Shortlisting
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Number of Students to Shortlist</label>
              <input
                type="number"
                name="shortlistCount"
                value={challenge.shortlistCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                min="1"
                required
                disabled={previewMode}
              />
            </div>
          </div>
          
          {/* Additional Features Section */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-100 pb-2 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Additional Features
            </h2>
            
            <div className="flex items-center mb-2">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={challenge.enablePlagiarism}
                    onChange={togglePlagiarism}
                    disabled={previewMode}
                  />
                  <div className={`block w-14 h-8 rounded-full ${challenge.enablePlagiarism ? 'bg-blue-400' : 'bg-gray-300'} transition-colors duration-200`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${challenge.enablePlagiarism ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  Enable Plagiarism Detection
                </div>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-1">AI will automatically scan submissions for potential plagiarism</p>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-8 py-3 rounded-lg text-white font-medium flex items-center ${
                isWeightValid ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-400 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg`}
              disabled={!isWeightValid || isSubmitting || previewMode}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Challenge"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Missing icons definition
const Users = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const Settings = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default CreateChallengePage;
