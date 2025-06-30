export interface MenuItem {
  icon: string;
  label: string;
  route?: string;
  badge?: string;
  isActive?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}
