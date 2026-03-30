const fs = require('fs');
const crypto = require('crypto');

function generateUUID() {
    return crypto.randomUUID();
}

// Data Arrays for generation
const firstNames = ['Lucas', 'Emma', 'Louis', 'Jade', 'Gabriel', 'Louise', 'Léo', 'Alice', 'Raphaël', 'Ambre', 'Arthur', 'Lina', 'Maël', 'Rose', 'Noah', 'Chloé', 'Hugo', 'Mia', 'Jules', 'Léa', 'Adam', 'Anna', 'Paul', 'Julia', 'Tiago', 'Léna', 'Gabin', 'Inès', 'Sacha', 'Zoé', 'Éden', 'Agathe', 'Victor', 'Juliette', 'Aaron', 'Lou'];
const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre', 'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier'];
const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Nantes', 'Lille', 'Strasbourg', 'Rennes', 'Montpellier', 'Nice', 'Grenoble', 'Dijon', 'Angers'];

const allSkills = {
    'Informatique': ['React', 'Node.js', 'Python', 'Machine Learning', 'Cybersécurité', 'Cloud'],
    'Médecine & Santé': ['Soins Infirmiers', 'Gestion Hospitalière', 'Télémédecine', 'Recherche Médicale', 'Biologie'],
    'Finance & Banque': ['Analyse Financière', 'Comptabilité', 'Excel Avancé', 'Gestion de Patrimoine', 'Audit'],
    'Commerce & Vente': ['Négociation B2B', 'CRM', 'Retail', 'Prospection', 'Gestion de Boutique'],
    'Marketing': ['SEO', 'Réseaux Sociaux', 'Stratégie Digitale', 'Figma', 'Copywriting'],
    'Environnement': ['RSE', 'Énergies Renouvelables', 'Analyse Carbone', 'Gestion des Déchets'],
    'Ressources Humaines': ['Recrutement', 'Paie', 'Droit Social', 'Marque Employeur'],
    'Immobilier': ['Transaction Immobilière', 'Gestion Locative', 'Estimation', 'Prospection Foncière']
};

const sectorsList = Object.keys(allSkills);

// 30 non-tech focus and some tech
const companyTemplates = [
    { name: 'BNP Paribas', sector: 'Finance & Banque' },
    { name: 'Société Générale', sector: 'Finance & Banque' },
    { name: 'AXA', sector: 'Finance & Banque' },
    { name: 'LCL', sector: 'Finance & Banque' },
    { name: 'Doctolib', sector: 'Médecine & Santé' },
    { name: 'Sanofi', sector: 'Médecine & Santé' },
    { name: 'AP-HP', sector: 'Médecine & Santé' },
    { name: 'Clinique Pasteur', sector: 'Médecine & Santé' },
    { name: "L'Oréal", sector: 'Commerce & Vente' },
    { name: 'Carrefour', sector: 'Commerce & Vente' },
    { name: 'Decathlon', sector: 'Commerce & Vente' },
    { name: 'Sephora', sector: 'Commerce & Vente' },
    { name: 'Vinci', sector: 'Immobilier' },
    { name: 'Nexity', sector: 'Immobilier' },
    { name: 'Foncia', sector: 'Immobilier' },
    { name: 'Veolia', sector: 'Environnement' },
    { name: 'Engie', sector: 'Environnement' },
    { name: 'Suez', sector: 'Environnement' },
    { name: 'Adecco', sector: 'Ressources Humaines' },
    { name: 'Randstad', sector: 'Ressources Humaines' },
    { name: 'Publicis', sector: 'Marketing' },
    { name: 'Havas', sector: 'Marketing' },
    { name: 'Capgemini', sector: 'Informatique' },
    { name: 'Dassault Systèmes', sector: 'Informatique' },
    { name: 'Airbus', sector: 'Ingénierie' },
    { name: 'Thales', sector: 'Ingénierie' },
    { name: 'Pharmacie Lafayette', sector: 'Médecine & Santé' },
    { name: 'Crédit Mutuel', sector: 'Finance & Banque' },
    { name: 'Auchan Retail', sector: 'Commerce & Vente' },
    { name: 'Century 21', sector: 'Immobilier' }
];

