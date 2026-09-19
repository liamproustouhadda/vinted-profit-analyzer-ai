# Vinted Profit Analyzer AI - 100% Gratuit, Sans Compte

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TON_USERNAME/vinted-profit-analyzer-ai)

Application SaaS complète pour revendeurs Vinted - analyse multi-photos, rentabilité, ROI, annonce auto.

**Mode actuel : 100% GRATUIT • ILLIMITÉ • SANS CONNEXION • LOCAL**

## 🚀 Démo Live
- **Vercel :** https://vinted-profit-analyzer-ai.vercel.app (après deploy)
- **Local :** `npm run dev`

## ✨ Fonctionnalités (toutes gratuites)

- 📸 **10 photos max** : drag & drop, caméra, réorganisation, photo principale
- 🤖 **IA multi-vues** : marque, catégorie, couleur, taille, état, authenticité, confiance
- 💰 **Rentabilité** : prix estimé, profit, ROI, marge, niveau Très rentable → Non rentable
- 📊 **Marché** : "Données indisponibles" respecté ou estimation avec disclaimer
- 💯 **Score 0-100** avec breakdown
- 🏆 **Comparateur** 6 articles, tri profit/ROI/score
- ✨ **Annonce Vinted** auto + copie
- 🎚️ **Prix intelligent** : rapide / équilibré / max
- 📈 **Dashboard & Stats** complets
- 🗂️ **Historique** local avec recherche/filtres

## 🛠️ Stack
Next.js 16 + TypeScript + Tailwind 4 + localStorage

## 📦 Installation

```bash
npm install
npm run dev
# http://localhost:3000
```

## 🌐 Déploiement Vercel (1 clic)

1. Push sur GitHub
2. https://vercel.com/new → Import repo → Deploy
3. Aucune env var nécessaire

Voir `VERCEL_DEPLOY.md` pour guide complet.

## 📁 Structure
```
src/
  app/page.tsx (app principale)
  components/ (PhotoUploader, ResultView, Dashboard, History, Comparator)
  lib/ (analyzer.ts, storage.ts, types.ts)
```

## 🔒 Confidentialité
Tout en localStorage, aucune photo envoyée. Mode gratuit sans compte.

## 📄 License
MIT
