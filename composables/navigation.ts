/**
 * Composable de navigation avec filtrage par permissions
 * Compatible avec l'API Nina.fm et les rôles utilisateur
 */
export const useNavigation = () => {
  const { navigation } = useAppConfig()
  const permissions = usePermissions()
  const routes = useRouter().getRoutes()

  const getRouteByPath = (path: string) => routes.find((route) => route.path === path)

  /**
   * Vérifier si l'utilisateur peut accéder à une action (bouton +)
   */
  const canAccessAction = (actionPath: string): boolean => {
    const page = getRouteByPath(actionPath)
    if (!page) return false

    // Si pas de rôles requis, accessible à tous
    if (!page.meta?.roles && !page.meta?.requiresRole && !page.meta?.requiresRoles) {
      return true
    }

    // Vérifier les rôles selon les métadonnées
    if (page.meta?.roles) {
      return permissions.checkAnyRole(page.meta.roles as string[])
    }

    if (page.meta?.requiresRoles) {
      return permissions.checkAnyRole(page.meta.requiresRoles as string[])
    }

    return true
  }

  const allowedNavigation = computed(() => {
    // Si l'utilisateur ne peut pas voir le backoffice, ne rien afficher
    if (!permissions.canViewBackoffice.value) {
      return []
    }

    return navigation
      .map((group) => ({
        ...group,
        children: group.children
          .filter((item) => {
            const page = getRouteByPath(item.to)
            if (!page) return false

            // Si pas de rôles requis, accessible à tous
            if (!page.meta?.roles && !page.meta?.requiresRole && !page.meta?.requiresRoles) {
              return true
            }

            // Vérifier les rôles selon les métadonnées
            if (page.meta?.roles) {
              return permissions.checkAnyRole(page.meta.roles as string[])
            }

            if (page.meta?.requiresRoles) {
              return permissions.checkAnyRole(page.meta.requiresRoles as string[])
            }

            return true
          })
          .map((item) => {
            // Filtrer les actions (boutons +) selon les permissions
            if (item.action && !canAccessAction(item.action.to)) {
              const { action, ...itemWithoutAction } = item
              return itemWithoutAction
            }
            return item
          }),
      }))
      .filter((group) => group.children.length > 0)
  })

  return allowedNavigation
}
