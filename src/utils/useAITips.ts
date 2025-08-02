import { useEffect, useState } from 'react';
import axios from 'axios';

export const useAITips = (userId: number | null) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('Fetching AI tips for userId:', userId);
    if (!userId) return;

    const fetchTips = async () => {
      try {
        setLoading(true);
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get(`${API_URL}/api/analyze-transactions?user_id=${userId}`);
        console.log('AI tips response:', res.data);
        setTips(res.data.tips || []);
      } catch (err) {
        console.error('Failed to fetch AI tips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [userId]);

  return { tips, loading };
};
