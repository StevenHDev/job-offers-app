# Checklist - Portal de Ofertas de Trabajo

## 📋 Descripción del Proyecto

Portal web para publicar ofertas de trabajo y recibir postulaciones con CV en PDF. Incluye sistema de autenticación y gestión de ofertas.

---

## 🛠️ Stack Tecnológico

### Frontend

- [x] **React.js** - Framework principal
- [x] **React Router DOM** - Navegación y rutas
- [x] **Zustand** - Estado global (opcional según necesidad)
- [x] **TailwindCSS** - Estilos y diseño responsivo
- [x] **React Hook Form** - Manejo de formularios
- [x] **Zod** - Validación de esquemas

### Backend

- [x] **Supabase** - Backend as a Service
  - Autenticación
  - Base de datos PostgreSQL
  - Storage para PDFs
  - Row Level Security (RLS)

### Adicionales Recomendados

- [x] **React Hot Toast** - Notificaciones
- [x] **Lucide React** - Iconos
- [x] **date-fns** - Manejo de fechas
- [x] **React PDF Viewer** - Preview de PDFs (opcional)

---

## 📁 Estructura del Proyecto

```
job-portal/
├── public/
│   └── assets/
│       └── images/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── jobs/
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobList.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── JobForm.jsx
│   │   │   └── JobFilters.jsx
│   │   ├── applications/
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   └── ApplicationCard.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── FileUpload.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Jobs.jsx
│   │   ├── JobDetails.jsx
│   │   ├── CreateJob.jsx
│   │   ├── MyApplications.jsx
│   │   ├── Dashboard.jsx (admin)
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── supabase.js
│   │   ├── authService.js
│   │   ├── jobService.js
│   │   └── applicationService.js
│   ├── store/
│   │   ├── authStore.js
│   │   └── jobStore.js (opcional)
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useJobs.js
│   │   └── useApplications.js
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🗄️ Esquema de Base de Datos (Supabase)

### Tabla: `profiles`

```sql
- id (uuid, PK, FK a auth.users)
- email (text)
- full_name (text)
- role (enum: 'candidate', 'recruiter', 'admin')
- created_at (timestamp)
- updated_at (timestamp)
```

### Tabla: `jobs`

```sql
- id (uuid, PK)
- title (text)
- description (text)
- responsibilities (text[])
- requirements (text[])
- team_info (text)
- company_info (text)
- benefits (text[])
- location (text)
- employment_type (enum: 'full-time', 'part-time', 'internship', 'contract')
- experience_level (text)
- salary_range (text, nullable)
- posted_by (uuid, FK a profiles)
- status (enum: 'active', 'closed', 'draft')
- created_at (timestamp)
- updated_at (timestamp)
- expires_at (timestamp, nullable)
```

### Tabla: `applications`

```sql
- id (uuid, PK)
- job_id (uuid, FK a jobs)
- candidate_id (uuid, FK a profiles)
- cv_url (text)
- cover_letter (text, nullable)
- status (enum: 'pending', 'reviewed', 'accepted', 'rejected')
- applied_at (timestamp)
- updated_at (timestamp)
```

### Storage Buckets

- `cvs` - Para almacenar archivos PDF de hojas de vida

---

## ✅ Checklist de Desarrollo

### Fase 1: Configuración Inicial

- [x] Crear proyecto con Vite + React
- [x] Instalar dependencias necesarias
- [x] Configurar TailwindCSS
- [x] Configurar Supabase
  - [x] Crear proyecto en Supabase
  - [x] Configurar variables de entorno
  - [x] Crear cliente de Supabase
- [x] Configurar React Router
- [x] Crear estructura de carpetas

### Fase 2: Autenticación

- [x] Configurar autenticación en Supabase
  - [x] Habilitar Email/Password
  - [x] Configurar emails de confirmación
- [x] Crear componente LoginForm
- [x] Crear componente RegisterForm
      [x] Implementar lógica de login
      [x] Implementar lógica de registro
      [x] Crear store de autenticación (Zustand)
      [x] Implementar logout
      [x] Crear ProtectedRoute component
      [x] Implementar persistencia de sesión
      [x] Crear página de perfil de usuario

### Fase 3: Base de Datos

[x] Crear tabla `profiles`

- [x] Configurar trigger para crear perfil automático
- [x] Configurar RLS policies (activadas)
      [x] Crear tabla `jobs`
- [x] Configurar RLS policies (activadas)
- [x] Crear índices necesarios
      [x] Crear tabla `applications`
- [x] Configurar RLS policies (activadas)
- [x] Crear constraint único (job_id + candidate_id)
      [x] Crear bucket de storage `cvs`
- [x] Configurar políticas de acceso
- [x] Configurar tamaño máximo de archivo

- [ ] Personalizar políticas RLS según roles y lógica de negocio

### Fase 4: Gestión de Ofertas de Trabajo

- [x] Crear servicio de jobs (CRUD)
- [x] Crear página de listado de ofertas
  - [x] Implementar JobCard component
  - [x] Implementar paginación
  - [x] Implementar filtros básicos
- [x] Crear página de detalle de oferta
  - [x] Mostrar información completa según template
  - [x] Botón de postulación
- [x] Crear formulario de creación de oferta
  - [x] Campos según template del documento
  - [ ] Validaciones con Zod
  - [ ] Vista previa
- [x] Implementar edición de ofertas
- [x] Implementar eliminación de ofertas
- [x] Agregar búsqueda de ofertas

### Fase 5: Sistema de Postulaciones

- [x] Crear componente de upload de CV
  - [x] Validar tipo de archivo (solo PDF)
  - [x] Validar tamaño máximo (5MB)
  - [x] Preview del archivo
- [x] Implementar upload a Supabase Storage
- [x] Crear formulario de postulación
  - [x] Upload de CV
  - [x] Carta de presentación (opcional)
  - [x] Validaciones
- [x] Prevenir postulaciones duplicadas
- [x] Crear página "Mis Postulaciones"
  - [x] Listar postulaciones del usuario
  - [x] Mostrar estado
  - [x] Opción de descargar CV enviado
- [x] Notificaciones de postulación exitosa

### Fase 6: Panel de Administración (Reclutadores)

- [x] Crear dashboard para reclutadores
- [x] Listar ofertas creadas por el reclutador
- [x] Ver postulaciones por oferta
  - [x] Filtrar por estado
  - [x] Descargar CVs
- [x] Cambiar estado de postulaciones
- [x] Estadísticas básicas
  - [x] Total de ofertas
  - [x] Total de postulaciones
  - [x] Postulaciones por estado

### Fase 7: UI/UX

- [ ] Diseñar y aplicar tema de colores
- [ ] Crear componentes reutilizables
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] FileUpload
  - [ ] Modal
  - [ ] Card
- [ ] Implementar diseño responsive
- [ ] Agregar estados de carga
- [ ] Implementar manejo de errores
- [ ] Agregar animaciones sutiles
- [ ] Optimizar imágenes y recursos

### Fase 8: Funcionalidades Avanzadas (Opcional)

- [ ] Sistema de notificaciones en tiempo real
- [ ] Filtros avanzados de ofertas
  - [ ] Por ubicación
  - [ ] Por tipo de empleo
  - [ ] Por nivel de experiencia
  - [ ] Por rango salarial
- [ ] Guardar ofertas favoritas
- [ ] Compartir ofertas en redes sociales
- [ ] Sistema de calificaciones/reviews
- [ ] Chat entre reclutador y candidato
- [ ] Exportar postulaciones a Excel/CSV
- [ ] Panel de analytics avanzado

### Fase 9: Testing y Optimización

- [ ] Testing de componentes críticos
- [ ] Testing de flujos principales
- [ ] Optimización de consultas a base de datos
- [ ] Implementar lazy loading
- [ ] Optimizar bundle size
- [ ] Testing de rendimiento
- [ ] Testing en diferentes navegadores
- [ ] Testing responsive en diferentes dispositivos

### Fase 10: Despliegue

- [ ] Configurar variables de entorno para producción
- [ ] Optimizar build de producción
- [ ] Configurar dominio personalizado
- [ ] Implementar CI/CD (opcional)
- [ ] Configurar monitoring y logs
- [ ] Documentar proceso de despliegue
- [ ] Crear documentación de usuario

---

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] Configurar Row Level Security (RLS) en todas las tablas
- [ ] Validar roles de usuario
- [ ] Sanitizar inputs del usuario
- [ ] Validar tipos de archivo en upload
- [ ] Implementar rate limiting (Supabase)
- [ ] Proteger rutas sensibles
- [ ] Encriptar datos sensibles
- [ ] Configurar CORS correctamente
- [ ] Implementar HTTPS en producción

---

## 📝 Variables de Entorno (.env)

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=application/pdf
```

