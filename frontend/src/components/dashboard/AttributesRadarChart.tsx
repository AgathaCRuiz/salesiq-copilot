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
};

const plotConfig = { displayModeBar: false, responsive: true };

interface AttributesRadarChartProps {
  niches: NicheData[];
}

export default function AttributesRadarChart({ niches }: AttributesRadarChartProps) {
  const traces = niches.map(n => {
    const attrs = n.data!.context.key_attributes.slice(0, 6);
    return {
      type: 'scatterpolar' as const,
      r: attrs.map((_, i) => attrs.length - i),
      theta: attrs.map(a => a.name.length > 14 ? a.name.slice(0, 14) + '…' : a.name),
      fill: 'toself' as const,
      name: n.query,
      line: { color: n.color, width: 2 },
      fillcolor: `${n.color}22`,
      hovertemplate: `<b>${n.query}</b><br>%{theta}<extra></extra>`,
    };
  });

  const layout = {
    ...plotLayout,
    polar: {
      bgcolor: 'rgba(0,0,0,0)',
      radialaxis: { visible: false },
      angularaxis: { gridcolor: '#1e293b', linecolor: '#1e293b', tickfont: { size: 10, color: '#64748b' } },
    },
    showlegend: true,
    legend: { font: { color: '#94a3b8', size: 10 }, bgcolor: 'rgba(0,0,0,0)', x: 1.05, y: 0.5 },
    margin: { t: 20, r: 120, b: 20, l: 20 },
    height: 220,
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
        <Tag className="h-4 w-4 text-fuchsia-400" /> Atributos Técnicos
      </h2>
      <Plot data={traces} layout={layout} config={plotConfig} style={{ width: '100%' }} />
    </div>
  );
}