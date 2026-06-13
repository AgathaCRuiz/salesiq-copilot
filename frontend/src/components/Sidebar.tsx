'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Bot,          // ✅ adiciona
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Visão geral do sistema'
    },
    {
    name: 'Copiloto',  
    href: '/copilot',
    icon: Bot,
    description: 'Atendimento com dados reais'
  },
    {
      name: 'Simulador',
      href: '/simulator',
      icon: MessageSquare,
      description: 'Atendimento inteligente'
    },
    {
      name: 'Oportunidades',
      href: '/opportunities',
      icon: TrendingUp,
      description: 'Métricas do Mercado Livre'
    }
  ];

  return (
    <aside 
      className={`relative h-screen bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 flex flex-col justify-between z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-3 overflow-hidden select-none">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 flex-shrink-0 animate-pulse">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              SalesIQ Copilot
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-indigo-400 border border-indigo-500/20 shadow-md shadow-indigo-950/20' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
              }`} />
              
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-medium text-sm tracking-wide">{item.name}</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal transition-colors">
                    {item.description}
                  </span>
                </div>
              )}

              {/* Tooltip for collapsed mode */}
              {collapsed && (
                <div className="absolute left-24 bg-slate-950 text-slate-200 text-xs py-2 px-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl border border-slate-800 whitespace-nowrap">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.description}</p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors shadow-sm focus:outline-none border border-slate-700/50"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
