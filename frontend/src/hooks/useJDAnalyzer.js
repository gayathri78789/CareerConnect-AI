import { useState, useEffect } from 'react';
import { getLatestAnalysis, analyzeJobDescription } from '../services/jdAnalyzerService.js';

export function useJDAnalyzer() {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0;

  useEffect(() => {
    getLatestAnalysis()
      .then((data) => {
        if (data && data.jobTitle) {
          setAnalysisResult(data);
          if (data.jobDescription) setJobDescription(data.jobDescription);
        }
      })
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage('');
    try {
      const data = await analyzeJobDescription(jobDescription);
      setAnalysisResult(data);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to reach AI service. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    jobDescription,
    setJobDescription,
    isAnalyzing,
    analysisResult,
    searchQuery,
    setSearchQuery,
    errorMessage,
    wordCount,
    handleAnalyze,
  };
}
