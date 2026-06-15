'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Tag } from 'lucide-react';
import { NicheData } from '../../hooks/useNicheData';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const plotLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#94a3b8', family: 'Inter, sans-serif', size: 11 },
  xaxis: { gridcolor: '#1e293b', zerolinecolor: '#1e293b' },
  yaxis: { gridcolor: 'transparent', zerolinecolor: 'transparent' },
};

const plotConfig = { displayModeBar: false, responsive: true };

interface BrandsTreemapProps {
  niches: NicheData[];
}

export default function BrandsTreemap({ niches }: BrandsTreemapProps) {
  const visibleNiches = niches.filter(n => n.data);

  const trace = {
    type: 'bar' as const,
    x: visibleNiches.map(n => n.query),
    y: visibleNiches.map(() => 1),
    marker: { color: visibleNiches.map(n => n.color), opacity: 0.85 },
    text: visibleNiches.map(n => n.data!.context.top_brands[0] ?? 'Sem dados'),
    textposition: 'inside' as const,
    insidetextanchor: 'middle' as const,
    textfont: { color: '#ffffff', size: 13, weight: 700 },
    hovertemplate: '<b>%{text}</b><br>Marca líder em %{x}<extra></extra>',
    width: 0.55,
  };

  const layout = {
    ...plotLayout,
    height: 200,
    margin: { t: 10, r: 10, b: 40, l: 10 },
    yaxis: { ...plotLayout.yaxis, visible: false, range: [0, 1.2] },
    xaxis: { ...plotLayout.xaxis, gridcolor: 'transparent', tickfont: { size: 11 } },
    showlegend: false,
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
        <Tag className="h-4 w-4 text-indigo-400" /> Marca Líder por Nicho
      </h2>
      <p className="text-[10px] text-slate-500 mb-4">A marca com maior presença em cada categoria</p>

      <Plot data={[trace]} layout={layout} config={plotConfig} style={{ width: '100%' }} />

      {/* Lista detalhada das top 5 marcas por nicho, abaixo do gráfico */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/60">
        {visibleNiches.map(n => (
          <div key={n.query}>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: n.color }} />
              <span className="text-xs font-bold text-slate-300">{n.query}</span>
            </div>
            {n.data!.context.top_brands.length > 0 ? (
              <ul className="space-y-1">
                {n.data!.context.top_brands.slice(0, 5).map((b, i) => (
                  <li key={b} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span className="text-slate-600 w-3">{i + 1}.</span> {b}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-slate-600 italic">Sem marcas identificadas</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}