const companySizes = ['1-10', '10-50', '50-200', '200-500', '500+'];
const offerTypes = ['stage', 'alternance'];

let sql = `-- ============================================
-- Supprime proprement uniquement les fausses données générées par le script précédent (pour ne pas toucher aux vrais comptes de l'utilisateur)
DELETE FROM public.applications WHERE student_id IN (SELECT id FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.applications WHERE company_id IN (SELECT id FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.conversations WHERE student_id IN (SELECT id FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.offers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%');
DELETE FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%');
DELETE FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%';

`;

let usersSql = `INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change) VALUES\n`;
let companiesSql = `INSERT INTO public.companies (id, user_id, company_name, sector, company_size, description, location, website, contact_email, contact_phone) VALUES\n`;
let studentsSql = `INSERT INTO public.students (id, user_id, first_name, last_name, study_field, skills, city, search_type, bio, search_status, mobility_radius) VALUES\n`;
let offersSql = `INSERT INTO public.offers (id, company_id, title, description, type, sector, location, duration, salary, skills_required, start_date, is_active) VALUES\n`;

const companies = [];

// Generate Companies from templates
companyTemplates.forEach((template, i) => {
    const userId = generateUUID();
    const companyId = generateUUID();
    const email = `contact@${template.name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.com`;
    
    usersSql += `('${userId}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),\n`;
    
    companiesSql += `('${companyId}', '${userId}', '${template.name.replace(/'/g, "''")}', '${template.sector.replace(/'/g, "''")}', '${companySizes[Math.floor(Math.random() * companySizes.length)]}', 'Poste au sein de ${template.name.replace(/'/g, "''")}', '${cities[Math.floor(Math.random() * cities.length)]}', 'https://${template.name.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.com', '${email}', '0102030405'),\n`;
    
    companies.push({ id: companyId, sector: template.sector });
});

