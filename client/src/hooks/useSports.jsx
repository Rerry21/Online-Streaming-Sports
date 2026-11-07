import { useEffect, useState } from 'react';
import { fetchSports } from '../services/api';

export default function useSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  fetchSports()
     .then(setSports)
     .catch(setError)
     .finally(() => setLoading(false));
}, []);

return {sports, loading, error};

}