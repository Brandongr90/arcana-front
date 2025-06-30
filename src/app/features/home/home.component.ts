import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Articulo, Bruja, Cita, CommentReply, CursoConProgreso, Evento, FilterOption, Organizador, Post, PostAuthor, PostComment, CommentAuthor, Disciplina } from './home-interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  // Signals para manejar el estado
  posts = signal<Post[]>([]);
  articulos = signal<Articulo[]>([]);
  eventos = signal<Evento[]>([]);
  citas = signal<Cita[]>([]);
  cursosConProgreso = signal<CursoConProgreso[]>([]);
  isLoading = signal<boolean>(false);
  activeFilter = signal<'posts' | 'articles' | 'events'>('posts');

  // Opciones de filtro
  filterOptions: FilterOption[] = [
    {
      value: 'posts',
      label: 'Posts',
      icon: 'fas fa-comments'
    },
    {
      value: 'articles',
      label: 'Artículos',
      icon: 'fas fa-scroll'
    },
    {
      value: 'events',
      label: 'Eventos',
      icon: 'fas fa-calendar-alt'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Home Component iniciado');
    this.loadInitialPosts();
    this.loadInitialArticulos();
    this.loadInitialEventos();
    this.loadInitialCitas();
    this.loadInitialCursos();
  }

  // Cambiar filtro activo
  setActiveFilter(filter: 'posts' | 'articles' | 'events'): void {
    this.activeFilter.set(filter);
    console.log(`Filtro cambiado a: ${filter}`);
    
    // Aquí puedes cargar datos específicos según el filtro
    switch(filter) {
      case 'posts':
        this.loadPosts();
        break;
      case 'articles':
        this.loadArticles();
        break;
      case 'events':
        this.loadEvents();
        break;
    }
  }

  // Cargar posts iniciales (simulados)
  loadInitialPosts(): void {
    const mockPosts: Post[] = [
      {
        id: '1',
        author: {
          id: '1',
          name: 'Luna Mística',
          avatar: 'https://ix-marketing.imgix.net/focalpoint.png?auto=format,compress&w=1678',
          zodiacSign: '♓ Piscis',
          isOnline: true
        },
        content: 'Las energías de esta luna llena en Escorpio nos invitan a una profunda transformación. Es momento de soltar lo que ya no nos sirve y abrazar nuestro poder interior.',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
        likes: 24,
        comments: 0, // Se calculará dinámicamente
        isLiked: false,
        showComments: false,
        showAllComments: false,
        postComments: [
          {
            id: 'c1',
            author: {
              id: '4',
              name: 'Astro Sage',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♊ Géminis',
              isOnline: true
            },
            content: '¡Exactamente! Esta energía escorpiana es perfecta para el trabajo de sombras y la liberación emocional. Gracias por recordárnoslo <i class="hgi-stroke hgi-praying-hands"></i>',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 5,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r1',
                author: {
                  id: '1',
                  name: 'Luna Mística',
                  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♓ Piscis'
                },
                content: 'Así es, hermano del aire. Es momento de mergirse en las profundidades del ser <i class="hgi-stroke hgi-sparkles"></i>',
                createdAt: new Date(Date.now() - 45 * 60 * 1000),
                likes: 2,
                isLiked: true
              },
              {
                id: 'r2',
                author: {
                  id: '5',
                  name: 'Mystic Rose',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♏ Escorpio'
                },
                content: 'Como escorpiana, siento estas energías muy intensas. Perfect timing para mi ritual de renovación <i class="hgi-stroke hgi-moon-02"></i>',
                createdAt: new Date(Date.now() - 30 * 60 * 1000),
                likes: 3,
                isLiked: false
              },
              {
                id: 'r3',
                author: {
                  id: '11',
                  name: 'Shadow Walker',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♏ Escorpio'
                },
                content: 'Los scorpios estamos sintiendo esta energía desde hace días. Es momento de enfrentar nuestras sombras <i class="hgi-stroke hgi-bug-01"></i>',
                createdAt: new Date(Date.now() - 25 * 60 * 1000),
                likes: 7,
                isLiked: false
              }
            ]
          },
          {
            id: 'c2',
            author: {
              id: '6',
              name: 'Crystal Witch',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♍ Virgo'
            },
            content: 'He preparado un altar especial con obsidiana y granate para esta luna. ¿Alguien más está trabajando con piedras oscuras?',
            createdAt: new Date(Date.now() - 30 * 60 * 1000),
            likes: 8,
            isLiked: true,
            showAllReplies: false,
            replies: [
              {
                id: 'r4',
                author: {
                  id: '7',
                  name: 'Stone Guardian',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♑ Capricornio'
                },
                content: 'Turmalina negra y cuarzo ahumado aquí! Perfectos para la transmutación <i class="hgi-stroke hgi-diamond-01"></i>',
                createdAt: new Date(Date.now() - 20 * 60 * 1000),
                likes: 4,
                isLiked: false
              },
              {
                id: 'r5',
                author: {
                  id: '12',
                  name: 'Earth Mother',
                  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♉ Tauro'
                },
                content: 'Labradorita para la protección psíquica y hematita para el grounding. Esta combinación me tiene muy centrada <i class="hgi-stroke hgi-earth"></i>',
                createdAt: new Date(Date.now() - 18 * 60 * 1000),
                likes: 6,
                isLiked: true
              }
            ]
          },
          {
            id: 'c3',
            author: {
              id: '8',
              name: 'Lunar Oracle',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♋ Cáncer'
            },
            content: 'Hermosa reflexión. Las cartas me han estado hablando de transformación toda la semana <i class="hgi-stroke hgi-star"></i>',
            createdAt: new Date(Date.now() - 15 * 60 * 1000),
            likes: 3,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r6',
                author: {
                  id: '13',
                  name: 'Tarot Mystic',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♓ Piscis'
                },
                content: 'A mí me salió La Torre tres veces esta semana. Definitivamente algo grande se viene <i class="hgi-stroke hgi-lightning-01"></i>',
                createdAt: new Date(Date.now() - 12 * 60 * 1000),
                likes: 9,
                isLiked: true
              }
            ]
          },
          {
            id: 'c4',
            author: {
              id: '14',
              name: 'Moon Dancer',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♌ Leo',
              isOnline: true
            },
            content: 'Perfecto momento para un baño de luna con sal marina y aceites esenciales. Cleansing total! <i class="hgi-stroke hgi-bathtub-01"></i><i class="hgi-stroke hgi-moon-02"></i>',
            createdAt: new Date(Date.now() - 10 * 60 * 1000),
            likes: 12,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r7',
                author: {
                  id: '15',
                  name: 'Sea Witch',
                  avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♓ Piscis'
                },
                content: '¡Sal del Mar Muerto + lavanda + romero! Mi combo favorito para limpiezas energéticas profundas <i class="hgi-stroke hgi-salt"></i>',
                createdAt: new Date(Date.now() - 8 * 60 * 1000),
                likes: 5,
                isLiked: false
              }
            ]
          },
          {
            id: 'c5',
            author: {
              id: '16',
              name: 'Cosmic Dreamer',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♒ Acuario'
            },
            content: 'Mis sueños han estado súper vívidos desde que empezó esta fase lunar. Alguien más está experimentando sueños proféticos? <i class="hgi-stroke hgi-shooting-star"></i>',
            createdAt: new Date(Date.now() - 5 * 60 * 1000),
            likes: 15,
            isLiked: true,
            showAllReplies: false,
            replies: []
          },
          {
            id: 'c6',
            author: {
              id: '27',
              name: 'Shadow Healer',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♏ Escorpio'
            },
            content: 'Esta luna está perfecta para trabajar con el shadow work. He estado journaling sobre patrones que necesito liberar <i class="hgi-stroke hgi-note-03"></i><i class="hgi-stroke hgi-sparkles"></i>',
            createdAt: new Date(Date.now() - 3 * 60 * 1000),
            likes: 19,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r16',
                author: {
                  id: '28',
                  name: 'Inner Work',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♍ Virgo'
                },
                content: 'El journaling es tan poderoso para el shadow work. ¿Usas alguna técnica específica? <i class="hgi-stroke hgi-edit-02"></i>',
                createdAt: new Date(Date.now() - 2 * 60 * 1000),
                likes: 4,
                isLiked: true
              }
            ]
          },
          {
            id: 'c7',
            author: {
              id: '29',
              name: 'Ritual Queen',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♌ Leo',
              isOnline: true
            },
            content: 'Preparando mi ritual de liberación para esta noche. Velas negras, incienso de copal y mis intenciones bien claras <i class="hgi-stroke hgi-candle-02"></i>',
            createdAt: new Date(Date.now() - 1 * 60 * 1000),
            likes: 25,
            isLiked: true,
            showAllReplies: false,
            replies: []
          }
        ]
      },
      {
        id: '2',
        author: {
          id: '2',
          name: 'Sage Astral',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
          zodiacSign: '♌ Leo'
        },
        content: 'Terminé mi primera lectura de tarot de la semana y las cartas hablan de nuevos comienzos. El Loco me salió en posición central... ¿alguien más siente estas energías de cambio? <i class="hgi-stroke hgi-magic-wand-01"></i>',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // Hace 5 horas
        likes: 47,
        comments: 0, // Se calculará dinámicamente
        isLiked: true,
        showComments: false,
        showAllComments: false,
        postComments: [
          {
            id: 'c6',
            author: {
              id: '9',
              name: 'Tarot Master',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♐ Sagitario'
            },
            content: 'El Loco es mi carta favorita! Representa el coraje de dar el salto hacia lo desconocido. ¿Qué otras cartas acompañaron esta lectura?',
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            likes: 12,
            isLiked: true,
            showAllReplies: false,
            replies: [
              {
                id: 'r8',
                author: {
                  id: '2',
                  name: 'Sage Astral',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♌ Leo'
                },
                content: 'Salieron La Estrella y El Sol! Una combinación muy poderosa de esperanza y éxito <i class="hgi-stroke hgi-sun-03"></i><i class="hgi-stroke hgi-star"></i>',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                likes: 8,
                isLiked: false
              },
              {
                id: 'r9',
                author: {
                  id: '17',
                  name: 'Card Reader',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♊ Géminis'
                },
                content: '¡Qué combinación más hermosa! El Loco + La Estrella + El Sol = nuevo ciclo lleno de bendiciones <i class="hgi-stroke hgi-sparkles"></i>',
                createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
                likes: 15,
                isLiked: true
              }
            ]
          },
          {
            id: 'c7',
            author: {
              id: '18',
              name: 'Arcana Wisdom',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♍ Virgo',
              isOnline: true
            },
            content: 'El Loco en posición central sugiere que estás en el momento perfecto para comenzar una nueva aventura espiritual. Trust the process! <i class="hgi-stroke hgi-theater"></i>',
            createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
            likes: 22,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r10',
                author: {
                  id: '19',
                  name: 'Journey Seeker',
                  avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♈ Aries'
                },
                content: 'Totalmente de acuerdo. El Loco nos recuerda que a veces hay que saltar sin red para encontrar nuestro verdadero camino <i class="hgi-stroke hgi-star"></i>',
                createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                likes: 11,
                isLiked: false
              }
            ]
          },
          {
            id: 'c8',
            author: {
              id: '20',
              name: 'Mystic Guide',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♓ Piscis'
            },
            content: 'Yo también he sentido estas energías de cambio! Mis cartas han estado muy "chatty" últimamente, como si quisieran contarme todos los secretos del universo <i class="hgi-stroke hgi-square-arrow-data-transfer-diagonal"></i>',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            likes: 18,
            isLiked: true,
            showAllReplies: false,
            replies: [
              {
                id: 'r11',
                author: {
                  id: '21',
                  name: 'Oracle Speaker',
                  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♌ Leo'
                },
                content: '¡Sí! Es como si el velo entre dimensiones estuviera más delgado estos días. Mis lecturas han sido súper precisas <i class="hgi-stroke hgi-diamond-01"></i>',
                createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
                likes: 14,
                isLiked: true
              },
              {
                id: 'r12',
                author: {
                  id: '22',
                  name: 'Intuition Master',
                  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♏ Escorpio'
                },
                content: 'Definitivamente hay algo en el aire cósmico. Mis clientes han estado recibiendo mensajes muy profundos <i class="hgi-stroke hgi-shooting-star"></i>',
                createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                likes: 9,
                isLiked: false
              }
            ]
          },
          {
            id: 'c9',
            author: {
              id: '23',
              name: 'Cosmic Leo',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♌ Leo',
              isOnline: true
            },
            content: 'Como fellow Leo, totally feeling this energy! Nuestro signo está siendo super activado por estas energías de renovación <i class="hgi-stroke hgi-lion"></i><i class="hgi-stroke hgi-sparkles"></i>',
            createdAt: new Date(Date.now() - 45 * 60 * 1000),
            likes: 13,
            isLiked: false,
            showAllReplies: false,
            replies: []
          }
        ]
      },
      {
        id: '3',
        author: {
          id: '3',
          name: 'Crystal Healer',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          zodiacSign: '♍ Virgo'
        },
        content: 'Sesión de meditación matutina completada <i class="hgi-stroke hgi-yoga-03"></i> Los cristales de amatista han estado vibrando con una energía increíble últimamente. ¿Alguien más lo ha notado?',
        tags: ['#meditación', '#cristales', '#amatista'],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 1 día
        likes: 12,
        comments: 0, // Se calculará dinámicamente
        isLiked: false,
        showComments: false,
        showAllComments: false,
        postComments: [
          {
            id: 'c10',
            author: {
              id: '10',
              name: 'Amethyst Dream',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♒ Acuario'
            },
            content: '¡Sí! Mis amatistas también han estado muy activas. Creo que están ayudando con la transición energética del planeta <i class="hgi-stroke hgi-heart-add"></i>',
            createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
            likes: 5,
            isLiked: false,
            showAllReplies: false,
            replies: [
              {
                id: 'r13',
                author: {
                  id: '24',
                  name: 'Purple Mystic',
                  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♓ Piscis'
                },
                content: 'La amatista es perfecta para estos tiempos de cambio. Su vibración nos ayuda a mantener la claridad mental <i class="hgi-stroke hgi-diamond-01"></i>',
                createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
                likes: 8,
                isLiked: true
              }
            ]
          },
          {
            id: 'c11',
            author: {
              id: '25',
              name: 'Meditation Master',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
              zodiacSign: '♌ Leo'
            },
            content: 'Hermosa práctica! Yo combino amatista con cuarzo rosa para equilibrar el corazón y la mente durante mis meditaciones <i class="hgi-stroke hgi-heart-check"></i>',
            createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
            likes: 11,
            isLiked: true,
            showAllReplies: false,
            replies: [
              {
                id: 'r14',
                author: {
                  id: '26',
                  name: 'Heart Chakra',
                  avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♎ Libra'
                },
                content: '¡Qué combinación más hermosa! El cuarzo rosa abre el corazón y la amatista eleva la consciencia. Perfect balance <i class="hgi-stroke hgi-scale-01"></i><i class="hgi-stroke hgi-diamond-01"></i>',
                createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
                likes: 7,
                isLiked: false
              },
              {
                id: 'r15',
                author: {
                  id: '3',
                  name: 'Crystal Healer',
                  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
                  zodiacSign: '♍ Virgo'
                },
                content: '¡Exacto! Esa combinación es una de mis favoritas. Voy a probarla en mi próxima sesión <i class="hgi-stroke hgi-praying-hands"></i>',
                createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
                likes: 6,
                isLiked: true
              }
            ]
          }
        ]
      }
    ];

    // Calcular el total de comentarios para cada post
    mockPosts.forEach(post => {
      post.comments = this.getTotalCommentsCount(post);
    });

    this.posts.set(mockPosts);
  }

  // Cargar artículos iniciales (simulados con datos exactos de la BD)
  loadInitialArticulos(): void {
    const mockArticulos: Articulo[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        bruja_id: '550e8400-e29b-41d4-a716-446655440010',
        titulo: 'Los Secretos de la Luna Llena en Escorpio',
        resumen: 'Descubre cómo esta poderosa luna llena puede transformar tu vida espiritual y emocional.',
        contenido: 'La luna llena en Escorpio trae consigo energías intensas de transformación y renacimiento. Durante este periodo, las emociones se intensifican y los secretos salen a la luz...',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440020',
        imagen_destacada: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        slug: 'secretos-luna-llena-escorpio',
        estado: 'publicado',
        fecha_publicacion: new Date('2024-01-15T10:30:00Z'),
        visualizaciones: 1250,
        me_gusta: 89,
        fecha_creacion: new Date('2024-01-10T08:00:00Z'),
        fecha_modificacion: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        bruja_id: '550e8400-e29b-41d4-a716-446655440011',
        titulo: 'Cristales para la Protección Energética',
        resumen: 'Una guía completa sobre los cristales más poderosos para proteger tu aura y energía personal.',
        contenido: 'Los cristales han sido utilizados durante milenios para la protección energética. En este artículo exploraremos las propiedades de la turmalina negra, la obsidiana y el cuarzo ahumado...',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440021',
        imagen_destacada: 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=600&h=400&fit=crop',
        slug: 'cristales-proteccion-energetica',
        estado: 'publicado',
        fecha_publicacion: new Date('2024-01-12T14:20:00Z'),
        visualizaciones: 890,
        me_gusta: 67,
        fecha_creacion: new Date('2024-01-08T16:45:00Z'),
        fecha_modificacion: new Date('2024-01-12T14:20:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        bruja_id: '550e8400-e29b-41d4-a716-446655440010',
        titulo: 'Interpretación Avanzada del Tarot: El Arcano Mayor',
        resumen: 'Profundiza en los secretos de los 22 Arcanos Mayores y su significado en las tiradas contemporáneas.',
        contenido: 'Los Arcanos Mayores representan el viaje del alma a través de la vida. Cada carta cuenta una historia, desde El Loco hasta El Mundo, simbolizando diferentes etapas de crecimiento espiritual...',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440022',
        imagen_destacada: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        slug: 'interpretacion-avanzada-tarot-arcano-mayor',
        estado: 'publicado',
        fecha_publicacion: new Date('2024-01-08T09:15:00Z'),
        visualizaciones: 2100,
        me_gusta: 156,
        fecha_creacion: new Date('2024-01-05T11:30:00Z'),
        fecha_modificacion: new Date('2024-01-08T09:15:00Z')
      }
    ];

    this.articulos.set(mockArticulos);
  }

  // Cargar eventos iniciales (simulados con datos exactos de la BD)
  loadInitialEventos(): void {
    const mockEventos: Evento[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440050',
        titulo: 'Ritual de Luna Llena: Liberación y Manifestación',
        descripcion: 'Únete a este poderoso ritual de luna llena donde aprenderás técnicas ancestrales de liberación de energías negativas y manifestación de deseos. Incluye meditación guiada, trabajo con cristales y creación de agua lunar.',
        fecha_inicio: new Date('2024-02-15T19:00:00Z'),
        fecha_fin: new Date('2024-02-15T21:30:00Z'),
        ubicacion: 'Jardín Místico - Centro Holístico Arcana',
        url_evento: 'https://zoom.us/j/1234567890',
        organizador_id: '550e8400-e29b-41d4-a716-446655440100',
        tipo_evento: 'retiro',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440020',
        precio: 45.00,
        cupo_maximo: 20,
        imagen_evento: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
        publico: true,
        activo: true,
        fecha_creacion: new Date('2024-01-10T10:00:00Z'),
        fecha_modificacion: new Date('2024-01-15T14:30:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440051',
        titulo: 'Webinar: Introducción al Tarot para Principiantes',
        descripcion: 'Descubre los fundamentos del Tarot en este webinar interactivo. Aprenderás sobre los 78 arcanos, cómo hacer tu primera tirada y conectar con la energía de las cartas. Incluye PDF descargable.',
        fecha_inicio: new Date('2024-02-20T18:00:00Z'),
        fecha_fin: new Date('2024-02-20T20:00:00Z'),
        ubicacion: '',
        url_evento: 'https://zoom.us/j/0987654321',
        organizador_id: '550e8400-e29b-41d4-a716-446655440101',
        tipo_evento: 'webinar',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440022',
        precio: 25.00,
        cupo_maximo: 50,
        imagen_evento: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        publico: true,
        activo: true,
        fecha_creacion: new Date('2024-01-08T16:20:00Z'),
        fecha_modificacion: new Date('2024-01-12T09:45:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440052',
        titulo: 'Taller: Sanación con Cristales y Chakras',
        descripcion: 'Aprende a trabajar con la energía de los cristales para equilibrar tus chakras. Este taller práctico incluye kit de cristales básicos, técnicas de limpieza energética y meditaciones específicas para cada chakra.',
        fecha_inicio: new Date('2024-02-25T10:00:00Z'),
        fecha_fin: new Date('2024-02-25T16:00:00Z'),
        ubicacion: 'Sala de Sanación - Centro Arcana, Piso 2',
        url_evento: '',
        organizador_id: '550e8400-e29b-41d4-a716-446655440102',
        tipo_evento: 'taller',
        disciplina_id: '550e8400-e29b-41d4-a716-446655440021',
        precio: 85.00,
        cupo_maximo: 15,
        imagen_evento: 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=600&h=400&fit=crop',
        publico: true,
        activo: true,
        fecha_creacion: new Date('2024-01-05T12:15:00Z'),
        fecha_modificacion: new Date('2024-01-18T11:20:00Z')
      }
    ];

    this.eventos.set(mockEventos);
  }

  // Cargar citas iniciales (simuladas con datos exactos de la BD)
  loadInitialCitas(): void {
    const mockCitas: Cita[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440070',
        bruja_id: '550e8400-e29b-41d4-a716-446655440010',
        usuario_id: '550e8400-e29b-41d4-a716-446655440200', // Usuario actual
        fecha_hora_inicio: new Date('2024-01-20T15:00:00Z'),
        fecha_hora_fin: new Date('2024-01-20T16:00:00Z'),
        estado: 'completada',
        metodo: 'zoom',
        url_reunion: 'https://zoom.us/j/1234567890',
        precio_acordado: 65.00,
        notas_bruja: 'Lectura de tarot sobre decisiones de carrera',
        notas_usuario: 'Consulta muy reveladora, muy satisfecho',
        calificacion_bruja: 5,
        comentario_calificacion: 'Excelente lectura, muy precisa y empática',
        fecha_creacion: new Date('2024-01-15T10:30:00Z'),
        fecha_modificacion: new Date('2024-01-20T16:05:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440071',
        bruja_id: '550e8400-e29b-41d4-a716-446655440011',
        usuario_id: '550e8400-e29b-41d4-a716-446655440200',
        fecha_hora_inicio: new Date('2024-02-28T18:30:00Z'),
        fecha_hora_fin: new Date('2024-02-28T19:30:00Z'),
        estado: 'confirmada',
        metodo: 'presencial',
        url_reunion: '',
        precio_acordado: 80.00,
        notas_bruja: '',
        notas_usuario: 'Consulta sobre sanación energética',
        calificacion_bruja: null,
        comentario_calificacion: '',
        fecha_creacion: new Date('2024-02-20T14:20:00Z'),
        fecha_modificacion: new Date('2024-02-25T11:15:00Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440072',
        bruja_id: '550e8400-e29b-41d4-a716-446655440010',
        usuario_id: '550e8400-e29b-41d4-a716-446655440200',
        fecha_hora_inicio: new Date('2024-01-05T14:00:00Z'),
        fecha_hora_fin: new Date('2024-01-05T15:00:00Z'),
        estado: 'completada',
        metodo: 'jitsi',
        url_reunion: 'https://meet.jit.si/consulta-arcana-123',
        precio_acordado: 70.00,
        notas_bruja: 'Primera consulta, excelente conexión energética',
        notas_usuario: 'Mi primera experiencia con lecturas, superó expectativas',
        calificacion_bruja: 4,
        comentario_calificacion: 'Muy buena orientación espiritual',
        fecha_creacion: new Date('2023-12-28T09:45:00Z'),
        fecha_modificacion: new Date('2024-01-05T15:10:00Z')
      }
    ];

    this.citas.set(mockCitas);
  }

  // Cargar cursos con progreso iniciales (simulados con datos exactos de la BD)
  loadInitialCursos(): void {
    const mockCursosConProgreso: CursoConProgreso[] = [
      {
        curso: {
          id: '550e8400-e29b-41d4-a716-446655440080',
          titulo: 'Fundamentos del Tarot: De Principiante a Lector',
          descripcion: 'Aprende a leer las cartas del tarot desde cero, incluyendo significados, tiradas y interpretación intuitiva.',
          disciplina_id: '550e8400-e29b-41d4-a716-446655440022', // tarot
          nivel: 'principiante',
          tipo_contenido: 'video',
          imagen_portada: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          duracion_total_minutos: 480, // 8 horas
          solo_suscripcion: false,
          precio_individual: 89.99,
          activo: true,
          orden_visualizacion: 1,
          fecha_creacion: new Date('2023-11-15T10:00:00Z'),
          fecha_modificacion: new Date('2024-01-10T14:30:00Z')
        },
        progreso: {
          porcentaje_completado: 100,
          estado: 'completada',
          fecha_ultimo_acceso: new Date('2024-01-25T16:45:00Z'),
          fecha_completado: new Date('2024-01-25T16:45:00Z')
        }
      },
      {
        curso: {
          id: '550e8400-e29b-41d4-a716-446655440081',
          titulo: 'Cristales y Chakras: Sanación Energética',
          descripcion: 'Descubre cómo usar cristales para equilibrar tus chakras y mejorar tu bienestar energético.',
          disciplina_id: '550e8400-e29b-41d4-a716-446655440021', // cristales
          nivel: 'intermedio',
          tipo_contenido: 'video',
          imagen_portada: 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=300&h=200&fit=crop',
          duracion_total_minutos: 360, // 6 horas
          solo_suscripcion: true,
          precio_individual: 0.00,
          activo: true,
          orden_visualizacion: 2,
          fecha_creacion: new Date('2024-01-05T09:20:00Z'),
          fecha_modificacion: new Date('2024-02-01T11:15:00Z')
        },
        progreso: {
          porcentaje_completado: 65,
          estado: 'en_progreso',
          fecha_ultimo_acceso: new Date('2024-02-20T19:30:00Z'),
          fecha_completado: null
        }
      },
      {
        curso: {
          id: '550e8400-e29b-41d4-a716-446655440082',
          titulo: 'Astrología Básica: Tu Carta Natal',
          descripcion: 'Interpreta tu carta natal y comprende cómo los astros influyen en tu personalidad y destino.',
          disciplina_id: '550e8400-e29b-41d4-a716-446655440020', // astrologia
          nivel: 'principiante',
          tipo_contenido: 'video',
          imagen_portada: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=300&h=200&fit=crop',
          duracion_total_minutos: 540, // 9 horas
          solo_suscripcion: false,
          precio_individual: 129.99,
          activo: true,
          orden_visualizacion: 3,
          fecha_creacion: new Date('2024-01-20T13:45:00Z'),
          fecha_modificacion: new Date('2024-02-15T10:20:00Z')
        },
        progreso: {
          porcentaje_completado: 25,
          estado: 'en_progreso',
          fecha_ultimo_acceso: new Date('2024-02-18T20:15:00Z'),
          fecha_completado: null
        }
      }
    ];

    this.cursosConProgreso.set(mockCursosConProgreso);
  }

  // Obtener información de bruja por artículo (simulado)
  getBrujaInfo(bruja_id: string): Bruja {
    const brujas: { [key: string]: Bruja } = {
      '550e8400-e29b-41d4-a716-446655440010': {
        id: '550e8400-e29b-41d4-a716-446655440010',
        usuario_id: '550e8400-e29b-41d4-a716-446655440100',
        biografia: 'Maestra en artes místicas con 15 años de experiencia',
        especialidades: ['astrologia', 'tarot'],
        calificacion_promedio: 4.8,
        total_consultas: 245,
        nombre: 'Luna',
        apellido: 'Silvestra',
        avatar_url: 'https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg',
        signo_zodiacal: 'piscis'
      },
      '550e8400-e29b-41d4-a716-446655440011': {
        id: '550e8400-e29b-41d4-a716-446655440011',
        usuario_id: '550e8400-e29b-41d4-a716-446655440101',
        biografia: 'Sanadora energética especializada en cristales',
        especialidades: ['cristales', 'reiki'],
        calificacion_promedio: 4.9,
        total_consultas: 189,
        nombre: 'Minerva',
        apellido: 'Cristalina',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        signo_zodiacal: 'virgo'
      }
    };

    return brujas[bruja_id] || brujas['550e8400-e29b-41d4-a716-446655440010'];
  }

  // Obtener información de disciplina por artículo (simulado)
  getDisciplinaInfo(disciplina_id: string): Disciplina {
    const disciplinas: { [key: string]: Disciplina } = {
      '550e8400-e29b-41d4-a716-446655440020': {
        id: '550e8400-e29b-41d4-a716-446655440020',
        nombre: 'astrologia',
        descripcion: 'Estudio de la influencia de los astros',
        color_hex: '#4B0082'
      },
      '550e8400-e29b-41d4-a716-446655440021': {
        id: '550e8400-e29b-41d4-a716-446655440021',
        nombre: 'cristales',
        descripcion: 'Propiedades energéticas de minerales',
        color_hex: '#9370DB'
      },
      '550e8400-e29b-41d4-a716-446655440022': {
        id: '550e8400-e29b-41d4-a716-446655440022',
        nombre: 'tarot',
        descripcion: 'Lectura e interpretación de cartas del tarot',
        color_hex: '#8B4513'
      }
    };

    return disciplinas[disciplina_id] || disciplinas['550e8400-e29b-41d4-a716-446655440020'];
  }

  // Obtener información de organizador por evento (simulado)
  getOrganizadorInfo(organizador_id: string): Organizador {
    const organizadores: { [key: string]: Organizador } = {
      '550e8400-e29b-41d4-a716-446655440100': {
        id: '550e8400-e29b-41d4-a716-446655440100',
        nombre: 'Luna',
        apellido: 'Silvestra',
        avatar_url: 'https://ix-marketing.imgix.net/focalpoint.png?auto=format,compress&w=1678',
        email: 'luna.silvestra@arcana.com',
        signo_zodiacal: 'piscis'
      },
      '550e8400-e29b-41d4-a716-446655440101': {
        id: '550e8400-e29b-41d4-a716-446655440101',
        nombre: 'Sage',
        apellido: 'Moonheart',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        email: 'sage.moonheart@arcana.com',
        signo_zodiacal: 'leo'
      },
      '550e8400-e29b-41d4-a716-446655440102': {
        id: '550e8400-e29b-41d4-a716-446655440102',
        nombre: 'Minerva',
        apellido: 'Cristalina',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        email: 'minerva.cristalina@arcana.com',
        signo_zodiacal: 'virgo'
      }
    };

    return organizadores[organizador_id] || organizadores['550e8400-e29b-41d4-a716-446655440100'];
  }

  // Calcular total de comentarios + respuestas
  getTotalCommentsCount(post: Post): number {
    let total = post.postComments.length; // Comentarios principales
    
    // Sumar todas las respuestas
    post.postComments.forEach(comment => {
      total += comment.replies.length;
    });
    
    return total;
  }

  // Actualizar contador de comentarios en un post
  updatePostCommentsCount(postId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: this.getTotalCommentsCount(post)
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
  }

  // Método para formatear el tiempo relativo
  getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Hace unos segundos';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }

  // Formatear fecha de publicación
  getFormattedDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  }

  // Calcular tiempo estimado de lectura basado en el contenido
  getEstimatedReadingTime(contenido: string): number {
    const wordsPerMinute = 200;
    const wordCount = contenido.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Formatear fecha y hora del evento
  getFormattedEventDate(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(fecha));
  }

  getFormattedEventTime(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(fecha));
  }

  // Calcular duración del evento en horas
  getEventDuration(fecha_inicio: Date, fecha_fin: Date): string {
    const startTime = new Date(fecha_inicio).getTime();
    const endTime = new Date(fecha_fin).getTime();
    const diffMs = endTime - startTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return `${diffMinutes} min`;
    } else if (diffHours === 1) {
      return '1 hora';
    } else {
      return `${diffHours.toFixed(1)} horas`;
    }
  }

  // Obtener icono por tipo de evento
  getEventTypeIcon(tipo_evento: string): string {
    const iconMap: { [key: string]: string } = {
      'webinar': 'fas fa-desktop',
      'reunion': 'fas fa-users',
      'retiro': 'fas fa-mountain',
      'taller': 'fas fa-tools',
      'conferencia': 'fas fa-microphone-alt'
    };
    
    return iconMap[tipo_evento] || 'fas fa-calendar-alt';
  }

  // Formatear fecha y hora para las citas
  getFormattedCitaDate(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date(fecha));
  }

  getFormattedCitaTime(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(fecha));
  }

  // Obtener icono por método de reunión
  getMetodoIcon(metodo: string): string {
    const iconMap: { [key: string]: string } = {
      'zoom': 'fas fa-video',
      'jitsi': 'fas fa-video',
      'phone': 'fas fa-phone',
      'presencial': 'fas fa-map-marker-alt'
    };
    
    return iconMap[metodo] || 'fas fa-calendar-alt';
  }

  // Obtener clase CSS por estado de cita
  getEstadoClass(estado: string): string {
    const classMap: { [key: string]: string } = {
      'pendiente': 'estado-pendiente',
      'confirmada': 'estado-confirmada',
      'cancelada': 'estado-cancelada',
      'completada': 'estado-completada'
    };
    
    return classMap[estado] || 'estado-pendiente';
  }

  // Formatear duración del curso
  getFormattedDuration(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    
    if (horas === 0) {
      return `${mins}min`;
    } else if (mins === 0) {
      return `${horas}h`;
    } else {
      return `${horas}h ${mins}min`;
    }
  }

  // Obtener clase CSS por nivel
  getNivelClass(nivel: string): string {
    const classMap: { [key: string]: string } = {
      'principiante': 'nivel-principiante',
      'intermedio': 'nivel-intermedio',
      'avanzado': 'nivel-avanzado'
    };
    
    return classMap[nivel] || 'nivel-principiante';
  }

  // Obtener clase CSS por estado de progreso
  getProgresoClass(estado: string): string {
    const classMap: { [key: string]: string } = {
      'pendiente': 'progreso-pendiente',
      'en_progreso': 'progreso-en-curso',
      'completada': 'progreso-completado'
    };
    
    return classMap[estado] || 'progreso-pendiente';
  }

  // Obtener icono por tipo de contenido
  getTipoContenidoIcon(tipo: string): string {
    const iconMap: { [key: string]: string } = {
      'video': 'fas fa-play-circle',
      'texto': 'fas fa-file-alt',
      'documento': 'fas fa-file-pdf',
      'audio': 'fas fa-volume-up'
    };
    
    return iconMap[tipo] || 'fas fa-play-circle';
  }

  // Formatear fecha de último acceso
  getFormattedLastAccess(fecha: Date): string {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    return `Hace ${Math.floor(diffInDays / 30)} meses`;
  }

  // Manejar like de un post
  onPostLike(postId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Post ${postId} ${currentPosts.find(p => p.id === postId)?.isLiked ? 'unliked' : 'liked'}`);
  }

  // Manejar comentario de un post
  onPostComment(postId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Toggle comentarios para post ${postId}`);
  }

  // Manejar like de comentario
  onCommentLike(postId: string, commentId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.postComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
            };
          }
          return comment;
        });
        
        return {
          ...post,
          postComments: updatedComments
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Comment ${commentId} ${currentPosts.find(p => p.id === postId)?.postComments.find(c => c.id === commentId)?.isLiked ? 'unliked' : 'liked'}`);
  }

  // Manejar like de respuesta
  onReplyLike(postId: string, commentId: string, replyId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.postComments.map(comment => {
          if (comment.id === commentId) {
            const updatedReplies = comment.replies.map(reply => {
              if (reply.id === replyId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                };
              }
              return reply;
            });
            
            return {
              ...comment,
              replies: updatedReplies
            };
          }
          return comment;
        });
        
        return {
          ...post,
          postComments: updatedComments
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Reply ${replyId} liked/unliked`);
  }

  // Mostrar más comentarios
  onShowMoreComments(postId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          showAllComments: true
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Mostrar todos los comentarios para post ${postId}`);
  }

  // Mostrar más respuestas
  onShowMoreReplies(postId: string, commentId: string): void {
    const currentPosts = this.posts();
    const updatedPosts = currentPosts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.postComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              showAllReplies: true
            };
          }
          return comment;
        });
        
        return {
          ...post,
          postComments: updatedComments
        };
      }
      return post;
    });
    
    this.posts.set(updatedPosts);
    console.log(`Mostrar todas las respuestas para comentario ${commentId}`);
  }

  // Responder a un comentario
  onReplyToComment(postId: string, commentId: string): void {
    console.log(`Responder al comentario ${commentId} en post ${postId}`);
    // Aquí implementarías la lógica para abrir el modal/form de respuesta
  }

  // Obtener comentarios visibles (limitados)
  getVisibleComments(post: Post): PostComment[] {
    const limit = 2; // Mostrar solo 2 comentarios inicialmente
    return post.showAllComments ? post.postComments : post.postComments.slice(0, limit);
  }

  // Obtener respuestas visibles (limitadas)
  getVisibleReplies(comment: PostComment): CommentReply[] {
    const limit = 1; // Mostrar solo 1 respuesta inicialmente
    return comment.showAllReplies ? comment.replies : comment.replies.slice(0, limit);
  }

  // Verificar si hay más comentarios para mostrar
  hasMoreComments(post: Post): boolean {
    return !post.showAllComments && post.postComments.length > 2;
  }

  // Verificar si hay más respuestas para mostrar
  hasMoreReplies(comment: PostComment): boolean {
    return !comment.showAllReplies && comment.replies.length > 1;
  }

  // Contar comentarios restantes
  getRemainingCommentsCount(post: Post): number {
    const limit = 2;
    return Math.max(0, post.postComments.length - limit);
  }

  // Contar respuestas restantes
  getRemainingRepliesCount(comment: PostComment): number {
    const limit = 1;
    return Math.max(0, comment.replies.length - limit);
  }

  // Compartir post
  onPostShare(postId: string): void {
    console.log(`Compartir post ${postId}`);
    // Aquí implementarías la lógica para compartir
  }

  // Crear nuevo post
  onCreateNewPost(): void {
    console.log('Crear nuevo post');
    // Aquí implementarías la lógica para abrir el modal de crear post
  }

  // Cargar más posts
  onLoadMorePosts(): void {
    console.log('Cargar más posts');
    this.isLoading.set(true);
    
    // Simular carga de más posts
    setTimeout(() => {
      // Aquí harías la llamada a la API para cargar más posts
      console.log('Más posts cargados');
      this.isLoading.set(false);
    }, 1500);
  }

  // Manejar me_gusta de un artículo
  onArticuloLike(articuloId: string): void {
    const currentArticulos = this.articulos();
    const updatedArticulos = currentArticulos.map(articulo => {
      if (articulo.id === articuloId) {
        return {
          ...articulo,
          me_gusta: articulo.me_gusta + 1
        };
      }
      return articulo;
    });
    
    this.articulos.set(updatedArticulos);
    console.log(`Artículo ${articuloId} liked`);
  }

  // Incrementar visualizaciones de un artículo
  onArticuloView(articuloId: string): void {
    const currentArticulos = this.articulos();
    const updatedArticulos = currentArticulos.map(articulo => {
      if (articulo.id === articuloId) {
        return {
          ...articulo,
          visualizaciones: articulo.visualizaciones + 1
        };
      }
      return articulo;
    });
    
    this.articulos.set(updatedArticulos);
    console.log(`Artículo ${articuloId} viewed`);
  }

  // Compartir artículo
  onArticuloShare(slug: string): void {
    console.log(`Compartir artículo: ${slug}`);
    // Aquí implementarías la lógica para compartir
  }

  // Cargar más artículos
  onLoadMoreArticulos(): void {
    console.log('Cargar más artículos');
    this.isLoading.set(true);
    
    // Simular carga de más artículos
    setTimeout(() => {
      console.log('Más artículos cargados');
      this.isLoading.set(false);
    }, 1500);
  }

  // Manejar inscripción a un evento
  onEventoInscripcion(eventoId: string): void {
    console.log(`Inscribirse al evento: ${eventoId}`);
    // Aquí implementarías la lógica para inscribirse al evento
  }

  // Cargar más eventos
  onLoadMoreEventos(): void {
    console.log('Cargar más eventos');
    this.isLoading.set(true);
    
    // Simular carga de más eventos
    setTimeout(() => {
      console.log('Más eventos cargados');
      this.isLoading.set(false);
    }, 1500);
  }

  // Track by function para optimizar ngFor
  trackByPostId = (index: number, post: Post): string => {
    return post.id;
  };

  // Track by function para optimizar ngFor de comentarios
  trackByCommentId = (index: number, comment: PostComment): string => {
    return comment.id;
  };

  // Track by function para optimizar ngFor de respuestas
  trackByReplyId = (index: number, reply: CommentReply): string => {
    return reply.id;
  };

  // Track by function para optimizar ngFor de artículos
  trackByArticuloId = (index: number, articulo: Articulo): string => {
    return articulo.id;
  };

  // Track by function para optimizar ngFor de citas
  trackByCitaId = (index: number, cita: Cita): string => {
    return cita.id;
  };

  // Track by function para optimizar ngFor de cursos
  trackByCursoId = (index: number, cursoConProgreso: CursoConProgreso): string => {
    return cursoConProgreso.curso.id;
  };

  // Track by function para optimizar ngFor de eventos
  trackByEventoId = (index: number, evento: Evento): string => {
    return evento.id;
  };

  // Métodos que usaremos después para cargar datos reales de la BD
  loadPosts(): void {
    console.log('Cargando posts...');
    // Futura implementación para cargar posts
  }

  loadArticles(): void {
    console.log('Cargando artículos...');
    // Futura implementación para cargar artículos de la BD
    this.loadInitialArticulos();
  }

  loadEvents(): void {
    console.log('Cargando eventos...');
    // Futura implementación para cargar eventos de la BD
    this.loadInitialEventos();
  }

  loadAppointmentsHistory(): void {
    console.log('Cargando historial de citas...');
    // Futura implementación para cargar citas de la tabla 'citas'
    this.loadInitialCitas();
  }

  loadCurrentCourses(): void {
    console.log('Cargando talleres en curso...');
    // Futura implementación para cargar cursos en progreso del usuario
    this.loadInitialCursos();
  }
}

