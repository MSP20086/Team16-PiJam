import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext";

const useSubmitChallenge = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuthContext();
  const submitChallenge = async ({
    title,
    description,
    deadline,
    criteria,
    rubric,
    referenceFiles = []
  }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      
      // Add text data
      formData.append('title', title);
      formData.append('description', description);
      formData.append('deadline', deadline);
      formData.append('criteria', JSON.stringify(criteria));
      formData.append('rubric', JSON.stringify(rubric));
      
      // Add reference material files
      if (referenceFiles.length > 0) {
        referenceFiles.forEach(file => {
          formData.append('refMaterials', file);
          console.log(file)
        });
      }

      // Make the API request
      const response = await axios.post('http://localhost:5000/api/teacher/challenge/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${user.token}`,
        }
      });
      console.log(formData)
      setSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create challenge';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitChallenge,
    isLoading,
    error,
    success
  };
};

export default useSubmitChallenge;