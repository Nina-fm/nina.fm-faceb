---
'nina.fm-admin': minor
---

Nettoyage complet des dépendances Supabase/Prisma

- Suppression des packages Supabase et Prisma du package.json
- Suppression des dossiers prisma/ et supabase/
- Nettoyage des scripts obsolètes (supa:_, db:_, prisma:\*)
- Suppression des configurations Supabase/Prisma dans nuxt.config.ts
- Application testée et fonctionnelle après nettoyage
- Prêt pour l'installation des nouvelles dépendances API
