# 🚀 Déploiement Vercel - 100% Gratuit

## Méthode 1: Via GitHub (Recommandé - 1 clic)

1. Pousse ton code sur GitHub :
```bash
git push origin main
```

2. Va sur https://vercel.com/new
   - Connecte ton compte GitHub
   - Importe `vinted-profit-analyzer-ai`
   - Clique **Deploy** (Vercel détecte Next.js automatiquement)
   - Aucune variable d'env nécessaire en mode gratuit !

3. Ton app est en ligne en 30s sur `https://vinted-profit-analyzer-ai.vercel.app`

Chaque `git push` redéploie automatiquement.

---

## Méthode 2: Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Réponds :
- Set up and deploy? Y
- Which scope? Ton compte
- Link to existing project? N
- Project name: vinted-profit-analyzer-ai
- Directory: ./
- Override settings? N

---

## Méthode 3: Drag & Drop ZIP

1. Va sur https://vercel.com/new
2. Choisis "Browse" et glisse `vinted-profit-analyzer-ai.zip`
3. Deploy

---

## Configuration

- **Framework:** Next.js (auto-détecté)
- **Build:** `npm run build`
- **Output:** `.next`
- **Node:** 20.x
- **Region:** Paris (cdg1) pour latence minimale en France

Aucune clé API requise en mode gratuit. Si tu ajoutes une vraie API Vision plus tard :
```
VISION_API_KEY=sk-...
VISION_API_URL=https://api.openai.com/v1/...
```

---

## Domaine custom (optionnel)

Dans Vercel Dashboard > Settings > Domains :
- Ajoute `ton-domaine.com`
- Configure DNS CNAME vers `cname.vercel-dns.com`

---

## Performance

- ✅ 100% statique + ISR
- ✅ Edge Network global
- ✅ HTTPS auto
- ✅ Gratuit illimité pour usage perso (Hobby plan)
