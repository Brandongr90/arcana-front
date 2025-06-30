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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DeviceDetectionService } from '../../../core/services/device-detection.service';
import {
  Service,
  Testimonial,
  TrustIndicators,
  PricingInfo,
  WelcomeData,
  FinalCTA,
} from '../welcome-interfaces';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  // ========================================
  // PROPIEDADES PRINCIPALES
  // ========================================

  activeService = signal<string>('tarot');
  currentTestimonial = signal<number>(0);

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  isMobile = false;
  private testimonialInterval?: ReturnType<typeof setInterval>;

  // ========================================
  // DATOS DE LA APLICACIÓN
  // ========================================

  services = signal<Service[]>([
    {
      id: 'tarot',
      name: 'Tarot y Arcanos',
      icon: 'fas fa-eye',
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
      icon: 'fas fa-star-and-crescent',
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
      icon: 'fas fa-spa',
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
      icon: 'fas fa-moon',
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

  trustIndicators = signal<TrustIndicators>({
    members: '10,000',
    rating: '4.9',
  });

  premiumBenefits = signal<string[]>([
    'Acceso completo a todos los cursos y talleres',
    'Sesiones en vivo exclusivas con maestros',
    'Comunidad privada de practicantes avanzados',
    'Lecturas personalizadas ilimitadas',
    'Calendario lunar y rituales personalizados',
    'Soporte prioritario y consultas 1:1',
  ]);

  pricing = signal<PricingInfo>({
    amount: '$19.99',
    period: '/mes',
    trial: '7 días gratis',
    cancellation: 'Cancela cuando quieras',
  });

  welcomeData = signal<WelcomeData>({
    title: 'Despierta tu sabiduría interior',
    description:
      'Únete a miles de personas que han transformado sus vidas a través del tarot, astrología, terapias holísticas y rituales lunares. Tu despertar espiritual comienza aquí.',
  });

  finalCTA = signal<FinalCTA>({
    description:
      'Únete a miles de personas que ya han transformado sus vidas con Arcana. Comienza tu viaje místico hoy mismo.',
    buttonText: 'Comenzar Mi Transformación',
    disclaimer: '✨ 7 días gratis • Sin compromiso • Cancela cuando quieras',
  });

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private deviceService: DeviceDetectionService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // ========================================
  // INICIALIZACIÓN Y DESTRUCCIÓN
  // ========================================

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startTestimonialRotation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
  }

  // ========================================
  // GESTIÓN DE SERVICIOS
  // ========================================

  setActiveService(serviceId: string): void {
    const service = this.services().find((s) => s.id === serviceId);
    if (service) {
      this.activeService.set(serviceId);
    }
  }

  getActiveService(): Service {
    return (
      this.services().find((s) => s.id === this.activeService()) ||
      this.services()[0]
    );
  }

  // ========================================
  // GESTIÓN DE TESTIMONIALES
  // ========================================

  private startTestimonialRotation(): void {
    if (!this.isBrowser) return;

    this.testimonialInterval = setInterval(() => {
      const nextIndex =
        (this.currentTestimonial() + 1) % this.testimonials().length;
      this.currentTestimonial.set(nextIndex);
    }, 5000);
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

      if (this.isBrowser) {
        this.stopTestimonialRotation();
        this.startTestimonialRotation();
      }
    }
  }

  getStarArray(stars: number): number[] {
    return Array(stars).fill(0);
  }

  // ========================================
  // NAVEGACIÓN
  // ========================================

  onNavigate(route: string): void {
    this.router.navigate([route]).catch((err) => {
      console.error('Error en navegación:', err);
    });
  }

  onLogin(): void {
    this.router.navigate(['/auth/login']).catch((err) => {
      console.error('Error al navegar a login:', err);
    });
  }

  onRegister(): void {
    this.router.navigate(['/auth/register']).catch((err) => {
      console.error('Error al navegar a registro:', err);
    });
  }

  // ========================================
  // ACCIONES DE CONVERSIÓN
  // ========================================

  onStartFreeTrial(): void {
    this.router
      .navigate(['/auth/register'], {
        queryParams: { trial: 'true', plan: 'premium' },
      })
      .catch((err) => {
        console.error('Error al navegar a prueba gratuita:', err);
      });
  }

  onViewPlans(): void {
    this.router.navigate(['/membership']).catch((err) => {
      console.error('Error al navegar a planes:', err);
    });
  }

  onStartPremium(): void {
    this.router
      .navigate(['/auth/register'], {
        queryParams: { plan: 'premium', source: 'services_section' },
      })
      .catch((err) => {
        console.error('Error al navegar a premium:', err);
      });
  }

  onStartTransformation(): void {
    this.router
      .navigate(['/auth/register'], {
        queryParams: { journey: 'transformation', source: 'final_cta' },
      })
      .catch((err) => {
        console.error('Error al navegar a transformación:', err);
      });
  }

  onViewDemo(): void {
    this.router
      .navigate(['/courses'], {
        queryParams: { filter: 'free' },
      })
      .catch((err) => {
        console.error('Error al navegar a demo:', err);
      });
  }

  onContactSupport(): void {
    if (this.isBrowser && window.location.hostname !== 'localhost') {
      this.router.navigate(['/support']).catch((err) => {
        console.error('Error al navegar a soporte:', err);
      });
    } else {
      alert('Función de soporte en desarrollo. Contacta a support@arcana.com');
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  trackByServiceId(index: number, service: Service): string {
    return service.id;
  }

  trackByTestimonialIndex(index: number, testimonial: Testimonial): string {
    return `${testimonial.name}-${index}`;
  }
}
