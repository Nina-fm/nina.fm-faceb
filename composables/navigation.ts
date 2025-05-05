import type { Role } from '@prisma/client'

export const useNavigation = () => {
  const { navigation } = useAppConfig()
  const { hasAnyRole } = useAuth()
  const routes = useRouter().getRoutes()

  const getRouteByPath = (path: string) => routes.find((route) => route.path === path)

  const allowedNavigation = computed(() =>
    navigation
      .map((group) => ({
        ...group,
        children: group.children.filter((item) => {
          const page = getRouteByPath(item.to)
          if (!page) return false
          if (!page.meta?.roles) return true
          return hasAnyRole(page.meta.roles as Role[])
        }),
      }))
      .filter((group) => group.children.length > 0),
  )

  return allowedNavigation
}
