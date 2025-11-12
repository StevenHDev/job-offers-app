# 💼 Job Portal - Sistema de Ofertas de Trabajo

Portal web moderno para publicar ofertas de trabajo y gestionar postulaciones con sistema de autenticación completo.

## 🚀 Características Principales

- ✅ **Autenticación completa** - Registro, login y gestión de sesiones
- 📝 **Gestión de ofertas** - CRUD completo de ofertas de trabajo
- 📄 **Sistema de postulaciones** - Upload de CV en PDF y seguimiento
- 👥 **Roles de usuario** - Candidatos, Reclutadores y Administradores
- 📱 **Diseño responsive** - Optimizado para todos los dispositivos
- 🔒 **Seguridad** - Row Level Security con Supabase
- ⚡ **Tiempo real** - Actualizaciones instantáneas de postulaciones

## 🛠️ Stack Tecnológico

### Frontend

- **React.js 18** - Biblioteca de UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento SPA
- **Zustand** - Estado global simplificado
- **TailwindCSS** - Framework de estilos utility-first
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **Lucide React** - Iconos modernos
- **React Hot Toast** - Notificaciones elegantes

### Backend

- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage (para CVs en PDF)
  - Row Level Security
  - Real-time subscriptions

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Cuenta de Supabase** (gratuita)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/job-portal.git
cd job-portal
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar Supabase

1. Crea un proyecto en [Supabase](https://app.supabase.com)
2. Ve a **Settings → API** y copia:
   - Project URL
   - Anon (public) key
3. Ejecuta los scripts SQL de configuración (ver sección Scripts SQL)

### 4. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tus credenciales de Supabase
```

Edita el archivo `.env` con tus valores:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📁 Estructura del Proyecto

```
job-portal/
├── public/              # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── auth/       # Componentes de autenticación
│   │   ├── jobs/       # Componentes de ofertas
│   │   ├── applications/ # Componentes de postulaciones
│   │   ├── layout/     # Layout y navegación
│   │   └── common/     # Componentes comunes (Button, Input, etc.)
│   ├── pages/          # Páginas principales
│   ├── services/       # Servicios de API y Supabase
│   ├── store/          # Estado global (Zustand)
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utilidades y helpers
│   └── styles/         # Estilos globales
├── .env.example        # Ejemplo de variables de entorno
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🗄️ Base de Datos

### Tablas Principales

- **profiles** - Información de usuarios
- **jobs** - Ofertas de trabajo publicadas
- **applications** - Postulaciones de candidatos

Para crear las tablas, ejecuta los scripts SQL proporcionados en `SUPABASE_SETUP.sql`

## 👤 Roles de Usuario

### Candidate (Candidato)

- Ver todas las ofertas de trabajo
- Postularse a ofertas
- Subir CV en formato PDF
- Ver historial de postulaciones
- Actualizar perfil

### Recruiter (Reclutador)

- Todas las funciones de Candidato
- Crear nuevas ofertas de trabajo
- Editar y eliminar sus ofertas
- Ver postulaciones recibidas
- Descargar CVs de candidatos
- Cambiar estado de postulaciones

### Admin (Administrador)

- Acceso completo a todas las funciones
- Gestionar usuarios
- Ver estadísticas globales
- Moderar contenido

## 🔒 Seguridad

- **Row Level Security (RLS)** activado en todas las tablas
- **Validación de archivos** - Solo PDFs, máximo 5MB
- **Autenticación JWT** con Supabase
- **Sanitización de inputs** en todos los formularios
- **Políticas de acceso** granulares por rol

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Formateo de código
npm run format
```

## 🚀 Despliegue

### Netlify (Recomendado)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Build command: `npm run build`
4. Publish directory: `dist`

### Vercel

1. Importa el proyecto desde GitHub
2. Configura las variables de entorno
3. Deploy automático

### Variables de entorno en producción

Asegúrate de configurar todas las variables del archivo `.env.example` en tu plataforma de hosting.

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm run test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Documentación Adicional

- [Guía de Contribución](CONTRIBUTING.md) _(próximamente)_
- [Changelog](CHANGELOG.md) _(próximamente)_
- [Roadmap del Proyecto](PROJECT_CHECKLIST.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Tu Nombre** - _Desarrollo inicial_ - [tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Inspirado en las mejores prácticas de portales de empleo modernos
- Diseño basado en principios de UX/UI actuales
- Comunidad de React y Supabase

## 📞 Soporte

Si tienes preguntas o problemas:

- 📧 Email: tu-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/job-portal/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/tu-usuario/job-portal/discussions)

---

**Hecho con ❤️ usando React y Supabase**
