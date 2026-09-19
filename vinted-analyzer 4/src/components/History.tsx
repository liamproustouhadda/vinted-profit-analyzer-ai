"use client";
import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface Props {
  analyses: AnalysisResult[];
  onOpen: (a: AnalysisResult) => void;
  onDelete: (id: string) => void;
}

export default function History({ analyses, onOpen, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'profitable' | 'recent'>('all');

  let filtered = analyses.filter(a => {
    const q = query.toLowerCase();
    return !q || a.identified.brand.toLowerCase().includes(q) || a.identified.category.toLowerCase().includes(q) || a.identified.color.toLowerCase().includes(q);
  });

  if (filter === 'profitable') filtered = filtered.filter(a => a.profit.level === 'very_profitable' || a.profit.level === 'profitable');
  if (filter === 'recent') filtered = filtered.slice(0, 10);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-[32px] font-black tracking-tight leading-none">Mes analyses</h1>
        <p className="text-[14px] text-zinc-500 mt-2">{analyses.length} articles • Historique complet</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher marque, catégorie, couleur..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-zinc-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(['all','profitable','recent'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-full text-[13px] font-semibold border transition ${filter===f ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}>
              {f === 'all' ? 'Tous' : f === 'profitable' ? 'Rentables' : 'Récents'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[24px] border-2 border-dashed border-zinc-200 bg-white p-12 text-center">
          <p className="text-[16px] font-bold">Aucun résultat</p>
          <p className="text-[13px] text-zinc-500 mt-2">Modifie ta recherche ou analyse de nouveaux articles</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.id} className="group rounded-[20px] bg-white border border-zinc-200 p-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
              <div className="flex gap-3">
                <img src={a.photos[0]?.url} alt="" className="w-20 h-20 rounded-2xl object-cover bg-zinc-100 border" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[14px] font-bold leading-tight truncate">{a.identified.brand}</p>
                      <p className="text-[12px] text-zinc-500 truncate">{a.identified.category} • {a.identified.color} • {a.identified.size}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${a.profit.level === 'very_profitable' ? 'bg-emerald-500' : a.profit.level === 'profitable' ? 'bg-emerald-400' : a.profit.level === 'average' ? 'bg-amber-400' : a.profit.level === 'low' ? 'bg-orange-400' : 'bg-red-500'}`}>{a.score.total}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-zinc-100">{a.profit.purchasePrice}€ → {a.profit.recommended}€</span>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${a.profit.profit >=0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>+{a.profit.profit}€</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2">{new Date(a.createdAt).toLocaleDateString('fr-FR')} • {a.photoCount} photos</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => onOpen(a)} className="flex-1 py-2.5 rounded-full bg-zinc-900 text-white text-[12px] font-bold hover:bg-black transition">Ouvrir</button>
                <button onClick={() => { if (confirm('Supprimer cette analyse ?')) onDelete(a.id); }} className="px-4 py-2.5 rounded-full bg-white border border-zinc-200 text-[12px] font-semibold hover:bg-zinc-50">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
