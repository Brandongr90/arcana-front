import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  features: string[];
}

export interface Testimonial {
  name: string;
  text: string;
  stars: number;
  specialty: string;
}

export interface TrustIndicators {
  members: string;
  rating: string;
}

export interface PricingInfo {
  amount: string;
  period: string;
  trial: string;
  cancellation: string;
}

export interface WelcomeData {
  title: string;
  description: string;
}

export interface FinalCTA {
  description: string;
  buttonText: string;
  disclaimer: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  // Señales reactivas para el estado del componente
  activeService = signal<string>('tarot');
  currentTestimonial = signal<number>(0);

  // Control de SSR
  private isBrowser: boolean;

  // Datos de los servicios
  // En tu welcome.component.ts - Actualizar la sección de services

services = signal<Service[]>([
  {
    id: 'tarot',
    name: 'Tarot y Arcanos',
    icon: 'fas fa-eye', // Reemplaza 🔮
    description: 'Lecturas personalizadas que revelan tu destino',
    features: [
      'Lecturas personalizadas diarias',
      'Interpretación de arcanos mayores y menores',
      'Spreads especializados para diferentes temas',
      'Consultas en vivo con tarotistas certificados',
      'Curso completo de lectura de tarot',
    ],
  },
  {
    id: 'astrology',
    name: 'Astrología Avanzada',
    icon: 'fas fa-star-and-crescent', // Reemplaza ✨
    description: 'Cartas astrales y predicciones cósmicas',
    features: [
      'Carta astral personalizada completa',
      'Predicciones basadas en tránsitos planetarios',
      'Compatibilidad astrológica',
      'Análisis de retorno solar anual',
      'Astrología predictiva y evolutiva',
    ],
  },
  {
    id: 'holistic',
    name: 'Terapias Holísticas',
    icon: 'fas fa-spa', // Reemplaza 🧘‍♀️
    description: 'Chakras, frecuencias y sanación energética',
    features: [
      'Equilibrio y sanación de chakras',
      'Terapias con frecuencias sonoras',
      'Meditaciones guiadas especializadas',
      'Trabajo con cristales y gemas',
      'Técnicas de reiki y sanación energética',
    ],
  },
  {
    id: 'lunar',
    name: 'Ciclos Lunares',
    icon: 'fas fa-moon', // Reemplaza 🌙
    description: 'Rituales y ceremonias según las fases lunares',
    features: [
      'Calendario lunar personalizado',
      'Rituales para cada fase lunar',
      'Ceremonias de luna llena y nueva',
      'Manifestación lunar guiada',
      'Conexión con ciclos naturales',
    ],
  },
]);

  // Testimoniales
  testimonials = signal<Testimonial[]>([
    {
      name: 'María Elena',
      text: 'Arcana cambió mi vida. Las lecturas son increíblemente precisas y el contenido premium vale cada centavo.',
      stars: 5,
      specialty: 'Tarot y Numerología',
    },
    {
      name: 'Carlos Mendoza',
      text: 'La comunidad es increíble y los cursos en vivo me han ayudado a desarrollar mis habilidades intuitivas.',
      stars: 5,
      specialty: 'Astrología y Chakras',
    },
    {
      name: 'Ana Sofía',
      text: 'Los rituales lunares y las meditaciones guiadas son exactamente lo que necesitaba para mi crecimiento espiritual.',
      stars: 5,
      specialty: 'Ceremonias Lunares',
    },
  ]);

  // Indicadores de confianza
  trustIndicators = signal<TrustIndicators>({
    members: '10,000',
    rating: '4.9',
  });

  // Beneficios premium
  premiumBenefits = signal<string[]>([
    'Acceso completo a todos los cursos y talleres',
    'Sesiones en vivo exclusivas con maestros',
    'Comunidad privada de practicantes avanzados',
    'Lecturas personalizadas ilimitadas',
    'Calendario lunar y rituales personalizados',
    'Soporte prioritario y consultas 1:1',
  ]);

  // Información de precios
  pricing = signal<PricingInfo>({
    amount: '$19.99',
    period: '/mes',
    trial: '7 días gratis',
    cancellation: 'Cancela cuando quieras',
  });

  // Datos de bienvenida
  welcomeData = signal<WelcomeData>({
    title: 'Despierta tu sabiduría interior',
    description:
      'Únete a miles de personas que han transformado sus vidas a través del tarot, astrología, terapias holísticas y rituales lunares. Tu despertar espiritual comienza aquí.',
  });

  // CTA final
  finalCTA = signal<FinalCTA>({
    description:
      'Únete a miles de personas que ya han transformado sus vidas con Arcana. Comienza tu viaje místico hoy mismo.',
    buttonText: 'Comenzar Mi Transformación',
    disclaimer: '✨ 7 días gratis • Sin compromiso • Cancela cuando quieras',
  });

