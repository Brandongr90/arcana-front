import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeviceDetectionService } from '../../core/services/device-detection.service';
import { ClickOutsideDirective } from '../directive/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  // ========================================
  // PROPIEDADES PRINCIPALES
  // ========================================

  searchQuery: string = '';
  notificationCount: number = 3;
  messageCount: number = 5;

  userProfile = {
    name: 'Usuario Arcana',
    email: 'usuario@arcana.com',
    avatar: '/assets/images/default-avatar.png',
  };

  // Logo URL para móvil
  logoUrl: string = '/assets/logo/logo-arcana.png';

  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================

  private destroy$ = new Subject<void>();
  private searchDebounceTimer?: ReturnType<typeof setTimeout>;
  private readonly SEARCH_DEBOUNCE_TIME = 300;

  // ========================================
  // PROPIEDADES MÓVILES
  // ========================================

  isMobile = false;
  isSearchExpanded = false;

  constructor(
    private router: Router,
    private deviceService: DeviceDetectionService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.setupKeyboardShortcuts();
    this.setupDeviceDetection();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupTimers();
    this.removeKeyboardShortcuts();
  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================

  private loadUserProfile(): void {
    // En una aplicación real, cargarías el perfil del usuario desde un servicio
    // this.userService.getCurrentUser().subscribe(user => {
    //   this.userProfile = user;
    // });

    console.log('👤 Perfil de usuario cargado:', this.userProfile);
  }

  private setupDeviceDetection(): void {
    this.deviceService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMobile) => {
        this.isMobile = isMobile;
        if (!isMobile && this.isSearchExpanded) {
          this.isSearchExpanded = false;
        }
      });
  }

  private setupKeyboardShortcuts(): void {
    // Configurar atajos de teclado (Cmd+K para búsqueda)
    document.addEventListener(
      'keydown',
      this.handleKeyboardShortcuts.bind(this)
    );
  }

  private removeKeyboardShortcuts(): void {
    document.removeEventListener(
      'keydown',
      this.handleKeyboardShortcuts.bind(this)
    );
  }

  private handleKeyboardShortcuts(event: KeyboardEvent): void {
    // Cmd+K o Ctrl+K para activar búsqueda
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.focusSearchInput();
    }

    // Escape para limpiar búsqueda
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  // ========================================
  // FUNCIONALIDAD DE BÚSQUEDA
  // ========================================

  onSearch(event: Event): void {
    event.preventDefault();

    if (this.searchQuery.trim()) {
      console.log('🔍 Buscando:', this.searchQuery);
      this.performSearch(this.searchQuery.trim());
    }
  }

  onSearchInput(): void {
    // Debounce para búsqueda en tiempo real
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      if (this.searchQuery.trim().length >= 2) {
        this.performLiveSearch(this.searchQuery.trim());
      }
    }, this.SEARCH_DEBOUNCE_TIME);
  }

  // ========================================
  // FUNCIONALIDAD MÓVIL - BÚSQUEDA EXPANDIBLE
  // ========================================

  onMobileSearchClick(): void {
    if (!this.isMobile) return;

    setTimeout(() => {
      if (this.isSearchExpanded) {
        this.isSearchExpanded = false;
        this.clearSearch();
      } else {
        this.isSearchExpanded = true;

        // Enfocar el input después de la animación
        setTimeout(() => {
          this.focusSearchInput();
        }, 300);
      }
    }, 50);
  }

  onMobileSearchTouch(event: TouchEvent): void {
    event.preventDefault(); // Evita zoom accidental, scroll, etc.
    event.stopPropagation();

    requestAnimationFrame(() => {
      if (this.isSearchExpanded) {
        this.isSearchExpanded = false;
        this.clearSearch();
      } else {
        this.isSearchExpanded = true;
        setTimeout(() => {
          this.focusSearchInput();
        }, 300);
      }
    });
  }

  onSearchExpandedClickOutside(): void {
    if (this.isMobile && this.isSearchExpanded) {
      this.isSearchExpanded = false;
      this.clearSearch();
    }
  }

  private performSearch(query: string): void {
    // Navegar a página de resultados
    this.router
      .navigate(['/search'], {
        queryParams: { q: query },
      })
      .catch((err) => {
        console.error('Error en navegación de búsqueda:', err);
      });
  }

  private performLiveSearch(query: string): void {
    // Implementar búsqueda en tiempo real si es necesario
    console.log('🔍 Búsqueda en vivo:', query);
  }

  private focusSearchInput(): void {
    const searchInput = document.querySelector(
      '.mystical-search-input, .mobile-search-input-field'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }

  private clearSearch(): void {
    this.searchQuery = '';
    const searchInput = document.querySelector(
      '.mystical-search-input, .mobile-search-input-field'
    ) as HTMLInputElement;
    if (searchInput && document.activeElement === searchInput) {
      searchInput.blur();
    }
  }

  // ========================================
  // FUNCIONALIDAD DE MENSAJES
  // ========================================

  onMessagesClick(): void {
    console.log('💌 Mensajes clickeados');

    // Navegar a la sección de mensajes
    this.router.navigate(['/messaging']).catch((err) => {
      console.error('Error al navegar a mensajes:', err);
    });
  }

  // ========================================
  // FUNCIONALIDAD DE NOTIFICACIONES
  // ========================================

  onNotificationsClick(): void {
    console.log('🔔 Notificaciones clickeadas');
    this.showNotificationsPanel();
  }

  private showNotificationsPanel(): void {
    // Implementar panel de notificaciones
    console.log('Mostrando panel de notificaciones...');

    // En una aplicación real:
    // this.notificationService.showPanel();
    // o abrir modal/sidebar de notificaciones
  }

  // ========================================
  // FUNCIONALIDAD DEL PERFIL DE USUARIO
  // ========================================

  onEditProfile(): void {
    console.log('✏️ Editar perfil clickeado');

    this.router.navigate(['/profile/edit']).catch((err) => {
      console.error('Error al navegar a editar perfil:', err);
    });
  }

  onChangePassword(): void {
    console.log('🔑 Cambiar contraseña clickeado');

    this.router.navigate(['/profile/change-password']).catch((err) => {
      console.error('Error al navegar a cambiar contraseña:', err);
    });
  }

  onSettings(): void {
    console.log('⚙️ Configuración clickeada');

    this.router.navigate(['/settings']).catch((err) => {
      console.error('Error al navegar a configuración:', err);
    });
  }

  onSubscription(): void {
    console.log('👑 Mi suscripción clickeada');

    this.router.navigate(['/subscriptions']).catch((err) => {
      console.error('Error al navegar a suscripción:', err);
    });
  }

  onHelp(): void {
    console.log('❓ Ayuda clickeada');

    this.router.navigate(['/help']).catch((err) => {
      console.error('Error al navegar a ayuda:', err);
    });
  }

  onLogout(): void {
    console.log('🚪 Logout clickeado');
    this.performLogout();
  }

  private performLogout(): void {
    // Limpiar datos de autenticación
    // this.authService.logout();

    // Limpiar almacenamiento local
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');

    // Navegar a login
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error durante logout:', err);
    });
  }

  // ========================================
  // MANEJO DE ERRORES - SIMPLIFICADO
  // ========================================

  onImageError(event: any): void {
    // Cambiar a imagen por defecto si falla la carga - SIN TRACKING
    event.target.src = '/assets/images/default-avatar.png';
  }

  onLogoError(event: any): void {
    event.target.src = '/assets/logo/logo-arcana.png';
  }

  // ========================================
  // UTILIDADES Y HELPERS
  // ========================================

  private cleanupTimers(): void {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = undefined;
    }
  }

  // ========================================
  // GETTERS PARA TEMPLATE
  // ========================================

  get hasUnreadMessages(): boolean {
    return this.messageCount > 0;
  }

  get hasUnreadNotifications(): boolean {
    return this.notificationCount > 0;
  }

  get formattedMessageCount(): string {
    return this.messageCount > 99 ? '99+' : this.messageCount.toString();
  }

  get formattedNotificationCount(): string {
    return this.notificationCount > 99
      ? '99+'
      : this.notificationCount.toString();
  }

  get userInitials(): string {
    if (!this.userProfile.name) return 'UA';

    const names = this.userProfile.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  get searchPlaceholder(): string {
    const placeholders = [
      'Busca tu destino en las estrellas...',
      'Explora los misterios del cosmos...',
      'Descubre secretos ancestrales...',
      'Encuentra tu camino místico...',
    ];

    // Rotar placeholder basado en la hora para variedad
    const hour = new Date().getHours();
    return placeholders[hour % placeholders.length];
  }

  // ========================================
  // MÉTODOS PARA FUTURAS FUNCIONALIDADES
  // ========================================

  updateMessageCount(count: number): void {
    this.messageCount = Math.max(0, count);
  }

  updateNotificationCount(count: number): void {
    this.notificationCount = Math.max(0, count);
  }

  updateUserProfile(profile: Partial<typeof this.userProfile>): void {
    this.userProfile = { ...this.userProfile, ...profile };
  }

  // Método para animar el header cuando hay nuevas notificaciones
  animateNewNotification(): void {
    const notificationBtn = document.querySelector('.notifications-mystical');
    if (notificationBtn) {
      notificationBtn.classList.add('pulse-animation');
      setTimeout(() => {
        notificationBtn.classList.remove('pulse-animation');
      }, 1000);
    }
  }

  // Método para animar el header cuando hay nuevos mensajes
  animateNewMessage(): void {
    const messageBtn = document.querySelector('.messages-mystical');
    if (messageBtn) {
      messageBtn.classList.add('pulse-animation');
      setTimeout(() => {
        messageBtn.classList.remove('pulse-animation');
      }, 1000);
    }
  }
}
