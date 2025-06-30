import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { StorageService } from '../../core/services/storage.service';
import { DeviceDetectionService } from '../../core/services/device-detection.service';
import { DashboardStats, QuickAction, RecentActivity } from '../../core/models/userInterface';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { MobileNavigationComponent } from '../../shared/mobile-navigation/mobile-navigation.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarComponent, 
    MobileNavigationComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  // ========================================
  // PROPIEDADES PRINCIPALES
  // ========================================
  
  private destroy$ = new Subject<void>();
  isMobile = false;
  isInDashboardHome = false;
  
  // Estado del usuario
  private user = signal<any>(null);
  userName = computed(() => this.user()?.name || 'Viajero Espiritual');

  // ========================================
  // DATOS DEL DASHBOARD
  // ========================================

  stats = signal<DashboardStats>({
    completedCourses: 3,
    totalCourses: 12,
    upcomingAppointments: 2,
    favoriteArticles: 8,
  });

  dailyQuote = signal<string>(
    'Las estrellas se alinean para traerte sabiduría y claridad en tu camino.'
  );

  quickActions = signal<QuickAction[]>([
    {
      title: 'Lectura de Tarot',
      description: 'Descubre lo que el universo tiene para ti',
      icon: 'fas fa-cards',
      color: 'bg-purple-600',
      route: '/tarot',
    },
    {
      title: 'Consulta Astral',
      description: 'Conecta con las energías cósmicas',
      icon: 'fas fa-star',
      color: 'bg-blue-600',
      route: '/astrology',
    },
    {
      title: 'Meditación Guiada',
      description: 'Encuentra paz interior y equilibrio',
      icon: 'fas fa-leaf',
      color: 'bg-green-600',
      route: '/meditation',
    },
  ]);

  recentActivity = signal<RecentActivity[]>([
    {
      id: '1',
      title: 'Completaste: Fundamentos del Tarot',
      description: 'Has finalizado el curso básico de Tarot',
      date: new Date('2024-03-15T10:30:00'),
      type: 'course',
      icon: 'fas fa-graduation-cap',
    },
    {
      id: '2',
      title: 'Nueva cita programada para mañana',
      description: 'Consulta de Tarot con especialista',
      date: new Date('2024-03-14T15:45:00'),
      type: 'consultation',
      icon: 'fas fa-calendar',
    },
    {
      id: '3',
      title: 'Guardaste: Cristales para la Prosperidad',
      description: 'Artículo sobre el poder de los cristales',
      date: new Date('2024-03-13T09:20:00'),
      type: 'article',
      icon: 'fas fa-bookmark',
    },
  ]);

  constructor(
    private router: Router,
    private storageService: StorageService,
    private deviceService: DeviceDetectionService
  ) {}

  // ========================================
  // INICIALIZACIÓN Y DESTRUCCIÓN
  // ========================================

  ngOnInit(): void {
    this.loadUserData();
    this.updateDailyQuote();
    this.setupDeviceDetection();
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    )
    .subscribe((event: NavigationEnd) => {
      this.isInDashboardHome = event.url === '/dashboard/home' || event.url === '/home';
    });
  this.isInDashboardHome = this.router.url === '/dashboard/home' || this.router.url === '/home';
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========================================
  // GESTIÓN DE DISPOSITIVOS
  // ========================================

  private setupDeviceDetection(): void {
    this.deviceService.isMobile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMobile => {
        this.isMobile = isMobile;
        console.log('📱 Device changed in Dashboard:', isMobile ? 'Mobile' : 'Desktop');
      });
  }

  // ========================================
  // CARGA DE DATOS
  // ========================================

  private loadUserData(): void {
    const userData = this.storageService.getItem('arcana_user_profile');
    if (userData?.data) {
      this.user.set(userData.data);
    }
  }

  private updateDailyQuote(): void {
    const quotes = [
      'Las estrellas se alinean para traerte sabiduría y claridad en tu camino.',
      'Hoy el universo conspira a tu favor. Confía en tu intuición.',
      'La energía lunar ilumina nuevas oportunidades en tu horizonte.',
      'Tus chakras vibran en armonía. Es momento de manifestar tus deseos.',
      'Los cristales resuenan con tu aura. Abraza la transformación.',
    ];

    const today = new Date().getDate();
    const selectedQuote = quotes[today % quotes.length];
    this.dailyQuote.set(selectedQuote);
  }

  // ========================================
  // ACCIONES DEL USUARIO
  // ========================================

  onQuickAction(action: QuickAction): void {
    console.log('Quick action:', action.title);
    this.router.navigate([action.route]).catch((err) => {
      console.error('Navigation error:', err);
    });
  }

  logout(): void {
    this.storageService.clearAuthData();
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error en logout:', err);
    });
  }

  // ========================================
  // UTILIDADES
  // ========================================

  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) {
      return 'Ahora mismo';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }
}