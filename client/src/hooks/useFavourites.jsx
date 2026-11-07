import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'matchday-favourites';

function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return new Set();
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(
      parsed.filter(
        (item) =>
          typeof item === 'string' &&
          item.trim()
      )
    );
  } catch {
    return new Set();
  }
}

export default function useFavourites() {
  const [favs, setFavs] = useState(loadFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...favs])
      );
    } catch {
      return;
    }
  }, [favs]);

  const toggle = useCallback((team) => {
    if (!team) return;

    setFavs((current) => {
      const next = new Set(current);

      if (next.has(team)) {
        next.delete(team);
      } else {
        next.add(team);
      }

      return next;
    });
  }, []);

  const isFavMatch = useCallback(
    (match) => {
      return Boolean(
        (match?.home && favs.has(match.home)) ||
        (match?.away && favs.has(match.away))
      );
    },
    [favs]
  );

  return {
    favs,
    toggle,
    isFavMatch
  };
}