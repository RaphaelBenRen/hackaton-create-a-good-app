-- ============================================
-- SCRIPT DE MISE À JOUR DE LA BASE DE DONNÉES
-- Ajout des colonnes pour l'analyse du CV et les recommandations
-- À copier-coller dans le SQL Editor de Supabase
-- ============================================

-- Ajout des nouvelles colonnes à la table students
ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS experiences JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS target_job VARCHAR(255),
ADD COLUMN IF NOT EXISTS qualities TEXT[] DEFAULT '{}';

-- Ajout des nouvelles colonnes à la table applications
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS cover_letter TEXT,
ADD COLUMN IF NOT EXISTS cv_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS cover_letter_url VARCHAR(255);
COMMENT ON COLUMN public.students.target_job IS 'Le métier ciblé par l''étudiant';
COMMENT ON COLUMN public.students.experiences IS 'Historique professionnel extrait du CV (JSON array)';
COMMENT ON COLUMN public.students.education IS 'Parcours académique extrait du CV (JSON array)';
COMMENT ON COLUMN public.students.qualities IS 'Qualités et soft skills extraits du CV';

-- Ajout des colonnes pour les offres de stage au format PDF
ALTER TABLE public.offers
ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(255);
COMMENT ON COLUMN public.offers.pdf_url IS 'Lien vers le PDF original de l''offre importé par l''entreprise';

-- Résolution de l'erreur "could not find a relationship" entre applications et students
ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_student_id_fkey,
  ADD CONSTRAINT applications_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(user_id) ON DELETE CASCADE;

-- Ajout de la table de référence pour les rémunérations
CREATE TABLE IF NOT EXISTS public.reference_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    is_top BOOLEAN DEFAULT false
);

INSERT INTO public.reference_salaries (name, is_top) VALUES 
('Non rémunéré', true),
('Gratification légale (~600€)', true),
('800€ - 1000€', true),
('1000€ - 1200€', true),
('1200€ - 1500€', false),
('1500€ - 2000€', false),
('+ 2000€', false)
ON CONFLICT (name) DO NOTHING;

-- Ajout de la table de référence pour les compétences (skills)
CREATE TABLE IF NOT EXISTS public.reference_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    is_top BOOLEAN DEFAULT false
);

INSERT INTO public.reference_skills (name, is_top) VALUES 
('React', true), ('Node.js', true), ('Python', true), ('Java', true), 
('Excel', true), ('PowerPoint', true), ('Photoshop', true), ('Figma', true), 
('SEO', true), ('Management', true), ('Communication', true), ('Marketing', true),
('Vente', true), ('Design UI/UX', true), ('TypeScript', true), ('SQL', false), ('Git', false)
ON CONFLICT (name) DO NOTHING;
-- Ajout du type de candidature (postulation ou invitation)
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('apply', 'invite')) DEFAULT 'apply';
COMMENT ON COLUMN public.applications.type IS 'Indique si c''est l''étudiant qui a postulé (apply) ou l''entreprise qui a invité (invite)';
