'use client';

import React from 'react';
import { RefreshCw, X, Layers, Loader2, AlertCircle } from 'lucide-react';
import { NicheData, getScoreLabel } from '../../hooks/useNicheData';

interface NicheCardProps {
  niche: NicheData;
  onRefresh: (query: string) => void;
  onRemove: (query: string) => void;
}

export default function NicheCard({ niche, onRefresh, onRemove }: NicheCardProps) {
  const scoreInfo = niche.score !== null ? getScoreLabel(niche.score) : null;

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: niche.color }} />

      <div className="flex items-start justify-between mb-3 mt-1">
        <h3 className="font-bold text-slate-200 text-sm">{niche.query}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => onRefresh(niche.query)} className="p-1 text-slate-500 hover:text-slate-300 transition-colors" title="Recarregar">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onRemove(niche.query)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors" title="Remover">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {niche.loading && (
        <div className="flex items-center gap-2 text-slate-500 text-xs py-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando dados...
        </div>
      )}

      {niche.error && (
        <div className="flex items-start gap-2 text-rose-400 text-xs py-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" /> {niche.error}
        </div>
      )}

      {niche.data && (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Categoria</p>
            <p className="text-xs text-slate-300 font-medium mt-0.5">{niche.data.context.category_name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 flex-shrink-0" style={{ color: niche.color }} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Itens no mercado</p>
              <p className="text-xl font-bold text-slate-100">
                {niche.data.context.total_items_in_market.toLocaleString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Score */}
          {niche.score !== null && scoreInfo && (
            <div className="pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Score de Oportunidade</p>
                <span className={`text-xs font-bold ${scoreInfo.color}`}>{niche.score}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreInfo.bg}`}
                  style={{ width: `${niche.score}%` }}
                />
              </div>
              <p className={`text-[10px] mt-1.5 font-semibold ${scoreInfo.color}`}>
                {scoreInfo.label}
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Top marcas</p>
            <div className="flex flex-wrap gap-1">
              {niche.data.context.top_brands.slice(0, 3).map(b => (
                <span
                  key={b}
                  className="text-[10px] px-2 py-0.5 rounded-full border"
                  style={{ color: niche.color, borderColor: `${niche.color}40`, backgroundColor: `${niche.color}12` }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}