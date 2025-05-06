import {
  CompassIcon,
  HeadphonesIcon,
  LibraryIcon,
  MusicIcon,
  PlusIcon,
  ScrollTextIcon,
  SendIcon,
  UsersIcon,
} from 'lucide-vue-next'

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
          label: "DJ's",
          icon: HeadphonesIcon,
          to: '/djs',
          action: {
            icon: PlusIcon,
            to: '/djs/add',
          },
        },
        {
          label: 'Mixtapes (supabase)',
          icon: LibraryIcon,
          to: '/mixtapes',
          action: {
            icon: PlusIcon,
            to: '/mixtapes/add',
          },
        },
        {
          label: "DJ's (supabase",
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
