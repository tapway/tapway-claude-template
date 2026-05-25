import {
  LayoutDashboard,
  Table,
  FormInput,
  BarChart3,
  Palette,
  Settings,
  Shield,
  type LucideIcon,
} from 'lucide-react'

export type MenuItem = {
  title: string
  icon: LucideIcon
  url?: string
  items?: { title: string; url: string }[]
}

export type SidebarSection = {
  label: string
  items: MenuItem[]
}

export const sidebarData: SidebarSection[] = [
  {
    label: 'Main',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        url: '/',
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        title: 'Tables',
        icon: Table,
        url: '/tables',
      },
      {
        title: 'Forms',
        icon: FormInput,
        url: '/forms',
      },
      {
        title: 'Charts',
        icon: BarChart3,
        url: '/charts',
      },
    ],
  },
  {
    label: 'UI Elements',
    items: [
      {
        title: 'Components',
        icon: Palette,
        url: '/ui-elements',
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        title: 'Profile',
        icon: Settings,
        url: '/settings',
      },
      {
        title: 'Security',
        icon: Shield,
        url: '/settings/security',
      },
    ],
  },
]