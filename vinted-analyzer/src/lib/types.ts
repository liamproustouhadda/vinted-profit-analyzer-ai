export interface PhotoItem {
  id: string;
  url: string; // blob url or base64
  file?: File;
  isPrimary?: boolean;
  name: string;
  size: number;
}

export interface IdentifiedArticle {
  brand: string;
  category: string;
  subCategory: string;
  model: string;
  size: string;
  condition: string;
  color: string;
  material: string;
  style: string;
  era: string;
  details: string[];
  logo: string;
  reference: string;
  defects: string[];
  wear: string;
  authenticity: {
    status: 'authentique' | 'probablement authentique' | 'incertain' | 'douteux';
    confidence: number;
    notes: string;
  };
  confidence: number;
}

export interface ProfitEstimation {
  purchasePrice: number;
  estimatedMin: number;
  estimatedMax: number;
  recommended: number;
  profit: number;
  margin: number;
  roi: number;
  minPrice: number;
  maxPrice: number;
  level: 'very_profitable' | 'profitable' | 'average' | 'low' | 'not_profitable';
  levelLabel: string;
  quickSale: number;
  balanced: number;
  maxSale: number;
}

export interface MarketData {
  available: boolean;
  avgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  comparableCount?: number;
  salesCount?: number;
  demand?: 'très élevée' | 'élevée' | 'moyenne' | 'faible' | 'très faible';
  competition?: 'faible' | 'moyenne' | 'élevée' | 'très élevée';
  speed?: string;
  priceEvolution?: { date: string; price: number }[];
  lastUpdated?: string;
}

export interface ProfitScore {
  total: number;
  breakdown: {
    demand: number;
    purchasePrice: number;
    margin: number;
    competition: number;
    speed: number;
  };
  explanation: string;
}

export interface VintedListing {
  title: string;
  description: string;
  category: string;
  size: string;
  condition: string;
  color: string;
  brand: string;
  hashtags: string[];
}

export interface AnalysisResult {
  id: string;
  photos: PhotoItem[];
  purchasePrice: number;
  identified: IdentifiedArticle;
  profit: ProfitEstimation;
  market: MarketData;
  score: ProfitScore;
  listing: VintedListing;
  createdAt: string;
  photoCount: number;
}

export interface DashboardStats {
  totalAnalyzed: number;
  potentialProfit: number;
  profitableCount: number;
  avgRoi: number;
  avgPurchasePrice: number;
}

export type SubscriptionPlan = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: SubscriptionPlan;
  analysesUsed: number;
  analysesLimit: number;
  createdAt: string;
}
