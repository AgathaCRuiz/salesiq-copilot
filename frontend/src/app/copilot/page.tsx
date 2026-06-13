'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Search,
  Send,
  Sparkles,
  Tag,
  Layers,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  RotateCcw,
} from 'lucide-react';
import { api, ProductContext, ChatMessage, InitResponse } from '../../services/api';

const TONES = [
  { value: 'Profissional', label: 'Profissional' },
  { value: 'Amigável', label: 'Amigável' },
  { value: 'Persuasivo', label: 'Persuasivo' },
];

const SUGGESTED_PRODUCTS = ['Smartwatch', 'Fone Bluetooth', 'Teclado Mecânico', 'Ring Light'];

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const map: Record<string, { icon: React.ReactNode; color: string }> = {
    Alta: { icon: <ShieldCheck className="h-3 w-3" />, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    Média: { icon: <ShieldAlert className="h-3 w-3" />, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    Baixa: { icon: <ShieldQuestion className="h-3 w-3" />, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  };
  const style = map[confidence] ?? map['Baixa'];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.color}`}>
      {style.icon} Confiança {confidence}
    </span>
  );
}

export default function CopilotPage() {
  // Etapa 1 — Setup
  const [query, setQuery] = useState('');
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [contextError, setContextError] = useState<string | null>(null);
  const [initData, setInitData] = useState<InitResponse | null>(null);

  // Etapa 2 — Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [tone, setTone] = useState('Profissional');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLoadContext = async (productQuery: string) => {
    if (!productQuery.trim()) return;
    setIsLoadingContext(true);
    setContextError(null);
    setInitData(null);
    setMessages([]);
    try {
      const data = await api.initCopilot(productQuery);
      setInitData(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar produto.';
      setContextError(msg);
    } finally {
      setIsLoadingContext(false);
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !initData) return;

    const userMessage: ChatMessage = { role: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoadingChat(true);
    setChatError(null);

    try {
      const response = await api.chatWithContext({
        question: userMessage.content,
        context: initData.context,
        tone,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        confidence: response.confidence,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao processar resposta.';
      setChatError(msg);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleReset = () => {
    setInitData(null);
    setMessages([]);
    setQuery('');
    setContextError(null);
    setChatError(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <Bot className="h-3.5 w-3.5" /> Copiloto Integrado
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Copiloto de Atendimento
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">
          Carregue um produto real do Mercado Livre e responda perguntas de clientes com dados concretos — sem inventar informações.
        </p>
      </header>

      {/* ETAPA 1 — Setup */}
      {!initData && (
        <div className="max-w-2xl">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                Qual produto você vende?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all"
                    placeholder="Ex: Smartwatch, Fone Bluetooth..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoadContext(query)}
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>
                <button
                  onClick={() => handleLoadContext(query)}
                  disabled={isLoadingContext || !query.trim()}
                  className="px-5 py-3 bg-linear-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                >
                  {isLoadingContext ? 'Carregando...' : 'Carregar'}
                </button>
              </div>

              {/* Sugestões */}
              <div className="flex flex-wrap gap-2 mt-3 items-center">
                <span className="text-xs text-slate-500">Sugestões:</span>
                {SUGGESTED_PRODUCTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setQuery(p); handleLoadContext(p); }}
                    className="text-xs bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-3 py-1 rounded-full border border-slate-800/80 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading */}
            {isLoadingContext && (
              <div className="flex items-center gap-3 text-slate-400 text-sm p-4 bg-slate-950/40 rounded-xl">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-400 border-t-transparent shrink-0" />
                Buscando dados reais no Mercado Livre...
              </div>
            )}

            {/* Erro */}
            {contextError && (
              <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Falha ao carregar produto</p>
                  <p className="mt-0.5">{contextError}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ETAPA 2 — Chat com contexto */}
      {initData && (
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Sidebar — Contexto do Produto */}
          <div className="lg:col-span-4 space-y-4">

            {/* Header do produto */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Produto Carregado</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                  title="Trocar produto"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-100 mb-1">{initData.context.category_name}</h2>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-3">
                <ChevronRight className="h-3 w-3" />
                {initData.context.category_path}
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-slate-950/40 rounded-lg">
                <Layers className="h-4 w-4 text-violet-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Itens no mercado</p>
                  <p className="text-sm font-bold text-slate-100">
                    {initData.context.total_items_in_market.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>

            {/* Resumo IA */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5" /> Resumo do Produto
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">{initData.summary}</p>
            </div>

            {/* Marcas */}
            {initData.context.top_brands.length > 0 && (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Tag className="h-3.5 w-3.5" /> Principais Marcas
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {initData.context.top_brands.slice(0, 8).map((brand) => (
                    <span key={brand} className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tom */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tom da Resposta</h3>
              <div className="flex flex-col gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                      tone === t.value
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm flex flex-col" style={{ minHeight: '520px' }}>

              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-800/80 flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-400" />
                <span className="font-bold text-slate-200 text-sm">Atendimento com Dados Reais</span>
                <span className="ml-auto text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                  Fonte: Mercado Livre
                </span>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
                    <Bot className="h-10 w-10 mb-3 text-slate-700" />
                    <p className="text-sm font-semibold text-slate-400">Pronto para atender!</p>
                    <p className="text-xs mt-1 max-w-xs">
                      Digite a pergunta do cliente abaixo. A IA responderá com base nos dados reais do Mercado Livre.
                    </p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-sm'
                          : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>

                      {/* Metadados da resposta IA */}
                      {msg.role === 'assistant' && msg.confidence && (
                        <div className="flex flex-wrap items-center gap-2 px-1">
                          <ConfidenceBadge confidence={msg.confidence} />
                          {msg.sources && msg.sources.length > 0 && (
                            <span className="text-[10px] text-slate-500">
                              Fonte: {msg.sources.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading da resposta */}
                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-slate-400">Consultando dados reais...</span>
                    </div>
                  </div>
                )}

                {/* Erro do chat */}
                {chatError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    {chatError}
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="px-6 py-4 border-t border-slate-800/80">
                <form onSubmit={handleSendQuestion} className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all"
                    placeholder="Digite a pergunta do cliente..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={isLoadingChat}
                  />
                  <button
                    type="submit"
                    disabled={isLoadingChat || !question.trim()}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}