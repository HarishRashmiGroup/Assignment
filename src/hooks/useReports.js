import { useState, useEffect } from 'react';
import { getReports } from '../services/api/reportApi';

export default function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports().then(data => {
      setReports(data);
      setLoading(false);
    });
  }, []);

  return { reports, loading };
} 