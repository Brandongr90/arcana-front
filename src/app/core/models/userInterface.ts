//! REGISTER COMPONENT INTERFACES

import { Component } from "@angular/core";

export interface RegisterCredentials {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  tipoPerfil: 'espiritual' | 'esoterico' | 'ambos' | '';
  disciplinasInteres: string[];
  fechaNacimiento: string;
  signoZodiacal?: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  user?: any;
  message?: string;
  errors?: ValidationError[];
}

export interface Disciplina {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SignoZodiacal {
  name: string;
  icon: string;
  dates: [[number, number], [number, number]];
}

//! DASHBOARD COMPONENT INTERFACES

export interface DashboardStats {
  completedCourses: number;
  totalCourses: number;
  upcomingAppointments: number;
  favoriteArticles: number;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: 'course' | 'article' | 'consultation' | 'tool';
  title: string;
  description: string;
  date: Date;
  icon: string;
}

//! FORGOT PASSWORD COMPONENT INTERFACES

export interface ForgotPasswordState {
  step: 'email' | 'code' | 'password';
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  errors?: ValidationError[];
}

//! REGISTER COMPONENT INTERFACES

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