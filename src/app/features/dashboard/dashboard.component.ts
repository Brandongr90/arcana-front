import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { DashboardStats, QuickAction, RecentActivity } from '../../core/models/userInterface';
import { HeaderComponent } from '../../shared/components/header/header.component';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Estado del usuario
  private user = signal<any>(null);

  // Datos computados
  userName = computed(() => this.user()?.name || 'Viajero Espiritual');

  // Estadísticas del dashboard
  stats = signal<DashboardStats>({
    completedCourses: 3,
    totalCourses: 12,
    upcomingAppointments: 2,
    favoriteArticles: 8,
  });

  // Mensaje del día
  dailyQuote = signal<string>(
    'Las estrellas se alinean para traerte sabiduría y claridad en tu camino.'
  );

  // Acciones rápidas
  quickActions = signal<QuickAction[]>([
    {
      title: 'Explorar Cursos',
      description: 'Descubre nuevos conocimientos esotéricos',
      icon: '📚',
      route: '/courses',
      color: 'rgba(52, 152, 219, 0.3)',
    },
    {
      title: 'Consultar Brujas',
      description: 'Agenda una sesión personalizada',
      icon: '🔮',
      route: '/consultations',
      color: 'rgba(155, 89, 182, 0.3)',
    },
    {
      title: 'Leer Artículos',
      description: 'Contenido espiritual y místico',
      icon: '📖',
      route: '/content',
      color: 'rgba(46, 204, 113, 0.3)',
    },
    {
      title: 'Herramientas Místicas',
      description: 'Tarot, runas y más',
      icon: '✨',
      route: '/tools',
      color: 'rgba(241, 196, 15, 0.3)',
    },
  ]);

  // Actividades recientes
  recentActivities = signal<RecentActivity[]>([
    {
      id: '1',
      type: 'course',
      title: 'Completaste: Introducción al Tarot',
      description: 'Has terminado todas las lecciones del curso básico',
      date: new Date(Date.now() - 86400000), // Ayer
      icon: '🎓',
    },
    {
      id: '2',
      type: 'tool',
      title: 'Lectura de Runas Realizada',
      description: 'Consultaste las runas sobre tu futuro profesional',
      date: new Date(Date.now() - 172800000), // Hace 2 días
      icon: 'ᚱ',
    },
    {
      id: '3',
      type: 'article',
      title: 'Artículo Guardado',
      description: 'Agregaste "El Poder de los Cristales" a favoritos',
      date: new Date(Date.now() - 259200000), // Hace 3 días
      icon: '⭐',
    },
  ]);

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData(): void {
    const userData = this.storageService.getUser();
    if (userData) {
      this.user.set(userData);
    }
  }

  private loadDashboardData(): void {
    // En una aplicación real, aquí cargarías datos del servidor
    // Por ahora usamos datos mock

    // Cargar progreso de cursos desde storage
    const progress = this.storageService.getUserPreferences();
    if (progress.stats) {
      this.stats.set(progress.stats);
    }

    // Generar frase del día basada en la fecha
    this.generateDailyQuote();
  }

  private generateDailyQuote(): void {
    const quotes = [
      'Las estrellas se alinean para traerte sabiduría y claridad en tu camino.',
      'Tu intuición es tu mejor guía en este momento de tu vida.',
      'Las energías cósmicas favorecen tu crecimiento espiritual hoy.',
      'La luna ilumina nuevas oportunidades en tu horizonte.',
      'Los cristales amplifican tu energía positiva en este día especial.',
      'Las cartas del tarot revelan secretos importantes para tu futuro.',
      'Tu aura brilla con una luz especial que atrae la abundancia.',
      'Los ancestros te envían mensajes de sabiduría a través de las runas.',
    ];

    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const selectedQuote = quotes[dayOfYear % quotes.length];

    this.dailyQuote.set(selectedQuote);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]).catch((err) => {
      console.error('Error navegando a:', route, err);
    });
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'Hace unos momentos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
  }

  logout(): void {
    // Limpiar datos de autenticación
    this.storageService.clearAuthData();

    // Redirigir al login
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error en logout:', err);
    });
  }
}
