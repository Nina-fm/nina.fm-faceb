import { CompassIcon, LibraryIcon, MusicIcon, PlusIcon, ScrollTextIcon, UsersIcon } from 'lucide-vue-next'

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
      Icon: CompassIcon,
      children: [
        {
          label: 'Textes',
          icon: ScrollTextIcon,
          to: '/website/texts',
        },
      ],
    },
  ],
})
