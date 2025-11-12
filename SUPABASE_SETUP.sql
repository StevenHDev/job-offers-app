-- ============================================
-- JOB PORTAL - SUPABASE DATABASE SETUP
-- ============================================
-- Este script configura toda la base de datos necesaria para el portal de empleos
-- Incluye: tablas, políticas RLS, funciones, triggers y storage

-- ============================================
-- 1. EXTENSIONES
-- ============================================

-- Habilitar extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. TIPOS ENUM
-- ============================================

-- Tipo de rol de usuario
CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'admin');

-- Tipo de empleo
CREATE TYPE employment_type AS ENUM ('full-time', 'part-time', 'internship', 'contract', 'temporary');

-- Estado de la oferta de trabajo
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');

-- Estado de la postulación
CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');

-- ============================================
-- 3. TABLA: profiles
-- ============================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'candidate' NOT NULL,
    phone TEXT,
    location TEXT,
    bio TEXT,
    avatar_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Índices para profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- 4. TABLA: jobs
-- ============================================

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    requirements TEXT[] NOT NULL DEFAULT '{}',
    team_info TEXT,
    company_info TEXT,
    benefits TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    employment_type employment_type NOT NULL DEFAULT 'full-time',
    experience_level TEXT,
    salary_range TEXT,
    english_level TEXT,
    education_requirements TEXT,
    technical_skills TEXT[] DEFAULT '{}',
    posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status job_status DEFAULT 'active' NOT NULL,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Índices para jobs
CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- ============================================
-- 5. TABLA: applications
-- ============================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    candidate_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    cv_url TEXT NOT NULL,
    cv_filename TEXT NOT NULL,
    cover_letter TEXT,
    status application_status DEFAULT 'pending' NOT NULL,
    notes TEXT, -- Notas del reclutador
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES profiles(id),
    
    -- Evitar postulaciones duplicadas
    CONSTRAINT unique_application UNIQUE (job_id, candidate_id)
);

-- Índices para applications
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- ============================================
-- 6. FUNCIONES Y TRIGGERS
-- ============================================

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'candidate')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para incrementar contador de postulaciones
CREATE OR REPLACE FUNCTION increment_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para contador de postulaciones
CREATE TRIGGER on_application_created
    AFTER INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION increment_applications_count();

-- Función para decrementar contador de postulaciones
CREATE OR REPLACE FUNCTION decrement_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = applications_count - 1
    WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger para decrementar postulaciones
CREATE TRIGGER on_application_deleted
    AFTER DELETE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION decrement_applications_count();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - PROFILES
-- ============================================

-- Ver perfiles: todos pueden ver perfiles públicos
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Insertar perfil: solo el sistema (via trigger)
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Actualizar perfil: solo el propio usuario
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ============================================
-- POLÍTICAS RLS - JOBS
-- ============================================

-- Ver ofertas: todos pueden ver ofertas activas
CREATE POLICY "Anyone can view active jobs"
    ON jobs FOR SELECT
    USING (status = 'active' OR posted_by = auth.uid());

-- Insertar ofertas: solo reclutadores y admins
CREATE POLICY "Recruiters and admins can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('recruiter', 'admin')
        )
    );