  // Intervalos para la gestión de testimoniales
  private testimonialInterval?: ReturnType<typeof setInterval>;

  constructor(private router: Router, @Inject(PLATFORM_ID) platformId: Object) {
    // Verificar si estamos en el browser
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Solo inicializar elementos del browser si estamos en el browser
    if (this.isBrowser) {
      this.startTestimonialRotation();
    }
  }

  ngOnDestroy(): void {
    this.stopTestimonialRotation();
  }

  // ============ MÉTODOS DE SERVICIOS ============

  setActiveService(serviceId: string): void {
    const service = this.services().find((s) => s.id === serviceId);
    if (service) {
      this.activeService.set(serviceId);
      this.trackUserInteraction('service_tab_click', { service: serviceId });
    }
  }

  getActiveService(): Service {
    return (
      this.services().find((s) => s.id === this.activeService()) ||
      this.services()[0]
    );
  }

  // ============ MÉTODOS DE TESTIMONIALES ============

  private startTestimonialRotation(): void {
    // Solo ejecutar en el browser
    if (!this.isBrowser) return;

    this.testimonialInterval = setInterval(() => {
      const nextIndex =
        (this.currentTestimonial() + 1) % this.testimonials().length;
      this.currentTestimonial.set(nextIndex);
    }, 5000); // Cambiar cada 5 segundos
  }

