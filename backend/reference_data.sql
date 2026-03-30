-- ============================================
-- SCRIPT DE CRÉATION ET REMPLISSAGE DES TABLES DE RÉFÉRENCE
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

CREATE TABLE IF NOT EXISTS public.reference_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    is_top BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.reference_sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    is_top BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.reference_cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL
);

-- =======================
-- INSERTION DES SECTEURS
-- =======================
INSERT INTO public.reference_sectors (name, is_top) VALUES 
('Informatique / Tech', true),
('Commerce / Vente', true),
('Marketing / Communication', true),
('Finance / Comptabilité', true),
('Ressources Humaines', true),
('Ingénierie / Industrie', true),
('Santé / Médical', true),
('Droit / Juridique', false),
('Art / Design / Architecture', false),
('Tourisme / Hôtellerie', false),
('Logistique / Supply Chain', false),
('Éducation / Formation', false),
('Environnement / Développement Durable', false),
('Audiovisuel / Média', false),
('BTP / Construction', false),
('Agriculture / Agroalimentaire', false),
('Assurance / Banque', false),
('Chimie / Biologie', false),
('Consulting / Audit', false),
('Édition / Journalisme', false),
('Immobilier', false),
('Secteur Public / Administration', false),
('Social / Services à la Personne', false),
('Sport / Loisirs', false),
('Transport', false)
ON CONFLICT (name) DO NOTHING;

-- =======================
-- INSERTION DES VILLES
-- =======================
INSERT INTO public.reference_cities (name) VALUES 
('Paris'), ('Marseille'), ('Lyon'), ('Toulouse'), ('Nice'), ('Nantes'), ('Montpellier'), ('Strasbourg'), ('Bordeaux'), ('Lille'),
('Rennes'), ('Reims'), ('Toulon'), ('Saint-Étienne'), ('Le Havre'), ('Grenoble'), ('Dijon'), ('Angers'), ('Nîmes'), ('Villeurbanne'),
('Aix-en-Provence'), ('Clermont-Ferrand'), ('Le Mans'), ('Brest'), ('Tours'), ('Amiens'), ('Annecy'), ('Limoges'), ('Metz'), ('Besançon'),
('Orléans'), ('Rouen')
ON CONFLICT (name) DO NOTHING;

-- =======================
-- INSERTION DES MÉTIERS
-- =======================
INSERT INTO public.reference_jobs (name, is_top) VALUES 
('Développeur Full-Stack', true),
('Développeur Front-End', true),
('Développeur Back-End', true),
('Data Analyst', true),
('Chef de Projet IT', true),
('Product Manager', true),
('UX/UI Designer', true),
('Ingénieur d''Affaires', true),
('Responsable Marketing', true),
('Assistant RH', true),
('Contrôleur de Gestion', true),
('Développeur React', false), ('Développeur Node.js', false), ('Développeur Python', false), ('Développeur Java', false), ('Développeur C++', false),
('Développeur iOS', false), ('Développeur Android', false), ('Développeur Flutter', false), ('Tech Lead', false), ('Architecte Logiciel', false),
('Data Scientist', false), ('Data Engineer', false), ('Ingénieur Machine Learning', false), ('Ingénieur IA', false), ('Analyste BI', false),
('Scrum Master', false), ('Product Owner', false), ('Directeur Technique (CTO)', false), ('Ingénieur DevOps', false), ('Cloud Engineer', false),
('Administrateur Systèmes', false), ('Administrateur Réseaux', false), ('Ingénieur Cybersécurité', false), ('Analyste SOC', false),
('Testeur QA', false), ('Ingénieur Qualité Logicielle', false), ('Intégrateur Web', false), ('Webmaster', false),
('Web Designer', false), ('Graphiste', false), ('Directeur Artistique', false), ('Motion Designer', false), ('Product Designer', false),
('Illustrateur', false), ('Monteur Vidéo', false), ('Game Designer', false), ('Level Designer', false),
('Assistant Marketing', false), ('Chef de Produit', false), ('Growth Hacker', false), ('Traffic Manager', false), ('Community Manager', false),
('Social Media Manager', false), ('Chargé de Communication', false), ('Attaché de Presse', false), ('Rédacteur Web', false), ('Copywriter', false),
('Responsable SEO', false), ('Consultant SEA', false), ('E-Merchandiser', false), ('Chef de Projet Digital', false),
('Commercial', false), ('Business Developer', false), ('Account Manager', false), ('Key Account Manager', false), ('Sales Representative', false),
('Directeur Commercial', false), ('Chef de Secteur', false), ('Assistant Commercial', false), ('Customer Success Manager', false),
('Acheteur', false), ('Supply Chain Manager', false), ('Logisticien', false), ('Responsable Logistique', false),
('Expert-Comptable', false), ('Analyste Financier', false), ('Auditeur', false), ('Trésorier', false), ('Directeur Financier (CFO)', false),
('Assistant de Gestion', false), ('Chargé de Recrutement', false), ('Consultant en Recrutement', false), ('Gestionnaire de Paie', false),
('Responsable Ressources Humaines (RRH)', false), ('Directeur des Ressources Humaines (DRH)', false),
('Ingénieur Mécanique', false), ('Ingénieur Électronique', false), ('Ingénieur Aéronautique', false), ('Ingénieur BTP', false),
('Chef de Chantier', false), ('Conducteur de Travaux', false), ('Architecte', false), ('Dessinateur Projeteur', false),
('Technicien de Maintenance', false), ('Ingénieur R&D', false), ('Ingénieur Qualité', false), ('Ingénieur Environnement', false)
ON CONFLICT (name) DO NOTHING;