-- Actualizar ofertas: solo el creador o admins
CREATE POLICY "Users can update their own jobs"
    ON jobs FOR UPDATE
    USING (
        posted_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Eliminar ofertas: solo el creador o admins
CREATE POLICY "Users can delete their own jobs"
    ON jobs FOR DELETE
    USING (
        posted_by = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- ============================================
-- POLÍTICAS RLS - APPLICATIONS
-- ============================================

-- Ver postulaciones: candidato ve las suyas, reclutador ve las de sus ofertas
CREATE POLICY "Users can view relevant applications"
    ON applications FOR SELECT
    USING (
        candidate_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id
            AND jobs.posted_by = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Insertar postulaciones: solo candidatos a ofertas activas
CREATE POLICY "Candidates can insert applications"
    ON applications FOR INSERT
    WITH CHECK (
        candidate_id = auth.uid()
        AND EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id
            AND jobs.status = 'active'
        )
    );

-- Actualizar postulaciones: reclutador de la oferta o admin
CREATE POLICY "Recruiters can update applications"
    ON applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = applications.job_id
            AND jobs.posted_by = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- Eliminar postulaciones: el candidato o admin
CREATE POLICY "Users can delete their own applications"
    ON applications FOR DELETE
    USING (
        candidate_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- ============================================
-- 8. STORAGE BUCKET PARA CVs
-- ============================================

-- Crear bucket para CVs (ejecutar en Supabase Dashboard o via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Políticas de Storage para CVs
-- Permitir subir CVs solo a usuarios autenticados
-- CREATE POLICY "Authenticated users can upload CVs"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--     bucket_id = 'cvs'
--     AND auth.role() = 'authenticated'
-- );

-- Permitir descargar CVs solo al candidato y al reclutador de la oferta
-- CREATE POLICY "Users can download relevant CVs"
-- ON storage.objects FOR SELECT
-- USING (
--     bucket_id = 'cvs'
--     AND (
--         auth.uid()::text = (storage.foldername(name))[1]
--         OR EXISTS (
--             SELECT 1 FROM applications a
--             JOIN jobs j ON j.id = a.job_id
--             WHERE a.cv_url LIKE '%' || name || '%'
--             AND j.posted_by = auth.uid()
--         )
--     )
-- );

-- ============================================
-- 9. FUNCIONES ÚTILES
-- ============================================

-- Función para buscar ofertas
CREATE OR REPLACE FUNCTION search_jobs(
    search_query TEXT DEFAULT NULL,
    job_location TEXT DEFAULT NULL,
    job_type employment_type DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS SETOF jobs AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM jobs
    WHERE status = 'active'
        AND (search_query IS NULL OR (
            title ILIKE '%' || search_query || '%'
            OR description ILIKE '%' || search_query || '%'
            OR company_name ILIKE '%' || search_query || '%'
        ))
        AND (job_location IS NULL OR location ILIKE '%' || job_location || '%')
        AND (job_type IS NULL OR employment_type = job_type)
    ORDER BY created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de un reclutador
CREATE OR REPLACE FUNCTION get_recruiter_stats(recruiter_id UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_jobs', COUNT(DISTINCT j.id),
        'active_jobs', COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'active'),
        'total_applications', COALESCE(SUM(j.applications_count), 0),
        'pending_applications', COUNT(a.id) FILTER (WHERE a.status = 'pending'),
        'reviewed_applications', COUNT(a.id) FILTER (WHERE a.status = 'reviewed'),
        'accepted_applications', COUNT(a.id) FILTER (WHERE a.status = 'accepted')
    ) INTO stats
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.posted_by = recruiter_id;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. DATOS DE EJEMPLO (OPCIONAL - PARA DESARROLLO)
-- ============================================

-- Comentar o descomentar según necesites datos de prueba

/*
-- Insertar usuario de prueba (debe existir en auth.users)
-- Reemplaza con un UUID real de tu usuario de prueba
INSERT INTO profiles (id, email, full_name, role) VALUES
    ('USER_UUID_AQUI', 'recruiter@example.com', 'Test Recruiter', 'recruiter')
ON CONFLICT (id) DO NOTHING;

-- Insertar oferta de ejemplo
INSERT INTO jobs (
    title,
    company_name,
    description,
    responsibilities,
    requirements,
    team_info,
    company_info,
    benefits,
    location,
    employment_type,
    experience_level,
    english_level,
    education_requirements,
    technical_skills,
    posted_by,
    status
) VALUES (
    'Practicante de Excelencia Operacional',
    'Siemens Energy',
    'Trabajar en el área de Excelencia Operacional, te permitirá tener días muy dinámicos...',
    ARRAY[
        'Apoyo en el programa de innovación y mejora en la fábrica',
        'Apoyo en el área de mejora e infraestructura',
        'Soportar en diseños de ingeniería para bocetos de ideas de mejoras de procesos',
        'Apoyar en implementación de metodologías de mejora en procesos productivos y administrativos'
    ],
    ARRAY[
        'Estudiante profesional universitario de carreras de Ingeniería Industrial o ingeniería mecánica',
        'Conocimientos en: Paquete Office (Manejo de Excel hasta Macros)-Nivel intermedio-avanzado',
        'Conocimiento en análisis de datos (SQL deseable)',
        'Conocimiento en análisis de datos, manejo de macros'
    ],
    'Formarás parte del equipo de Transformadores Colombia; específicamente del departamento de Excelencia Operacional...',
    'En Siemens Energy somos más que una empresa de tecnología energética. Satisfacemos la creciente demanda de energía en más de 90 países...',
    ARRAY['Ruta', 'Restaurante', 'Parqueadero'],
    'Bucaramanga, Colombia',
    'internship',
    'Entry Level',
    'B2 (Intermedio - avanzado)',
    'Ingeniería Industrial o Ingeniería Mecánica',
    ARRAY['Excel', 'Macros', 'SQL', 'Análisis de Datos'],
    'USER_UUID_AQUI',
    'active'
);
*/

-- ============================================
-- SCRIPT COMPLETADO
-- ============================================

-- Para ejecutar este script:
-- 1. Ve a tu proyecto de Supabase
-- 2. Ve a SQL Editor
-- 3. Crea una nueva query
-- 4. Copia y pega este script completo
-- 5. Ejecuta el script
-- 6. Verifica que todas las tablas se hayan creado correctamente

-- Nota: El bucket de storage 'cvs' debe crearse manualmente desde el dashboard
-- de Supabase en la sección Storage, o usando la función insertada arriba.