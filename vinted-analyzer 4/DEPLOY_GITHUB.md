# 🚀 Connecter à GitHub - Guide Complet

Ton projet est déjà un dépôt Git local avec commit initial sur branche `main`.

## Option 1: Nouveau repo GitHub (recommandé)

### 1. Crée le repo sur GitHub
Va sur https://github.com/new
- **Repository name:** `vinted-profit-analyzer-ai`
- **Description:** `Vinted Profit Analyzer AI - SaaS pour revendeurs Vinted : analyse multi-photos, rentabilité, ROI, annonce auto`
- **Visibility:** Public ou Private (ton choix)
- **NE coche PAS** "Initialize with README" (on a déjà le code)
- Clique **Create repository**

### 2. Connecte et pousse (2 commandes)

GitHub te donnera une URL genre `https://github.com/TON_USERNAME/vinted-profit-analyzer-ai.git`

Dans ce terminal (ou local), exécute :

```bash
cd /home/user/vinted-analyzer

# Remplace par ton URL
git remote add origin https://github.com/TON_USERNAME/vinted-profit-analyzer-ai.git

# Pousse
git push -u origin main
```

Si GitHub demande auth :
- **HTTPS:** Utilise un Personal Access Token (Settings > Developer settings > Tokens > Generate)
  - Username = ton username GitHub
  - Password = ton token
- **SSH:** `git remote add origin git@github.com:TON_USERNAME/vinted-profit-analyzer-ai.git`

### 3. C'est en ligne !

Ton code est sur GitHub. Tu peux ensuite :
- Connecter à **Vercel** : https://vercel.com/new → Import Git Repository → `vinted-profit-analyzer-ai` → Deploy (auto)
- Ou **Netlify**, **Railway**, etc.

## Option 2: Utiliser le script automatique

J'ai créé `push_to_github.sh` :

```bash
chmod +x push_to_github.sh
./push_to_github.sh https://github.com/TON_USERNAME/vinted-profit-analyzer-ai.git
```

## Option 3: GitHub CLI (si installé)

```bash
gh auth login
gh repo create vinted-profit-analyzer-ai --public --source=. --remote=origin --push
```

## Variables d'environnement à configurer (plus tard)

Sur Vercel / hosting, ajoute :

```
VISION_API_KEY=sk-...
VISION_API_URL=https://api.openai.com/v1/chat/completions
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=https://ton-domaine.com
```

## Structure du repo

```
vinted-profit-analyzer-ai/
├── src/
│   ├── app/ (Next.js App Router)
│   ├── components/ (PhotoUploader, ResultView, Dashboard, etc.)
│   └── lib/ (analyzer, types, storage, mockData)
├── .github/workflows/ci.yml
├── public/
├── LICENSE (MIT)
├── README.md
└── DEPLOY_GITHUB.md
```

## Prochaines étapes après push

1. **Vercel Deploy** (1 clic) : https://vercel.com/new
2. **Domaine custom** : dans Vercel Settings > Domains
3. **Stripe** : ajoute clés dans Vercel Env Vars
4. **Vraie IA Vision** : remplace `simulateAnalysis` dans `src/lib/analyzer.ts` par call API `/api/analyze` sécurisé

Besoin d'aide ? Donne-moi l'URL de ton repo et je prépare la commande exacte.
