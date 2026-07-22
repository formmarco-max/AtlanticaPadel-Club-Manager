import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  MapPinned,
  Settings,
  Trophy,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
 }

export interface NavigationGroup {
  label?: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Gestão',
    items: [
      {
        label: 'Sócios',
        href: '/members',
        icon: Users,
      },
      {
        label: 'Campos',
        href: '/courts',
        icon: MapPinned,
      },
      {
        label: 'Reservas',
        href: '/reservations',
        icon: CalendarDays,
      },
      {
        label: 'Treinadores',
        href: '/coaches',
        icon: Dumbbell,
      },
      {
        label: 'Aulas',
        href: '/lessons',
        icon: BookOpen,
      
      },
      {
        label: 'Mensalidades',
        href: '/memberships',
        icon: CreditCard,
        
      },
      {
        label: 'Eventos',
        href: '/events',
        icon: Trophy,
        
      },
    ],
  },
  {
    label: 'Análise',
    items: [
      {
        label: 'Relatórios',
        href: '/reports',
        icon: BarChart3,
        
      },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        label: 'Definições',
        href: '/settings',
        icon: Settings,
        
      },
    ],
  },
];