'use client';

import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { useNicheData } from '../../hooks/useNicheData';
import NicheCard from '../../components/dashboard/NicheCard';
import VolumeChart from '../../components/dashboard/VolumeChart';
import AttributesRadarChart from '../../components/dashboard/AttributesRadarChart';
import BrandsTreemap from '../../components/dashboard/BrandsTreemap';
import AddNicheButton from '../../components/dashboard/AddNicheButton';

export default function DashboardPage() {
  const { niches, addNiche, removeNiche, refreshNiche } = useNicheData();
  const loadedNiches = niches.filter(n => n.data);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-fade-in">

      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <LayoutDashboard className="h-3.5 w-3.5" /> Market Overview
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Dashboard de Nichos</h1>
          <p className="mt-1 text-slate-400 text-sm">
            Monitorando <span className="text-violet-400 font-semibold">{niches.length}</span> nichos com dados reais do Mercado Livre
          </p>
        </div>
        <AddNicheButton onAdd={addNiche} />
      </header>

      {/* Cards de Nichos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {niches.map(niche => (
          <NicheCard key={niche.query} niche={niche} onRefresh={refreshNiche} onRemove={removeNiche} />
        ))}
      </div>

      {/* Gráficos */}
      {loadedNiches.length > 0 && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <VolumeChart niches={loadedNiches} />
            <AttributesRadarChart niches={loadedNiches} />
          </div>
          <BrandsTreemap niches={loadedNiches} />
        </div>
      )}

      {/* Empty state */}
      {niches.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-slate-800/40 border-dashed rounded-3xl min-h-[300px] text-center">
          <LayoutDashboard className="h-10 w-10 text-slate-700 mb-3" />
          <h3 className="font-bold text-slate-400 text-lg">Nenhum nicho monitorado</h3>
          <p className="text-xs text-slate-500 mt-1">Adicione um nicho para começar.</p>
        </div>
      )}
    </div>
  );
}