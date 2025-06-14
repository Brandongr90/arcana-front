import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { Subject, takeUntil, filter } from 'rxjs';

// Interfaces específicas del header
export interface Discipline {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon: string;
  date: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  avatar_url?: string;
  signo_zodiacal?: string;
  tipo_perfil: 'esoterico' | 'espiritual';
  subscription?: {
    status: 'active' | 'inactive';
    plan: string;
  };
  roles?: string[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Control de SSR
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // Estados del componente
  activeDropdown = signal<string | null>(null);
  showNotifications = signal<boolean>(false);
  showMobileMenu = signal<boolean>(false);
  isScrolled = signal<boolean>(false);
  currentRoute = signal<string>('');

  // Datos del usuario
  user = signal<User | null>(null);

  // Contadores
  unreadNotifications = signal<number>(0);
  unreadMessages = signal<number>(0);

  // Disciplinas disponibles
  disciplines = signal<Discipline[]>([
    { id: 'tarot', name: 'Tarot', icon: '🔮', description: 'Lectura de cartas' },
    { id: 'astrologia', name: 'Astrología', icon: '⭐', description: 'Influencia astral' },
    { id: 'numerologia', name: 'Numerología', icon: '🔢', description: 'Poder de números' },
    { id: 'runas', name: 'Runas', icon: '🪨', description: 'Símbolos antiguos' },
    { id: 'cristales', name: 'Cristales', icon: '💎', description: 'Energía mineral' },
    { id: 'meditacion', name: 'Meditación', icon: '🧘', description: 'Paz interior' },
    { id: 'chakras', name: 'Chakras', icon: '🌈', description: 'Centros energéticos' },
    { id: 'reiki', name: 'Reiki', icon: '✋', description: 'Sanación energética' }
  ]);

  // Notificaciones recientes
  recentNotifications = signal<Notification[]>([
    {
      id: '1',
      title: 'Nueva lección disponible',
      message: 'Tu curso de Tarot tiene contenido nuevo',
      icon: '🎓',
      date: new Date(Date.now() - 300000), // 5 min ago
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Cita confirmada',
      message: 'Tu consulta con María Luna está programada',
      icon: '📅',
      date: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: 'Luna Llena',
      message: 'Hoy es un día perfecto para rituales',
      icon: '🌕',
      date: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
      type: 'info'
    }
  ]);

  // Signos zodiacales
  private zodiacSigns: {[key: string]: {name: string, icon: string}} = {
    'aries': { name: 'Aries', icon: '♈' },
    'tauro': { name: 'Tauro', icon: '♉' },
    'geminis': { name: 'Géminis', icon: '♊' },
    'cancer': { name: 'Cáncer', icon: '♋' },
    'leo': { name: 'Leo', icon: '♌' },
    'virgo': { name: 'Virgo', icon: '♍' },
    'libra': { name: 'Libra', icon: '♎' },
    'escorpio': { name: 'Escorpio', icon: '♏' },
    'sagitario': { name: 'Sagitario', icon: '♐' },
    'capricornio': { name: 'Capricornio', icon: '♑' },
    'acuario': { name: 'Acuario', icon: '♒' },
    'piscis': { name: 'Piscis', icon: '♓' }
  };

  // Timeouts para dropdowns
  private dropdownTimeouts: {[key: string]: ReturnType<typeof setTimeout>} = {};

  constructor(
    private router: Router,
    private storageService: StorageService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadUserData();
    this.setupRouteTracking();
    this.setupScrollListener();
    this.calculateNotificationCounts();
    this.loadMockData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Limpiar timeouts
    Object.values(this.dropdownTimeouts).forEach(timeout => clearTimeout(timeout));
  }

  // ============ INICIALIZACIÓN ============

  private loadUserData(): void {
    const userData = this.storageService.getUser();
    if (userData) {
      // Mapear datos del storage al formato del header
      const user: User = {
        id: userData.id || '1',
        nombre: userData.nombre || userData.name || 'Usuario',
        apellido: userData.apellido || 'Demo',
        email: userData.email || 'demo@arcana.com',
        avatar_url: userData.avatar_url,
        signo_zodiacal: userData.signo_zodiacal,
        tipo_perfil: userData.tipo_perfil || userData.tipoPerfil || 'esoterico',
        subscription: {
          status: 'active', // Mock data
          plan: 'premium'
        },
        roles: ['usuario']
      };
      this.user.set(user);
    }
  }

  private setupRouteTracking(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        this.closeAllDropdowns();
      });
  }

  private setupScrollListener(): void {
    if (!this.isBrowser) return;

    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
    });
  }

  private calculateNotificationCounts(): void {
    const unread = this.recentNotifications().filter(n => !n.read).length;
    this.unreadNotifications.set(unread);
    this.unreadMessages.set(2); // Mock data
  }

  private loadMockData(): void {
    // Simular carga de datos adicionales si es necesario
    console.log('Header loaded with user:', this.user()?.nombre);
  }

  // ============ NAVEGACIÓN ============

  navigateTo(route: string): void {
    this.closeAllDropdowns();
    this.router.navigate([route]).catch(err => {
      console.error('Error navigating to:', route, err);
    });
  }

  navigateToMobile(route: string): void {
    this.showMobileMenu.set(false);
    this.navigateTo(route);
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute().startsWith(route);
  }

  // ============ DROPDOWNS ============

  showDropdown(dropdownId: string): void {
    // Cancelar timeout de cierre si existe
    if (this.dropdownTimeouts[dropdownId]) {
      clearTimeout(this.dropdownTimeouts[dropdownId]);
      delete this.dropdownTimeouts[dropdownId];
    }

    this.activeDropdown.set(dropdownId);
  }

  hideDropdown(dropdownId: string): void {
    // Delay para permitir hover en el dropdown
    this.dropdownTimeouts[dropdownId] = setTimeout(() => {
      if (this.activeDropdown() === dropdownId) {
        this.activeDropdown.set(null);
      }
      delete this.dropdownTimeouts[dropdownId];
    }, 150);
  }

  closeAllDropdowns(): void {
    this.activeDropdown.set(null);
    this.showNotifications.set(false);
    Object.values(this.dropdownTimeouts).forEach(timeout => clearTimeout(timeout));
    this.dropdownTimeouts = {};
  }

  // ============ NOTIFICACIONES ============

  toggleNotifications(): void {
    const currentState = this.showNotifications();
    this.closeAllDropdowns();
    this.showNotifications.set(!currentState);
  }

  markAllAsRead(): void {
    const updated = this.recentNotifications().map(n => ({ ...n, read: true }));
    this.recentNotifications.set(updated);
    this.unreadNotifications.set(0);
  }

  markAsRead(notificationId: string): void {
    const updated = this.recentNotifications().map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.recentNotifications.set(updated);
    this.calculateNotificationCounts();
  }

  // ============ MENÚ MÓVIL ============

  toggleMobileMenu(): void {
    this.showMobileMenu.update(show => !show);
    
    if (this.isBrowser) {
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = this.showMobileMenu() ? 'hidden' : '';
    }
  }

  // ============ USUARIO ============

  getInitials(): string {
    const user = this.user();
    if (!user) return 'U';
    
    const firstName = user.nombre?.charAt(0) || '';
    const lastName = user.apellido?.charAt(0) || '';
    return (firstName + lastName).toUpperCase() || 'U';
  }

  getUserRole(): string {
    const user = this.user();
    if (!user) return 'Usuario';
    
    if (user.roles?.includes('admin')) return 'Administrador';
    if (user.roles?.includes('bruja')) return 'Bruja Certificada';
    if (user.roles?.includes('moderador')) return 'Moderador';
    
    return user.tipo_perfil === 'esoterico' ? 'Practicante Esotérico' : 'Buscador Espiritual';
  }

  getZodiacIcon(): string {
    const user = this.user();
    if (!user?.signo_zodiacal) return '⭐';
    return this.zodiacSigns[user.signo_zodiacal]?.icon || '⭐';
  }

  getZodiacName(): string {
    const user = this.user();
    if (!user?.signo_zodiacal) return 'Signo Zodiacal';
    return this.zodiacSigns[user.signo_zodiacal]?.name || 'Desconocido';
  }

  isPremium(): boolean {
    return this.user()?.subscription?.status === 'active';
  }

  // ============ LOGOUT ============

  logout(): void {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar datos de autenticación
    this.storageService.clearAuthData();
    
    // Cerrar menús
    this.closeAllDropdowns();
    this.showMobileMenu.set(false);
    
    // Restaurar scroll del body
    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
    
    // Redirigir al welcome
    this.router.navigate(['/']).catch(err => {
      console.error('Error en logout:', err);
    });
  }

  // ============ UTILIDADES ============

  formatTime(date: Date): string {
    if (!this.isBrowser) return 'Hace un momento';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  }

  // ============ GESTIÓN DE EVENTOS ============

  onDocumentClick(event: Event): void {
    // Cerrar dropdowns al hacer click fuera
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-dropdown') && !target.closest('.user-dropdown') && !target.closest('.notification-container')) {
      this.closeAllDropdowns();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Cerrar dropdowns con Escape
    if (event.key === 'Escape') {
      this.closeAllDropdowns();
      this.showMobileMenu.set(false);
    }
  }

  // ============ TRACKING Y ANALYTICS ============

  trackNavigation(destination: string, source: string = 'header'): void {
    if (!this.isBrowser) return;
    
    console.log('📊 Navigation:', {
      destination,
      source,
      user: this.user()?.id,
      timestamp: new Date().toISOString()
    });
  }

  trackDropdownUsage(dropdownId: string): void {
    if (!this.isBrowser) return;
    
    console.log('📊 Dropdown Used:', {
      dropdown: dropdownId,
      user: this.user()?.id,
      timestamp: new Date().toISOString()
    });
  }

  // ============ MÉTODOS COMPUTADOS ============

  get hasActiveSubscription(): boolean {
    return this.isPremium();
  }

  get userDisplayName(): string {
    const user = this.user();
    return user ? `${user.nombre} ${user.apellido}` : 'Usuario';
  }

  get totalUnreadCount(): number {
    return this.unreadNotifications() + this.unreadMessages();
  }

  // ============ LIFECYCLE HOOKS ADICIONALES ============

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      // Configurar listeners globales
      document.addEventListener('click', this.onDocumentClick.bind(this));
      document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  }

  // ============ MÉTODOS DE DESARROLLO ============

  refreshNotifications(): void {
    // Simular nuevas notificaciones para desarrollo
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: 'Nueva notificación',
      message: 'Esta es una notificación de prueba',
      icon: '🔔',
      date: new Date(),
      read: false,
      type: 'info'
    };
    
    const updated = [newNotification, ...this.recentNotifications()];
    this.recentNotifications.set(updated.slice(0, 10)); // Mantener solo las 10 más recientes
    this.calculateNotificationCounts();
  }

  simulateMessageReceived(): void {
    this.unreadMessages.update(count => count + 1);
  }

  // ============ GETTERS PARA TEMPLATE ============

  get isLoggedIn(): boolean {
    return !!this.user();
  }

  get canAccessPremiumFeatures(): boolean {
    return this.isPremium();
  }

  get shouldShowPremiumUpgrade(): boolean {
    return !this.isPremium();
  }
}