import React from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';

export default function Home() {
  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      {/* Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Dashboard Inicial
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Boas-vindas ao <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">SalesIQ Copilot</span>
          </h1>
          <p className="mt-3 text-slate-400 text-lg max-w-2xl">
            Otimize seu atendimento, supere objeções de clientes e descubra oportunidades lucrativas no Mercado Livre com o poder da Inteligência Artificial.
          </p>
        </div>
      </header>

      {/* Grid of Main Modules */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Module 1: Simulator */}
        <Link 
          href="/simulator" 
          className="group relative flex flex-col justify-between p-8 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-3xl transition-all duration-300 shadow-xl overflow-hidden"
        >
          {/* Neon background light effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl group-hover:bg-indigo-600/10 transition-all duration-300" />
          
          <div>
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
              Simulador de Atendimento
            </h2>
            <p className="mt-3 text-slate-400 group-hover:text-slate-300 transition-colors text-sm leading-relaxed">
              Cole mensagens recebidas de seus clientes e gere respostas de vendas persuasivas com argumentos de valor estruturados, tratamento de objeções ocultas e CTAs focados em conversão.
            </p>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Começar Simulação <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Module 2: Lead Intelligence */}
        <Link 
          href="/opportunities" 
          className="group relative flex flex-col justify-between p-8 bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800 hover:border-violet-500/50 rounded-3xl transition-all duration-300 shadow-xl overflow-hidden"
        >
          {/* Neon background light effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 rounded-full blur-3xl group-hover:bg-violet-600/10 transition-all duration-300" />
          
          <div>
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 group-hover:text-white transition-colors">
              Análise de Oportunidades
            </h2>
            <p className="mt-3 text-slate-400 group-hover:text-slate-300 transition-colors text-sm leading-relaxed">
              Pesquise qualquer produto ou categoria no Mercado Livre e obtenha métricas agregadas reais (preços, concorrência, frete grátis) combinadas com análises estratégicas de IA.
            </p>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-violet-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
            Analisar Mercado <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Tech stack / info banner */}
      <div className="p-6 bg-slate-900/20 border border-slate-800/60 rounded-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-850 text-slate-400 border border-slate-850">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-slate-200 text-sm font-semibold">Status do Servidor API</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-slate-400">FastAPI conectado à API pública do Mercado Livre</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Groq Llama-3.3 IA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
            <span>Visualização Recharts</span>
          </div>
        </div>
      </div>
    </div>
  );
}
