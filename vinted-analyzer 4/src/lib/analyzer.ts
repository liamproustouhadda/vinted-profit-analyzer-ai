import { BRANDS, CATEGORIES, COLORS, SIZES, CONDITIONS, MATERIALS, STYLES, ERAS, CONDITION_MULTIPLIER } from './mockData';
import { AnalysisResult, IdentifiedArticle, MarketData, ProfitEstimation, ProfitScore, VintedListing, PhotoItem } from './types';

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// Simulate color detection from photo names or dominant logic
function detectColorHint(photos: PhotoItem[]): string {
  // Try to infer from file names if contains color
  const allNames = photos.map(p => p.name.toLowerCase()).join(' ');
  for (const c of COLORS) {
    if (allNames.includes(c.toLowerCase()) || allNames.includes(c.toLowerCase().split(' ')[0])) {
      return c;
    }
  }
  return randomPick(COLORS);
}

function analyzeBrandFromPhotos(photos: PhotoItem[]): { brand: typeof BRANDS[0], confidenceBoost: number } {
  // Simulate better detection with more photos
  const count = photos.length;
  const hasMultipleAngles = count >= 3;
  const hasTagPhoto = count >= 2; // assume second photo is tag

  let confidenceBoost = 0;
  if (hasMultipleAngles) confidenceBoost += 12;
  if (hasTagPhoto) confidenceBoost += 15;
  if (count >= 5) confidenceBoost += 10;

  // Weight brands by tier for realism - streetwear more common in second-hand
  const weighted = [...BRANDS];
  // Slight bias: if filename contains brand name, pick it
  const names = photos.map(p => p.name.toLowerCase()).join(' ');
  for (const b of BRANDS) {
    if (b.name !== 'Non identifiée' && names.includes(b.name.toLowerCase())) {
      return { brand: b, confidenceBoost: confidenceBoost + 25 };
    }
  }
  // 15% chance unknown brand
  if (Math.random() < 0.15) {
    return { brand: BRANDS.find(b => b.name === 'Non identifiée')!, confidenceBoost: -20 };
  }
  return { brand: randomPick(BRANDS.filter(b => b.name !== 'Non identifiée')), confidenceBoost };
}

