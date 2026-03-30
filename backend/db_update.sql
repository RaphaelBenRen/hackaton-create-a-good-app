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
