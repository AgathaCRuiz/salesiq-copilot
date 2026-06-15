'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Layers } from 'lucide-react';
import { NicheData } from '../../hooks/useNicheData';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const plotLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#94a3b8', family: 'Inter, sans-serif', size: 11 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#1e293b' },
  yaxis: { gridcolor: '#1e293b', zerolinecolor: '#1e293b' },
  showlegend: false,
};

const plotConfig = { displayModeBar: false, responsive: true };

interface VolumeChartProps {
  niches: NicheData[];
}

export default function VolumeChart({ niches }: VolumeChartProps) {
  const trace = {
    type: 'bar' as const,
    orientation: 'h' as const,
    x: niches.map(n => n.data!.context.total_items_in_market),
    y: niches.map(n => n.query),
    marker: { color: niches.map(n => n.color), opacity: 0.85 },
    text: niches.map(n => n.data!.context.total_items_in_market.toLocaleString('pt-BR')),
    textposition: 'outside' as const,
    textfont: { color: '#e2e8f0', size: 11 },
    hovertemplate: '<b>%{y}</b><br>%{x:,} itens<extra></extra>',
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
        <Layers className="h-4 w-4 text-violet-400" /> Volume de Mercado
      </h2>
      <Plot
        data={[trace]}
        layout={{
          ...plotLayout,
          height: 220,
          margin: { t: 10, r: 80, b: 30, l: 120 },
          xaxis: { ...plotLayout.xaxis, tickformat: ',.0f' },
        }}
        config={plotConfig}
        style={{ width: '100%' }}
      />
    </div>
  );
}