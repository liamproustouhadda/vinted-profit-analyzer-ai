"use client";
import { useState } from "react";
import { AnalysisResult } from "@/lib/types";

interface Props {
  result: AnalysisResult;
  onSave?: () => void;
  onNew?: () => void;
}

export default function ResultView({ result, onSave, onNew }: Props) {
  const [priceMode, setPriceMode] = useState<'quick' | 'balanced' | 'max'>('balanced');
  const [copied, setCopied] = useState(false);

  const currentPrice = priceMode === 'quick' ? result.profit.quickSale : priceMode === 'max' ? result.profit.maxSale : result.profit.balanced;
  const currentProfit = currentPrice - result.profit.purchasePrice;
  const currentRoi = result.profit.purchasePrice > 0 ? Math.round((currentProfit / result.profit.purchasePrice) * 100) : 0;

  const profitabilityColor = {
    very_profitable: 'bg-emerald-500',
    profitable: 'bg-emerald-400',
    average: 'bg-amber-400',
    low: 'bg-orange-400',
    not_profitable: 'bg-red-500',
  }[result.profit.level];

  const profitabilityBg = {
    very_profitable: 'bg-emerald-50 border-emerald-200',
    profitable: 'bg-emerald-50/50 border-emerald-100',
    average: 'bg-amber-50 border-amber-200',
    low: 'bg-orange-50 border-orange-200',
    not_profitable: 'bg-red-50 border-red-200',
  }[result.profit.level];

  const copyListing = () => {
    const text = `${result.listing.title}\n\n${result.listing.description}\n\n${result.listing.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header success */}
      <div className="rounded-[24px] bg-zinc-900 text-white p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-zinc-900 flex items-center justify-center text-xl font-bold">✓</div>
            <div>
              <h2 className="text-[20px] font-bold tracking-tight">Analyse terminée ✓</h2>
              <p className="text-[13px] text-zinc-400">{result.photoCount} photos analysées • Confiance IA {result.identified.confidence}%</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onNew} className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-[13px] font-semibold backdrop-blur transition">+ Nouvel article</button>
            <button onClick={onSave} className="px-5 py-2.5 rounded-full bg-white text-zinc-900 text-[13px] font-bold hover:bg-zinc-100 transition">Sauvegarder</button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - identification */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identified article */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 md:p-7 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-[16px] font-bold tracking-tight">Article identifié</h3>
                <p className="text-[12px] text-zinc-500 mt-1">Basé sur {result.photoCount} photos • IA multi-vues</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">IA {result.identified.confidence}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Marque</p>
                <p className="text-[15px] font-bold">{result.identified.brand}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.authenticity.status} • {result.identified.authenticity.confidence}%</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Catégorie</p>
                <p className="text-[15px] font-bold">{result.identified.category}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.subCategory}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Taille</p>
                <p className="text-[15px] font-bold">{result.identified.size}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.color}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">État</p>
                <p className="text-[14px] font-bold leading-tight">{result.identified.condition}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.wear}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Matière</p>
                <p className="text-[14px] font-bold">{result.identified.material}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.style}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4 border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Époque</p>
                <p className="text-[14px] font-bold">{result.identified.era}</p>
                <p className="text-[11px] text-zinc-500 mt-1">{result.identified.logo}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {result.identified.details.map((d, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-medium">{d}</span>
              ))}
              {result.identified.defects[0] !== 'Aucun défaut visible' && result.identified.defects.map((def, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-medium">⚠ {def}</span>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-violet-50 border border-violet-100">
              <p className="text-[11px] font-bold uppercase tracking-widest text-violet-700 mb-1">Authenticité</p>
              <p className="text-[13px] text-violet-900 leading-relaxed">
                <span className="font-bold capitalize">{result.identified.authenticity.status}</span> — {result.identified.authenticity.notes} (confiance {result.identified.authenticity.confidence}%)
              </p>
            </div>
          </div>

          {/* Market data */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 md:p-7 shadow-sm">
            <h3 className="text-[16px] font-bold tracking-tight mb-1">📊 Analyse du marché</h3>
            <p className="text-[12px] text-zinc-500 mb-5">Estimation IA basée sur tendances • Non garantie Vinted</p>

            {!result.market.available ? (
              <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center">
                <p className="text-[14px] font-semibold text-zinc-700">Données de marché indisponibles pour cet article.</p>
                <p className="text-[12px] text-zinc-500 mt-2 max-w-md mx-auto">Nous n'avons pas trouvé suffisamment de données comparables. L'estimation de prix reste basée sur notre IA et ton prix d'achat.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="rounded-2xl bg-zinc-50 p-4 border">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Prix moyen</p>
                    <p className="text-[20px] font-bold mt-1">{result.market.avgPrice}€</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4 border">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Comparables</p>
                    <p className="text-[20px] font-bold mt-1">{result.market.comparableCount}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4 border">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Ventes</p>
                    <p className="text-[20px] font-bold mt-1">{result.market.salesCount}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4 border">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Vitesse</p>
                    <p className="text-[12px] font-bold mt-1 leading-tight">{result.market.speed}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-semibold">Demande: {result.market.demand}</span>
                  <span className="px-3 py-1.5 rounded-full bg-white border text-[11px] font-semibold">Concurrence: {result.market.competition}</span>
                  <span className="px-3 py-1.5 rounded-full bg-white border text-[11px] font-semibold">{result.market.minPrice}€ – {result.market.maxPrice}€</span>
                </div>

                {/* Price evolution chart */}
                {result.market.priceEvolution && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Évolution prix (6 mois)</p>
                    <div className="flex items-end gap-2 h-24">
                      {result.market.priceEvolution.map((p, i) => {
                        const max = Math.max(...result.market.priceEvolution!.map(x => x.price));
                        const min = Math.min(...result.market.priceEvolution!.map(x => x.price));
                        const h = ((p.price - min) / (max - min || 1)) * 80 + 20;
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full rounded-t-lg bg-zinc-900 transition-all hover:bg-violet-600" style={{ height: `${h}px` }} />
                            <span className="text-[10px] font-medium text-zinc-500">{p.date}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Listing generator */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 md:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[16px] font-bold">✨ Générer mon annonce</h3>
              <button onClick={copyListing} className={`px-4 py-2 rounded-full text-[12px] font-bold transition ${copied ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-black'}`}>
                {copied ? '✓ Copié !' : '📋 Copier l\'annonce'}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Titre Vinted</p>
                <div className="rounded-2xl bg-zinc-50 border p-4 text-[13px] font-medium leading-relaxed">{result.listing.title}</div>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-zinc-50 border p-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Catégorie</p>
                  <p className="text-[12px] font-semibold mt-1">{result.listing.category}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 border p-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Taille / État</p>
                  <p className="text-[12px] font-semibold mt-1">{result.listing.size} • {result.listing.condition}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 border p-3">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Couleur / Marque</p>
                  <p className="text-[12px] font-semibold mt-1">{result.listing.color} • {result.listing.brand}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</p>
                <div className="rounded-2xl bg-zinc-50 border p-4 text-[13px] leading-relaxed whitespace-pre-wrap">{result.listing.description}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.listing.hashtags.map((h, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-medium">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - profit & score */}
        <div className="space-y-6">
          {/* Profit */}
          <div className={`rounded-[24px] border-2 p-6 md:p-7 shadow-sm ${profitabilityBg}`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold">💰 Estimation</h3>
              <span className={`px-3 py-1 rounded-full text-white text-[10px] font-bold tracking-widest ${profitabilityColor}`}>{result.profit.levelLabel}</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-zinc-600">Prix d'achat</span>
                <span className="text-[15px] font-bold">{result.profit.purchasePrice}€</span>
              </div>
              <div className="rounded-2xl bg-white border p-4">
                <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Prix de vente estimé</p>
                <p className="text-[22px] font-bold tracking-tight">{result.profit.estimatedMin}€ – {result.profit.estimatedMax}€</p>
                <p className="text-[12px] text-zinc-500 mt-1">Recommandé: <span className="font-bold text-zinc-900">{currentPrice}€</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Bénéfice</p>
                  <p className={`text-[20px] font-bold mt-1 ${currentProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{currentProfit >= 0 ? '+' : ''}{currentProfit}€</p>
                </div>
                <div className="rounded-2xl bg-white border p-4 text-center">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">ROI</p>
                  <p className={`text-[20px] font-bold mt-1 ${currentRoi >= 0 ? 'text-zinc-900' : 'text-red-500'}`}>{currentRoi}%</p>
                </div>
              </div>

              <div className="rounded-2xl bg-zinc-900 text-white p-4">
                <div className="flex justify-between text-[11px] opacity-70 mb-2"><span>Min</span><span>Max</span></div>
                <div className="flex justify-between text-[13px] font-bold"><span>{result.profit.minPrice}€</span><span>{result.profit.maxPrice}€</span></div>
                <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(100, Math.max(10, ((currentPrice - result.profit.minPrice) / (result.profit.maxPrice - result.profit.minPrice || 1)) * 100))}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Price slider */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
            <h4 className="text-[13px] font-bold mb-4">Prix de vente intelligent</h4>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
              <span>Rapide</span><span>Équilibré</span><span>Max</span>
            </div>
            <div className="relative mb-6">
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={priceMode === 'quick' ? 0 : priceMode === 'balanced' ? 1 : 2}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setPriceMode(v === 0 ? 'quick' : v === 1 ? 'balanced' : 'max');
                }}
                className="w-full h-2 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-zinc-900"
              />
            </div>
            <div className="space-y-2.5">
              <div className={`flex justify-between items-center p-3 rounded-2xl border transition ${priceMode === 'quick' ? 'bg-amber-50 border-amber-200' : 'bg-zinc-50 border-zinc-100'}`}>
                <span className="text-[12px] font-medium">⚡ Vente rapide</span><span className="text-[14px] font-bold">{result.profit.quickSale}€</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-2xl border transition ${priceMode === 'balanced' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 border-zinc-100'}`}>
                <span className="text-[12px] font-medium">⚖️ Prix recommandé</span><span className="text-[14px] font-bold">{result.profit.balanced}€</span>
              </div>
              <div className={`flex justify-between items-center p-3 rounded-2xl border transition ${priceMode === 'max' ? 'bg-violet-50 border-violet-200' : 'bg-zinc-50 border-zinc-100'}`}>
                <span className="text-[12px] font-medium">💎 Prix maximum</span><span className="text-[14px] font-bold">{result.profit.maxSale}€</span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
            <h4 className="text-[15px] font-bold mb-1">Score de rentabilité</h4>
            <p className="text-[11px] text-zinc-500 mb-4">Estimation indicative, non garantie de vente</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full border-[6px] border-zinc-100 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-[6px] border-zinc-900" style={{ clipPath: `inset(0 ${100 - result.score.total}% 0 0)` }} />
                <span className="text-[22px] font-black">{result.score.total}</span>
              </div>
              <div>
                <p className="text-[28px] font-black leading-none">{result.score.total}<span className="text-[16px] font-bold text-zinc-400">/100</span></p>
                <p className="text-[12px] text-zinc-600 mt-1 max-w-[180px] leading-snug">{result.score.explanation}</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(result.score.breakdown).map(([k, v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-[11px] font-medium capitalize w-24">{k === 'purchasePrice' ? 'Prix achat' : k === 'speed' ? 'Vitesse' : k}</span>
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 rounded-full transition-all" style={{ width: `${v}%` }} />
                  </div>
                  <span className="text-[11px] font-bold w-8 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Photos mini */}
          <div className="rounded-[24px] bg-white border border-zinc-200 p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">{result.photos.length} photos analysées</p>
            <div className="grid grid-cols-5 gap-2">
              {result.photos.map((p, i) => (
                <img key={p.id} src={p.url} alt="" className="aspect-square rounded-xl object-cover border" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