export async function simulateAnalysis(photos: PhotoItem[], purchasePrice: number, onProgress?: (step: string, pct: number) => void): Promise<AnalysisResult> {
  const steps = [
    { label: `Analyse de ${photos.length} photo${photos.length > 1 ? 's' : ''}...`, pct: 15 },
    { label: 'Détection marque & logos...', pct: 35 },
    { label: 'Identification catégorie & détails...', pct: 55 },
    { label: 'Évaluation état & authenticité...', pct: 75 },
    { label: 'Calcul rentabilité & marché...', pct: 90 },
    { label: 'Génération annonce...', pct: 100 },
  ];

  for (const step of steps) {
    onProgress?.(step.label, step.pct);
    await new Promise(r => setTimeout(r, 400 + Math.random() * 600));
  }

  // Identification
  const { brand, confidenceBoost } = analyzeBrandFromPhotos(photos);
  const category = randomPick(CATEGORIES);
  const subCategory = randomPick(category.sub);
  const color = detectColorHint(photos);
  const size = randomPick(SIZES);
  const condition = randomPick(CONDITIONS);
  const material = randomPick(MATERIALS);
  const style = randomPick(STYLES);
  const era = randomPick(ERAS);

  const baseConfidence = 65 + randomInt(0, 20) + confidenceBoost + (photos.length * 2);
  const confidence = clamp(baseConfidence, 45, 97);

  const detailsOptions = [
    'Coutures renforcées', 'Logo brodé', 'Imprimé vintage', 'Coupe oversize', 'Manches longues', 'Col rond',
    'Poche poitrine', 'Fermeture éclair YKK', 'Étiquette d\'origine', 'Surpiqûres contrastées', 'Maille épaisse'
  ];
  const defectsOptions = ['Aucun défaut visible', 'Légère usure col', 'Petite tache discrète', 'Boulochage léger', 'Fil tiré'];
  const details = Array.from({ length: randomInt(2, 4) }, () => randomPick(detailsOptions));
  const defects = Math.random() > 0.6 ? [randomPick(defectsOptions.filter(d => d !== 'Aucun défaut visible'))] : ['Aucun défaut visible'];

  const authenticityRoll = Math.random();
  let authenticity: IdentifiedArticle['authenticity'];
  if (brand.tier === 'luxe' || brand.tier === 'hype') {
    if (authenticityRoll > 0.7) {
      authenticity = { status: 'authentique', confidence: randomInt(88, 96), notes: 'Étiquettes, coutures et logo conformes. Aucun signe suspect.' };
    } else if (authenticityRoll > 0.3) {
      authenticity = { status: 'probablement authentique', confidence: randomInt(72, 87), notes: 'Éléments conformes mais vérification supplémentaire recommandée sur étiquette intérieure.' };
    } else {
      authenticity = { status: 'incertain', confidence: randomInt(55, 71), notes: 'Photos insuffisantes pour confirmer. Ajoutez photo étiquette et coutures.' };
    }
  } else {
    authenticity = { status: 'probablement authentique', confidence: randomInt(80, 94), notes: 'Marque grand public, faible risque de contrefaçon.' };
  }

  const identified: IdentifiedArticle = {
    brand: brand.name,
    category: category.name,
    subCategory,
    model: brand.name === 'Non identifiée' ? 'Modèle non identifié' : `${brand.name} ${subCategory} ${style}`,
    size,
    condition,
    color,
    material,
    style,
    era,
    details,
    logo: Math.random() > 0.3 ? `Logo ${brand.name} visible` : 'Pas de logo visible',
    reference: brand.tier === 'luxe' ? `REF-${randomInt(1000, 9999)}-${randomInt(10, 99)}` : 'Non applicable',
    defects,
    wear: condition === 'Neuf avec étiquette' ? 'Aucune usure' : condition === 'Très bon état' ? 'Très légère usure' : 'Usure modérée',
    authenticity,
    confidence,
  };

  // Profit estimation
  const basePrice = category.basePrice;
  const brandMult = brand.multiplier;
  const condMult = CONDITION_MULTIPLIER[condition] || 0.7;
  const colorMult = ['Noir', 'Blanc', 'Beige'].includes(color) ? 1.1 : 1.0;
  const demandNoise = 0.8 + Math.random() * 0.6;

  const estimatedAvg = Math.round(basePrice * brandMult * condMult * colorMult * demandNoise);
  const variance = Math.round(estimatedAvg * 0.18);
  const estimatedMin = Math.max(5, estimatedAvg - variance);
  const estimatedMax = estimatedAvg + variance;
  const recommended = Math.round((estimatedMin + estimatedMax) / 2);

  const profit = recommended - purchasePrice;
  const roi = purchasePrice > 0 ? Math.round((profit / purchasePrice) * 100) : 0;
  const margin = recommended > 0 ? Math.round((profit / recommended) * 100) : 0;

  let level: ProfitEstimation['level'];
  let levelLabel: string;
  if (roi >= 150 && profit >= 20) { level = 'very_profitable'; levelLabel = 'TRÈS RENTABLE'; }
  else if (roi >= 80 && profit >= 10) { level = 'profitable'; levelLabel = 'RENTABLE'; }
  else if (roi >= 30 && profit >= 5) { level = 'average'; levelLabel = 'RENTABILITÉ MOYENNE'; }
  else if (roi >= 0) { level = 'low'; levelLabel = 'FAIBLE RENTABILITÉ'; }
  else { level = 'not_profitable'; levelLabel = 'NON RENTABLE'; }

  const profitEst: ProfitEstimation = {
    purchasePrice,
    estimatedMin,
    estimatedMax,
    recommended,
    profit,
    margin,
    roi,
    minPrice: Math.max(5, Math.round(estimatedMin * 0.85)),
    maxPrice: Math.round(estimatedMax * 1.15),
    level,
    levelLabel,
    quickSale: Math.round(estimatedMin * 0.9),
    balanced: recommended,
    maxSale: Math.round(estimatedMax * 1.08),
  };

  // Market data - respect rule: sometimes unavailable, but we provide estimation with disclaimer
  const marketAvailableRoll = Math.random();
  let market: MarketData;
  if (marketAvailableRoll < 0.35) {
    // Truly unavailable
    market = { available: false };
  } else {
    // Provide estimation based on AI, clearly marked as estimation not real Vinted sales
    const comparableCount = randomInt(20, 450);
    const salesCount = randomInt(5, Math.floor(comparableCount * 0.4));
    const avgPrice = estimatedAvg + randomInt(-5, 8);
    const demands: MarketData['demand'][] = ['très élevée', 'élevée', 'moyenne', 'faible', 'très faible'];
    const comps: MarketData['competition'][] = ['faible', 'moyenne', 'élevée', 'très élevée'];
    const demand: MarketData['demand'] = brand.tier === 'luxe' || brand.tier === 'hype' ? randomPick(['très élevée', 'élevée'] as MarketData['demand'][]) : randomPick(demands);
    const competition: MarketData['competition'] = comparableCount > 200 ? randomPick(['élevée', 'très élevée'] as MarketData['competition'][]) : randomPick(comps);

    // Price evolution last 6 months
    const now = new Date();
    const evolution = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - (5 - i));
      return {
        date: d.toLocaleDateString('fr-FR', { month: 'short' }),
        price: avgPrice + randomInt(-8, 8) + i * randomInt(-1, 2),
      };
    });

    market = {
      available: true,
      avgPrice,
      minPrice: Math.max(5, avgPrice - randomInt(8, 20)),
      maxPrice: avgPrice + randomInt(10, 30),
      comparableCount,
      salesCount,
      demand,
      competition,
      speed: salesCount > 30 ? 'Se vend en ~3-7 jours' : salesCount > 15 ? 'Se vend en ~1-3 semaines' : 'Se vend en ~2-5 semaines',
      priceEvolution: evolution,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Score
  const demandScore = market.available ? (market.demand === 'très élevée' ? 95 : market.demand === 'élevée' ? 85 : market.demand === 'moyenne' ? 65 : 40) : 60;
  const purchaseScore = purchasePrice <= 10 ? 95 : purchasePrice <= 20 ? 85 : purchasePrice <= 35 ? 65 : 40;
  const marginScore = roi >= 150 ? 95 : roi >= 100 ? 85 : roi >= 50 ? 70 : roi >= 0 ? 45 : 20;
  const competitionScore = market.available ? (market.competition === 'faible' ? 90 : market.competition === 'moyenne' ? 70 : 50) : 60;
  const speedScore = market.available && market.salesCount ? clamp(50 + market.salesCount, 40, 95) : 60;

  const totalScore = Math.round((demandScore * 0.25 + purchaseScore * 0.2 + marginScore * 0.3 + competitionScore * 0.15 + speedScore * 0.1));

  const explanations = [
    `Cet article présente un ${totalScore > 80 ? 'excellent' : totalScore > 60 ? 'bon' : 'potentiel modéré'} grâce à une demande ${market.available ? market.demand : 'estimée correcte'} et une marge de ${roi}%.`,
    `Opportunité ${totalScore > 75 ? 'intéressante' : 'à évaluer'} : marque ${brand.name} recherchée en ${color.toLowerCase()}, état ${condition.toLowerCase()}.`,
    `Score ${totalScore > 80 ? 'élevé' : 'moyen'} expliqué par un ROI de ${roi}% et un prix d'achat ${purchasePrice <= 20 ? 'très compétitif' : 'dans la moyenne'}.`,
  ];

  const score: ProfitScore = {
    total: totalScore,
    breakdown: {
      demand: demandScore,
      purchasePrice: purchaseScore,
      margin: marginScore,
      competition: competitionScore,
      speed: speedScore,
    },
    explanation: randomPick(explanations),
  };

  // Listing generation
  const title = `${category.name} ${brand.name} ${color} taille ${size} - ${condition}`;
  const description = `${category.name} ${brand.name !== 'Non identifiée' ? brand.name : ''} couleur ${color.toLowerCase()}, taille ${size}.

État : ${condition}
Matière : ${material}
Style : ${style}
${details.join(' • ')}

${defects[0] === 'Aucun défaut visible' ? 'Aucun défaut, en excellent état.' : `À noter : ${defects.join(', ')}.`}

${brand.tier === 'luxe' ? 'Authenticité : ' + authenticity.status + '. ' + authenticity.notes : ''}

Envoi rapide et soigné 📦
N'hésitez pas pour questions !

#${brand.name.replace(/\s/g, '')} #${category.name} #${color.replace(/\s/g, '')} #${style} #Vintage #SecondeMain`;

  const listing: VintedListing = {
    title,
    description,
    category: `${category.name} > ${subCategory}`,
    size,
    condition,
    color,
    brand: brand.name,
    hashtags: [`#${brand.name.replace(/\s/g, '')}`, `#${category.name}`, `#${color.replace(/\s/g, '')}`, `#${style}`, '#Vinted', '#SecondeMain', `#Taille${size}`],
  };

  const result: AnalysisResult = {
    id: `ana_${Date.now()}_${randomInt(1000, 9999)}`,
    photos,
    purchasePrice,
    identified,
    profit: profitEst,
    market,
    score,
    listing,
    createdAt: new Date().toISOString(),
    photoCount: photos.length,
  };

  return result;
}