  private stopTestimonialRotation(): void {
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
      this.testimonialInterval = undefined;
    }
  }

  setCurrentTestimonial(index: number): void {
    if (index >= 0 && index < this.testimonials().length) {
      this.currentTestimonial.set(index);
      this.trackUserInteraction('testimonial_manual_change', { index });

      // Reiniciar el intervalo solo en el browser
      if (this.isBrowser) {
        this.stopTestimonialRotation();
        this.startTestimonialRotation();
      }
    }
  }

  getStarArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  // ============ MÉTODOS DE NAVEGACIÓN ============

  onNavigate(route: string): void {
    // Prevenir navegación por defecto y usar router
    this.trackUserInteraction('navigation_click', { route });
    this.router.navigate([route]).catch((err) => {
      console.error('Error en navegación:', err);
      this.handleNavigationError(err, route);
    });
  }

  // ============ MÉTODOS DE AUTENTICACIÓN ============

  onLogin(): void {
    console.log('🔐 Navegando a login...');
    this.trackUserInteraction('login_click', { location: 'navbar' });
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error al navegar a login:', err);
      this.handleNavigationError(err, 'login');
    });
  }

  onRegister(): void {
    console.log('📝 Navegando a registro...');
    this.trackUserInteraction('register_click', { location: 'navbar' });
    this.router.navigate(['/auth/register']).catch((err) => {
      console.error('Error al navegar a registro:', err);
      this.handleNavigationError(err, 'register');
    });
  }

  // ============ MÉTODOS DE CONVERSIÓN ============

  onStartFreeTrial(): void {
    console.log('🎁 Iniciando prueba gratuita...');
    this.trackUserInteraction('free_trial_click', { location: 'hero' });
    // Redirigir a registro con parámetro de trial
    this.router
      .navigate(['/auth/register'], {
        queryParams: { trial: 'true', plan: 'premium' },
      })
      .catch((err) => {
        console.error('Error al navegar a prueba gratuita:', err);
        this.handleNavigationError(err, 'free-trial');
      });
  }

  onViewPlans(): void {
    console.log('💎 Viendo planes premium...');
    this.trackUserInteraction('view_plans_click');
    this.router.navigate(['/membership']).catch((err) => {
      console.error('Error al navegar a planes:', err);
      this.handleNavigationError(err, 'membership');
    });
  }

  onStartPremium(): void {
    console.log('👑 Iniciando suscripción premium...');
    this.trackUserInteraction('start_premium_click', { location: 'services' });
    // Redirigir a registro con parámetro de premium
    this.router
      .navigate(['/auth/register'], {
        queryParams: { plan: 'premium', source: 'services_section' },
      })
      .catch((err) => {
        console.error('Error al navegar a premium:', err);
        this.handleNavigationError(err, 'premium');
      });
  }

  onStartTransformation(): void {
    console.log('🦋 Comenzando transformación...');
    this.trackUserInteraction('start_transformation_click', {
      location: 'final_cta',
    });
    // Redirigir a registro con parámetro de transformación
    this.router
      .navigate(['/auth/register'], {
        queryParams: { journey: 'transformation', source: 'final_cta' },
      })
      .catch((err) => {
        console.error('Error al navegar a transformación:', err);
        this.handleNavigationError(err, 'transformation');
      });
  }

  // ============ MÉTODOS INFORMATIVOS ============

  onViewDemo(): void {
    console.log('👁️ Viendo contenido gratuito...');
    this.trackUserInteraction('view_demo_click');
    this.router
      .navigate(['/courses'], {
        queryParams: { filter: 'free' },
      })
      .catch((err) => {
        console.error('Error al navegar a demo:', err);
        this.handleNavigationError(err, 'demo');
      });
  }

  onContactSupport(): void {
    console.log('💬 Contactando soporte...');
    this.trackUserInteraction('contact_support_click');

    // Abrir chat de soporte o navegar a página de contacto
    if (this.isBrowser && window.location.hostname !== 'localhost') {
      // En producción, podrías abrir un chat widget
      // window.Intercom?.('show');
      // o navegar a página de contacto
      this.router.navigate(['/support']).catch((err) => {
        console.error('Error al navegar a soporte:', err);
        this.handleNavigationError(err, 'support');
      });
    } else {
      // En desarrollo, simular contacto
      alert(
        'Función de soporte en desarrollo. Por favor, contacta a support@arcana.com'
      );
    }
  }

  // ============ TRACKING Y ANALYTICS ============

  trackUserInteraction(action: string, details: any = {}): void {
    // Solo ejecutar analytics en el browser
    if (!this.isBrowser) return;

    const eventData = {
      action,
      page: 'welcome',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      viewport: this.getViewportSize(),
      ...details,
    };

    console.log('📊 Analytics Event:', eventData);

    // Aquí puedes integrar con Google Analytics, etc.
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', action, eventData);
    // }
  }

  private getViewportSize(): string {
    if (!this.isBrowser) return 'SSR';

    try {
      return `${window.innerWidth}x${window.innerHeight}`;
    } catch {
      return 'unknown';
    }
  }

  private handleNavigationError(error: any, context: string): void {
    console.error(`Error de navegación en ${context}:`, error);
    this.trackUserInteraction('navigation_error', {
      context,
      error: error.message || 'Unknown error',
    });
  }

  // ============ MÉTODOS DE UTILIDADES ============

  trackByServiceId(index: number, service: Service): string {
    return service.id;
  }

  trackByTestimonialIndex(index: number, testimonial: Testimonial): string {
    return `${testimonial.name}-${index}`;
  }

  // ============ GETTERS COMPUTADOS ============

  get isServiceActive(): boolean {
    return !!this.activeService();
  }

  get hasTestimonials(): boolean {
    return this.testimonials().length > 0;
  }

  get currentTestimonialData(): Testimonial | null {
    const testimonials = this.testimonials();
    const currentIndex = this.currentTestimonial();
    return testimonials[currentIndex] || null;
  }

  // ============ MÉTODOS DE VALIDACIÓN ============

  private isValidServiceId(serviceId: string): boolean {
    return this.services().some((service) => service.id === serviceId);
  }

  // ============ MÉTODOS DE ESTADO ============

  isFirstTestimonial(): boolean {
    return this.currentTestimonial() === 0;
  }

  isLastTestimonial(): boolean {
    return this.currentTestimonial() === this.testimonials().length - 1;
  }

  // ============ MÉTODOS PARA FUTURAS INTEGRACIONES ============

  async loadDynamicContent(): Promise<void> {
    try {
      console.log('Cargando contenido dinámico...');
      this.trackUserInteraction('dynamic_content_load_start');

      // Aquí irían las llamadas a API
      // const content = await this.contentService.getWelcomeContent();
      // this.welcomeData.set(content);

      this.trackUserInteraction('dynamic_content_load_success');
    } catch (error) {
      console.error('Error cargando contenido dinámico:', error);
      this.trackUserInteraction('dynamic_content_load_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  personalizeContent(userPreferences?: any): void {
    console.log('Personalizando contenido...', userPreferences);
    this.trackUserInteraction('content_personalized', {
      hasPreferences: !!userPreferences,
    });
  }

  // ============ MÉTODOS DE PERFORMANCE ============

  preloadCriticalRoutes(): void {
    if (!this.isBrowser) return;

    const criticalRoutes = [
      '/auth/login',
      '/auth/register',
      '/membership/plans',
    ];

    // Solo precargar si estamos en el browser
    criticalRoutes.forEach((route) => {
      // Implementar precarga si es necesario
      console.log(`Preparando precarga para: ${route}`);
    });
  }

  // ============ MÉTODOS DE ACCESIBILIDAD ============

  announceServiceChange(serviceName: string): void {
    if (!this.isBrowser) return;

    const announcement = `Servicio activo cambiado a ${serviceName}`;
    this.announceToScreenReader(announcement);
  }

  private announceToScreenReader(message: string): void {
    if (!this.isBrowser) return;

    try {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;

      document.body.appendChild(announcement);

      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    } catch (error) {
      console.warn('Error en anuncio de accesibilidad:', error);
    }
  }
}
