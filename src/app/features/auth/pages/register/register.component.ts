import {
  Component,
  signal,
  OnInit,
  Inject,
  PLATFORM_ID,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  RegisterCredentials,
  ValidationError,
  RegisterResponse,
  Disciplina,
  SignoZodiacal,
} from '../../../../core/models/userInterface';
import { Subject, takeUntil } from 'rxjs';
import { DeviceDetectionService } from '../../../../core/services/device-detection.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
        animate(
          '0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0) scale(1)' })
        ),
      ]),
    ]),
  ],
})
export class RegisterComponent {
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  @ViewChildren('codeInput') codeInputs!: QueryList<
    ElementRef<HTMLInputElement>
  >;

  // Estado del formulario
  credentials = signal<RegisterCredentials>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoPerfil: '',
    disciplinasInteres: [],
    fechaNacimiento: '',
    acceptTerms: false,
    acceptMarketing: false,
  });

  // Estados de UI
  isLoading = signal<boolean>(false);
  isSubmitted = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  // Estados de verificación de email
  showEmailVerification = signal<boolean>(false);
  verificationCode = signal<string[]>(['', '', '', '', '', '']);
  filledDigitsCount = signal<number>(0);
  isVerifying = signal<boolean>(false);
  isResending = signal<boolean>(false);
  verificationError = signal<string>('');
  verificationSuccess = signal<boolean>(false);
  resendCooldown = signal<number>(0);
  private resendTimer?: number;

  // Estados de validación
  formTouched = signal<{ [key: string]: boolean }>({});
  formErrors = signal<{ [key: string]: string }>({});

  // 🆕 Estados para tracking de iconos profesionales
  iconInteractions = signal<{ [key: string]: number }>({
    starlife_main: 0,
    zen_spiritual: 0,
    crystal_esoteric: 0,
    balanced_both: 0,
    lightbulb_hints: 0,
    envelope_verification: 0,
  });

  // Disciplinas y signos zodiacales
  disciplinas: Disciplina[] = [
    {
      id: 'tarot',
      name: 'Tarot',
      icon: '🔮',
      description: 'Lectura de cartas',
    },
    {
      id: 'astrologia',
      name: 'Astrología',
      icon: '⭐',
      description: 'Influencia astral',
    },
    {
      id: 'numerologia',
      name: 'Numerología',
      icon: '🔢',
      description: 'Poder de números',
    },
    {
      id: 'runas',
      name: 'Runas',
      icon: '🪨',
      description: 'Símbolos antiguos',
    },
    {
      id: 'cristales',
      name: 'Cristales',
      icon: '💎',
      description: 'Energía mineral',
    },
    {
      id: 'meditacion',
      name: 'Meditación',
      icon: '🧘',
      description: 'Paz interior',
    },
    {
      id: 'chakras',
      name: 'Chakras',
      icon: '🌈',
      description: 'Centros energéticos',
    },
    {
      id: 'reiki',
      name: 'Reiki',
      icon: '✋',
      description: 'Sanación energética',
    },
    {
      id: 'adivinacion',
      name: 'Adivinación',
      icon: '🔭',
      description: 'Predicción',
    },
    {
      id: 'brujeria',
      name: 'Brujería',
      icon: '🌙',
      description: 'Artes mágicas',
    },
  ];

  signosZodiacales: { [key: string]: SignoZodiacal } = {
    aries: {
      name: 'Aries',
      icon: '♈',
      dates: [
        [3, 21],
        [4, 19],
      ],
    },
    tauro: {
      name: 'Tauro',
      icon: '♉',
      dates: [
        [4, 20],
        [5, 20],
      ],
    },
    geminis: {
      name: 'Géminis',
      icon: '♊',
      dates: [
        [5, 21],
        [6, 20],
      ],
    },
    cancer: {
      name: 'Cáncer',
      icon: '♋',
      dates: [
        [6, 21],
        [7, 22],
      ],
    },
    leo: {
      name: 'Leo',
      icon: '♌',
      dates: [
        [7, 23],
        [8, 22],
      ],
    },
    virgo: {
      name: 'Virgo',
      icon: '♍',
      dates: [
        [8, 23],
        [9, 22],
      ],
    },
    libra: {
      name: 'Libra',
      icon: '♎',
      dates: [
        [9, 23],
        [10, 22],
      ],
    },
    escorpio: {
      name: 'Escorpio',
      icon: '♏',
      dates: [
        [10, 23],
        [11, 21],
      ],
    },
    sagitario: {
      name: 'Sagitario',
      icon: '♐',
      dates: [
        [11, 22],
        [12, 21],
      ],
    },
    capricornio: {
      name: 'Capricornio',
      icon: '♑',
      dates: [
        [12, 22],
        [1, 19],
      ],
    },
    acuario: {
      name: 'Acuario',
      icon: '♒',
      dates: [
        [1, 20],
        [2, 18],
      ],
    },
    piscis: {
      name: 'Piscis',
      icon: '♓',
      dates: [
        [2, 19],
        [3, 20],
      ],
    },
  };

  // Estados computados
  passwordStrength = signal<{
    level: 'weak' | 'medium' | 'strong';
    percentage: number;
    feedback: string[];
  }>({
    level: 'weak',
    percentage: 0,
    feedback: [],
  });

  calculatedZodiacSign = signal<{ name: string; icon: string } | null>(null);
  selectedDisciplinesCount = signal<number>(0);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
    // private authService: AuthService, // Inyectar cuando esté disponible
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.initializeComponent();
    this.setupRouteParams();
    this.trackPageView();

    // Asegurar que el contador de disciplinas esté sincronizado
    this.selectedDisciplinesCount.set(
      this.credentials().disciplinasInteres.length
    );

    // 🆕 Inicializar tracking de iconos profesionales
    this.initializeProfessionalIconTracking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearResendTimer();
  }


  // ============ 🆕 MÉTODOS PARA ICONOS PROFESIONALES ============

  private initializeProfessionalIconTracking(): void {
    if (!this.isBrowser) return;

    // Track cuando se muestran los iconos profesionales (solo una vez)
    this.trackUserInteraction('professional_icons_loaded', {
      icons: [
        'star-of-life_main',
        'spa_zen_spiritual',
        'gem_crystal_esoteric',
        'star-of-life_balanced',
        'lightbulb_hints',
        'envelope_verification',
      ],
      timestamp: new Date().toISOString(),
    });
  }

  private onIconInteraction(iconType: string): void {
    // Incrementar contador de interacciones
    const current = this.iconInteractions();
    current[iconType] = (current[iconType] || 0) + 1;
    this.iconInteractions.set({ ...current });

    // Track la interacción
    this.trackUserInteraction('professional_icon_interaction', {
      iconType,
      interactions: current[iconType],
      timestamp: new Date().toISOString(),
    });

    // Log para debugging
    console.log(`🎨 Interacción con icono profesional: ${iconType}`, current);
  }

  // 🆕 Método para debugging de iconos profesionales
  debugProfessionalIcons(): void {
    if (!this.isBrowser) return;

    const iconElements = {
      mainStarLife: document.querySelector(
        '.mystical-starlife-icon'
      ) as HTMLElement,
      zen: document.querySelector('.zen-icon') as HTMLElement,
      crystal: document.querySelector('.crystal-radio-icon') as HTMLElement,
      balanced: document.querySelector('.balanced-star-icon') as HTMLElement,
      hints: document.querySelectorAll(
        '.hint-bulb-icon, .hint-bulb-icon-small'
      ),
      envelope: document.querySelector(
        '.mystical-envelope-icon'
      ) as HTMLElement,
      sparkles: document.querySelectorAll(
        '.sparkle-secondary, .verification-sparkle-icon'
      ),
    };

    console.log('🔍 Debug de Iconos Profesionales:', {
      elements: iconElements,
      interactions: this.iconInteractions(),
      styles: {
        mainIcon: iconElements.mainStarLife
          ? getComputedStyle(iconElements.mainStarLife)
          : null,
        zenIcon: iconElements.zen ? getComputedStyle(iconElements.zen) : null,
      },
      animations: {
        mainIcon: iconElements.mainStarLife?.style?.animation || 'none',
        zen: iconElements.zen?.style?.animation || 'none',
        crystal: iconElements.crystal?.style?.animation || 'none',
        balanced: iconElements.balanced?.style?.animation || 'none',
        envelope: iconElements.envelope?.style?.animation || 'none',
      },
      computed_styles: {
        mainIcon: iconElements.mainStarLife
          ? getComputedStyle(iconElements.mainStarLife).animation
          : 'none',
        zen: iconElements.zen
          ? getComputedStyle(iconElements.zen).animation
          : 'none',
      },
    });
  }

  // 🆕 Método para verificar si los iconos están renderizados correctamente
  validateProfessionalIcons(): boolean {
    if (!this.isBrowser) return false;

    const requiredIcons = [
      '.mystical-starlife-icon',
      '.zen-icon',
      '.crystal-radio-icon',
      '.balanced-star-icon',
      '.hint-bulb-icon',
      '.mystical-envelope-icon',
    ];

    const missingIcons: string[] = [];

    requiredIcons.forEach((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        missingIcons.push(selector);
      }
    });

    if (missingIcons.length > 0) {
      console.warn('⚠️ Iconos profesionales faltantes:', missingIcons);
      // 🔥 REMOVIDO: No llamar trackUserInteraction aquí para evitar loop infinito
    }

    return missingIcons.length === 0;
  }

  // ============ INICIALIZACIÓN ============

  private initializeComponent(): void {
    // Pre-llenar email si viene de query params
    const email = this.route.snapshot.queryParams['email'];
    if (email) {
      this.credentials.update((cred) => ({ ...cred, email }));
    }

    // Inicializar estado de errores
    this.clearAllErrors();
  }

  private setupRouteParams(): void {
    // Tracking de origen
    const source = this.route.snapshot.queryParams['source'];
    if (source) {
      this.trackUserInteraction('register_page_view', { source });
    }
  }

  private trackPageView(): void {
    this.trackUserInteraction('register_page_view', {
      timestamp: new Date().toISOString(),
      // 🆕 Incluir información sobre iconos profesionales
      professional_icons_enabled: true,
      icon_system_version: '2.0_professional',
    });
  }

  // ============ VALIDACIONES ============

  private validateField(fieldName: keyof RegisterCredentials): string {
    const creds = this.credentials();

    switch (fieldName) {
      case 'nombre':
        if (!creds.nombre.trim()) return 'El nombre es requerido';
        if (creds.nombre.trim().length < 2)
          return 'El nombre debe tener al menos 2 caracteres';
        return '';

      case 'apellido':
        if (!creds.apellido.trim()) return 'El apellido es requerido';
        if (creds.apellido.trim().length < 2)
          return 'El apellido debe tener al menos 2 caracteres';
        return '';

      case 'email':
        if (!creds.email.trim()) return 'El email es requerido';
        if (!this.isValidEmail(creds.email)) return 'Ingresa un email válido';
        return '';

      case 'password':
        if (!creds.password) return 'La contraseña es requerida';
        if (creds.password.length < 6)
          return 'La contraseña debe tener al menos 6 caracteres';
        return '';

      case 'confirmPassword':
        if (!creds.confirmPassword) return 'Confirma tu contraseña';
        if (creds.confirmPassword !== creds.password)
          return 'Las contraseñas no coinciden';
        return '';

      case 'tipoPerfil':
        if (!creds.tipoPerfil) return 'Selecciona un tipo de perfil';
        return '';

      case 'acceptTerms':
        if (!creds.acceptTerms)
          return 'Debes aceptar los términos y condiciones';
        return '';

      default:
        return '';
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ============ PASSWORD STRENGTH CALCULATION - CORREGIDO ============
  private calculatePasswordStrength(password: string): void {
    console.log('🔍 Calculando fortaleza para:', password);

    if (!password) {
      this.passwordStrength.set({ level: 'weak', percentage: 0, feedback: [] });
      console.log('❌ Contraseña vacía, percentage: 0');
      return;
    }

    let strength = 0;
    const feedback: string[] = [];

    // Criterios de fortaleza
    if (password.length >= 8) {
      strength += 25;
      console.log('✅ +25 por longitud >= 8');
    } else {
      feedback.push('mínimo 8 caracteres');
      console.log('❌ Falta longitud mínima');
    }

    if (/[A-Z]/.test(password)) {
      strength += 25;
      console.log('✅ +25 por mayúscula');
    } else {
      feedback.push('una mayúscula');
      console.log('❌ Falta mayúscula');
    }

    if (/[a-z]/.test(password)) {
      strength += 25;
      console.log('✅ +25 por minúscula');
    } else {
      feedback.push('una minúscula');
      console.log('❌ Falta minúscula');
    }

    if (/[\d\W]/.test(password)) {
      strength += 25;
      console.log('✅ +25 por número/símbolo');
    } else {
      feedback.push('un número o símbolo');
      console.log('❌ Falta número/símbolo');
    }

    let level: 'weak' | 'medium' | 'strong' = 'weak';
    if (strength >= 75) level = 'strong';
    else if (strength >= 50) level = 'medium';

    console.log('🎯 Resultado final - Level:', level, 'Percentage:', strength);

    this.passwordStrength.set({ level, percentage: strength, feedback });
  }

  private calculateZodiacSign(birthDate: string): void {
    if (!birthDate) {
      this.calculatedZodiacSign.set(null);
      return;
    }

    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const [sign, data] of Object.entries(this.signosZodiacales)) {
      const [[startMonth, startDay], [endMonth, endDay]] = data.dates;

      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        this.calculatedZodiacSign.set({ name: data.name, icon: data.icon });
        this.credentials.update((cred) => ({ ...cred, signoZodiacal: sign }));
        return;
      }
    }

    this.calculatedZodiacSign.set(null);
  }

  // ============ EVENT HANDLERS - CORREGIDOS ============

  onFieldChange(fieldName: keyof RegisterCredentials, value: any): void {
    // Asegurar que el valor no sea null o undefined
    const safeValue = value ?? '';

    console.log('🔄 Campo cambiado:', fieldName, '→', safeValue);

    this.credentials.update((cred) => ({ ...cred, [fieldName]: safeValue }));

    // Validaciones específicas
    if (fieldName === 'password') {
      console.log('🔐 Es campo password, calculando fortaleza...');
      this.calculatePasswordStrength(safeValue);
      // Re-validar confirmPassword si ya fue tocado
      if (this.formTouched()[`confirmPassword`]) {
        this.onFieldBlur('confirmPassword');
      }
    }

    if (fieldName === 'fechaNacimiento') {
      this.calculateZodiacSign(safeValue);
    }

    // Limpiar error si el campo ya fue tocado
    if (this.formTouched()[fieldName]) {
      const error = this.validateField(fieldName);
      this.setFieldError(fieldName, error);
    }
  }

  // Helper functions para manejar eventos de input
  onInputChange(event: Event, fieldName: keyof RegisterCredentials): void {
    const target = event.target as HTMLInputElement | null;
    const value = target?.value || '';
    console.log('📝 Input change event:', fieldName, '→', value);
    this.onFieldChange(fieldName, value);
  }

  onCheckboxToggle(
    event: Event,
    checkboxName: 'acceptTerms' | 'acceptMarketing'
  ): void {
    const target = event.target as HTMLInputElement | null;
    const checked = target?.checked || false;
    this.onCheckboxChange(checkboxName, checked);
  }

  onFieldBlur(fieldName: keyof RegisterCredentials): void {
    this.setFieldTouched(fieldName, true);
    const error = this.validateField(fieldName);
    this.setFieldError(fieldName, error);

    this.trackUserInteraction(`${fieldName}_field_blur`, {
      hasValue: !!this.credentials()[fieldName],
      isValid: !error,
    });
  }

  onProfileSelect(profile: 'espiritual' | 'esoterico' | 'ambos'): void {
    console.log('Profile selected:', profile); // Debug
    this.credentials.update((cred) => ({ ...cred, tipoPerfil: profile }));
    this.clearFieldError('tipoPerfil');

    // 🆕 Track interacción con iconos profesionales según perfil
    let iconType = '';
    switch (profile) {
      case 'espiritual':
        iconType = 'zen_spiritual';
        break;
      case 'esoterico':
        iconType = 'crystal_esoteric';
        break;
      case 'ambos':
        iconType = 'balanced_both';
        break;
    }

    this.trackUserInteraction('profile_type_selected', {
      profile,
      professional_icon_used: iconType,
      timestamp: new Date().toISOString(),
    });

    // Track la interacción específica del icono
    if (iconType) {
      this.onIconInteraction(iconType);
    }
  }

  onDisciplineToggle(disciplineId: string): void {
    console.log('Discipline toggled:', disciplineId); // Debug
    const current = this.credentials().disciplinasInteres;
    let updated: string[];

    if (current.includes(disciplineId)) {
      // Deseleccionar
      updated = current.filter((id) => id !== disciplineId);
    } else if (current.length < 3) {
      // Seleccionar (máximo 3)
      updated = [...current, disciplineId];
    } else {
      // Ya hay 3 seleccionadas, no hacer nada
      return;
    }

    this.credentials.update((cred) => ({
      ...cred,
      disciplinasInteres: updated,
    }));
    this.selectedDisciplinesCount.set(updated.length);

    console.log('Updated disciplines:', updated); // Debug

    this.trackUserInteraction('discipline_selected', {
      discipline: disciplineId,
      action: current.includes(disciplineId) ? 'deselect' : 'select',
      totalSelected: updated.length,
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword.update((show) => !show);
    } else {
      this.showConfirmPassword.update((show) => !show);
    }

    this.trackUserInteraction('password_visibility_toggle', { field });
  }

  onCheckboxChange(
    checkboxName: 'acceptTerms' | 'acceptMarketing',
    checked: boolean | null
  ): void {
    // Asegurar que el valor sea boolean
    const safeChecked = checked ?? false;

    this.credentials.update((cred) => ({
      ...cred,
      [checkboxName]: safeChecked,
    }));

    if (checkboxName === 'acceptTerms') {
      this.clearFieldError('acceptTerms');
    }

    this.trackUserInteraction('checkbox_change', {
      checkbox: checkboxName,
      checked: safeChecked,
    });
  }

  // ============ FORM SUBMISSION ============

  async onSubmit(): Promise<void> {
    this.isSubmitted.set(true);

    // Validar todos los campos
    if (!this.validateAllFields()) {
      this.trackUserInteraction('register_validation_failed', {
        errors: this.formErrors(),
      });
      return;
    }

    this.isLoading.set(true);

    try {
      this.trackUserInteraction('register_attempt', {
        profile: this.credentials().tipoPerfil,
        disciplines: this.credentials().disciplinasInteres,
        hasZodiacSign: !!this.calculatedZodiacSign(),
        acceptMarketing: this.credentials().acceptMarketing,
        // 🆕 Incluir información de iconos profesionales
        professional_icons_interactions: this.iconInteractions(),
        icon_system_version: '2.0_professional',
      });

      const result = await this.performRegistration(this.credentials());

      if (result.success) {
        await this.handleRegistrationSuccess(result);
      } else {
        this.handleRegistrationError(result);
      }
    } catch (error) {
      this.handleRegistrationError({
        success: false,
        message: 'Error de conexión. Por favor, intenta de nuevo.',
      });

      this.trackUserInteraction('register_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateAllFields(): boolean {
    const requiredFields: (keyof RegisterCredentials)[] = [
      'nombre',
      'apellido',
      'email',
      'password',
      'confirmPassword',
      'tipoPerfil',
      'acceptTerms',
    ];

    let isValid = true;
    const errors: { [key: string]: string } = {};

    requiredFields.forEach((field) => {
      const error = this.validateField(field);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    this.formErrors.set(errors);
    return isValid;
  }

  private async performRegistration(
    credentials: RegisterCredentials
  ): Promise<RegisterResponse> {
    // Aquí iría la llamada real al AuthService
    // return this.authService.register(credentials);

    // Simulación para demo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular verificación de email duplicado
        if (credentials.email === 'test@example.com') {
          resolve({
            success: false,
            message: 'Este email ya está registrado',
            errors: [{ field: 'email', message: 'Este email ya está en uso' }],
          });
        } else {
          resolve({
            success: true,
            user: {
              id: Date.now().toString(),
              email: credentials.email,
              nombre: credentials.nombre,
              apellido: credentials.apellido,
              tipoPerfil: credentials.tipoPerfil,
            },
          });
        }
      }, 2500);
    });
  }

  // ============ MÉTODO CORREGIDO - handleRegistrationSuccess ============
  private async handleRegistrationSuccess(
    result: RegisterResponse
  ): Promise<void> {
    this.trackUserInteraction('register_success', {
      userId: result.user?.id,
      profile: this.credentials().tipoPerfil,
      disciplines: this.credentials().disciplinasInteres.length,
      // 🆕 Track iconos profesionales usados
      professional_icons_interactions: this.iconInteractions(),
    });

    // Track específicamente la transición a verificación con icono profesional
    this.onIconInteraction('envelope_verification');

    // Mostrar sección de verificación de email
    this.showEmailVerification.set(true);

    // Simular envío de código
    console.log(
      '📧 Código de verificación enviado a:',
      this.credentials().email
    );

    // Limpiar estados del formulario
    this.isLoading.set(false);
    this.isSubmitted.set(false);

    // 🔥 FOCUS AUTOMÁTICO AL PRIMER INPUT - SOLUCIÓN PRINCIPAL
    this.focusFirstCodeInput();
  }

  private focusFirstCodeInput(): void {
    setTimeout(() => {
      if (this.isBrowser) {
        const firstInput = document.querySelector(
          '.code-input'
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
          console.log('🎯 Auto-focus aplicado al primer input de código');
        }
      }
    }, 100); // Aumenté el delay para dar más tiempo al render
  }

  private handleRegistrationError(result: RegisterResponse): void {
    // Manejar errores específicos de campos
    if (result.errors) {
      const errors: { [key: string]: string } = {};
      result.errors.forEach((error) => {
        errors[error.field] = error.message;
      });
      this.formErrors.set(errors);
    }

    this.trackUserInteraction('register_failed', {
      error: result.message,
      fieldErrors: result.errors,
    });
  }

  // ============ MÉTODO MEJORADO - onCodeDigitInput ============
  onCodeDigitInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const digit = target.value.replace(/[^0-9]/g, '').slice(-1);

    target.value = digit;

    // Actualizar signal
    const currentCode = [...this.verificationCode()];
    currentCode[index] = digit;
    this.verificationCode.set(currentCode);

    // 🔥 FORZAR actualización con detección manual
    setTimeout(() => {
      const realCount = this.getFilledDigits();
      this.filledDigitsCount.set(realCount);
      this.cdr.detectChanges(); // 🆕 FORZAR detección de cambios
      console.log(
        '📊 Barra actualizada a:',
        realCount,
        '%:',
        (realCount / 6) * 100
      );
    }, 10);

    // Limpiar errores
    if (this.verificationError()) {
      this.verificationError.set('');
    }

    // Focus al siguiente
    if (digit && index < 5) {
      const nextInput = document.querySelector(
        `input[data-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }

    // AUTO-VERIFICACIÓN cuando se completan los 6 dígitos
    if (digit && currentCode.every((d) => d !== '')) {
      setTimeout(() => this.onVerifyCode(), 500);
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

      setTimeout(() => {
        const realCount = this.getFilledDigits();
        this.filledDigitsCount.set(realCount);
        this.cdr.detectChanges(); // 🆕 FORZAR detección
      }, 10);

      // 🆕 ACTUALIZAR: Forzar actualización del contador
      const filledCount = this.getFilledDigits();
      this.filledDigitsCount.set(filledCount);

      if (this.verificationError()) {
        this.verificationError.set('');
      }
      return;
    }
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

    // Limpiar errores
    if (this.verificationError()) {
      this.verificationError.set('');
    }

    // Auto-verificar si está completo
    if (digits.length === 6) {
      setTimeout(() => this.onVerifyCode(), 500);
    }
  }

  ngAfterViewInit(): void {
    // Simplificar la lógica de ViewChildren
    if (this.codeInputs) {
      this.codeInputs.changes.subscribe(() => {
        if (this.showEmailVerification() && this.codeInputs.length > 0) {
          this.focusFirstCodeInput();
        }
      });
    }

    // 🆕 Validar iconos profesionales UNA SOLA VEZ después del render (sin loop)
    setTimeout(() => {
      const iconsValid = this.validateProfessionalIcons();
      if (iconsValid) {
        console.log('✅ Todos los iconos profesionales cargados correctamente');
      }
    }, 3000); // Dar más tiempo para que se carguen todos los elementos
  }

  onCodeInputFocus(index: number): void {
    const input = document.querySelectorAll('.code-input')[
      index
    ] as HTMLInputElement;
    if (!input) return;

    // Seleccionar el contenido si existe
    if (input.value) {
      setTimeout(() => {
        input.select();
      }, 1);
    }
  }

  private syncInputsWithCode(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const allInputs = document.querySelectorAll(
        '.code-input'
      ) as NodeListOf<HTMLInputElement>;
      const currentCode = this.verificationCode();

      allInputs.forEach((input, index) => {
        if (input.value !== currentCode[index]) {
          input.value = currentCode[index];
        }
      });
    }, 10);
  }

  clearVerificationCode(): void {
    this.verificationCode.set(['', '', '', '', '', '']);
    this.verificationError.set('');
    this.filledDigitsCount.set(0); // 🆕 AGREGAR

    // Limpiar TODOS los inputs del DOM
    for (let i = 0; i < 6; i++) {
      const input = document.querySelector(
        `input[data-index="${i}"]`
      ) as HTMLInputElement;
      if (input) {
        input.value = '';
      }
    }
  }

  async onVerifyCode(): Promise<void> {
    if (!this.isCodeComplete() || this.isVerifying()) return;

    const code = this.verificationCode().join('');
    this.isVerifying.set(true);
    this.verificationError.set('');

    try {
      this.trackUserInteraction('verification_attempt', {
        code: code.length,
        // 🆕 Track icono profesional usado
        professional_verification_icon: true,
      });

      const result = await this.verifyEmailCode(code);

      if (result.success) {
        this.verificationSuccess.set(true);

        this.trackUserInteraction('verification_success', {
          code: code.length,
          attempts: 1, // Se podría trackear intentos
          // 🆕 Track éxito con iconos profesionales
          professional_icons_experience: this.iconInteractions(),
        });

        // Simular proceso de creación de cuenta completa
        setTimeout(() => {
          this.router
            .navigate(['/dashboard'], {
              queryParams: { welcome: 'true' },
            })
            .catch((err) => {
              console.error('Error en redirección:', err);
              this.router.navigate(['/auth/login']);
            });
        }, 2000);
      } else {
        this.verificationError.set(
          result.message || 'Código incorrecto. Inténtalo de nuevo.'
        );
        this.shakeCodeInputs();

        this.trackUserInteraction('verification_failed', {
          error: result.message,
        });
      }
    } catch (error) {
      this.verificationError.set(
        'Error de conexión. Por favor, intenta de nuevo.'
      );
      this.shakeCodeInputs();

      this.trackUserInteraction('verification_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.isVerifying.set(false);
    }
  }

  async onResendCode(): Promise<void> {
    if (this.resendCooldown() > 0 || this.isResending()) return;

    this.isResending.set(true);
    this.verificationError.set('');

    try {
      this.trackUserInteraction('resend_code_attempt', {
        // 🆕 Track icono profesional
        professional_envelope_icon: true,
      });

      const result = await this.resendVerificationCode();

      if (result.success) {
        // Limpiar código actual
        this.clearVerificationCode();

        // Iniciar cooldown
        this.startResendCooldown();

        // Focus al primer input después de que Angular actualice la vista
        setTimeout(() => {
          this.focusFirstCodeInput();
        }, 100);

        this.trackUserInteraction('resend_code_success');
      } else {
        this.verificationError.set(
          result.message || 'Error al reenviar código.'
        );
        this.trackUserInteraction('resend_code_failed', {
          error: result.message,
        });
      }
    } catch (error) {
      this.verificationError.set(
        'Error de conexión. Por favor, intenta de nuevo.'
      );
      this.trackUserInteraction('resend_code_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      this.isResending.set(false);
    }
  }

  onBackToEdit(): void {
    this.showEmailVerification.set(false);
    this.clearVerificationCode();
    this.verificationSuccess.set(false);
    this.isVerifying.set(false);
    this.isResending.set(false);
    this.clearResendTimer();

    // Focus al campo email cuando regrese al formulario
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      if (emailInput) {
        emailInput.focus();
        emailInput.select();
      }
    }, 100);

    this.trackUserInteraction('back_to_edit_form');
  }

  // ============ EMAIL VERIFICATION UTILITIES ============

  private async verifyEmailCode(
    code: string
  ): Promise<{ success: boolean; message?: string }> {
    // Simulación para demo - aquí iría la llamada real al backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Código correcto para demo: 123456
        if (code === '123456') {
          resolve({ success: true });
        } else {
          resolve({
            success: false,
            message: 'Código incorrecto. El código demo es: 123456',
          });
        }
      }, 2000);
    });
  }

  private async resendVerificationCode(): Promise<{
    success: boolean;
    message?: string;
  }> {
    // Simulación para demo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1500);
    });
  }

  private shakeCodeInputs(): void {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach((input) => {
      input.classList.add('error');
      setTimeout(() => {
        input.classList.remove('error');
      }, 600);
    });
  }

  private startResendCooldown(): void {
    this.clearResendTimer();
    this.resendCooldown.set(60); // 60 segundos

    this.resendTimer = window.setInterval(() => {
      const current = this.resendCooldown();
      if (current <= 1) {
        this.clearResendTimer();
      } else {
        this.resendCooldown.set(current - 1);
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
    }
    this.resendCooldown.set(0);
  }

  // ============ EMAIL VERIFICATION GETTERS ============

  getFilledDigits(): number {
    let filledCount = 0;

    // Debug: verificar que encontramos los inputs
    for (let i = 0; i < 6; i++) {
      const input = document.querySelector(
        `input[data-index="${i}"]`
      ) as HTMLInputElement;
      console.log(`Input ${i}:`, input, 'Value:', input?.value); // Debug

      if (input && input.value.trim() !== '') {
        filledCount++;
      }
    }

    console.log('🔢 Total filled:', filledCount); // Debug
    return filledCount;
  }

  isCodeComplete(): boolean {
    // Verificar que todos los inputs DOM tengan valor
    for (let i = 0; i < 6; i++) {
      const input = document.querySelector(
        `input[data-index="${i}"]`
      ) as HTMLInputElement;
      if (!input || input.value.trim() === '') {
        return false;
      }
    }
    return true;
  }

  hasVerificationError(): boolean {
    return !!this.verificationError();
  }

  debugCodeState(): void {
    const domInputs = document.querySelectorAll(
      '.code-input'
    ) as NodeListOf<HTMLInputElement>;
    const domValues = Array.from(domInputs).map((input) => input.value);

    console.log('🐛 Estado completo del código:', {
      signal: this.verificationCode(),
      domValues: domValues,
      filled: this.getFilledDigits(),
      complete: this.isCodeComplete(),
      mismatch: this.verificationCode().some(
        (digit, i) => digit !== domValues[i]
      ),
      // 🆕 Incluir estado de iconos profesionales (simplificado)
      professional_icons: this.iconInteractions(),
    });

    // Si hay un mismatch, forzar sincronización
    const signalValues = this.verificationCode();
    if (signalValues.some((digit, i) => digit !== domValues[i])) {
      console.log('🔄 Sincronizando valores...');
      // Forzar re-render de Angular
      this.verificationCode.set([...signalValues]);
    }

    // 🔧 Debug de iconos comentado para optimización
    // this.debugProfessionalIcons();
  }

  // ============ SOCIAL REGISTRATION ============

  onSocialRegister(provider: 'google' | 'facebook'): void {
    if (this.isLoading()) return;

    this.trackUserInteraction('social_register_attempt', {
      provider,
      // 🆕 Track que se usaron iconos profesionales en el proceso
      professional_icons_before_social: this.iconInteractions(),
    });

    // Implementar registro social
    this.performSocialRegistration(provider);
  }

  private performSocialRegistration(provider: string): void {
    if (!this.isBrowser) return;

    try {
      // Aquí iría la implementación real del registro social
      console.log(`Iniciando registro con ${provider}...`);

      // Para demo, simular proceso
      alert(`Registro con ${provider} no implementado en demo`);
    } catch (error) {
      console.error(`Error en registro social con ${provider}:`, error);
      this.trackUserInteraction('social_register_error', { provider, error });
    }
  }

  // ============ NAVEGACIÓN ============

  onBackToHome(): void {
    this.trackUserInteraction('back_to_home_click', {
      // 🆕 Track iconos usados antes de salir
      professional_icons_interactions: this.iconInteractions(),
    });
    this.router.navigate(['/']).catch((err) => {
      console.error('Error navegando al inicio:', err);
    });
  }

  onGoToLogin(): void {
    this.trackUserInteraction('go_to_login_click', {
      // 🆕 Track iconos usados antes de ir a login
      professional_icons_interactions: this.iconInteractions(),
    });

    // Preservar email si ya fue ingresado
    const email = this.credentials().email;
    const queryParams = email ? { email } : {};

    this.router.navigate(['/auth/login'], { queryParams }).catch((err) => {
      console.error('Error navegando a login:', err);
    });
  }

  // ============ UTILIDADES ============

  private setFieldTouched(field: string, touched: boolean): void {
    this.formTouched.update((current) => ({ ...current, [field]: touched }));
  }

  private setFieldError(field: string, error: string): void {
    const currentErrors = this.formErrors();
    if (error) {
      this.formErrors.set({ ...currentErrors, [field]: error });
    } else {
      const { [field]: removed, ...rest } = currentErrors;
      this.formErrors.set(rest);
    }
  }

  private clearFieldError(field: string): void {
    this.setFieldError(field, '');
  }

  private clearAllErrors(): void {
    this.formErrors.set({});
  }

  // ============ GETTERS - CORREGIDOS ============

  getFieldError(field: string): string {
    return this.formErrors()[field] || '';
  }

  hasFieldError(field: string): boolean {
    return (
      !!this.getFieldError(field) &&
      (this.formTouched()[field] || this.isSubmitted())
    );
  }

  isFormValid(): boolean {
    return this.validateAllFields();
  }

  getDisciplineById(id: string): Disciplina | undefined {
    return this.disciplinas.find((d) => d.id === id);
  }

  isDisciplineSelected(id: string): boolean {
    return this.credentials().disciplinasInteres.includes(id);
  }

  canSelectMoreDisciplines(): boolean {
    return this.credentials().disciplinasInteres.length < 3;
  }

  getPasswordStrengthClass(): string {
    const strength = this.passwordStrength();
    const className = `strength-${strength.level}`;
    console.log(
      '🎨 CSS Class:',
      className,
      'Level:',
      strength.level,
      'Percentage:',
      strength.percentage
    );
    return className;
  }

  getPasswordStrengthText(): string {
    const strength = this.passwordStrength();
    console.log('📝 Strength text for:', strength);

    if (strength.percentage === 100) {
      return '¡Excelente! Contraseña muy segura';
    } else if (strength.percentage >= 75) {
      return 'Buena - Casi perfecta';
    } else if (strength.percentage >= 50) {
      return `Medio - Necesita: ${strength.feedback.join(', ')}`;
    } else if (strength.percentage > 0) {
      return `Débil - Necesita: ${strength.feedback.join(', ')}`;
    }
    return '';
  }

  // ============ ANALYTICS Y TRACKING ============

  private trackUserInteraction(action: string, details: any = {}): void {
    if (!this.isBrowser) return;

    const eventData = {
      action,
      page: 'register',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'SSR',
      viewport: this.getViewportSize(),
      formProgress: this.calculateFormProgress(),
      // 🆕 Información de iconos profesionales (SIN validación automática para evitar loops)
      professional_icons_system: '2.0',
      professional_icons_interactions: this.iconInteractions(),
      ...details,
    };

    console.log('📊 Register Analytics Event:', eventData);

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

  private calculateFormProgress(): number {
    const creds = this.credentials();
    const requiredFields = [
      'nombre',
      'apellido',
      'email',
      'password',
      'confirmPassword',
      'tipoPerfil',
      'acceptTerms',
    ];
    const completedFields = requiredFields.filter((field) => {
      const value = creds[field as keyof RegisterCredentials];
      return value !== '' && value !== false;
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }

  // ============ ACCESIBILIDAD ============

  onKeyDown(event: KeyboardEvent): void {
    // Escape limpia errores
    if (event.key === 'Escape') {
      this.clearAllErrors();
    }

    // 🆕 Atajos para debugging de iconos profesionales (solo en desarrollo)
    if (event.key === 'F12' && event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      this.debugProfessionalIcons();
    }
  }

  // ============ CLEANUP ============

  private cleanup(): void {
    this.isLoading.set(false);
    this.clearAllErrors();
  }
}
