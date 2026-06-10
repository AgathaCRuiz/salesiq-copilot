'use client';

import React from 'react';
import { ExternalLink, Check } from 'lucide-react';
import { ProductItem } from '../services/api';

interface TopProductsTableProps {
  products: ProductItem[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
  const formatCurrency = (val: number | null) => {
    if (val === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  if (products.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl text-slate-400">
        Nenhum produto em destaque encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-900/40 border border-slate-800/80 rounded-2xl backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/20">
            <th className="py-4 px-6">Produto</th>
            <th className="py-4 px-6 text-right">Preço</th>
            <th className="py-4 px-6 text-center">Frete</th>
            <th className="py-4 px-6 text-center">Condição</th>
            <th className="py-4 px-6 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-300 text-sm">
          {products.map((product) => (
            <tr 
              key={product.id || Math.random().toString()} 
              className="hover:bg-slate-800/30 transition-colors duration-150 group"
            >
              {/* Product Info */}
              <td className="py-4 px-6 flex items-center gap-3">
                {product.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={product.thumbnail} 
                    alt={product.title || 'Produto'} 
                    className="w-10 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-slate-800"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                    No Image
                  </div>
                )}
                <div className="flex flex-col max-w-[280px] sm:max-w-[360px]">
                  <span className="font-medium text-slate-200 line-clamp-1 group-hover:text-white transition-colors">
                    {product.title}
                  </span>
                  <span className="text-xs text-slate-500">ID: {product.id || 'N/A'}</span>
                </div>
              </td>

              {/* Price */}
              <td className="py-4 px-6 text-right font-semibold text-slate-100">
                {formatCurrency(product.price)}
              </td>

              {/* Free Shipping */}
              <td className="py-4 px-6 text-center">
                {product.free_shipping ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="h-3 w-3" /> Grátis
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                    Pago
                  </span>
                )}
              </td>

              {/* Condition */}
              <td className="py-4 px-6 text-center">
                {product.condition === 'new' ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/10 font-medium">
                    Novo
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10 font-medium">
                    Usado
                  </span>
                )}
              </td>

              {/* Link */}
              <td className="py-4 px-6 text-center">
                {product.permalink ? (
                  <a 
                    href={product.permalink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-colors border border-slate-700/60 hover:border-indigo-500 shadow-sm"
                    title="Ver no Mercado Livre"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-slate-600">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
