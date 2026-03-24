-- ============================================
-- ALBATROS - Schéma Supabase
-- Copie-colle ce SQL dans l'éditeur SQL de Supabase
-- Dashboard > SQL Editor > New Query > coller > Run
-- ============================================

-- 1. Table des étudiants
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  study_field TEXT,
  skills TEXT[] DEFAULT '{}',
  city TEXT,
  search_type TEXT CHECK (search_type IN ('stage', 'alternance', 'both')) DEFAULT 'both',
  avatar_url TEXT,
  cv_url TEXT,
  bio TEXT,
  search_status TEXT CHECK (search_status IN ('active', 'open', 'not_searching')) DEFAULT 'active',
  contract_start_date DATE,
  contract_end_date DATE,
  mobility_radius INTEGER DEFAULT 50,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Table des entreprises
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  sector TEXT,
  company_size TEXT,
  description TEXT,
  location TEXT,
  logo_url TEXT,
  website TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Table des offres (créées par les entreprises)
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('stage', 'alternance')) NOT NULL,
  sector TEXT,
  location TEXT,
  duration TEXT,
  salary TEXT,
  skills_required TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  attachment_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Table des candidatures
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  message TEXT,
  cover_letter TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(offer_id, student_id)
);

-- 5. Table des conversations
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, company_id, offer_id)
);

-- 6. Table des messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEX pour la performance
-- ============================================

-- Index existants
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_offers_company_id ON offers(company_id);
CREATE INDEX idx_offers_type ON offers(type);
CREATE INDEX idx_offers_sector ON offers(sector);
CREATE INDEX idx_applications_student_id ON applications(student_id);
CREATE INDEX idx_applications_company_id ON applications(company_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);

-- Nouveaux index pour les clés étrangères ajoutées
CREATE INDEX idx_students_search_status ON students(search_status);
CREATE INDEX idx_offers_is_active ON offers(is_active);
CREATE INDEX idx_offers_start_date ON offers(start_date);
CREATE INDEX idx_applications_offer_id ON applications(offer_id);
CREATE INDEX idx_conversations_student_id ON conversations(student_id);
CREATE INDEX idx_conversations_company_id ON conversations(company_id);
CREATE INDEX idx_conversations_offer_id ON conversations(offer_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_application_id ON messages(application_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Students : lecture publique, écriture par le propriétaire
CREATE POLICY "Students are viewable by everyone"
  ON students FOR SELECT USING (true);

CREATE POLICY "Users can create their own student profile"
  ON students FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile"
  ON students FOR UPDATE USING (auth.uid() = user_id);

-- Companies : lecture publique, écriture par le propriétaire
CREATE POLICY "Companies are viewable by everyone"
  ON companies FOR SELECT USING (true);

CREATE POLICY "Users can create their own company profile"
  ON companies FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company profile"
  ON companies FOR UPDATE USING (auth.uid() = user_id);

-- Offers : lecture publique, écriture par l'entreprise propriétaire
CREATE POLICY "Offers are viewable by everyone"
  ON offers FOR SELECT USING (true);

CREATE POLICY "Companies can create offers"
  ON offers FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id AND companies.user_id = auth.uid())
  );

CREATE POLICY "Companies can update their own offers"
  ON offers FOR UPDATE USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id AND companies.user_id = auth.uid())
  );

CREATE POLICY "Companies can delete their own offers"
  ON offers FOR DELETE USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = company_id AND companies.user_id = auth.uid())
  );

-- Applications : visibles par l'étudiant ou l'entreprise concernée
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT USING (
    auth.uid() = student_id
    OR EXISTS (SELECT 1 FROM companies WHERE companies.id = applications.company_id AND companies.user_id = auth.uid())
  );

CREATE POLICY "Students can create applications"
  ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Companies can update application status"
  ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM companies WHERE companies.id = applications.company_id AND companies.user_id = auth.uid())
  );

-- Conversations : visibles par l'étudiant ou l'entreprise de la conversation
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT USING (
    auth.uid() = student_id OR auth.uid() = company_id
  );

CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT WITH CHECK (
    auth.uid() = student_id OR auth.uid() = company_id
  );

CREATE POLICY "Participants can update their conversations"
  ON conversations FOR UPDATE USING (
    auth.uid() = student_id OR auth.uid() = company_id
  );

-- Messages : visibles par l'envoyeur ou le receveur
CREATE POLICY "Users can view their own messages"
  ON messages FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark their received messages as read"
  ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- STORAGE BUCKETS (à créer manuellement dans Dashboard > Storage)
-- ============================================
-- Créer les buckets suivants :
-- 1. "avatars" — pour les photos de profil
-- 2. "cvs" — pour les CV des étudiants
-- 3. "logos" — pour les logos entreprises
-- 4. "attachments" — pour les pièces jointes des offres
-- Rendre chaque bucket PUBLIC en lecture
