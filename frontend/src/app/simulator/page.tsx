'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  HelpCircle,
  Volume2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api, SimulationResponse } from '../../services/api';

const TONES = [
  { value: 'Profissional', label: 'Profissional', description: 'Credibilidade e respeito técnico' },
  { value: 'Amigável', label: 'Amigável/Empático', description: 'Uso leve de emojis e caloroso' },
  { value: 'Persuasivo', label: 'Persuasivo/Vendas', description: 'Gatilhos de escassez e urgência' }
];

const SUGGESTED_NICHES = [
  'Smartwatch Inteligente',
  'Fone Bluetooth com Cancelamento de Ruído',
  'Câmera de Segurança Wifi Externa',
  'Teclado Mecânico RGB Gamer',
  'Suplemento Whey Protein Isolado'
];

export default function SimulatorPage() {
  // Input states
  const [customerMessage, setCustomerMessage] = useState('');
  const [niche, setNiche] = useState('');
  const [tone, setTone] = useState('Profissional');

  // Request & UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerMessage.trim() || !niche.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.simulateCustomerReply({
        customer_message: customerMessage,
        niche: niche,
        tone: tone
      });
      setResult(response);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao processar simulação. Verifique se o backend está ativo.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.suggested_response) return;
    navigator.clipboard.writeText(result.suggested_response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageSquare className="h-3.5 w-3.5" /> Simulador de Vendas
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Simulador de Atendimento com IA
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">
          Cole a mensagem de um cliente, defina seu produto e o tom de voz. A IA gerará a melhor resposta estratégica de vendas baseada no contexto.
        </p>
      </header>

      {/* Main Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Side: Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-5">
            {/* Customer Message */}
            <div className="space-y-2">
              <label htmlFor="customer_message" className="block text-sm font-semibold text-slate-200">
                Mensagem do Cliente
              </label>
              <textarea
                id="customer_message"
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all resize-none"
                placeholder="Ex: Gostaria de saber se o produto tem garantia e se vem com nota fiscal? É confiável?"
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
              />
            </div>

            {/* Product Niche */}
            <div className="space-y-2">
              <label htmlFor="niche" className="block text-sm font-semibold text-slate-200">
                Nicho / Produto Vendido
              </label>
              <input
                id="niche"
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all"
                placeholder="Ex: Smartwatch Inteligente"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {SUGGESTED_NICHES.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setNiche(suggestion)}
                    className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/50 transition-colors"
                  >
                    + {suggestion.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">
                Tom da Resposta
              </label>
              <div className="space-y-2">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTone(t.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-200 ${
                      tone === t.value
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/20'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/20 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{t.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{t.description}</p>
                    </div>
                    {tone === t.value && <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !customerMessage.trim() || !niche.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-indigo-500/35"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Simulando Resposta...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Simular Atendimento
                </>
              )}
            </button>
          </form>

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Ocorreu um erro</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Results Panel */}
        <div className="lg:col-span-7 flex flex-col">
          {result ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Suggested Reply Card */}
              <div className="bg-linear-to-tr from-indigo-900/15 via-slate-900/40 to-slate-900/40 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <span className="font-bold text-slate-100 text-sm tracking-wide">Resposta Sugerida por IA</span>
                  </div>
                  
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                      copied 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700/60 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copiar Texto
                      </>
                    )}
                  </button>
                </div>

                <blockquote className="bg-slate-950/65 border border-slate-900 p-4 rounded-xl text-slate-200 text-sm whitespace-pre-line leading-relaxed font-sans shadow-inner select-all">
                  {result.suggested_response}
                </blockquote>
              </div>

              {/* Tone Analysis & Objection Handling */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tone Analysis */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5 mb-2">
                    <Volume2 className="h-3.5 w-3.5" /> Análise do Tom ({tone})
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {result.tone_analysis}
                  </p>
                </div>

                {/* Objection Handling */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                  <h3 className="text-xs font-bold text-violet-400 tracking-wider uppercase flex items-center gap-1.5 mb-2">
                    <HelpCircle className="h-3.5 w-3.5" /> Contorno de Objeções
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {result.objection_handling}
                  </p>
                </div>
              </div>

              {/* Sales Arguments */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3">
                  Argumentos de Vendas Empregados
                </h3>
                <ul className="space-y-2.5">
                  {result.sales_arguments.map((arg, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
                      <span className="h-5 w-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900/10 border border-slate-800/40 border-dashed rounded-3xl min-h-87.5 text-center text-slate-500">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-slate-900 text-slate-600 border border-slate-800 mb-4 animate-pulse">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-slate-400 text-lg">Aguardando Mensagem</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1.5">
                Preencha o painel esquerdo com os detalhes da mensagem recebida para que a inteligência artificial analise o contexto de vendas.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
