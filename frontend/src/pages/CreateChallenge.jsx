import React, { useState } from "react";
import useSubmitChallenge from "./useSubmitChallenge";
import {
  Calendar,
  Clock,
  FileText,
  CheckSquare,
  AlertTriangle,
  PlusCircle,
  X,
  Upload,
  Book,
  MessageSquare,
} from "lucide-react";

const CreateChallengeForm = () => {
  const { submitChallenge, isLoading, error, success } = useSubmitChallenge();
  const [activeSection, setActiveSection] = useState("details");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [generateSampleAnswers, setGenerateSampleAnswers] = useState(true);
  const [expandedSample, setExpandedSample] = useState(null);
  const [challenge, setChallenge] = useState({
    title: "",
    description: "",
    deadline: "",
    criteria: {
      mid: 70,
      high: 85,
    },
    rubric: {
      criteria: [
        {
          parameter: "Creativity",
          weight: 20,
          description: "Originality and innovation in approach",
          sample:""
        },
        {
          parameter: "Technical Accuracy",
          weight: 40,
          description: "Correct implementation and methodology",
          sample:""
        },
        {
          parameter: "Presentation",
          weight: 20,
          description: "Quality of visual design and organization",
          sample:""
        },
        {
          parameter: "Analysis",
          weight: 20,
          description: "Depth of insight and critical thinking",
          sample:""
        },
      ],
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChallenge((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRubricChange = (index, field, value) => {
    const updatedCriteria = [...challenge.rubric.criteria];
    updatedCriteria[index][field] =
      field === "weight" ? parseInt(value, 10) : value;
    setChallenge((prev) => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        criteria: updatedCriteria,
      },
    }));
  };

  const handleCriteriaChange = (field, value) => {
    setChallenge((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [field]: parseInt(value, 10),
      },
    }));
  };

  const addRubricCriteria = () => {
    setChallenge((prev) => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        criteria: [
          ...prev.rubric.criteria,
          { parameter: "", weight: 0, description: "" ,sample:""},
        ],
      },
    }));
  };

  const removeRubricCriteria = (index) => {
    const updatedCriteria = challenge.rubric.criteria.filter(
      (_, i) => i !== index
    );
    setChallenge((prev) => ({
      ...prev,
      rubric: {
        ...prev.rubric,
        criteria: updatedCriteria,
      },
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await submitChallenge({
        title: challenge.title,
        description: challenge.description,
        deadline: challenge.deadline,
        criteria: challenge.criteria,
        rubric: challenge.rubric,
        referenceFiles: selectedFiles,
      });

      console.log("Challenge created:", result);
      // Reset form or redirect after successful submission
    } catch (err) {
      console.error("Error submitting challenge:", err);
    }
  };

  const totalWeight = challenge.rubric.criteria.reduce(
    (sum, item) => sum + item.weight,
    0
  );
  const isWeightValid = totalWeight === 100;

  // Get a color for each rubric parameter
  const getParameterColor = (index) => {
    const colors = [
      "bg-purple-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    return colors[index % colors.length];
  };

  const getParameterLightColor = (index) => {
    const colors = [
      "bg-purple-100",
      "bg-blue-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-pink-100",
      "bg-indigo-100",
      "bg-red-100",
      "bg-teal-100",
    ];
    return colors[index % colors.length];
  };

  const getParameterTextColor = (index) => {
    const colors = [
      "text-purple-600",
      "text-blue-600",
      "text-green-600",
      "text-yellow-600",
      "text-pink-600",
      "text-indigo-600",
      "text-red-600",
      "text-teal-600",
    ];
    return colors[index % colors.length];
  };

  const getParameterBorderColor = (index) => {
    const colors = [
      "border-purple-200",
      "border-blue-200",
      "border-green-200",
      "border-yellow-200",
      "border-pink-200",
      "border-indigo-200",
      "border-red-200",
      "border-teal-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create New Challenge
          </h1>
          <p className="text-gray-500">
            Design your challenge with evaluation criteria
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg">
            Challenge created successfully!
          </div>
        )}

        <div className="flex gap-6">
          {/* Navigation Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-4">
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveSection("details")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeSection === "details" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "hover:bg-gray-50"}`}
              >
                <FileText className="w-5 h-5 mr-3" />
                <span className="font-medium">Challenge Details</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSection("rubric")}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${activeSection === "rubric" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "hover:bg-gray-50"}`}
              >
                <CheckSquare className="w-5 h-5 mr-3" />
                <span className="font-medium">Evaluation Rubric</span>
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div
                className={`flex items-center ${isWeightValid ? "text-green-600" : "text-red-500"}`}
              >
                <div className="w-3 h-3 rounded-full mr-2 bg-current"></div>
                <span className="text-sm font-medium">
                  {isWeightValid
                    ? "Rubric weights valid"
                    : `Total weight: ${totalWeight}%`}
                </span>
              </div>
              <div className="mt-4">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateSampleAnswers}
                    onChange={() =>
                      setGenerateSampleAnswers(!generateSampleAnswers)
                    }
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
                  />
                  Generate sample answers
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              {activeSection === "details" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-500">
                    <h2 className="text-lg font-semibold p-6 text-white">
                      Challenge Details
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Challenge Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={challenge.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter an engaging title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={challenge.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Provide detailed instructions for participants"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          Deadline Date
                        </div>
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={challenge.deadline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center">
                          <Book className="w-4 h-4 mr-2 text-gray-500" />
                          Reference Materials
                        </div>
                      </label>

                      <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <input
                          type="file"
                          id="file-upload"
                          onChange={handleFileChange}
                          multiple
                          className="hidden"
                        />
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer block"
                        >
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDFs, documents, images, etc.
                          </p>
                        </label>
                      </div>

                      {selectedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">
                            Uploaded Files:
                          </h4>
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100"
                            >
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-blue-500 mr-2" />
                                <span className="text-sm">{file.name}</span>
                                <span className="ml-2 text-xs text-gray-500">
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="p-1 hover:bg-blue-100 rounded-full"
                              >
                                <X className="w-4 h-4 text-blue-500" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Grading Thresholds
                      </label>
                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            Medium Score Threshold (%)
                          </label>
                          <input
                            type="number"
                            value={challenge.criteria.mid}
                            onChange={(e) =>
                              handleCriteriaChange("mid", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="99"
                            required
                          />
                          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${challenge.criteria.mid}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            High Score Threshold (%)
                          </label>
                          <input
                            type="number"
                            value={challenge.criteria.high}
                            onChange={(e) =>
                              handleCriteriaChange("high", e.target.value)
                            }
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            max="100"
                            required
                          />
                          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500"
                              style={{ width: `${challenge.criteria.high}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "rubric" && (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-500">
                    <h2 className="text-lg font-semibold p-6 text-white">
                      Evaluation Rubric
                    </h2>
                  </div>

                  <div className="p-6">
                    {!isWeightValid && (
                      <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center text-sm">
                        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>
                          Total weight must equal 100% (currently {totalWeight}
                          %)
                        </span>
                      </div>
                    )}

                    <div className="space-y-6 mb-6">
                      {challenge.rubric.criteria.map((item, index) => (
                        <div
                          key={index}
                          className={`rounded-lg border ${getParameterBorderColor(index)} overflow-hidden`}
                        >
                          <div
                            className={`p-4 flex justify-between items-center ${getParameterLightColor(index)}`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-6 h-6 rounded-full ${getParameterColor(index)} flex items-center justify-center text-white font-bold`}
                              >
                                {index + 1}
                              </div>
                              <input
                                type="text"
                                value={item.parameter}
                                onChange={(e) =>
                                  handleRubricChange(
                                    index,
                                    "parameter",
                                    e.target.value
                                  )
                                }
                                className={`ml-3 px-3 py-1 bg-white font-medium rounded-lg focus:ring-2 focus:ring-blue-400 ${getParameterTextColor(index)}`}
                                placeholder="Parameter name"
                                required
                              />
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <label className="mr-2 text-sm text-gray-600">
                                  Weight:
                                </label>
                                <input
                                  type="number"
                                  value={item.weight}
                                  onChange={(e) =>
                                    handleRubricChange(
                                      index,
                                      "weight",
                                      e.target.value
                                    )
                                  }
                                  className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 text-center"
                                  min="0"
                                  max="100"
                                  required
                                />
                                <span className="ml-1 text-gray-600">%</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeRubricCriteria(index)}
                                className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                                disabled={challenge.rubric.criteria.length <= 1}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) =>
                                  handleRubricChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                                placeholder="Description of criteria"
                                required
                              />
                            </div>

                            {!generateSampleAnswers && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Sample Answer
                                </label>
                                <textarea
                                  value={item.sampleAnswer}
                                  onChange={(e) =>
                                    handleRubricChange(
                                      index,
                                      "sampleAnswer",
                                      e.target.value
                                    )
                                  }
                                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 ${expandedSample === index ? "h-24" : "h-10"}`}
                                  placeholder="Example of good answer"
                                  onFocus={() => setExpandedSample(index)}
                                  onBlur={() => setExpandedSample(null)}
                                />
                                {expandedSample !== index &&
                                  item.sampleAnswer && (
                                    <div
                                      className={`mt-1 text-xs ${getParameterTextColor(index)} cursor-pointer`}
                                      onClick={() => setExpandedSample(index)}
                                    >
                                      Click to expand sample
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addRubricCriteria}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 flex items-center text-sm shadow-sm transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Add Parameter
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-lg text-white font-medium ${
                    isWeightValid
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } shadow-sm transition-all duration-200`}
                  disabled={!isWeightValid || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Challenge...
                    </div>
                  ) : (
                    "Create Challenge"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeForm;
