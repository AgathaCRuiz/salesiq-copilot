'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  DollarSign, 
  Users, 
  Layers, 
  Truck, 
  AlertCircle,
  Lightbulb,
  Compass,
  Tag,
  Activity
} from 'lucide-react';
import { api, MarketAnalysisResponse } from '../../services/api';
import PriceDistributionChart from '../../components/PriceDistributionChart';
import TopProductsTable from '../../components/TopProductsTable';

const RECOMMENDED_SEARCHES = ['Smartwatch', 'Fone Bluetooth', 'Teclado Mecânico', 'Ring Light'];

export default function OpportunitiesPage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MarketAnalysisResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.searchAndAnalyzeMarket(query);
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao buscar dados do Mercado Livre. Verifique se o backend está online.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.searchAndAnalyzeMarket(searchQuery);
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao buscar dados do Mercado Livre.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  const getCompetitionBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'baixa':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'média':
      case 'media':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'alta':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'saturado':
      case 'saturada':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700/50';
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
          Consulte dados agregados reais do Mercado Livre e obtenha relatórios de IA que mapeiam preços de entrada, nível de concorrência e estratégias de diferenciação.
        </p>
      </header>

      {/* Search Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              required
              className="w-full bg-slate-900/40 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all"
              placeholder="Pesquise por produto, nicho ou categoria no Mercado Livre..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-550" />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-violet-500/35"
          >
            {isLoading ? 'Analisando...' : 'Analisar'}
          </button>
        </form>

        {/* Quick searches */}
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

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs mb-8 animate-fade-in max-w-2xl">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Falha na análise</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/10 border border-slate-850/60 border-dashed rounded-3xl min-h-[400px] text-center">
          <div className="relative h-16 w-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-indigo-500/10 border-b-indigo-500 animate-spin animate-reverse" />
          </div>
          <h3 className="font-bold text-slate-300 text-lg">Processando Lead Intelligence</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            Consumindo dados em tempo real da API do Mercado Livre e gerando relatório interpretado por IA na Groq...
          </p>
        </div>
      )}

      {/* Results Section */}
      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Avg Price */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <DollarSign className="h-5 w-5 text-indigo-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Preço Médio</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{formatCurrency(result.metrics.avg_price)}</p>
            </div>

            {/* Total Listings */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
              <Layers className="h-5 w-5 text-violet-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Anúncios Ativos</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{result.metrics.total_listings.toLocaleString()}</p>
            </div>

            {/* Competitors */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />
              <Users className="h-5 w-5 text-fuchsia-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Sellers Concorrentes</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{result.metrics.unique_sellers}</p>
            </div>

            {/* Free Shipping */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <Truck className="h-5 w-5 text-emerald-400 mb-3" />
              <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Frete Grátis (%)</p>
              <p className="text-xl font-bold text-slate-100 mt-1">{Math.round(result.metrics.free_shipping_ratio * 100)}%</p>
            </div>

          </div>

          {/* Graphs & Products Section */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Price Graph */}
            <div className="lg:col-span-5 flex flex-col">
              <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-indigo-400" /> Comparativo de Preços
              </h2>
              <PriceDistributionChart 
                minPrice={result.metrics.min_price}
                avgPrice={result.metrics.avg_price}
                maxPrice={result.metrics.max_price}
              />
            </div>

            {/* Products Table */}
            <div className="lg:col-span-7 flex flex-col">
              <h2 className="text-sm font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-violet-400" /> Anúncios Populares ( MLB )
              </h2>
              <TopProductsTable products={result.metrics.top_products} />
            </div>
          </div>

          {/* AI Intelligence Report */}
          <div className="bg-gradient-to-br from-violet-950/10 via-slate-900/40 to-slate-900/40 border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                  <Compass className="h-5.5 w-5.5 text-violet-400" /> Relatório Estratégico de Inteligência
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Mapeado e interpretado pelo Groq Llama-3.3</p>
              </div>

              {/* Competition Badge */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Concorrência:</span>
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border ${getCompetitionBadgeColor(result.analysis.competition_level)} shadow-md`}>
                  {result.analysis.competition_level}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Competition Analysis */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Análise de Mercado</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{result.analysis.competition_analysis}</p>
              </div>

              {/* Entry Price & Strategy */}
              <div className="grid md:grid-cols-2 gap-6 bg-slate-950/30 border border-slate-900 p-5 rounded-2xl">
                
                <div>
                  <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase mb-1.5 flex items-center gap-1.5">
                    <Tag className="h-4 w-4" /> Faixa de Preço de Entrada Recomendada
                  </h3>
                  <p className="text-xl font-extrabold text-slate-100">{result.analysis.ideal_price_range}</p>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                    Faixa ótima calculada para atrair cliques e preservar margens competitivas.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1.5">Justificativa da Estratégia</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.analysis.price_strategy}</p>
                </div>

              </div>

              {/* Opportunities & Approach */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Opportunities list */}
                <div>
                  <h3 className="text-xs font-bold text-violet-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4" /> Oportunidades de Diferenciação
                  </h3>
                  <ul className="space-y-2.5">
                    {result.analysis.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
                        <span className="h-2 w-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Commercial Approach */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">Abordagem Comercial Sugerida</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">{result.analysis.commercial_approach}</p>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* Empty State */}
      {!result && !isLoading && (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/10 border border-slate-800/40 border-dashed rounded-3xl min-h-[350px] text-center text-slate-500">
          <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-slate-900 text-slate-600 border border-slate-800 mb-4 animate-pulse">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-slate-400 text-lg">Aguardando Análise</h3>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5">
            Insira o nome de um produto ou termo de vendas na barra superior para iniciar o mapeamento em tempo real do Mercado Livre.
          </p>
        </div>
      )}
    </div>
  );
}
