import { useState, useEffect, useCallback } from 'react';

// custom hook to fetch data easily
export function useFetch(link) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // function to get the data
  const loadData = useCallback(async (signal) => {
    if (!link) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(link, { signal });
      
      // check if request was successful
      if (!res.ok) {
        throw new Error(`Server status: ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  }, [link]);

  // fetch data when link changes
  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);

    // cleanup on unmount
    return () => {
      controller.abort();
    };
  }, [link, loadData]);

  // allow manual refresh
  const refresh = () => {
    const controller = new AbortController();
    loadData(controller.signal);
  };

  return { data, loading, error, refetch: refresh };
}

export default useFetch;
