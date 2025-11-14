declare global {
  interface NavigationItem {
    label: string
    icon: unknown
    to: string
    action?: {
      icon: unknown
      to: string
    }
  }

  interface NavigationGroup {
    label: string
    icon: unknown
    children: NavigationItem[]
  }

  type NavigationDef = NavigationGroup[]
}

export {}
