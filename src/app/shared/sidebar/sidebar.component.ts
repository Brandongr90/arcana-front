import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MenuItem, MenuSection } from './sidebar-interfaces';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  
  // ========================================
  // PROPIEDADES PRINCIPALES
  // ========================================
  
  appName: string = 'Arcana';
  logoUrl: string = '/assets/logo/logo-arcana.png';
  isHomeActive: boolean = false;

  menuSections: MenuSection[] = [
    {
      title: 'OPCIONES',
      items: [
        {
          icon: 'fas fa-route mystical-icon',
          label: 'Camino Mágico',
          route: '/dashboard/camino-magico',
        },
        {
          icon: 'fas fa-hat-wizard mystical-icon',
          label: 'Magia y Esoterismo',
          route: '/dashboard/magia-esoterismo',
        },
        {
          icon: 'fas fa-spa mystical-icon',
          label: 'Holístico y Espiritualidad',
          route: '/dashboard/holistico-espiritualidad',
        },
        {
          icon: 'fas fa-id-card-alt mystical-icon',
          label: 'Tarot "Carta del Día"',
          route: '/dashboard/tarot',
        },
      ],
    },
    {
      title: 'SERVICIOS',
      items: [
        {
          icon: 'far fa-moon mystical-icon',
          label: 'Fases Lunares',
          route: '/dashboard/fases-lunares',
        },
        {
          icon: 'fas fa-video mystical-icon',
          label: 'Lecturas en Vivo',
          route: '/dashboard/en-vivo',
          badge: 'En vivo',
        },
        {
          icon: 'fas fa-gem mystical-icon',
          label: 'Tienda',
          route: '/dashboard/tienda',
        },
        {
          icon: 'fas fa-graduation-cap mystical-icon',
          label: 'Cursos y Talleres',
          route: '/dashboard/cursos-talleres',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  // ========================================
  // INICIALIZACIÓN
  // ========================================

  ngOnInit(): void {
    this.checkCurrentRoute(this.router.url);
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkCurrentRoute(event.urlAfterRedirects);
      });
  }

  // ========================================
  // GESTIÓN DE RUTAS Y ESTADOS
  // ========================================

  private checkCurrentRoute(url: string): void {
    const homeRoutes = ['/dashboard', '/dashboard/home', '/dashboard/'];
    this.isHomeActive = homeRoutes.some(route => 
      url === route || url.startsWith(route + '?') || url.startsWith(route + '#')
    );

    if (this.isHomeActive) {
      this.clearActiveStates();
    } else {
      this.updateActiveStateBasedOnRoute(url);
    }
  }

  private updateActiveStateBasedOnRoute(url: string): void {
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.route) {
          item.isActive = url.startsWith(item.route);
        }
      });
    });
  }

  private clearActiveStates(): void {
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        item.isActive = false;
      });
    });
  }

  private updateActiveState(selectedItem: MenuItem): void {
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        item.isActive = item === selectedItem;
      });
    });
  }

  // ========================================
  // ACCIONES DE NAVEGACIÓN
  // ========================================

  onMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item.label);

    if (item.label === 'Cerrar Sesión') {
      this.handleLogout();
      return;
    }

    this.updateActiveState(item);
    this.isHomeActive = false;
  }

  onLogoClick(): void {
    console.log('Logo clicked - redirecting to home');
    this.isHomeActive = true;
    this.clearActiveStates();
  }

  // ========================================
  // GESTIÓN DE CLASES CSS
  // ========================================

  getLinkClasses(item: MenuItem): string {
    const baseClasses =
      'flex items-center gap-2 transition-colors duration-200 rounded-lg px-3 py-2';

    if (item.isActive) {
      return `${baseClasses} text-[#0f3e23] font-semibold bg-[#0f3e23]/10`;
    }

    return `${baseClasses} hover:text-[#0f3e23]`;
  }

  getLogoClasses(): string {
    const baseClasses = 'flex items-center gap-2 mb-5 logo-container cursor-pointer transition-all duration-300';
    
    if (this.isHomeActive) {
      return `${baseClasses} logo-active`;
    }
    
    return `${baseClasses} hover:opacity-80`;
  }

  // ========================================
  // UTILIDADES
  // ========================================

  trackBySection(index: number, section: MenuSection): string {
    return section.title;
  }

  trackByItem(index: number, item: MenuItem): string {
    return item.label;
  }

  onLogoError(event: any): void {
    event.target.src = '/assets/logo/logo-arcana.png';
  }

  // ========================================
  // GESTIÓN DE SESIÓN
  // ========================================

  private handleLogout(): void {
    console.log('Logging out...');
    // Implementar lógica de logout aquí
  }
}