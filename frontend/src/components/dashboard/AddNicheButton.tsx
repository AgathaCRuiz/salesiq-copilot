'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AddNicheButtonProps {
  onAdd: (query: string) => void;
}

export default function AddNicheButton({ onAdd }: AddNicheButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-slate-700 transition-all"
      >
        <Plus className="h-4 w-4" /> Adicionar Nicho
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Ex: Cafeteira"
        className="bg-slate-900 border border-slate-700 focus:border-violet-500 rounded-xl px-4 py-2 text-slate-200 placeholder-slate-500 text-sm focus:outline-none w-44"
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
      >
        Adicionar
      </button>
      <button onClick={() => { setIsAdding(false); setValue(''); }} className="p-2 text-slate-400 hover:text-slate-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}