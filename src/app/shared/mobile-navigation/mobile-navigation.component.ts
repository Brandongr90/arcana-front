import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { DeviceDetectionService } from '../../core/services/device-detection.service';
import { MenuItem, MenuSection } from '../sidebar/sidebar-interfaces';
import { ClickOutsideDirective } from '../directive/click-outside.directive';

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss'],
})
export class MobileNavigationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Estados de los modales
  isMenuModalOpen = false;
  isUserModalOpen = false;

  // Estado de navegación
  isHomeActive = false;

  // Datos de usuario (igual que en header)
  userProfile = {
    name: 'Usuario Arcana',
    email: 'usuario@arcana.com',
    avatar: '/assets/images/default-avatar.png',
  };

  // Datos del menú (igual que en sidebar)
  appName = 'Arcana';
  logoUrl = '/assets/logo/logo-arcana.png';

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

  constructor(
    private deviceService: DeviceDetectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkCurrentRoute(this.router.url);

    // Escuchar cambios de ruta
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.checkCurrentRoute(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // NAVEGACIÓN Y RUTAS
  // ========================================

  private checkCurrentRoute(url: string): void {
    const homeRoutes = ['/dashboard', '/dashboard/home', '/dashboard/'];
    this.isHomeActive = homeRoutes.some(
      (route) =>
        url === route ||
        url.startsWith(route + '?') ||
        url.startsWith(route + '#')
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

  // ========================================
  // BOTTOM NAVIGATION ACTIONS
  // ========================================

  onMenuClick(): void {
    console.log('Menu click - Estado actual:', this.isMenuModalOpen);

    setTimeout(() => {
      if (this.isMenuModalOpen) {
        console.log('Cerrando menú...');
        this.closeAllModals();
        document.body.classList.remove('modal-open');
      } else {
        console.log('Abriendo menú...');
        this.isUserModalOpen = false;
        this.isMenuModalOpen = true;
        document.body.classList.add('modal-open');
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    }, 50);
  }

  onMenuTouch(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();

    requestAnimationFrame(() => {
      if (this.isMenuModalOpen) {
        this.closeAllModals();
      } else {
        this.isUserModalOpen = false;
        this.isMenuModalOpen = true;
      }
    });
  }

  onHomeClick(): void {
    this.closeAllModals();
    this.isHomeActive = true;
    this.clearActiveStates();
    this.router.navigate(['/dashboard/home']).catch((err) => {
      console.error('Error al navegar a home:', err);
    });
  }

  onUserClick(): void {
    console.log('User click - Estado actual:', this.isUserModalOpen);

    setTimeout(() => {
      if (this.isUserModalOpen) {
        this.closeAllModals();
        document.body.classList.remove('modal-open');
      } else {
        this.isMenuModalOpen = false;
        this.isUserModalOpen = true;
        // Bloquear scroll del body
        document.body.classList.add('modal-open');
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    }, 50);
  }

  onUserTouch(event: TouchEvent): void {
    event.preventDefault();
    event.stopPropagation();

    requestAnimationFrame(() => {
      if (this.isUserModalOpen) {
        this.closeAllModals();
      } else {
        this.isMenuModalOpen = false;
        this.isUserModalOpen = true;
      }
    });
  }

  // ========================================
  // MODAL ACTIONS
  // ========================================

  closeAllModals(): void {
    this.isMenuModalOpen = false;
    this.isUserModalOpen = false;

    //Restaurar scroll del body
    document.body.classList.remove('modal-open');

    setTimeout(() => {
      const body = document.body;
      body.style.overflow = 'auto';
      body.style.position = 'static';
      body.style.width = 'auto';
      body.style.height = 'auto';
    }, 100);
  }

  onMenuModalClickOutside(): void {
    this.isMenuModalOpen = false;
  }

  onUserModalClickOutside(): void {
    this.isUserModalOpen = false;
  }

  // ========================================
  // MENU ITEM ACTIONS
  // ========================================

  onMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item.label);

    if (item.label === 'Cerrar Sesión') {
      this.handleLogout();
      return;
    }

    this.updateActiveState(item);
    this.isHomeActive = false;
    this.closeAllModals();
  }

  onLogoClick(): void {
    console.log('Logo clicked - redirecting to home');
    this.isHomeActive = true;
    this.clearActiveStates();
    this.router.navigate(['/dashboard/home']);
    this.closeAllModals();
  }

  private updateActiveState(selectedItem: MenuItem): void {
    this.menuSections.forEach((section) => {
      section.items.forEach((item) => {
        item.isActive = item === selectedItem;
      });
    });
  }

  // ========================================
  // USER PROFILE ACTIONS
  // ========================================

  onEditProfile(): void {
    this.closeAllModals();
    this.router.navigate(['/profile/edit']).catch((err) => {
      console.error('Error al navegar a editar perfil:', err);
    });
  }

  onChangePassword(): void {
    this.closeAllModals();
    this.router.navigate(['/profile/change-password']).catch((err) => {
      console.error('Error al navegar a cambiar contraseña:', err);
    });
  }

  onSettings(): void {
    this.closeAllModals();
    this.router.navigate(['/settings']).catch((err) => {
      console.error('Error al navegar a configuración:', err);
    });
  }

  onSubscription(): void {
    this.closeAllModals();
    this.router.navigate(['/subscriptions']).catch((err) => {
      console.error('Error al navegar a suscripción:', err);
    });
  }

  onHelp(): void {
    this.closeAllModals();
    this.router.navigate(['/help']).catch((err) => {
      console.error('Error al navegar a ayuda:', err);
    });
  }

  onLogout(): void {
    this.closeAllModals();
    // Limpiar datos de autenticación
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    // Navegar a login
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error durante logout:', err);
    });
  }

  private performLogout(): void {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error durante logout:', err);
    });
    this.closeAllModals();
  }

  private handleLogout(): void {
    console.log('Logging out...');
    this.performLogout();
  }

  // ========================================
  // UTILITY METHODS
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

  onImageError(event: any): void {
    event.target.src = '/assets/images/default-avatar.png';
  }

  get userInitials(): string {
    if (!this.userProfile.name) return 'UA';

    const names = this.userProfile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }
}
