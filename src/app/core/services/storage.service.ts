import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Métodos para localStorage
  setItem(key: string, value: any): void {
    if (!this.isBrowser) return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error guardando en localStorage (${key}):`, error);
    }
  }

  getItem<T = any>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error leyendo de localStorage (${key}):`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removiendo de localStorage (${key}):`, error);
    }
  }

  clear(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
    }
  }

  // Métodos para sessionStorage
  setSessionItem(key: string, value: any): void {
    if (!this.isBrowser) return;

    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error guardando en sessionStorage (${key}):`, error);
    }
  }

  getSessionItem<T = any>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error leyendo de sessionStorage (${key}):`, error);
      return null;
    }
  }

  removeSessionItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removiendo de sessionStorage (${key}):`, error);
    }
  }

  // Métodos específicos para la aplicación
  saveAuthData(token: string, user: any): void {
    this.setItem('arcana_auth_token', token);
    this.setItem('arcana_user', user);
  }

  getAuthToken(): string | null {
    return this.getItem<string>('arcana_auth_token');
  }

  getUser(): any {
    return this.getItem('arcana_user');
  }

  clearAuthData(): void {
    this.removeItem('arcana_auth_token');
    this.removeItem('arcana_user');
    this.removeItem('arcana_remember_email');
  }

  saveRememberEmail(email: string): void {
    this.setItem('arcana_remember_email', email);
  }

  getRememberEmail(): string | null {
    return this.getItem<string>('arcana_remember_email');
  }

  // Verificar si hay datos de sesión válidos
  hasValidSession(): boolean {
    const token = this.getAuthToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Guardar configuraciones de usuario
  saveUserPreferences(preferences: any): void {
    this.setItem('arcana_user_preferences', preferences);
  }

  getUserPreferences(): any {
    return this.getItem('arcana_user_preferences') || {};
  }

  // Gestión de carrito (para la tienda)
  saveCart(items: any[]): void {
    this.setItem('arcana_cart', items);
  }

  getCart(): any[] {
    return this.getItem('arcana_cart') || [];
  }

  clearCart(): void {
    this.removeItem('arcana_cart');
  }

  // Gestión de favoritos
  saveFavorites(favorites: any[]): void {
    this.setItem('arcana_favorites', favorites);
  }

  getFavorites(): any[] {
    return this.getItem('arcana_favorites') || [];
  }

  addToFavorites(item: any): void {
    const favorites = this.getFavorites();
    if (!favorites.find(fav => fav.id === item.id)) {
      favorites.push(item);
      this.saveFavorites(favorites);
    }
  }

  removeFromFavorites(itemId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(fav => fav.id !== itemId);
    this.saveFavorites(filtered);
  }

  // Progreso de cursos
  saveCourseProgress(courseId: string, progress: any): void {
    const allProgress = this.getItem('arcana_course_progress') || {};
    allProgress[courseId] = progress;
    this.setItem('arcana_course_progress', allProgress);
  }

  getCourseProgress(courseId: string): any {
    const allProgress = this.getItem('arcana_course_progress') || {};
    return allProgress[courseId] || null;
  }

  // Utilidades
  getStorageSize(): { localStorage: number; sessionStorage: number } {
    if (!this.isBrowser) return { localStorage: 0, sessionStorage: 0 };

    let localStorageSize = 0;
    let sessionStorageSize = 0;

    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length + key.length;
        }
      }

      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          sessionStorageSize += sessionStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Error calculando tamaño de storage:', error);
    }

    return {
      localStorage: localStorageSize,
      sessionStorage: sessionStorageSize
    };
  }

  // Limpiar datos antiguos (llamar en inicialización de app)
  cleanupOldData(): void {
    if (!this.isBrowser) return;

    const keysToCheck = [
      'arcana_auth_token',
      'arcana_user',
      'arcana_course_progress'
    ];

    keysToCheck.forEach(key => {
      const data = this.getItem(key);
      if (data && data.timestamp) {
        const now = Date.now();
        const dataAge = now - data.timestamp;
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 días

        if (dataAge > maxAge) {
          this.removeItem(key);
          console.log(`Datos antiguos removidos: ${key}`);
        }
      }
    });
  }
}