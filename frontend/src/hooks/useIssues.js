import { useState, useEffect, useCallback } from 'react';
import { issueService } from '../services/issueService';

export const useIssues = (initialFilters = {}) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = useCallback(async (filters = initialFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await issueService.getIssues(filters);
      setIssues(data);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues(initialFilters);
  }, [fetchIssues]);

  return {
    issues,
    loading,
    error,
    refetch: fetchIssues
  };
};
