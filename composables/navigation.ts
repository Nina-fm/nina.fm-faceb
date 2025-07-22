/**
 * Composable de navigation avec filtrage par permissions
 * Compatible avec l'API Nina.fm et les rôles utilisateur
 */
export const useNavigation = () => {
  const { navigation } = useAppConfig()
  const { checkAnyRole, canViewBackoffice } = usePermissions()
  const routes = useRouter().getRoutes()

  const getRouteByPath = (path: string) => routes.find((route) => route.path === path)

  const allowedNavigation = computed(() => {
    // Si l'utilisateur ne peut pas voir le backoffice, ne rien afficher
    if (!canViewBackoffice.value) {
      return []
    }

    return navigation
      .map((group) => ({
        ...group,
        children: group.children.filter((item) => {
          const page = getRouteByPath(item.to)
          if (!page) return false

          // Si pas de rôles requis, accessible à tous
          if (!page.meta?.roles && !page.meta?.requiresRole && !page.meta?.requiresRoles) {
            return true
          }

          // Vérifier les rôles selon les métadonnées
          if (page.meta?.roles) {
            return checkAnyRole(page.meta.roles as string[])
          }

          if (page.meta?.requiresRoles) {
            return checkAnyRole(page.meta.requiresRoles as string[])
          }

          return true
        }),
      }))
      .filter((group) => group.children.length > 0)
  })

  return allowedNavigation
}
