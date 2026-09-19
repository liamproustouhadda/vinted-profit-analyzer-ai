export const BRANDS = [
  { name: 'Nike', tier: 'streetwear', multiplier: 1.8 },
  { name: 'Adidas', tier: 'streetwear', multiplier: 1.6 },
  { name: 'Zara', tier: 'fast', multiplier: 0.7 },
  { name: 'H&M', tier: 'fast', multiplier: 0.5 },
  { name: 'Levi\'s', tier: 'casual', multiplier: 1.4 },
  { name: 'Gucci', tier: 'luxe', multiplier: 3.5 },
  { name: 'Louis Vuitton', tier: 'luxe', multiplier: 4.2 },
  { name: 'Chanel', tier: 'luxe', multiplier: 4.0 },
  { name: 'Supreme', tier: 'hype', multiplier: 2.8 },
  { name: 'The North Face', tier: 'outdoor', multiplier: 1.9 },
  { name: 'Patagonia', tier: 'outdoor', multiplier: 2.0 },
  { name: 'Carhartt', tier: 'workwear', multiplier: 1.7 },
  { name: 'Ralph Lauren', tier: 'premium', multiplier: 1.8 },
  { name: 'Lacoste', tier: 'premium', multiplier: 1.5 },
  { name: 'Tommy Hilfiger', tier: 'premium', multiplier: 1.3 },
  { name: 'Uniqlo', tier: 'basics', multiplier: 0.8 },
  { name: 'Mango', tier: 'fast', multiplier: 0.7 },
  { name: 'Sezane', tier: 'premium', multiplier: 1.9 },
  { name: 'Sandro', tier: 'premium', multiplier: 2.2 },
  { name: 'Maje', tier: 'premium', multiplier: 2.1 },
  { name: 'Balenciaga', tier: 'luxe', multiplier: 3.2 },
  { name: 'Stone Island', tier: 'hype', multiplier: 2.5 },
  { name: 'Arc\'teryx', tier: 'outdoor', multiplier: 2.3 },
  { name: 'Stussy', tier: 'streetwear', multiplier: 2.0 },
  { name: 'Palace', tier: 'hype', multiplier: 2.4 },
  { name: 'Non identifiée', tier: 'unknown', multiplier: 1.0 },
];

export const CATEGORIES = [
  { name: 'Sweat', sub: ['Crewneck', 'Hoodie', 'Zippé', 'Oversize'], basePrice: 35 },
  { name: 'Veste', sub: ['Bomber', 'Denim', 'Cuir', 'Blazer', 'Doudoune'], basePrice: 65 },
  { name: 'T-shirt', sub: ['Col rond', 'Col V', 'Oversize', 'Long'], basePrice: 20 },
  { name: 'Jean', sub: ['Slim', 'Regular', 'Baggy', 'Mom', 'Bootcut'], basePrice: 40 },
  { name: 'Robe', sub: ['Courte', 'Longue', 'Midi', 'Pull'], basePrice: 45 },
  { name: 'Chemise', sub: ['Oxford', 'Flanelle', 'Hawaïenne', 'Lin'], basePrice: 30 },
  { name: 'Pull', sub: ['Col rond', 'Col roulé', 'Cardigan', 'Maille'], basePrice: 38 },
  { name: 'Manteau', sub: ['Trench', 'Parka', 'Wool', 'Long'], basePrice: 90 },
  { name: 'Chaussures', sub: ['Sneakers', 'Bottes', 'Derbies', 'Sandales'], basePrice: 55 },
  { name: 'Sac', sub: ['Bandoulière', 'Tote', 'Dos', 'Pochette'], basePrice: 70 },
  { name: 'Accessoire', sub: ['Casquette', 'Écharpe', 'Ceinture', 'Bonnet'], basePrice: 18 },
];

export const COLORS = ['Noir', 'Blanc', 'Beige', 'Bleu marine', 'Bleu clair', 'Gris', 'Rouge', 'Vert kaki', 'Marron', 'Rose', 'Jaune', 'Violet', 'Multicolore'];
export const SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44', 'Unique'];
export const CONDITIONS = ['Neuf avec étiquette', 'Neuf sans étiquette', 'Très bon état', 'Bon état', 'Correct', 'Usé'];
export const MATERIALS = ['Coton', 'Laine', 'Polyester', 'Cuir', 'Denim', 'Lin', 'Cachemire', 'Nylon', 'Velours', 'Soie', 'Mélange coton/polyester'];
export const STYLES = ['Streetwear', 'Casual', 'Vintage', 'Minimaliste', 'Y2K', 'Workwear', 'Preppy', 'Grunge', 'Sportswear', 'Chic'];
export const ERAS = ['Actuel (2020+)', '2010s', '2000s Y2K', '90s vintage', '80s', '70s', 'Indéterminée'];

export const CONDITION_MULTIPLIER: Record<string, number> = {
  'Neuf avec étiquette': 1.0,
  'Neuf sans étiquette': 0.9,
  'Très bon état': 0.8,
  'Bon état': 0.65,
  'Correct': 0.45,
  'Usé': 0.25,
};
