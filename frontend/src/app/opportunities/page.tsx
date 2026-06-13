'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Layers,
  AlertCircle,
  Lightbulb,
  Compass,
  Tag,
  Tag as BrandTag,
  ChevronRight,
} from 'lucide-react';
import { api, MarketAnalysisResponse } from '../../services/api';

const RECOMMENDED_SEARCHES = ['Smartwatch', 'Fone Bluetooth', 'Teclado Mecânico', 'Ring Light'];

export default function OpportunitiesPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarketAnalysisResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await fetchData(query);
  };

  const handleQuickSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    await fetchData(searchQuery);
  };

  const fetchData = async (q: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.searchAndAnalyzeMarket(q);
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao buscar dados do Mercado Livre.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getCompetitionBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'baixa': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'média':
      case 'media': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'alta': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'saturado':
      case 'saturada': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700/50';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <TrendingUp className="h-3.5 w-3.5" /> Lead Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Análise de Oportunidades
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">
          Consulte dados reais do Mercado Livre e obtenha relatórios de IA que mapeiam concorrência, marcas e estratégias de diferenciação.
        </p>
      </header>

      {/* Search */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              required
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all"
              placeholder="Pesquise por produto ou nicho..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3.5 bg-linear-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? 'Analisando...' : 'Analisar'}
          </button>
        </form>
        <div className="flex flex-wrap gap-2 mt-3 items-center">
          <span className="text-xs text-slate-500">Sugestões rápidas:</span>
          {RECOMMENDED_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleQuickSearch(term)}
              className="text-xs bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full border border-slate-800/80 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs mb-8 max-w-2xl">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Falha na análise</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-800/40 border-dashed rounded-3xl min-h-100 text-center">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-indigo-500/10 border-b-indigo-500 animate-spin" />
          </div>
          <h3 className="font-bold text-slate-300 text-lg">Processando Lead Intelligence</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            Consultando API do Mercado Livre e gerando relatório com IA...
          </p>
        </div>
      )}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Total Items */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <Layers className="h-5 w-5 text-violet-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Itens na Categoria</p>
              <p className="text-xl font-bold text-slate-100 mt-1">
                {(result.metrics.total_items_in_market ?? 0).toLocaleString('pt-BR')}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">{result.metrics.category_name}</p>
            </div>

            {/* Category Path */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <ChevronRight className="h-5 w-5 text-indigo-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Hierarquia</p>
              <p className="text-sm font-semibold text-slate-100 mt-1 leading-snug">
                {result.metrics.category_path ?? 'N/A'}
              </p>
            </div>

            {/* Top Brands */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <BrandTag className="h-5 w-5 text-fuchsia-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Principais Marcas</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(result.metrics.top_brands ?? []).slice(0, 5).map((brand) => (
                  <span key={brand} className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Key Attributes + Related Categories */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* Key Attributes */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Atributos Técnicos do Nicho</h2>
              <div className="space-y-3">
                {(result.metrics.key_attributes ?? []).slice(0, 6).map((attr) => (
                  <div key={attr.name}>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{attr.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {attr.values.map((val) => (
                        <span key={val} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Categories */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-4">Categorias Relacionadas</h2>
              <div className="space-y-2">
                {(result.metrics.related_categories ?? []).map((cat) => (
                  <div key={cat.id} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
                    {cat.name}
                    <span className="text-[10px] text-slate-500 ml-auto">{cat.id}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* AI Report */}
          <div className="bg-linear-to-br from-violet-950/10 via-slate-900/40 to-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-violet-400" /> Relatório Estratégico
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Interpretado pelo Groq Llama-3.3-70b</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Concorrência:</span>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getCompetitionBadgeColor(result.analysis.competition_level)}`}>
                  {result.analysis.competition_level}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Análise de Mercado</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{result.analysis.competition_analysis}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 bg-slate-950/30 border border-slate-900 p-5 rounded-2xl">
                <div>
                  <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Faixa de Preço de Entrada
                  </h3>
                  <p className="text-xl font-extrabold text-slate-100">{result.analysis.ideal_price_range}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Justificativa</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.analysis.price_strategy}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-violet-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" /> Oportunidades
                  </h3>
                  <ul className="space-y-2.5">
                    {result.analysis.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Abordagem Comercial</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.analysis.commercial_approach}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-800/40 border-dashed rounded-3xl min-h-87.5 text-center">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-slate-900 text-slate-600 border border-slate-800 mb-4">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-slate-400 text-lg">Aguardando Análise</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5">
            Insira um produto ou nicho para iniciar o mapeamento do Mercado Livre.
          </p>
        </div>
      )}
    </div>
  );
}