import { Component, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
 private isBrowser: boolean;

  // Estados
  email = '';
  emailSent = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  emailError = signal<string>('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Pre-llenar email si viene como parámetro
    const emailParam = this.route.snapshot.queryParams['email'];
    if (emailParam) {
      this.email = emailParam;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.validateEmail()) return;

    this.isLoading.set(true);
    this.emailError.set('');

    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('📧 Enviando email de recuperación a:', this.email);
      this.emailSent.set(true);
      
    } catch (error) {
      this.emailError.set('Error al enviar el email. Intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async onResendEmail(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('📧 Reenviando email a:', this.email);
    } finally {
      this.isLoading.set(false);
    }
  }

  onBackToLogin(): void {
    this.router.navigate(['/auth/login'], {
      queryParams: this.email ? { email: this.email } : {}
    }).catch(err => {
      console.error('Error navegando a login:', err);
    });
  }

  private validateEmail(): boolean {
    if (!this.email) {
      this.emailError.set('El email es requerido');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError.set('Ingresa un email válido');
      return false;
    }

    return true;
  }

  onBackToHome(): void {
  this.router.navigate(['/']).catch(err => {
    console.error('Error navegando al inicio:', err);
  });
}

onGoToLogin(): void {
  this.router.navigate(['/auth/login']).catch(err => {
    console.error('Error navegando a login:', err);
  });
}
}