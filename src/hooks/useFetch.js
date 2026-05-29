import { useState, useEffect, useCallback } from 'react';

// Custom hook to fetch data from any API URL
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback is used to keep the function reference stable
  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      
      // if response status is not ok (e.g. 404 or 500)
      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // useEffect triggers the fetch whenever the url changes
  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  // return the values required by the assignment, plus refetch for retry buttons
  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
