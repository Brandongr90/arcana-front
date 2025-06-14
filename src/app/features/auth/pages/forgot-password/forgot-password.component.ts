import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

// ============ INTERFACES BÁSICAS ============

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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  // ============ PROPIEDADES BÁSICAS ============

  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // Estados del formulario
  credentials = signal<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Estados de UI
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  // Control de flujo
  currentStep = signal<number>(1); // 1: email, 2: código, 3: nueva contraseña

  // Estados de verificación de código
  verificationCode = signal<string[]>(['', '', '', '', '', '']);
  newPassword = signal<string>('');
  confirmPassword = signal<string>('');

  // Estados de validación
  emailTouched = signal<boolean>(false);
  emailError = signal<string>('');
  loginError = signal<string>('');
  codeError = signal<string>('');

  // URL de retorno
  private returnUrl: string = '/dashboard';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.initializeComponent();
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
      this.credentials.update((cred) => ({ ...cred, email }));
    }

    // Obtener URL de retorno
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.clearErrors();
  }

  private trackPageView(): void {
    console.log('📊 Forgot Password page loaded');
  }

  // ============ VALIDACIONES ============

  private validateEmail(email: string): string {
    if (!email) return 'El correo electrónico es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Ingresa un correo electrónico válido';
    return '';
  }

  private validatePasswords(): string {
    if (!this.newPassword() || !this.confirmPassword()) {
      return 'Ambas contraseñas son requeridas';
    }
    if (this.newPassword() !== this.confirmPassword()) {
      return 'Las contraseñas no coinciden';
    }
    if (this.newPassword().length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  // ============ EVENT HANDLERS ============

  onEmailChange(event: any): void {
    const email = event.target.value;
    this.credentials.update((cred) => ({ ...cred, email }));

    if (this.emailTouched()) {
      this.emailError.set(this.validateEmail(email));
    }
  }

  onEmailBlur(): void {
    this.emailTouched.set(true);
    const email = this.credentials().email;
    this.emailError.set(this.validateEmail(email));
  }

  onNewPasswordChange(event: any): void {
    this.newPassword.set(event.target.value);
  }

  onConfirmPasswordChange(event: any): void {
    this.confirmPassword.set(event.target.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((show) => !show);
  }

  // ============ CODE INPUT HANDLING ============

  onCodeInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const digit = target.value.replace(/[^0-9]/g, '').slice(-1);

    target.value = digit;

    // Actualizar signal
    const currentCode = [...this.verificationCode()];
    currentCode[index] = digit;
    this.verificationCode.set(currentCode);

    // Limpiar errores
    if (this.codeError()) {
      this.codeError.set('');
    }

    // Focus al siguiente
    if (digit && index < 5) {
      const nextInput = document.querySelector(
        `input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }

    // Auto-verificación cuando se completan los 6 dígitos
    if (digit && currentCode.every((d) => d !== '')) {
      setTimeout(() => this.handleCodeVerification(), 500);
    }
  }

  onCodeKeyDown(event: KeyboardEvent, index: number): void {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      event.preventDefault();

      const currentCode = [...this.verificationCode()];

      if (target.value) {
        target.value = '';
        currentCode[index] = '';
      } else if (index > 0) {
        const prevInput = document.querySelector(
          `input[data-index="${index - 1}"]`
        ) as HTMLInputElement;
        if (prevInput) {
          prevInput.value = '';
          prevInput.focus();
          currentCode[index - 1] = '';
        }
      }

      this.verificationCode.set(currentCode);
      if (this.codeError()) {
        this.codeError.set('');
      }
      return;
    }

    // Permitir solo números
    if (
      !/[0-9]/.test(event.key) &&
      ![
        'Backspace',
        'Delete',
        'Tab',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
      ].includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  // ============ NAVEGACIÓN ENTRE PASOS ============

  goToStep(step: number): void {
    if (step === this.currentStep()) return;

    console.log(`🔄 Cambiando de paso ${this.currentStep()} a paso ${step}`);

    this.currentStep.set(step);
    this.clearErrors();

    // Forzar detección de cambios
    this.cdr.detectChanges();

    // Focus automático según el paso
    setTimeout(() => {
      if (step === 2) {
        this.focusFirstCodeInput();
      } else if (step === 1) {
        const emailInput = document.getElementById('email') as HTMLInputElement;
        emailInput?.focus();
      }
    }, 100);

    console.log(`✅ Transición completada a paso: ${step}`);
  }

  goToNextStep(): void {
    const nextStep = this.currentStep() + 1;
    if (nextStep <= 3) {
      this.goToStep(nextStep);
    }
  }

  goToPreviousStep(): void {
    const prevStep = this.currentStep() - 1;
    if (prevStep >= 1) {
      this.goToStep(prevStep);
    }
  }

  // ============ FORM SUBMISSION ============

  async onSubmit(): Promise<void> {
    this.isSubmitted.set(true);
    this.clearErrors();

    const step = this.currentStep();

    console.log(`📝 Submit en paso: ${step}`);

    switch (step) {
      case 1:
        await this.handleEmailSubmission();
        break;
      case 2:
        await this.handleCodeVerification();
        break;
      case 3:
        await this.handlePasswordReset();
        break;
    }
  }

  private async handleEmailSubmission(): Promise<void> {
    const email = this.credentials().email;
    const emailErr = this.validateEmail(email);
    this.emailError.set(emailErr);

    if (emailErr) {
      console.log('❌ Error de validación de email:', emailErr);
      return;
    }

    this.isLoading.set(true);
    console.log('🔄 Enviando código de verificación...');

    try {
      const result = await this.sendVerificationCode(email);

      if (result.success) {
        console.log('✅ Código enviado exitosamente');
        this.goToNextStep();
      } else {
        console.log('❌ Error enviando código:', result.message);
        this.loginError.set(result.message || 'Error enviando código');
      }
    } catch (error) {
      console.log('❌ Error en envío:', error);
      this.loginError.set('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handleCodeVerification(): Promise<void> {
    const code = this.verificationCode().join('');

    if (code.length !== 6) {
      this.codeError.set('Por favor, completa el código de 6 dígitos');
      return;
    }

    this.isLoading.set(true);
    console.log('🔄 Verificando código...');

    try {
      const result = await this.verifyCode(code);

      if (result.success) {
        console.log('✅ Código verificado exitosamente');
        this.goToNextStep();
      } else {
        console.log('❌ Error verificando código:', result.message);
        this.codeError.set(result.message || 'Código incorrecto');
        this.shakeCodeInputs();
      }
    } catch (error) {
      console.log('❌ Error en verificación:', error);
      this.codeError.set('Error de conexión. Por favor, intenta de nuevo.');
      this.shakeCodeInputs();
    } finally {
      this.isLoading.set(false);
    }
  }

  private async handlePasswordReset(): Promise<void> {
    const passwordError = this.validatePasswords();
    if (passwordError) {
      this.loginError.set(passwordError);
      return;
    }

    this.isLoading.set(true);
    console.log('🔄 Actualizando contraseña...');

    try {
      const result = await this.resetPassword(this.newPassword());

      if (result.success) {
        console.log('✅ Contraseña actualizada exitosamente');

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: {
              email: this.credentials().email,
              passwordReset: 'success',
            },
          });
        }, 2000);
      } else {
        console.log('❌ Error actualizando contraseña:', result.message);
        this.loginError.set(result.message || 'Error actualizando contraseña');
      }
    } catch (error) {
      console.log('❌ Error en actualización:', error);
      this.loginError.set('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      this.isLoading.set(false);
    }
  }

  // ============ API SIMULATION ============

  private async sendVerificationCode(email: string): Promise<LoginResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`📧 Simulando envío de código a: ${email}`);
        resolve({
          success: true,
          message: 'Código de verificación enviado exitosamente.',
        });
      }, 1500);
    });
  }

  private async verifyCode(code: string): Promise<LoginResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`🔍 Verificando código: ${code}`);
        // Para demo: acepta cualquier código de 6 dígitos o "123456"
        if (code.length === 6 && (code === '123456' || /^\d{6}$/.test(code))) {
          resolve({
            success: true,
            message: 'Código verificado exitosamente.',
          });
        } else {
          resolve({
            success: false,
            message: 'Código incorrecto. Para la demo, usa: 123456',
          });
        }
      }, 1500);
    });
  }

  private async resetPassword(password: string): Promise<LoginResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`🔐 Simulando actualización de contraseña`);
        resolve({
          success: true,
          message: 'Contraseña actualizada exitosamente.',
        });
      }, 1500);
    });
  }

  // ============ UTILIDADES ============

  private focusFirstCodeInput(): void {
    setTimeout(() => {
      if (this.isBrowser) {
        const firstInput = document.querySelector(
          '.code-input' // ✅ NUEVO
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
          console.log('🎯 Auto-focus aplicado al primer input de código');
        }
      }
    }, 200);
  }

  private shakeCodeInputs(): void {
    const codeInputs = document.querySelectorAll('.code-input-professional');
    codeInputs.forEach((input) => {
      input.classList.add('error');
      setTimeout(() => {
        input.classList.remove('error');
      }, 600);
    });
  }

  private clearErrors(): void {
    this.emailError.set('');
    this.loginError.set('');
    this.codeError.set('');
  }

  // ============ GETTERS PARA TEMPLATE ============

  isFormValid(): boolean {
    const step = this.currentStep();
    const creds = this.credentials();

    switch (step) {
      case 1:
        return !!creds.email && !this.validateEmail(creds.email);
      case 2:
        return (
          this.verificationCode().every((d) => d !== '') &&
          this.verificationCode().join('').length === 6
        );
      case 3:
        return (
          !!this.newPassword() &&
          !!this.confirmPassword() &&
          this.newPassword() === this.confirmPassword() &&
          this.newPassword().length >= 6
        );
      default:
        return false;
    }
  }

  getStepTitle(): string {
    switch (this.currentStep()) {
      case 1:
        return 'Recupera tu Cuenta';
      case 2:
        return 'Verifica el Código';
      case 3:
        return 'Nueva Contraseña';
      default:
        return 'Recupera tu Cuenta';
    }
  }

  getStepSubtitle(): string {
    switch (this.currentStep()) {
      case 1:
        return 'Ingresa tu email para recibir un código de verificación mágico';
      case 2:
        return 'Introduce el código de 6 dígitos que enviamos a tu correo';
      case 3:
        return 'Crea una nueva contraseña segura para proteger tu cuenta';
      default:
        return 'Ingresa tu email para recibir un código de verificación mágico';
    }
  }

  getSubmitButtonText(): string {
    const step = this.currentStep();
    const isLoading = this.isLoading();

    if (isLoading) {
      switch (step) {
        case 1:
          return 'Enviando código mágico...';
        case 2:
          return 'Verificando código...';
        case 3:
          return 'Actualizando contraseña...';
        default:
          return 'Procesando...';
      }
    }

    switch (step) {
      case 1:
        return 'Enviar Código Mágico';
      case 2:
        return 'Verificar Código';
      case 3:
        return 'Actualizar Contraseña';
      default:
        return 'Continuar';
    }
  }

  // ============ NAVEGACIÓN ============

  onBackToHome(): void {
    this.router.navigate(['/']).catch((err) => {
      console.error('Error navegando al inicio:', err);
    });
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

  // ============ 🧪 MÉTODOS DE DEBUG (SIMPLIFICADOS) ============

  debugCurrentStep(): void {
    console.log('🔍 Debug Current Step:', {
      currentStep: this.currentStep(),
      formValid: this.isFormValid(),
      stepTitle: this.getStepTitle(),
      email: this.credentials().email,
      codeComplete: this.verificationCode().join('').length === 6,
      passwords: {
        new: !!this.newPassword(),
        confirm: !!this.confirmPassword(),
        match: this.newPassword() === this.confirmPassword(),
      },
    });
  }

  testStepChange(step: number): void {
    console.log(`🧪 Test: Cambiando manualmente al paso ${step}`);
    this.goToStep(step);
    setTimeout(() => {
      this.debugCurrentStep();
    }, 100);
  }

  onCodePaste(event: ClipboardEvent, index: number): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/[^0-9]/g, '').slice(0, 6);

    if (digits.length === 0) return;

    const currentCode = [...this.verificationCode()];

    // Poner cada dígito en su input correspondiente
    for (let i = 0; i < digits.length && i < 6; i++) {
      currentCode[i] = digits[i];
      const input = document.querySelectorAll('.code-input')[
        i
      ] as HTMLInputElement;
      if (input) {
        input.value = digits[i];
      }
    }

    this.verificationCode.set(currentCode);

    // Focus al último input llenado
    const focusIndex = Math.min(digits.length, 5);
    const targetInput = document.querySelectorAll('.code-input')[
      focusIndex
    ] as HTMLInputElement;
    if (targetInput) {
      targetInput.focus();
    }

    // Auto-verificar si está completo
    if (digits.length === 6) {
      setTimeout(() => this.handleCodeVerification(), 500);
    }
  }
}
