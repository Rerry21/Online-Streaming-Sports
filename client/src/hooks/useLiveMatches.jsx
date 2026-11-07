import { useCallback, useEffect, useState } from 'react';
import { fetchLiveMatches } from '../services/api';

export default function useLiveMatches(sport = null) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchLiveMatches(sport);

      setMatches(
        Array.isArray(data) ? data : []
      );

      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [sport]);

  useEffect(() => {
    let timer = null;
    let active = true;

    async function refresh() {
      if (!active || document.hidden) return;

      try {
        const data = await fetchLiveMatches(sport);

        if (!active) return;

        setMatches(
          Array.isArray(data) ? data : []
        );

        setError(null);
      } catch (err) {
        if (active) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    function startPolling() {
      if (document.hidden || !active) return;

      refresh();

      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(refresh, 30000);
    }

    function stopPolling() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    }

    startPolling();

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      active = false;
      stopPolling();

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [sport]);

  return {
    matches,
    loading,
    error,
    refresh: load
  };
}