---

## 🚀 Comandos Útiles

```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Linting
npm run lint
```

---

## 📚 Recursos y Documentación

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

---

## 📌 Notas Importantes

1. **Estructura de Oferta de Trabajo**: Basada en el template proporcionado, incluye:

   - Descripción del día a día
   - Responsabilidades
   - Requisitos (educación, conocimientos técnicos, idiomas)
   - Información del equipo
   - Información de la empresa
   - Compromiso con diversidad
   - Beneficios

2. **Roles de Usuario**:

   - **Candidate**: Puede ver ofertas y postularse
   - **Recruiter**: Puede crear ofertas y gestionar postulaciones
   - **Admin**: Acceso completo (opcional para MVP)

3. **Validaciones de CV**:

   - Solo archivos PDF
   - Tamaño máximo: 5MB
   - Nombre de archivo sanitizado

4. **Estados de Postulación**:
   - Pending (inicial)
   - Reviewed (revisada)
   - Accepted (aceptada)
   - Rejected (rechazada)

---

## 🎯 MVP (Mínimo Producto Viable)

Para lanzar una primera versión funcional, priorizar:

1. ✅ Autenticación básica (registro/login)
2. ✅ CRUD de ofertas de trabajo
3. ✅ Sistema de postulación con upload de PDF
4. ✅ Vista de mis postulaciones
5. ✅ Panel básico para reclutadores
6. ✅ Diseño responsive

---

**Fecha de Inicio**: \***\*\_\_\_\*\***  
**Fecha Estimada de Finalización**: \***\*\_\_\_\*\***  
**Versión Actual**: 1.0.0

---

## 💡 Tips para trabajar con GitHub Copilot

1. **Usa comentarios descriptivos**: Copilot se guía por tus comentarios para generar código

   ```javascript
   // TODO: Create a function to upload CV to Supabase storage with validation
   ```

2. **Sigue convenciones de nombres**: Usa nombres descriptivos en inglés

   ```javascript
   // ✅ Bueno
   const uploadCVToSupabase = async (file) => {}

   // ❌ Evitar
   const subirCV = async (archivo) => {}
   ```

3. **Define tipos e interfaces primero**: Copilot generará mejor código con tipos claros

   ```typescript
   interface Job {
     id: string
     title: string
     // ...
   }
   ```

4. **Usa este checklist**: Copia las tareas como comentarios TODO en tu código
