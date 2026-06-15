'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { PieChart } from 'lucide-react';
import { NicheData } from '../../hooks/useNicheData';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

const plotLayout = {
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#94a3b8', family: 'Inter, sans-serif', size: 11 },
};

const plotConfig = { displayModeBar: false, responsive: true };

interface VolumeShareDonutProps {
  niches: NicheData[];
}

export default function BrandsTreemap({ niches }: VolumeShareDonutProps) {
  const visibleNiches = niches.filter(n => n.data);

  const values = visibleNiches.map(n => n.data!.context.total_items_in_market);
  const total = values.reduce((a, b) => a + b, 0);

  const trace = {
    type: 'pie' as const,
    hole: 0.6,
    labels: visibleNiches.map(n => n.query),
    values,
    marker: { colors: visibleNiches.map(n => n.color) },
    textinfo: 'percent' as const,
    textfont: { color: '#ffffff', size: 12 },
    hovertemplate: '<b>%{label}</b><br>%{value:,} itens<br>%{percent}<extra></extra>',
    sort: false,
  };

  const layout = {
    ...plotLayout,
    height: 260,
    margin: { t: 10, r: 10, b: 10, l: 10 },
    showlegend: true,
    legend: {
      orientation: 'v' as const,
      font: { color: '#94a3b8', size: 11 },
      bgcolor: 'rgba(0,0,0,0)',
      x: 1,
      y: 0.5,
    },
    annotations: [
      {
        text: `<b>${total.toLocaleString('pt-BR')}</b><br>itens totais`,
        showarrow: false,
        font: { color: '#e2e8f0', size: 13 },
        x: 0.5,
        y: 0.5,
      },
    ],
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
        <PieChart className="h-4 w-4 text-indigo-400" /> Participação no Volume Total
      </h2>
      <p className="text-[10px] text-slate-500 mb-4">Distribuição dos itens ativos entre os nichos monitorados</p>

      <Plot data={[trace]} layout={layout} config={plotConfig} style={{ width: '100%' }} />
    </div>
  );
}