import { useState, useEffect, useCallback } from 'react';
import { api, InitResponse } from '../services/api';

const DEFAULT_NICHES = ['Smartwatch', 'Fone Bluetooth', 'Teclado Mecânico', 'Ring Light'];

export const NICHE_COLORS = [
  '#6366f1', '#a855f7', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6'
];

export interface NicheData {
  query: string;
  data: InitResponse | null;
  loading: boolean;
  error: string | null;
  color: string;
}

export function useNicheData() {
  const [niches, setNiches] = useState<NicheData[]>(
    DEFAULT_NICHES.map((q, i) => ({
      query: q,
      data: null,
      loading: true,
      error: null,
      color: NICHE_COLORS[i % NICHE_COLORS.length],
    }))
  );

  const fetchNiche = useCallback(async (query: string): Promise<InitResponse | null> => {
    try {
      return await api.initCopilot(query);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      const updated = await Promise.all(
        DEFAULT_NICHES.map(async (q, i) => {
          const result = await fetchNiche(q);
          return {
            query: q,
            data: result,
            loading: false,
            error: result ? null : `Falha ao carregar "${q}"`,
            color: NICHE_COLORS[i % NICHE_COLORS.length],
          };
        })
      );
      setNiches(updated);
    };
    loadAll();
  }, [fetchNiche]);

  const addNiche = async (query: string) => {
    if (!query.trim()) return;
    const already = niches.find(n => n.query.toLowerCase() === query.toLowerCase());
    if (already) return;

    const newEntry: NicheData = {
      query,
      data: null,
      loading: true,
      error: null,
      color: NICHE_COLORS[niches.length % NICHE_COLORS.length],
    };
    setNiches(prev => [...prev, newEntry]);

    const result = await fetchNiche(query);
    setNiches(prev => prev.map(n =>
      n.query === query
        ? { ...n, data: result, loading: false, error: result ? null : `Falha ao carregar "${query}"` }
        : n
    ));
  };

  const removeNiche = (query: string) => {
    setNiches(prev => prev.filter(n => n.query !== query));
  };

  const refreshNiche = async (query: string) => {
    setNiches(prev => prev.map(n => n.query === query ? { ...n, loading: true, data: null, error: null } : n));
    const result = await fetchNiche(query);
    setNiches(prev => prev.map(n =>
      n.query === query
        ? { ...n, data: result, loading: false, error: result ? null : `Falha ao recarregar "${query}"` }
        : n
    ));
  };

  return { niches, addNiche, removeNiche, refreshNiche };
}