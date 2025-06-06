import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Interfaces
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
  errors?: ValidationError[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Control de SSR
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // Estado del formulario
  credentials = signal<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  // Estados de UI
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  // Estados de validación
  emailTouched = signal<boolean>(false);
  passwordTouched = signal<boolean>(false);
  emailError = signal<string>('');
  passwordError = signal<string>('');
  loginError = signal<string>('');

  // Parámetros de retorno
  private returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object,
    // private authService: AuthService, // Inyectar cuando esté disponible
    // private analyticsService: AnalyticsService // Inyectar cuando esté disponible
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupRouteParams();
    this.trackPageView();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============ INICIALIZACIÓN ============

  private initializeComponent(): void {
    // Pre-llenar email si viene de query params
    const email = this.route.snapshot.queryParams['email'];
    if (email) {
      this.credentials.update(cred => ({ ...cred, email }));
    }

    // Limpiar errores anteriores
    this.clearErrors();
  }

  private setupRouteParams(): void {
    // Obtener URL de retorno
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Tracking de origen
    const source = this.route.snapshot.queryParams['source'];
    if (source) {
      this.trackUserInteraction('login_page_view', { source });
    }
  }

  private trackPageView(): void {
    this.trackUserInteraction('login_page_view', {
      returnUrl: this.returnUrl,
      timestamp: new Date().toISOString()
    });
  }

  // ============ VALIDACIONES ============

  private validateEmail(email: string): string {
    if (!email) {
      return 'El correo electrónico es requerido';
    }
    
    if (!this.isValidEmail(email)) {
      return 'Ingresa un correo electrónico válido';
    }
    
    return '';
  }

  private validatePassword(password: string): string {
    if (!password) {
      return 'La contraseña es requerida';
    }
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validateForm(): boolean {
    const creds = this.credentials();
    
    const emailErr = this.validateEmail(creds.email);
    const passwordErr = this.validatePassword(creds.password);
    
    this.emailError.set(emailErr);
    this.passwordError.set(passwordErr);
    
    return !emailErr && !passwordErr;
  }

  // ============ EVENT HANDLERS ============

  onEmailChange(event: any): void {
    const email = event.target.value;
    this.credentials.update(cred => ({ ...cred, email }));
    
    // Validación en tiempo real solo si ya fue tocado
    if (this.emailTouched()) {
      this.emailError.set(this.validateEmail(email));
    }
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
    const email = this.credentials().email;
    this.emailError.set(this.validateEmail(email));
    
    this.trackUserInteraction('email_field_blur', {
      hasValue: !!email,
      isValid: !this.emailError()
    });
  }

  onPasswordChange(event: any): void {
    const password = event.target.value;
    this.credentials.update(cred => ({ ...cred, password }));
    
    // Validación en tiempo real solo si ya fue tocado
    if (this.passwordTouched()) {
      this.passwordError.set(this.validatePassword(password));
    }
  }

  onPasswordBlur(): void {
    this.passwordTouched.set(true);
    const password = this.credentials().password;
    this.passwordError.set(this.validatePassword(password));
    
    this.trackUserInteraction('password_field_blur', {
      hasValue: !!password,
      isValid: !this.passwordError()
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
    this.trackUserInteraction('password_visibility_toggle', {
      isVisible: this.showPassword()
    });
  }

  // ============ FORM SUBMISSION ============

  async onSubmit(): Promise<void> {
    this.isSubmitted.set(true);
    this.clearErrors();

    // Validar formulario
    if (!this.validateForm()) {
      this.trackUserInteraction('login_validation_failed', {
        emailError: this.emailError(),
        passwordError: this.passwordError()
      });
      return;
    }

    // Iniciar loading
    this.isLoading.set(true);
    
    try {
      this.trackUserInteraction('login_attempt', {
        email: this.credentials().email,
        rememberMe: this.credentials().rememberMe
      });

      // Simular llamada al servicio de autenticación
      const result = await this.performLogin(this.credentials());
      
      if (result.success) {
        await this.handleLoginSuccess(result);
      } else {
        this.handleLoginError(result);
      }
      
    } catch (error) {
      this.handleLoginError({
        success: false,
        message: 'Error de conexión. Por favor, intenta de nuevo.'
      });
      
      this.trackUserInteraction('login_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  private async performLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    // Aquí iría la llamada real al AuthService
    // return this.authService.login(credentials);
    
    // Simulación para demo
    return new Promise((resolve) => {
      setTimeout(() => {
        if (credentials.email === 'demo@arcana.com' && credentials.password === 'demo123') {
          resolve({
            success: true,
            token: 'demo_token_' + Date.now(),
            user: {
              id: '1',
              email: credentials.email,
              name: 'Usuario Demo'
            }
          });
        } else {
          resolve({
            success: false,
            message: 'Credenciales incorrectas. Usa demo@arcana.com / demo123 para la demo.'
          });
        }
      }, 1500);
    });
  }

  private async handleLoginSuccess(result: LoginResponse): Promise<void> {
    this.trackUserInteraction('login_success', {
      userId: result.user?.id,
      rememberMe: this.credentials().rememberMe
    });

    // Guardar token si remember me está activado
    if (this.credentials().rememberMe && this.isBrowser) {
      this.saveRememberMeData(result);
    }

    // Mostrar mensaje de éxito (opcional)
    this.showSuccessMessage();

    // Redirigir después de un breve delay
    setTimeout(() => {
      this.router.navigate([this.returnUrl]).catch(err => {
        console.error('Error en redirección:', err);
        this.router.navigate(['/dashboard']);
      });
    }, 1000);
  }

  private handleLoginError(result: LoginResponse): void {
    this.loginError.set(result.message || 'Error desconocido');
    
    // Manejar errores específicos de campos
    if (result.errors) {
      result.errors.forEach(error => {
        if (error.field === 'email') {
          this.emailError.set(error.message);
        } else if (error.field === 'password') {
          this.passwordError.set(error.message);
        }
      });
    }

    this.trackUserInteraction('login_failed', {
      error: result.message,
      fieldErrors: result.errors
    });
  }

  private saveRememberMeData(result: LoginResponse): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem('arcana_remember_email', this.credentials().email);
      if (result.token) {
        localStorage.setItem('arcana_auth_token', result.token);
      }
    } catch (error) {
      console.warn('Error guardando datos de remember me:', error);
    }
  }

  private showSuccessMessage(): void {
    // Aquí podrías mostrar un toast o mensaje de éxito
    this.loginError.set('');
    console.log('¡Login exitoso! Redirigiendo...');
  }

  // ============ SOCIAL LOGIN ============

  onSocialLogin(provider: 'google' | 'facebook'): void {
    if (this.isLoading()) return;

    this.trackUserInteraction('social_login_attempt', { provider });

    // Implementar login social
    this.performSocialLogin(provider);
  }

  private performSocialLogin(provider: string): void {
    if (!this.isBrowser) return;

    try {
      // Aquí iría la implementación real del login social
      // this.authService.loginWithSocial(provider);
      
      // Para demo, simular redirección
      console.log(`Iniciando login con ${provider}...`);
      
      // Mostrar loading temporal
      this.isLoading.set(true);
      
      setTimeout(() => {
        this.isLoading.set(false);
        alert(`Login con ${provider} no implementado en demo`);
      }, 2000);
      
    } catch (error) {
      this.isLoading.set(false);
      this.loginError.set(`Error al conectar con ${provider}`);
      this.trackUserInteraction('social_login_error', { provider, error });
    }
  }

  // ============ NAVEGACIÓN ============

  onBackToHome(): void {
    this.trackUserInteraction('back_to_home_click');
    this.router.navigate(['/']).catch(err => {
      console.error('Error navegando al inicio:', err);
    });
  }

  onGoToRegister(): void {
    this.trackUserInteraction('go_to_register_click');
    
    // Preservar email si ya fue ingresado
    const email = this.credentials().email;
    const queryParams = email ? { email } : {};
    
    this.router.navigate(['/auth/register'], { queryParams }).catch(err => {
      console.error('Error navegando a registro:', err);
    });
  }

  onForgotPassword(): void {
    this.trackUserInteraction('forgot_password_click');
    
    // Preservar email si ya fue ingresado
    const email = this.credentials().email;
    const queryParams = email ? { email } : {};
    
    this.router.navigate(['/auth/forgot-password'], { queryParams }).catch(err => {
      console.error('Error navegando a recuperar contraseña:', err);
    });
  }

  // ============ UTILIDADES ============

  isFormValid(): boolean {
    const creds = this.credentials();
    return !!creds.email && 
           !!creds.password && 
           !this.emailError() && 
           !this.passwordError();
  }

  private clearErrors(): void {
    this.emailError.set('');
    this.passwordError.set('');
    this.loginError.set('');
  }

  // ============ ANALYTICS Y TRACKING ============

  private trackUserInteraction(action: string, details: any = {}): void {
    if (!this.isBrowser) return;

    const eventData = {
      action,
      page: 'login',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      viewport: this.getViewportSize(),
      ...details
    };

    console.log('📊 Login Analytics Event:', eventData);

    // Integración con servicio de analytics
    // this.analyticsService?.track(action, eventData);
  }

  private getViewportSize(): string {
    if (!this.isBrowser) return 'SSR';
    
    try {
      return `${window.innerWidth}x${window.innerHeight}`;
    } catch {
      return 'unknown';
    }
  }

  // ============ ACCESIBILIDAD ============

  onKeyDown(event: KeyboardEvent): void {
    // Enter en cualquier campo submite el formulario
    if (event.key === 'Enter' && this.isFormValid() && !this.isLoading()) {
      event.preventDefault();
      this.onSubmit();
    }

    // Escape limpia errores
    if (event.key === 'Escape') {
      this.clearErrors();
    }
  }

  // ============ PERFORMANCE ============

  // Método para precargar recursos críticos
  preloadCriticalResources(): void {
    if (!this.isBrowser) return;

    // Precargar rutas importantes
    const criticalRoutes = ['/dashboard', '/auth/register', '/auth/forgot-password'];
    
    criticalRoutes.forEach(route => {
      // Implementar precarga si es necesario
      console.log(`Precargando ruta: ${route}`);
    });
  }

  // ============ GESTIÓN DE ESTADO AVANZADA ============

  // Autocompletar email si existe en localStorage
  private loadRememberedEmail(): void {
    if (!this.isBrowser) return;

    try {
      const rememberedEmail = localStorage.getItem('arcana_remember_email');
      if (rememberedEmail) {
        this.credentials.update(cred => ({ 
          ...cred, 
          email: rememberedEmail,
          rememberMe: true 
        }));
      }
    } catch (error) {
      console.warn('Error cargando email recordado:', error);
    }
  }

  // Limpiar datos recordados
  private clearRememberedData(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem('arcana_remember_email');
      localStorage.removeItem('arcana_auth_token');
    } catch (error) {
      console.warn('Error limpiando datos recordados:', error);
    }
  }

  // ============ VALIDACIONES AVANZADAS ============

  // Validación de email en tiempo real con debounce
  private emailValidationTimeout?: ReturnType<typeof setTimeout>;

  onEmailInput(event: any): void {
    const email = event.target.value;
    this.credentials.update(cred => ({ ...cred, email }));

    // Limpiar timeout anterior
    if (this.emailValidationTimeout) {
      clearTimeout(this.emailValidationTimeout);
    }

    // Validar después de 500ms de inactividad
    this.emailValidationTimeout = setTimeout(() => {
      if (this.emailTouched()) {
        this.emailError.set(this.validateEmail(email));
      }
    }, 500);
  }

  // ============ GETTERS COMPUTADOS ============

  get formClasses(): string {
    const classes = ['login-form'];
    
    if (this.isLoading()) {
      classes.push('loading');
    }
    
    if (this.isSubmitted()) {
      classes.push('submitted');
    }

    return classes.join(' ');
  }

  get submitButtonText(): string {
    if (this.isLoading()) {
      return 'Iniciando sesión...';
    }
    return 'Iniciar Sesión';
  }

  // ============ ERROR HANDLING ============

  private handleUnexpectedError(error: any): void {
    console.error('Error inesperado en LoginComponent:', error);
    
    this.loginError.set('Ha ocurrido un error inesperado. Por favor, recarga la página e intenta de nuevo.');
    
    this.trackUserInteraction('unexpected_error', {
      error: error.message || error.toString(),
      stack: error.stack
    });
  }

  // ============ CLEANUP ============

  private cleanup(): void {
    // Limpiar timeouts
    if (this.emailValidationTimeout) {
      clearTimeout(this.emailValidationTimeout);
    }

    // Limpiar estados
    this.isLoading.set(false);
    this.clearErrors();
  }
}