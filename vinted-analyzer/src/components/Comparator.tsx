"use client";
import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface Props {
  analyses: AnalysisResult[];
}

export default function Comparator({ analyses }: Props) {
  const [sortBy, setSortBy] = useState<'profit' | 'roi' | 'price' | 'score'>('profit');
  const [selected, setSelected] = useState<string[]>(analyses.slice(0, 4).map(a => a.id));

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id].slice(0, 6));
  };

  const selectedAnalyses = analyses.filter(a => selected.includes(a.id));
  const sorted = [...selectedAnalyses].sort((a, b) => {
    if (sortBy === 'profit') return b.profit.profit - a.profit.profit;
    if (sortBy === 'roi') return b.profit.roi - a.profit.roi;
    if (sortBy === 'price') return b.profit.recommended - a.profit.recommended;
    return b.score.total - a.score.total;
  });

  if (analyses.length === 0) {
    return (
      <div className="rounded-[24px] border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
        <p className="text-[16px] font-bold">Aucun article à comparer</p>
        <p className="text-[13px] text-zinc-500 mt-2">Analyse au moins 2 articles pour utiliser le comparateur</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight leading-none">🏆 Comparateur</h1>
          <p className="text-[14px] text-zinc-500 mt-2">Compare la rentabilité de plusieurs articles</p>
        </div>
        <div className="flex gap-2">
          {(['profit','roi','price','score'] as const).map(k => (
            <button key={k} onClick={() => setSortBy(k)} className={`px-4 py-2 rounded-full text-[12px] font-bold border transition ${sortBy===k ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200'}`}>
              {k === 'profit' ? 'Profit' : k === 'roi' ? 'ROI' : k === 'price' ? 'Prix vente' : 'Score'}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] bg-white border border-zinc-200 p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Sélectionne jusqu'à 6 articles</p>
        <div className="flex flex-wrap gap-2">
          {analyses.map(a => (
            <button key={a.id} onClick={() => toggle(a.id)} className={`flex items-center gap-2 px-3 py-2 rounded-full border text-[12px] font-medium transition ${selected.includes(a.id) ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
              <img src={a.photos[0]?.url} alt="" className="w-6 h-6 rounded-full object-cover" />
              {a.identified.brand} {a.identified.category}
              {selected.includes(a.id) && <span className="ml-1">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] bg-white border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b">
              <tr className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                <th className="p-4">Article</th>
                <th className="p-4 text-right">Achat</th>
                <th className="p-4 text-right">Vente</th>
                <th className="p-4 text-right">Profit</th>
                <th className="p-4 text-right">ROI</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(a => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-zinc-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={a.photos[0]?.url} alt="" className="w-10 h-10 rounded-xl object-cover border bg-zinc-100" />
                      <div>
                        <p className="text-[13px] font-bold leading-tight">{a.identified.brand} {a.identified.category}</p>
                        <p className="text-[11px] text-zinc-500">{a.identified.color} • {a.identified.size} • {a.identified.condition}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right text-[13px] font-medium">{a.profit.purchasePrice}€</td>
                  <td className="p-4 text-right text-[13px] font-bold">{a.profit.recommended}€</td>
                  <td className={`p-4 text-right text-[13px] font-bold ${a.profit.profit >=0 ? 'text-emerald-600' : 'text-red-500'}`}>+{a.profit.profit}€</td>
                  <td className="p-4 text-right text-[13px] font-bold">{a.profit.roi}%</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${a.score.total >=80 ? 'bg-emerald-500' : a.score.total >=60 ? 'bg-amber-500' : 'bg-zinc-400'}`}>{a.score.total}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">Meilleur profit</p>
            <p className="text-[16px] font-bold mt-2">{sorted[0]?.identified.brand} {sorted[0]?.identified.category} — +{sorted[0]?.profit.profit}€</p>
          </div>
          <div className="rounded-[20px] bg-violet-50 border border-violet-200 p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-700">Meilleur ROI</p>
            <p className="text-[16px] font-bold mt-2">{[...selectedAnalyses].sort((a,b)=>b.profit.roi-a.profit.roi)[0]?.identified.brand} — {[...selectedAnalyses].sort((a,b)=>b.profit.roi-a.profit.roi)[0]?.profit.roi}%</p>
          </div>
          <div className="rounded-[20px] bg-zinc-900 text-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Total potentiel</p>
            <p className="text-[20px] font-black mt-2">{selectedAnalyses.reduce((s,a)=>s+a.profit.profit,0)}€ profit • {Math.round(selectedAnalyses.reduce((s,a)=>s+a.profit.roi,0)/ (selectedAnalyses.length||1))}% ROI moyen</p>
          </div>
        </div>
      )}
    </div>
  );
}
