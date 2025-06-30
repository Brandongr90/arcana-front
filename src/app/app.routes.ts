import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome/welcome.component').then(m => m.WelcomeComponent)
  },

  // Rutas de autenticación (sin guard)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Rutas del dashboard (protegidas con guard)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'camino-magico',
        loadComponent: () => import('./features/camino-magico/camino-magico.component').then(m => m.CaminoMagicoComponent)
      },
      {
        path: 'magia-esoterismo',
        loadComponent: () => import('./features/magia-esoterismo/magia-esoterismo.component').then(m => m.MagiaEsoterismoComponent)
      },
      {
        path: 'holistico-espiritualidad',
        loadComponent: () => import('./features/holistico-espiritualidad/holistico-espiritualidad.component').then(m => m.HolisticoEspiritualidadComponent)
      },
      {
        path: 'tarot',
        loadComponent: () => import('./features/tarot/tarot.component').then(m => m.TarotComponent)
      },
      // Rutas de SERVICIOS
      {
        path: 'fases-lunares',
        loadComponent: () => import('./features/fases-lunares/fases-lunares.component').then(m => m.FasesLunaresComponent)
      },
      {
        path: 'en-vivo',
        loadComponent: () => import('./features/en-vivo/en-vivo.component').then(m => m.EnVivoComponent)
      },
      {
        path: 'tienda',
        loadComponent: () => import('./features/tienda/tienda.component').then(m => m.TiendaComponent)
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'cursos-talleres',
        loadComponent: () => import('./features/cursos-talleres/cursos-talleres.component').then(m => m.CursosTalleresComponent)
      }
    ]
  },

  // Fallback para rutas no encontradas
  {
    path: '**',
    redirectTo: ''
  }
];