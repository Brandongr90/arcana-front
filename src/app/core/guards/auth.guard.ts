import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageService } from '../services/storage.service'; // Asegúrate de que la ruta sea correcta
import { AuthModule } from '../../features/auth/auth.module';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private storageService = inject(StorageService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verificar si el usuario está autenticado
    if (this.isAuthenticated()) {
      return true;
    }

    // Si no está autenticado, redirigir al login con la URL de retorno
    this.router.navigate(['/auth/login'], {
      // 👈 CORREGIR RUTA
      queryParams: { returnUrl: state.url },
    });

    return false;
  }

  private isAuthenticated(): boolean {
    // En una aplicación real, verificarías el token con el backend
    // Para la demo, verificamos si existe un token válido

    try {
      const token = this.storageService.getItem('arcana_auth_token');
      const user = this.storageService.getItem('arcana_user');

      // Verificación simple para demo
      if (token && user) {
        // Verificar si el token no ha expirado (para demo, siempre válido)
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      return false;
    }
  }

  // Método auxiliar para verificar roles específicos (opcional)
  hasRole(requiredRole: string): boolean {
    try {
      const user = this.storageService.getItem('arcana_user');
      if (user && user.roles) {
        return user.roles.includes(requiredRole);
      }
      return false;
    } catch (error) {
      console.error('Error verificando rol:', error);
      return false;
    }
  }

  // Método para verificar suscripción activa (opcional)
  hasActiveSubscription(): boolean {
    try {
      const user = this.storageService.getItem('arcana_user');
      if (user && user.subscription) {
        const now = new Date();
        const subscriptionEnd = new Date(user.subscription.endDate);
        return subscriptionEnd > now && user.subscription.status === 'active';
      }
      return false;
    } catch (error) {
      console.error('Error verificando suscripción:', error);
      return false;
    }
  }
}
