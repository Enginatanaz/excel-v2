/**
 * Navigation items for Excel Akademi AI
 */

export type AppView =
  | 'dashboard'
  | 'lessons'
  | 'lesson_detail'
  | 'simulator'
  | 'practice'
  | 'progress'
  | 'tools'
  | 'profile';

export interface NavItem {
  id: AppView;
  label: string;
  iconName: string;
  description: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Ana Sayfa',
    iconName: 'LayoutDashboard',
    description: 'Özet ve öğrenme merkezi',
  },
  {
    id: 'lessons',
    label: 'Dersler',
    iconName: 'BookOpen',
    description: 'Müfredat ve etkileşimli dersler',
  },
  {
    id: 'simulator',
    label: 'Excel Simülatörü',
    iconName: 'Table2',
    description: 'Serbest çalışma alanı ve formül laboratuvarı',
  },
  {
    id: 'practice',
    label: 'Pratik',
    iconName: 'Dumbbell',
    description: 'Hızlı alıştırmalar ve senaryo testleri',
  },
  {
    id: 'progress',
    label: 'İlerleme',
    iconName: 'TrendingUp',
    description: 'Öğrenme istatistikleri ve hedefler',
  },
  {
    id: 'tools',
    label: 'Araçlar',
    iconName: 'Wrench',
    description: 'Formül ve kısayol rehberleri',
  },
  {
    id: 'profile',
    label: 'Profil',
    iconName: 'User',
    description: 'Kullanıcı tercihleri ve ayarlar',
  },
];
