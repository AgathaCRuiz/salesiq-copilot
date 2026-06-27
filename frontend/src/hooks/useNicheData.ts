import { useState, useEffect, useCallback } from 'react';
import { api, InitResponse } from '../services/api';

const DEFAULT_NICHES = ['Smartwatch', 'Fone Bluetooth', 'Teclado Mecânico', 'Ring Light'];
const STORAGE_KEY = 'salesiq:niches';

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
  score: number | null;  // ✅ novo
}

// ── Score ─────────────────────────────────────────────────────────────────

function calculateScore(data: InitResponse): number {
  const volume = data.context.total_items_in_market ?? 0;
  const attributes = data.context.total_attributes ?? 0;

  if (volume === 0) return 0;

  // Fator 1: Volume (0-60 pts)
  // Escala logarítmica para diferenciar melhor
  const volumeScore = Math.min(60, Math.round(Math.log10(volume + 1) * 12));

  // Fator 2: Maturidade técnica via atributos (0-40 pts)
  // Nichos com mais atributos são mais estruturados e fáceis de se diferenciar
  let attributesScore = 0;
  if (attributes >= 40) attributesScore = 40;
  else if (attributes >= 25) attributesScore = 30;
  else if (attributes >= 15) attributesScore = 20;
  else if (attributes >= 5) attributesScore = 10;
  else attributesScore = 0;

  return Math.round(Math.min(100, volumeScore + attributesScore));
}

export function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 75) return { label: '🟢 Alta Oportunidade', color: 'text-emerald-400', bg: 'bg-emerald-500' };
  if (score >= 55) return { label: '🔵 Boa Oportunidade', color: 'text-indigo-400', bg: 'bg-indigo-500' };
  if (score >= 40) return { label: '🟡 Mercado Ativo', color: 'text-amber-400', bg: 'bg-amber-500' };
  if (score >= 25) return { label: '🟠 Mercado Pequeno', color: 'text-orange-400', bg: 'bg-orange-500' };
  return { label: '🔴 Sem Dados Suficientes', color: 'text-rose-400', bg: 'bg-rose-500' };
}

// ── Persistência ──────────────────────────────────────────────────────────

function loadSavedQueries(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_NICHES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_NICHES;
  } catch {
    return DEFAULT_NICHES;
  }
}

function saveQueries(queries: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queries));
  } catch {}
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useNicheData() {
  const [niches, setNiches] = useState<NicheData[]>([]);

  const fetchNiche = useCallback(async (query: string): Promise<InitResponse | null> => {
    try {
      return await api.initCopilot(query);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const savedQueries = loadSavedQueries();

    setNiches(savedQueries.map((q, i) => ({
      query: q,
      data: null,
      loading: true,
      error: null,
      color: NICHE_COLORS[i % NICHE_COLORS.length],
      score: null,
    })));

    const loadAll = async () => {
      const updated = await Promise.all(
        savedQueries.map(async (q, i) => {
          const result = await fetchNiche(q);
          return {
            query: q,
            data: result,
            loading: false,
            error: result ? null : `Falha ao carregar "${q}"`,
            color: NICHE_COLORS[i % NICHE_COLORS.length],
            score: result ? calculateScore(result) : null,
          };
        })
      );
      setNiches(updated);
    };

    loadAll();
  }, [fetchNiche]);

  useEffect(() => {
    if (niches.length === 0) return;
    saveQueries(niches.map(n => n.query));
  }, [niches]);

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
      score: null,
    };
    setNiches(prev => [...prev, newEntry]);

    const result = await fetchNiche(query);
    setNiches(prev => prev.map(n =>
      n.query === query
        ? { ...n, data: result, loading: false, error: result ? null : `Falha ao carregar "${query}"`, score: result ? calculateScore(result) : null }
        : n
    ));
  };

  const removeNiche = (query: string) => {
    setNiches(prev => prev.filter(n => n.query !== query));
  };

  const refreshNiche = async (query: string) => {
    setNiches(prev => prev.map(n =>
      n.query === query ? { ...n, loading: true, data: null, error: null, score: null } : n
    ));
    const result = await fetchNiche(query);
    setNiches(prev => prev.map(n =>
      n.query === query
        ? { ...n, data: result, loading: false, error: result ? null : `Falha ao recarregar "${query}"`, score: result ? calculateScore(result) : null }
        : n
    ));
  };

  return { niches, addNiche, removeNiche, refreshNiche };
}