---
'nina.fm-faceb': major
---

Phase 1: Migration complète vers Nina.fm API avec génération automatique des types

🚀 **Migration majeure:**

- Abandon total de Supabase/Prisma au profit de l'API Nina.fm
- Architecture de types automatisée (3379 lignes générées)
- Migration de tous les composants, pages et fonctionnalités

🏗️ **Nouvelle architecture:**

- Types auto-générés depuis Swagger API (api-generated.d.ts)
- Bridge global pour compatibilité (api.d.ts)
- Utilitaires personnalisés maintenus (api-helpers.d.ts)
- Script `pnpm generate:types` pour synchronisation

✨ **Améliorations:**

- DX considérablement améliorée avec IntelliSense complet
- Source unique de vérité pour les types
- Maintenance simplifiée grâce à l'automatisation
- Architecture 100% TypeScript avec validation stricte

🔧 **Technique:**

- Migration de 200+ composants vers les nouveaux types
- Refactoring complet des composables et stores
- Formatage et optimisation ESLint généralisés
- Configuration pnpm workspace optimisée
