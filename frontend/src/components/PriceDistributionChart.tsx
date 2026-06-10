'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface PriceDistributionChartProps {
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
}

export default function PriceDistributionChart({
  minPrice,
  avgPrice,
  maxPrice
}: PriceDistributionChartProps) {
  
  const data = [
    {
      name: 'Mínimo',
      value: minPrice,
      color: '#ef4444', // Vermelho / Tom quente
      description: 'Menor preço praticado no nicho'
    },
    {
      name: 'Médio',
      value: avgPrice,
      color: '#6366f1', // Indigo / Neutro
      description: 'Média de mercado para entrada'
    },
    {
      name: 'Máximo',
      value: maxPrice,
      color: '#10b981', // Verde / Premium
      description: 'Preço mais alto registrado'
    }
  ];

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; description: string } }> }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-4 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">{dataPoint.name}</p>
          <p className="text-lg font-bold text-slate-100">{formatCurrency(dataPoint.value)}</p>
          <p className="text-[11px] text-slate-400 mt-2 max-w-[200px]">{dataPoint.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${value}`}
            dx={-8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b', opacity: 0.2 }} />
          <Bar 
            dataKey="value" 
            radius={[12, 12, 0, 0]}
            maxBarSize={60}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="transition-all duration-300 hover:opacity-85 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
