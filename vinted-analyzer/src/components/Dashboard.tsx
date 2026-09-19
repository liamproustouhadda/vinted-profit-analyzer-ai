"use client";
import { AnalysisResult } from "@/lib/types";

interface Props {
  analyses: AnalysisResult[];
  onAnalyzeClick: () => void;
}

export default function Dashboard({ analyses, onAnalyzeClick }: Props) {
  const total = analyses.length;
  const potentialProfit = analyses.reduce((s, a) => s + a.profit.profit, 0);
  const profitable = analyses.filter(a => a.profit.level === 'very_profitable' || a.profit.level === 'profitable').length;
  const avgRoi = total ? Math.round(analyses.reduce((s, a) => s + a.profit.roi, 0) / total) : 0;
  const avgPurchase = total ? Math.round(analyses.reduce((s, a) => s + a.profit.purchasePrice, 0) / total) : 0;

  const topBrands = Object.entries(
    analyses.reduce((acc: Record<string, number>, cur) => {
      acc[cur.identified.brand] = (acc[cur.identified.brand] || 0) + cur.profit.profit;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const topCategories = Object.entries(
    analyses.reduce((acc: Record<string, number>, cur) => {
      acc[cur.identified.category] = (acc[cur.identified.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-tight leading-none">Dashboard</h1>
          <p className="text-[14px] text-zinc-500 mt-2">Vue d'ensemble de ton activité de revente</p>
        </div>
        <button onClick={onAnalyzeClick} className="px-6 py-3 rounded-full bg-zinc-900 text-white text-[14px] font-bold hover:bg-black transition shadow-lg">
          📸 Analyser un article
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-[20px] bg-white border border-zinc-200 p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Articles analysés</p>
          <p className="text-[28px] font-black mt-2 tracking-tight">{total}</p>
          <p className="text-[11px] text-zinc-500 mt-1">+{Math.max(0, total - 1)} ce mois</p>
        </div>
        <div className="rounded-[20px] bg-zinc-900 text-white p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/40 to-fuchsia-600/40 blur-2xl rounded-full" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 relative">Profit potentiel</p>
          <p className="text-[28px] font-black mt-2 tracking-tight relative">{potentialProfit}€</p>
          <p className="text-[11px] text-zinc-400 mt-1 relative">Estimé total</p>
        </div>
        <div className="rounded-[20px] bg-white border border-zinc-200 p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Articles rentables</p>
          <p className="text-[28px] font-black mt-2 tracking-tight">{profitable}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">{total ? Math.round((profitable/total)*100) : 0}% de réussite</p>
        </div>
        <div className="rounded-[20px] bg-white border border-zinc-200 p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">ROI moyen</p>
          <p className="text-[28px] font-black mt-2 tracking-tight">{avgRoi}%</p>
          <p className="text-[11px] text-zinc-500 mt-1">Moyenne globale</p>
        </div>
        <div className="rounded-[20px] bg-white border border-zinc-200 p-5 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Prix moyen achat</p>
          <p className="text-[28px] font-black mt-2 tracking-tight">{avgPurchase}€</p>
          <p className="text-[11px] text-zinc-500 mt-1">Par article</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profit evolution */}
        <div className="lg:col-span-2 rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
          <h3 className="text-[14px] font-bold mb-6">Évolution du profit potentiel</h3>
          {analyses.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
              <p className="text-[13px] font-medium text-zinc-600">Aucune donnée pour le moment</p>
              <p className="text-[12px] text-zinc-400 mt-1">Analyse ton premier article pour voir le graphique</p>
            </div>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {analyses.slice(0, 12).reverse().map((a, i) => {
                const max = Math.max(...analyses.map(x => x.profit.profit), 1);
                const h = Math.max(10, (Math.max(0, a.profit.profit) / max) * 100);
                return (
                  <div key={a.id} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full rounded-t-xl bg-zinc-900 hover:bg-violet-600 transition-colors" style={{ height: `${h}%`, minHeight: '12px' }} />
                    <span className="text-[9px] font-medium text-zinc-400 truncate w-full text-center">{a.identified.brand.slice(0,6)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold mb-4">Marques les plus rentables</h3>
            {topBrands.length === 0 ? <p className="text-[12px] text-zinc-400">Pas encore de données</p> : (
              <div className="space-y-3">
                {topBrands.map(([brand, profit]) => (
                  <div key={brand} className="flex items-center justify-between">
                    <span className="text-[13px] font-medium">{brand}</span>
                    <span className="text-[13px] font-bold text-emerald-600">+{profit}€</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-[13px] font-bold mb-4">Catégories populaires</h3>
            {topCategories.length === 0 ? <p className="text-[12px] text-zinc-400">Pas encore de données</p> : (
              <div className="space-y-3">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div className="h-full bg-zinc-900 rounded-full" style={{ width: `${(count/total)*100}%` }} />
                    </div>
                    <span className="text-[12px] font-medium w-20 truncate">{cat}</span>
                    <span className="text-[11px] font-bold">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent */}
      <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
        <h3 className="text-[14px] font-bold mb-4">Analyses récentes</h3>
        {analyses.length === 0 ? (
          <p className="text-[13px] text-zinc-400">Aucune analyse. Commence par analyser un article.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {analyses.slice(0, 3).map(a => (
              <div key={a.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4 flex gap-3">
                <img src={a.photos[0]?.url} alt="" className="w-14 h-14 rounded-xl object-cover bg-white border" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold truncate">{a.identified.brand} {a.identified.category}</p>
                  <p className="text-[11px] text-zinc-500">{a.identified.color} • {a.identified.size}</p>
                  <p className="text-[11px] font-bold mt-1 text-emerald-600">+{a.profit.profit}€ • {a.profit.roi}% ROI</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
