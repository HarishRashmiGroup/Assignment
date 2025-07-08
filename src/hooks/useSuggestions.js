import { useState, useEffect } from 'react';
import { getSuggestions } from '../services/api/suggestionApi';

export default function useSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuggestions().then(data => {
      setSuggestions(data);
      setLoading(false);
    });
  }, []);

  return { suggestions, loading };
} 