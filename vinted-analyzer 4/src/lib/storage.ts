import { AnalysisResult, User, SubscriptionPlan } from './types';

const STORAGE_KEYS = {
  analyses: 'vpa_analyses',
  user: 'vpa_user',
  stats: 'vpa_stats',
};

export function getAnalyses(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.analyses);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveAnalysis(analysis: AnalysisResult) {
  const all = getAnalyses();
  all.unshift(analysis);
  localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(all.slice(0, 500)));
  return all;
}

export function deleteAnalysis(id: string) {
  const all = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.analyses, JSON.stringify(all));
  return all;
}

export function getAnalysisById(id: string): AnalysisResult | undefined {
  return getAnalyses().find(a => a.id === id);
}

// MODE GRATUIT SANS CONNEXION - Tout illimité
export function getUser(): User {
  if (typeof window === 'undefined') return defaultUser();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Force mode gratuit illimité
      return { ...parsed, plan: 'premium' as SubscriptionPlan, analysesLimit: 999999, analysesUsed: 0 };
    }
  } catch {}
  const u = defaultUser();
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
  return u;
}

function defaultUser(): User {
  return {
    id: 'user_free',
    email: 'gratuit@vinted-analyzer.app',
    name: 'Mode Gratuit',
    plan: 'premium', // Tout débloqué
    analysesUsed: 0,
    analysesLimit: 999999,
    createdAt: new Date().toISOString(),
  };
}

export function updateUser(patch: Partial<User>) {
  const user = { ...getUser(), ...patch, plan: 'premium' as SubscriptionPlan, analysesLimit: 999999 };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

// Toujours autorisé en mode gratuit
export function canAnalyze(user: User): boolean {
  return true;
}

export function incrementUsage() {
  // Ne compte plus en mode gratuit
  return getUser();
}

export function getPlanDetails(plan: SubscriptionPlan) {
  const plans = {
    free: { name: 'Gratuit Illimité', limit: 999999, price: '0€', features: ['Analyses illimitées', 'Jusqu’à 10 photos par article', 'Historique illimité', 'Génération annonces', 'Statistiques complètes', 'Comparateur', 'Sans compte'] },
    pro: { name: 'Gratuit Illimité', limit: 999999, price: '0€', features: ['Analyses illimitées', 'Jusqu’à 10 photos', 'Historique illimité', 'Génération annonces', 'Statistiques'] },
    premium: { name: 'Gratuit Illimité', limit: 999999, price: '0€', features: ['Analyses illimitées', 'Comparateur avancé', 'Stats avancées', 'IA premium', 'Tout gratuit'] },
  };
  return plans[plan];
}
