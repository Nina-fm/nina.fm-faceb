import { CompassIcon, LibraryIcon, MusicIcon, PlusIcon, ScrollTextIcon, SendIcon, UsersIcon } from 'lucide-vue-next'

export default defineAppConfig({
  resend: {
    from: 'Nina.fm <noreply@nina.fm>',
  },
  navigation: [
    {
      label: 'Bibliothèque musicale',
      icon: MusicIcon,
      children: [
        {
          label: 'Mixtapes',
          icon: LibraryIcon,
          to: '/mixtapes',
          action: {
            icon: PlusIcon,
            to: '/mixtapes/add',
          },
        },
        {
          label: "DJ's",
          icon: UsersIcon,
          to: '/authors',
          action: {
            icon: PlusIcon,
            to: '/authors/add',
          },
        },
      ],
    },
    {
      label: 'Gestion du site web',
      icon: CompassIcon,
      children: [
        {
          label: 'Textes',
          icon: ScrollTextIcon,
          to: '/website/texts',
        },
      ],
    },
    {
      label: 'Administration',
      icon: UsersIcon,
      children: [
        {
          label: 'Utilisateurs',
          icon: UsersIcon,
          to: '/users',
        },
        {
          label: 'Invitations',
          icon: SendIcon,
          to: '/invitations',
        },
      ],
    },
  ] as NavigationDef,
})
