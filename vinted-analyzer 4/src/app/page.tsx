"use client";
import { useEffect, useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import ResultView from "@/components/ResultView";
import Dashboard from "@/components/Dashboard";
import History from "@/components/History";
import Comparator from "@/components/Comparator";
import { PhotoItem, AnalysisResult } from "@/lib/types";
import { simulateAnalysis } from "@/lib/analyzer";
import { getAnalyses, saveAnalysis, deleteAnalysis } from "@/lib/storage";

type View = 'dashboard' | 'analyze' | 'history' | 'comparator' | 'stats' | 'settings';

export default function Home() {
  const [view, setView] = useState<View>('analyze');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [purchasePrice, setPurchasePrice] = useState<number>(15);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<{ label: string; pct: number } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setAnalyses(getAnalyses());
    // Nettoie ancien user pour mode gratuit
    localStorage.removeItem('vpa_user');
  }, []);

  const handleAnalyze = async () => {
    if (photos.length === 0) {
      alert("Ajoutez au moins une photo.");
      return;
    }
    setIsAnalyzing(true);
    setProgress({ label: 'Préparation...', pct: 5 });
    try {
      const res = await simulateAnalysis(photos, purchasePrice, (label, pct) => setProgress({ label, pct }));
      setResult(res);
      const updated = saveAnalysis(res);
      setAnalyses(updated);
    } catch (e: any) {
      alert("Impossible d'analyser cette image. " + e.message);
    } finally {
      setIsAnalyzing(false);
      setProgress(null);
    }
  };

  const handleSave = () => {
    if (result) {
      alert("Article sauvegardé dans ton historique ✓");
    }
  };

  const handleNew = () => {
    setPhotos([]);
    setResult(null);
    setPurchasePrice(15);
  };

  const handleDelete = (id: string) => {
    const updated = deleteAnalysis(id);
    setAnalyses(updated);
  };

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analyze', label: 'Analyser', icon: '📸' },
    { id: 'history', label: 'Mes articles', icon: '🗂️' },
    { id: 'comparator', label: 'Comparateur', icon: '🏆' },
    { id: 'stats', label: 'Statistiques', icon: '📈' },
    { id: 'settings', label: 'Infos', icon: 'ℹ️' },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf8] text-zinc-900 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-zinc-200">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-[16px]">V</div>
            <div>
              <p className="text-[15px] font-black tracking-tight leading-none">VINTED PROFIT</p>
              <p className="text-[10px] font-bold tracking-widest text-zinc-500 -mt-0.5">ANALYZER AI • FREE</p>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-6 pl-6 border-l border-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-zinc-600">100% gratuit • Sans compte • {photos.length >0 ? `${photos.length} photos prêtes` : 'Illimité'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 pl-3 pr-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-800 tracking-wide">GRATUIT • ILLIMITÉ • SANS CONNEXION</span>
            </div>
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center">☰</button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1400px] mx-auto w-full flex">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-[240px] shrink-0 p-6 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition text-left ${view === item.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-600 hover:bg-white hover:text-zinc-900 border border-transparent hover:border-zinc-200'}`}
              >
                <span className="text-[16px]">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-[20px] bg-emerald-500 text-white p-5 shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-2xl rounded-full" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-100 relative">Mode</p>
            <p className="text-[18px] font-black mt-1 relative">100% Gratuit</p>
            <p className="text-[12px] text-emerald-100 mt-1 relative leading-snug">Analyses illimitées, 10 photos, sans compte, sans paiement. Tout est débloqué.</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] font-bold bg-white/15 rounded-full px-3 py-2 w-fit relative">
              <span>✓</span> {analyses.length} analyses sauvegardées
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-violet-50 border border-violet-100">
            <p className="text-[12px] font-bold text-violet-900">💡 Astuce Pro</p>
            <p className="text-[11px] text-violet-700 mt-1 leading-relaxed">Ajoute 5 photos (vue, étiquette, logo, défaut, détail) pour +25% de précision IA.</p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-white border border-zinc-200">
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Raccourcis</p>
            <div className="space-y-2 text-[12px]">
              <p>📸 Glisse-dépose tes photos</p>
              <p>📱 Fonctionne sur téléphone</p>
              <p>💾 Sauvegarde locale auto</p>
              <p>🚀 Aucune limite</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 md:p-8">
          {view === 'dashboard' && <Dashboard analyses={analyses} onAnalyzeClick={() => setView('analyze')} />}

          {view === 'analyze' && (
            <div className="space-y-6">
              {!result ? (
                <>
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h1 className="text-[30px] md:text-[36px] font-black tracking-tight leading-[0.9]">Analyse ton article</h1>
                      <p className="text-[14px] text-zinc-500 mt-3 max-w-xl">📸 Photos → 🤖 Analyse IA → 📊 Marché → 💰 Rentabilité → 📝 Annonce Vinted. <span className="font-bold text-emerald-600">Gratuit et illimité.</span></p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sans compte • Sans limite
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <PhotoUploader photos={photos} setPhotos={setPhotos} />
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-[24px] bg-white border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-[14px] font-bold mb-4">💶 Prix d'achat</h3>
                        <div className="relative">
                          <input
                            type="number"
                            value={purchasePrice}
                            onChange={e => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full h-14 pl-5 pr-12 rounded-2xl bg-zinc-50 border border-zinc-200 text-[22px] font-black focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-zinc-400">€</span>
                        </div>
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {[5,10,15,25].map(v => (
                            <button key={v} onClick={() => setPurchasePrice(v)} className={`py-2 rounded-full text-[12px] font-bold border transition ${purchasePrice===v ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>{v}€</button>
                          ))}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-4 leading-relaxed">Ce prix sert à calculer profit, ROI et score de rentabilité.</p>
                      </div>

                      <div className="rounded-[24px] bg-zinc-900 text-white p-6 shadow-lg relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-violet-600 to-fuchsia-600 blur-3xl opacity-30 rounded-full" />
                        <div className="flex items-center gap-2 mb-1 relative">
                          <h4 className="text-[14px] font-bold">Prêt à analyser ?</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">GRATUIT</span>
                        </div>
                        <p className="text-[12px] text-zinc-400 mt-2 relative leading-relaxed">IA multi-photos, estimation rentabilité, annonce Vinted — tout illimité sans compte.</p>

                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing || photos.length === 0}
                          className="mt-5 w-full h-12 rounded-full bg-white text-zinc-900 font-black text-[14px] flex items-center justify-center gap-2 hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl relative"
                        >
                          {isAnalyzing ? (
                            <>
                              <span className="w-4 h-4 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                              {progress?.label || 'Analyse...'}
                            </>
                          ) : (
                            <>✨ Analyser mon article — Gratuit</>
                          )}
                        </button>

                        {isAnalyzing && progress && (
                          <div className="mt-4 relative">
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progress.pct}%` }} />
                            </div>
                            <p className="text-[11px] text-zinc-400 mt-2">{progress.pct}% • {progress.label}</p>
                          </div>
                        )}

                        {photos.length === 0 && <p className="text-[11px] text-amber-300 mt-3 relative">⚠ Ajoute au moins une photo</p>}
                      </div>

                      <div className="rounded-[20px] bg-white border border-zinc-200 p-5">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Comment ça marche</p>
                        <div className="space-y-3 text-[12px] leading-relaxed">
                          <p className="flex gap-2"><span>1️⃣</span><span><b>Photos multiples</b> — vue, étiquette, logo, défauts</span></p>
                          <p className="flex gap-2"><span>2️⃣</span><span><b>IA vision</b> — marque, état, authenticité</span></p>
                          <p className="flex gap-2"><span>3️⃣</span><span><b>Rentabilité</b> — prix, ROI, score sur 100</span></p>
                          <p className="flex gap-2"><span>4️⃣</span><span><b>Annonce</b> — titre + description Vinted prête</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <ResultView result={result} onSave={handleSave} onNew={handleNew} />
              )}
            </div>
          )}

          {view === 'history' && <History analyses={analyses} onOpen={(a) => { setResult(a); setView('analyze'); window.scrollTo(0,0); }} onDelete={handleDelete} />}

          {view === 'comparator' && <Comparator analyses={analyses} />}

          {view === 'stats' && (
            <div className="space-y-6 animate-fadeIn">
              <h1 className="text-[32px] font-black tracking-tight leading-none">Statistiques</h1>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-[24px] bg-white border p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold mb-4">Répartition par rentabilité</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Très rentable', level: 'very_profitable' as const, color: 'bg-emerald-500' },
                      { label: 'Rentable', level: 'profitable' as const, color: 'bg-emerald-400' },
                      { label: 'Moyenne', level: 'average' as const, color: 'bg-amber-400' },
                      { label: 'Faible', level: 'low' as const, color: 'bg-orange-400' },
                      { label: 'Non rentable', level: 'not_profitable' as const, color: 'bg-red-500' },
                    ].map(item => {
                      const count = analyses.filter(a => a.profit.level === item.level).length;
                      const pct = analyses.length ? (count/analyses.length)*100 : 0;
                      return (
                        <div key={item.level} className="flex items-center gap-3">
                          <span className="text-[12px] w-28">{item.label}</span>
                          <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} /></div>
                          <span className="text-[11px] font-bold w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-[24px] bg-white border p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold mb-4">Insights • Mode gratuit</h3>
                  <ul className="space-y-3 text-[13px] leading-relaxed text-zinc-600">
                    <li>• Prix d'achat optimal observé: <b>{analyses.length ? Math.round(analyses.filter(a=>a.profit.level==='very_profitable').reduce((s,a)=>s+a.profit.purchasePrice,0)/(analyses.filter(a=>a.profit.level==='very_profitable').length||1)) : 12}€</b></li>
                    <li>• Meilleure catégorie: <b>{analyses.length ? Object.entries(analyses.reduce((acc:any,cur)=>{acc[cur.identified.category]=(acc[cur.identified.category]||0)+cur.profit.profit;return acc;},{})).sort((a:any,b:any)=>b[1]-a[1])[0]?.[0] || '—' : '—'}</b></li>
                    <li>• ROI moyen des 5 derniers: <b>{analyses.slice(0,5).reduce((s,a)=>s+a.profit.roi,0)/ (analyses.slice(0,5).length||1) | 0}%</b></li>
                    <li>• Taux de rentabilité: <b>{analyses.length ? Math.round((analyses.filter(a=>a.profit.level==='very_profitable'||a.profit.level==='profitable').length/analyses.length)*100) : 0}%</b></li>
                    <li>• Mode: <b className="text-emerald-600">100% gratuit • Illimité • Local</b></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {view === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-3xl">
              <h1 className="text-[32px] font-black tracking-tight leading-none">À propos • Mode Gratuit</h1>

              <div className="rounded-[24px] bg-emerald-500 text-white p-8 shadow-lg relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 blur-3xl rounded-full" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[11px] font-bold tracking-widest">✓ 100% GRATUIT • SANS COMPTE • ILLIMITÉ</div>
                  <h2 className="text-[28px] font-black mt-4 leading-[0.9]">Tout est débloqué.<br/>Pour toujours.</h2>
                  <p className="text-[14px] text-emerald-50 mt-3 leading-relaxed max-w-lg">Pas d'inscription, pas de paiement, pas de limite. Analyses illimitées, 10 photos par article, historique local, génération d'annonces, comparateur, stats — tout gratuit.</p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px] font-semibold">
                    <div className="bg-white/15 rounded-2xl p-3">♾️ Analyses illimitées</div>
                    <div className="bg-white/15 rounded-2xl p-3">📸 10 photos max</div>
                    <div className="bg-white/15 rounded-2xl p-3">💾 Local storage</div>
                    <div className="bg-white/15 rounded-2xl p-3">🚀 Sans connexion</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-[24px] bg-white border p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold mb-2">🔒 Confidentialité</h3>
                  <p className="text-[12px] text-zinc-600 leading-relaxed">Tout reste dans ton navigateur (localStorage). Aucune photo n'est envoyée à un serveur. Aucun compte requis. Tu peux effacer à tout moment.</p>
                </div>
                <div className="rounded-[24px] bg-white border p-6 shadow-sm">
                  <h3 className="text-[14px] font-bold mb-2">💡 Comment ça marche ?</h3>
                  <p className="text-[12px] text-zinc-600 leading-relaxed">L'analyse est simulée côté client avec une IA heuristique avancée (couleur dominante, marque, catégorie, marché). Prêt à brancher une vraie API Vision (OpenAI, Claude) via <code className="bg-zinc-100 px-1 rounded">src/lib/analyzer.ts</code>.</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white border p-6">
                <h3 className="text-[14px] font-bold mb-4">Données locales</h3>
                <p className="text-[12px] text-zinc-500">{analyses.length} analyses sauvegardées localement</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => { if(confirm('Effacer tout l\'historique ?')) { localStorage.clear(); setAnalyses([]); alert('Historique effacé'); } }} className="px-4 py-2 rounded-full bg-zinc-100 border text-[12px] font-semibold hover:bg-zinc-200">🗑️ Effacer historique</button>
                  <button onClick={() => { const data = JSON.stringify(getAnalyses(), null, 2); const blob = new Blob([data], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='vinted-analyses.json'; a.click(); }} className="px-4 py-2 rounded-full bg-zinc-900 text-white text-[12px] font-bold hover:bg-black">⬇️ Exporter JSON</button>
                </div>
              </div>

              <div className="rounded-[24px] bg-zinc-900 text-white p-6">
                <h3 className="text-[14px] font-bold">🚀 Déploiement</h3>
                <p className="text-[12px] text-zinc-400 mt-2 leading-relaxed">Ce projet est déjà sur GitHub. Connecte-le à Vercel en 1 clic pour le mettre en ligne gratuitement. Aucune variable d'env requise en mode gratuit.</p>
                <p className="text-[11px] text-zinc-500 mt-3">Build: <code>npm run build</code> • Dev: <code>npm run dev</code></p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile nav */}
      <div className="lg:hidden sticky bottom-0 z-40 bg-white/90 backdrop-blur-xl border-t border-zinc-200 px-2 py-2">
        <div className="flex justify-around">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setView(item.id); setShowMobileMenu(false); }} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition ${view===item.id ? 'bg-zinc-900 text-white' : 'text-zinc-500'}`}>
              <span className="text-[18px]">{item.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white p-6">
          <div className="flex justify-between items-center mb-8">
            <p className="font-black">Menu • Gratuit</p>
            <button onClick={() => setShowMobileMenu(false)} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">✕</button>
          </div>
          <div className="space-y-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => { setView(item.id); setShowMobileMenu(false); }} className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-bold ${view===item.id ? 'bg-zinc-900 text-white' : 'bg-zinc-50'}`}>
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-[12px] font-bold text-emerald-800">100% Gratuit • Illimité • Sans compte</p>
          </div>
        </div>
      )}
    </div>
  );
}
