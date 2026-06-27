'use client';

import React, { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { MarketAnalysisResponse } from '../services/api';

interface ExportPDFButtonProps {
  result: MarketAnalysisResponse;
  query: string;
}

export default function ExportPDFButton({ result, query }: ExportPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageW = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentW = pageW - margin * 2;
      let y = 20;

      // ── Helpers ──────────────────────────────────────────────────────────

      const addText = (
        text: string,
        x: number,
        fontSize: number,
        style: 'normal' | 'bold' = 'normal',
        color: [number, number, number] = [30, 30, 30]
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', style);
        doc.setTextColor(...color);
        doc.text(text, x, y);
      };

      const addWrappedText = (
        text: string,
        fontSize: number,
        color: [number, number, number] = [80, 80, 80]
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...color);
        const lines = doc.splitTextToSize(text, contentW);
        doc.text(lines, margin, y);
        y += lines.length * (fontSize * 0.4) + 2;
      };

      const addSectionTitle = (title: string) => {
        y += 6;
        doc.setFillColor(99, 102, 241);
        doc.rect(margin, y - 4, 3, 6, 'F');
        addText(title, margin + 6, 11, 'bold', [99, 102, 241]);
        y += 6;
        doc.setDrawColor(220, 220, 235);
        doc.line(margin, y, pageW - margin, y);
        y += 5;
      };

      const checkPageBreak = (needed = 20) => {
        if (y + needed > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }
      };

      // ── Header ────────────────────────────────────────────────────────────

      // Fundo roxo no topo
      doc.setFillColor(99, 102, 241);
      doc.rect(0, 0, pageW, 45, 'F');

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('SalesIQ Copilot', margin, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(200, 200, 255);
      doc.text('Relatório de Inteligência de Mercado', margin, 26);

      doc.setFontSize(9);
      doc.setTextColor(180, 180, 230);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, 33);

      y = 58;

      // ── Título da busca ───────────────────────────────────────────────────

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(`Análise: ${query}`, margin, y);
      y += 5;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(`Categoria: ${result.metrics.category_name ?? 'N/A'} · ${result.metrics.category_path ?? ''}`, margin, y);
      y += 10;

      // ── Métricas principais ───────────────────────────────────────────────

      addSectionTitle('Métricas do Mercado');

      // Cards de métricas
      const metricBoxW = (contentW - 6) / 3;
      const metrics = [
        { label: 'Itens na Categoria', value: (result.metrics.total_items_in_market ?? 0).toLocaleString('pt-BR') },
        { label: 'Hierarquia', value: result.metrics.category_path?.split(' > ').pop() ?? 'N/A' },
        { label: 'Total de Atributos', value: String(result.metrics.total_attributes ?? 0) },
      ];

      metrics.forEach((m, i) => {
        const x = margin + i * (metricBoxW + 3);
        doc.setFillColor(245, 245, 255);
        doc.roundedRect(x, y, metricBoxW, 18, 2, 2, 'F');
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 150);
        doc.text(m.label.toUpperCase(), x + 4, y + 6);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
        doc.text(m.value, x + 4, y + 14);
      });
      y += 26;

      // ── Marcas ────────────────────────────────────────────────────────────

      if (result.metrics.top_brands?.length > 0) {
        checkPageBreak();
        addSectionTitle('Principais Marcas');
        const brandsText = result.metrics.top_brands.join('  ·  ');
        addWrappedText(brandsText, 10, [60, 60, 60]);
        y += 2;
      }

      // ── Relatório IA ──────────────────────────────────────────────────────

      checkPageBreak();
      addSectionTitle('Relatório Estratégico (IA)');

      // Badge de concorrência
      const compLevel = result.analysis.competition_level;
      const compColors: Record<string, [number, number, number]> = {
        'Baixa': [16, 185, 129],
        'Média': [245, 158, 11],
        'Alta': [249, 115, 22],
        'Saturado': [239, 68, 68],
      };
      const compColor = compColors[compLevel] ?? [120, 120, 120];
      doc.setFillColor(...compColor);
      doc.roundedRect(margin, y, 40, 8, 2, 2, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(`Concorrência: ${compLevel}`, margin + 3, y + 5.5);
      y += 14;

      // Análise de mercado
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Análise de Mercado', margin, y);
      y += 5;
      addWrappedText(result.analysis.competition_analysis, 9);
      y += 2;

      // Faixa de preço
      checkPageBreak();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Faixa de Preço de Entrada', margin, y);
      y += 5;
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(result.analysis.ideal_price_range, margin, y);
      y += 7;
      addWrappedText(result.analysis.price_strategy, 9);
      y += 2;

      // Oportunidades
      checkPageBreak();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Oportunidades de Diferenciação', margin, y);
      y += 6;
      result.analysis.opportunities.forEach((opp) => {
        checkPageBreak(10);
        doc.setFillColor(99, 102, 241);
        doc.circle(margin + 2, y - 1, 1.2, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        const lines = doc.splitTextToSize(opp, contentW - 8);
        doc.text(lines, margin + 6, y);
        y += lines.length * 4 + 2;
      });
      y += 2;

      // Abordagem comercial
      checkPageBreak();
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text('Abordagem Comercial Sugerida', margin, y);
      y += 5;
      addWrappedText(result.analysis.commercial_approach, 9);

      // ── Atributos técnicos ────────────────────────────────────────────────

      if (result.metrics.key_attributes?.length > 0) {
        checkPageBreak(30);
        addSectionTitle('Atributos Técnicos do Nicho');
        result.metrics.key_attributes.slice(0, 8).forEach((attr) => {
          checkPageBreak(10);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(99, 102, 241);
          doc.text(`${attr.name}:`, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const vals = attr.values.join(', ');
          const lines = doc.splitTextToSize(vals, contentW - 30);
          doc.text(lines, margin + 30, y);
          y += Math.max(lines.length * 4, 5) + 1;
        });
      }

      // ── Footer ────────────────────────────────────────────────────────────

      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        const pageH = doc.internal.pageSize.getHeight();
        doc.setDrawColor(220, 220, 235);
        doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('SalesIQ Copilot · Powered by Groq + Mercado Livre API', margin, pageH - 7);
        doc.text(`Página ${i} de ${totalPages}`, pageW - margin, pageH - 7, { align: 'right' });
      }

      // ── Download ──────────────────────────────────────────────────────────

      const filename = `salesiq-${query.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
      doc.save(filename);

    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Gerando PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" /> Exportar PDF
        </>
      )}
    </button>
  );
}