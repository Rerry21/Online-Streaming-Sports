import { useEffect, useState } from 'react';
import { fetchMatches } from '../services/api';

export default function useMatches(sport = null) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    fetchMatches(sport)
      .then((data) => {
        if (!active) return;

        setMatches(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
         if(!active) return;

         setError(err);
         setMatches([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [sport]);
  
  return {
    matches,
    loading,
    error
  };
}