// Interfaces para los datos de posts
export interface PostAuthor {
  id: string;
  name: string;
  avatar: string;
  zodiacSign: string;
  isOnline?: boolean;
}

export interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
  zodiacSign: string;
  isOnline?: boolean;
}

export interface CommentReply {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
}

export interface PostComment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  replies: CommentReply[];
  showAllReplies: boolean;
}

export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  image?: string;
  tags?: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  isLiked?: boolean;
  postComments: PostComment[];
  showComments: boolean;
  showAllComments: boolean;
}

// Interface exacta de la tabla articulos de la BD
export interface Articulo {
  id: string;
  bruja_id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  disciplina_id: string;
  imagen_destacada: string;
  slug: string;
  estado: 'borrador' | 'publicado' | 'archivado';
  fecha_publicacion: Date;
  visualizaciones: number;
  me_gusta: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Interface exacta de la tabla eventos de la BD
export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  ubicacion: string;
  url_evento: string;
  organizador_id: string;
  tipo_evento: 'webinar' | 'reunion' | 'retiro' | 'taller' | 'conferencia';
  disciplina_id: string;
  precio: number;
  cupo_maximo: number;
  imagen_evento: string;
  publico: boolean;
  activo: boolean;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Interface exacta de la tabla evento_participantes de la BD
export interface EventoParticipante {
  id: string;
  evento_id: string;
  usuario_id: string;
  fecha_inscripcion: Date;
  precio_pagado: number;
  estado: string;
}

// Interface exacta de la tabla citas de la BD
export interface Cita {
  id: string;
  bruja_id: string;
  usuario_id: string;
  fecha_hora_inicio: Date;
  fecha_hora_fin: Date;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  metodo: 'zoom' | 'jitsi' | 'phone' | 'presencial';
  url_reunion: string;
  precio_acordado: number;
  notas_bruja: string;
  notas_usuario: string;
  calificacion_bruja: number | null;
  comentario_calificacion: string;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Interface exacta de la tabla cursos de la BD
export interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  disciplina_id: string;
  nivel: 'principiante' | 'intermedio' | 'avanzado';
  tipo_contenido: 'video' | 'texto' | 'documento' | 'audio';
  imagen_portada: string;
  duracion_total_minutos: number;
  solo_suscripcion: boolean;
  precio_individual: number;
  activo: boolean;
  orden_visualizacion: number;
  fecha_creacion: Date;
  fecha_modificacion: Date;
}

// Interface exacta de la tabla progreso_lecciones de la BD
export interface ProgresoLeccion {
  id: string;
  usuario_id: string;
  leccion_id: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  porcentaje_completado: number;
  tiempo_visto_minutos: number;
  fecha_inicio: Date;
  fecha_ultimo_acceso: Date;
  fecha_completado: Date | null;
}

// Interface para combinar curso con progreso del usuario
export interface CursoConProgreso {
  curso: Curso;
  progreso: {
    porcentaje_completado: number;
    estado: 'pendiente' | 'en_progreso' | 'completada';
    fecha_ultimo_acceso: Date;
    fecha_completado: Date | null;
  };
}

// Interface para brujas (tabla relacionada)
export interface Bruja {
  id: string;
  usuario_id: string;
  biografia: string;
  especialidades: string[];
  calificacion_promedio: number;
  total_consultas: number;
  // Campos del usuario relacionado
  nombre: string;
  apellido: string;
  avatar_url: string;
  signo_zodiacal: string;
}

// Interface para organizadores (usuarios)
export interface Organizador {
  id: string;
  nombre: string;
  apellido: string;
  avatar_url: string;
  email: string;
  signo_zodiacal: string;
}

// Interface para disciplinas (tabla relacionada)
export interface Disciplina {
  id: string;
  nombre: string;
  descripcion: string;
  color_hex: string;
}

// Interface para los filtros
export interface FilterOption {
  value: 'posts' | 'articles' | 'events';
  label: string;
  icon: string;
}