// Generate Students (30) mapped to sectors
for (let i = 0; i < 30; i++) {
    const userId = generateUUID();
    const studentId = generateUUID();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@student.fr`;
    
    const studyField = sectorsList[Math.floor(Math.random() * sectorsList.length)];
    const availableSkills = allSkills[studyField] || ['Polyvalence', 'Organisation'];
    
    const studentSkills = [];
    for(let k=0; k<2; k++) {
        studentSkills.push('"' + availableSkills[Math.floor(Math.random() * availableSkills.length)] + '"');
    }
    const skillsStr = `{${Array.from(new Set(studentSkills)).join(',')}}`;
    
    usersSql += `('${userId}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', '${i == 29 ? '' : ''}')`;
    if (i < 29) usersSql += ',\n'; else usersSql += '\nON CONFLICT (id) DO NOTHING;\n\n';
    
    studentsSql += `('${studentId}', '${userId}', '${firstName.replace(/'/g, "''")}', '${lastName.replace(/'/g, "''")}', '${studyField.replace(/'/g, "''")}', '${skillsStr}', '${cities[Math.floor(Math.random() * cities.length)]}', '${['stage', 'alternance', 'both'][Math.floor(Math.random()*3)]}', 'Étudiant motivé pour rejoindre le secteur ${studyField.replace(/'/g, "''")}.', 'active', 50)`;
    if (i < 29) studentsSql += ',\n'; else studentsSql += '\nON CONFLICT (user_id) DO NOTHING;\n\n';
}

// Generate Offers (2-3 per company)
const getRoleFromSector = (sector, type) => {
    switch(sector) {
        case 'Finance & Banque': return type === 'stage' ? 'Stagiaire Analyste Financier' : 'Alternant Conseiller Bancaire';
        case 'Médecine & Santé': return type === 'stage' ? 'Stagiaire Assistant Médical' : 'Alternant Gestion Clinique';
        case 'Commerce & Vente': return type === 'stage' ? 'Stagiaire Vente & Conseil' : 'Alternant Business Developer';
        case 'Environnement': return type === 'stage' ? 'Stagiaire RSE' : 'Alternant Chef de Projet Vert';
        case 'Marketing': return type === 'stage' ? 'Stagiaire Assistant Marketing' : 'Alternant Traffic Manager';
        case 'Immobilier': return type === 'stage' ? 'Stagiaire Négociateur' : 'Alternant Gestionnaire de Copropriété';
        case 'Ressources Humaines': return type === 'stage' ? 'Stagiaire Recrutement' : 'Alternant Assistant RH';
        default: return type === 'stage' ? 'Stagiaire Polyvalent' : 'Alternant Polyvalent';
    }
};

let offerCount = 0;
const totalOffers = companies.length * 2;

const descriptionTemplates = [
    "En tant que [TITLE] au sein de notre entreprise, vous serez au cœur de notre développement. \n\nVos missions :\n- Assister l'équipe dans ses tâches quotidiennes stratégiques.\n- Participer activement aux projets en cours et proposer des solutions innovantes.\n- Veiller au bon déroulement des opérations et au respect des délais.\n\nCe que nous recherchons :\nÉtudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d'équipe. Vous avez une bonne capacité d'analyse et êtes force de proposition.",
    "Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) [TITLE].\n\nVos responsabilités :\n- Prendre en charge des dossiers spécifiques et les mener à bien.\n- Assurer le reporting et le suivi des indicateurs clés (KPIs).\n- Travailler de concert avec les différents départements de l'entreprise.\n\nVotre profil :\nDoté(e) d'un excellent relationnel, vous savez faire preuve de rigueur et d'adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.",
    "Nous sommes à la recherche de notre futur(e) [TITLE] pour accompagner notre forte croissance.\n\nLe poste :\n- Co-construire et déployer la stratégie de notre département.\n- Analyser les données existantes pour optimiser nos processus.\n- Aider à la gestion de la relation client/partenaire.\n\nVos qualités :\nUne grande soif d'apprendre, beaucoup d'autonomie et une véritable passion pour votre domaine d'études. Rejoignez-nous pour une aventure formatrice !"
];

const salaries = {
    stage: ['800 € / mois', '1000 € / mois', '1200 € / mois', 'Indemnité légale + primes'],
    alternance: ['1200 € / mois', '1500 € / mois', '1800 € / mois', 'Selon grille légale alternance']
};

const durations = {
    stage: ['4 mois', '6 mois', '6 mois (Temps plein)'],
    alternance: ['1 an', '2 ans', '12 mois (Rythme 3 sem / 1 sem)', '24 mois']
};

for (let i = 0; i < companies.length; i++) {
    for (let j = 0; j < 2; j++) {
        offerCount++;
        const offerId = generateUUID();
        const type = offerTypes[Math.floor(Math.random() * offerTypes.length)];
        const sector = companies[i].sector;
        const title = getRoleFromSector(sector, type);
        
        const descTemplate = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];
        const description = descTemplate.replace(/\[TITLE\]/g, title);

        const availableSkills = allSkills[sector] || ['Polyvalence', 'Autonomie'];
        const numberOfSkills = Math.min(availableSkills.length, Math.floor(Math.random() * 3) + 2); // 2 to 4 skills
        const shuffledSkills = [...availableSkills].sort(() => 0.5 - Math.random());
        const offerSkills = shuffledSkills.slice(0, numberOfSkills).map(s => '"' + s + '"');
        const skillsStr = `{${offerSkills.join(',')}}`;
        
        const salary = salaries[type][Math.floor(Math.random() * salaries[type].length)];
        const duration = durations[type][Math.floor(Math.random() * durations[type].length)];

        offersSql += `('${offerId}', '${companies[i].id}', '${title.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', '${type}', '${sector.replace(/'/g, "''")}', '${cities[Math.floor(Math.random() * cities.length)]}', '${duration}', '${salary}', '${skillsStr}', '2026-09-01', true)`;
        
        if (offerCount === totalOffers) offersSql += ';\n'; else offersSql += ',\n';
    }
}

companiesSql = companiesSql.slice(0, -2) + '\nON CONFLICT (user_id) DO NOTHING;\n\n';

sql += usersSql + companiesSql + studentsSql + offersSql;

fs.writeFileSync('mock_data.sql', sql);
console.log('mock_data.sql successfully updated with diverse sectors (Finance, Medical, Commerce, etc).');
