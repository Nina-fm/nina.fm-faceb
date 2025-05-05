declare global {
  interface NavigationItem {
    label: string
    icon: any
    to: string
    action?: {
      icon: any
      to: string
    }
  }

  interface NavigationGroup {
    label: string
    icon: any
    children: NavigationItem[]
  }

  type NavigationDef = NavigationGroup[]
}

export {}
