# Matrice des Permissions - Nina.fm Face B

## Table de référence

| Ressource       | ADMIN                  | MANAGER                                                                                                    | CONTRIBUTOR                                                        | VIEWER                      |
| --------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------- |
| **MIXTAPES**    | ✅ Tout                | ✅ Tout                                                                                                    | ✅ Lister<br>✅ Voir détail<br>✅ Créer<br>✅ Modifier les siennes | ✅ Lister<br>✅ Voir détail |
| **DJS**         | ✅ Tout                | ✅ Tout                                                                                                    | ✅ Lister<br>✅ Voir détail                                        | ✅ Lister<br>✅ Voir détail |
| **TAGS**        | ✅ Tout                | ✅ Tout                                                                                                    | ✅ Lister<br>✅ Voir détail<br>✅ Créer                            | ✅ Lister<br>✅ Voir détail |
| **USERS**       | ✅ Tout                | ✅ Lister<br>✅ Voir détail<br>✅ Modifier VIEWER/CONTRIBUTOR<br>❌ Supprimer<br>❌ Modifier MANAGER/ADMIN | ❌ Aucun droit                                                     | ❌ Aucun droit              |
| **INVITATIONS** | ✅ Tout                | ✅ Tout                                                                                                    | ❌ Aucun droit                                                     | ❌ Aucun droit              |
| **PROFILE**     | ✅ Modifier son profil | ✅ Modifier son profil                                                                                     | ✅ Modifier son profil                                             | ✅ Modifier son profil      |
| **WEBSITE**     | ✅ Tout                | ✅ Tout                                                                                                    | ❌ Aucun droit                                                     | ❌ Aucun droit              |

## Détails par rôle

### ADMIN

- Accès complet à toutes les fonctionnalités
- Peut créer, lire, modifier, supprimer toutes les ressources
- Peut gérer tous les utilisateurs
- Peut gérer les invitations
- Peut gérer le contenu du site web

### MANAGER

- Peut gérer toutes les ressources (mixtapes, DJs, tags)
- Peut gérer les invitations
- Peut lister et voir les utilisateurs
- Peut modifier uniquement les utilisateurs VIEWER et CONTRIBUTOR
- **NE PEUT PAS** modifier les utilisateurs MANAGER ou ADMIN
- **NE PEUT PAS** supprimer les utilisateurs
- Peut modifier son propre profil

### CONTRIBUTOR

- Peut lister/voir toutes les mixtapes, DJs et tags
- Peut créer des mixtapes
- Peut modifier uniquement ses propres mixtapes (ownership)
- Peut créer des tags
- **NE PEUT PAS** modifier/supprimer les mixtapes des autres
- **NE PEUT PAS** gérer les utilisateurs
- **NE PEUT PAS** gérer les invitations
- Peut modifier son propre profil

### VIEWER

- Accès en lecture seule aux mixtapes, DJs et tags
- Peut lister et voir les détails
- **NE PEUT PAS** créer, modifier ou supprimer de contenu
- **NE PEUT PAS** gérer les utilisateurs
- **NE PEUT PAS** gérer les invitations
- Peut modifier son propre profil

## Implémentation technique

### Pages et routes

```typescript
// Accès complet (tous les rôles)
definePageMeta({ roles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR, Role.VIEWER] })
// Exemples: mixtapes/index, djs/index, tags/index, profile

// Lecture + Création (ADMIN, MANAGER, CONTRIBUTOR)
definePageMeta({ roles: [Role.ADMIN, Role.MANAGER, Role.CONTRIBUTOR] })
// Exemples: mixtapes/add, tags/add, mixtapes/[id]/edit (avec vérif ownership)

// Gestion avancée (ADMIN, MANAGER)
definePageMeta({ roles: [Role.ADMIN, Role.MANAGER] })
// Exemples: users/index, invitations/index, tags/[id]/edit

// Administration uniquement (ADMIN)
definePageMeta({ roles: [Role.ADMIN] })
// Exemples: configuration système (futur)
```

### Boutons et actions

```typescript
// Bouton "Créer une mixtape" - CONTRIBUTOR+
const { canCreateMixtape } = usePermissions()
<Button v-if="canCreateMixtape">Créer</Button>

// Bouton "Créer un tag" - CONTRIBUTOR+
const { canCreateTag } = usePermissions()
<Button v-if="canCreateTag">Créer</Button>

// Bouton "Modifier une mixtape" - Ownership OU MANAGER+
const { canEditResource } = usePermissions()
const ownerId = mixtape.createdBy?.id
const canEdit = canEditResource(ownerId)
<Button v-if="canEdit">Modifier</Button>

// Bouton "Modifier un utilisateur" - Selon rôle cible
const { canEditUser } = usePermissions()
const canEdit = canEditUser(user.role) // true si MANAGER modifie VIEWER/CONTRIBUTOR
<Button v-if="canEdit">Modifier</Button>
```

### Ownership (propriété des ressources)

Les CONTRIBUTOR peuvent modifier leurs propres ressources même sans être MANAGER :

```typescript
// Vérification d'ownership
const canEditResource = (ownerId: string | undefined): boolean => {
  if (!user.value?.id) return false

  // Si c'est le propriétaire, accès autorisé
  if (ownerId === user.value.id) return true

  // Sinon vérifier le rôle MANAGER+
  return checkRole('MANAGER')
}
```

## Cas spéciaux

### DJs

- Pas de page de création dédiée (créés via le formulaire de mixtape)
- Page d'édition à créer pour corriger les typos (MANAGER+ uniquement)

### Users

- MANAGER ne peut pas modifier les utilisateurs de même niveau (MANAGER) ou supérieur (ADMIN)
- MANAGER ne peut pas supprimer d'utilisateurs
- Seul ADMIN peut supprimer des utilisateurs

### Invitations

- Accessible aux ADMIN et MANAGER
- Permet de créer de nouveaux comptes utilisateurs

### Website (futur)

- Section "textes du site" à venir
- Accessible aux ADMIN et MANAGER uniquement
