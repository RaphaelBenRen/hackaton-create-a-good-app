-- ============================================
-- Supprime proprement uniquement les fausses données générées par le script précédent (pour ne pas toucher aux vrais comptes de l'utilisateur)
DELETE FROM public.applications WHERE student_id IN (SELECT id FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.applications WHERE company_id IN (SELECT id FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.conversations WHERE student_id IN (SELECT id FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.offers WHERE company_id IN (SELECT id FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%'));
DELETE FROM public.students WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%');
DELETE FROM public.companies WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%');
DELETE FROM auth.users WHERE email LIKE '%@student.fr' OR email LIKE 'contact@%';

INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change) VALUES
('5ead514f-98e7-4e8d-9d66-e567e4bf01b5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@bnpparibas.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('4ca419fc-fe2e-4252-a404-cd61d9bc99b4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@sociétégénérale.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('3f7efdc7-f2e2-4f51-ae10-5c82f06b7b67', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@axa.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('b961a92c-4946-478b-8ad5-77f20f11cf35', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@lcl.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('ca20160f-7c86-4007-a24d-8b3774f83644', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@doctolib.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('f06bdc5f-cfe2-46ff-8664-66cb81dfe9b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@sanofi.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('682d107f-675e-4c55-9d58-12bd8191eade', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@ap-hp.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('39a65e88-cf04-4bd8-ae48-5d7ede52301d', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@cliniquepasteur.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('0aa7ce58-ea1b-4aa1-9174-08c7fc725082', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@loréal.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('c0f544b3-a491-42c8-9c2f-ffd10cd1d027', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@carrefour.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('052d67df-3848-4b00-bf52-5955c74c9119', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@decathlon.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('019cbd9f-04db-47d9-bdde-136d9a7a6a4b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@sephora.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('ee469d79-9eba-49f9-8150-fc94558b2f68', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@vinci.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('b300cade-e4ff-4d1c-887c-4487f0dfa9e3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@nexity.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('c75b7b86-da96-448a-a5e6-d0ef4d46e120', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@foncia.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('84876a7e-db3c-4dec-ad74-c2afde36e640', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@veolia.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('4385b287-0c10-496f-b9ba-5e193bd5c977', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@engie.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('7ad9aa1a-c2c1-43bd-8187-4c2aebbef8f8', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@suez.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('86eacaf8-6314-49b5-b04a-b5d4fddc27c5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@adecco.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('efe9be92-cdf3-40b1-bddc-d2974bc7e077', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@randstad.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('ae8e71ce-d05f-4b50-b2b7-fac3bf24d97e', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@publicis.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('7bdf1ed7-2a01-47b8-b065-e2a4896728e7', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@havas.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('b66bf429-c022-4175-8352-7e43954c0654', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@capgemini.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('bc2f9985-d1d8-4a5b-9253-5cf7154f742a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@dassaultsystèmes.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('fde37f22-f012-406b-9cb0-a51aca7e2397', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@airbus.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('e4ed575d-bbcb-4995-a21d-3d1146d3b578', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@thales.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('197cd478-3c20-4040-a070-5a97b3223cea', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@pharmacielafayette.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('ce9b7f7e-2910-4f24-9df3-349ef368df3f', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@créditmutuel.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('88517f9b-a7af-4aa3-86cf-250e22b6cfdd', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@auchanretail.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('39be7c60-5834-4693-a760-7a8a735f5228', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'contact@century21.com', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('0056adce-95ec-4730-8367-09067138c29c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chloé.michel0@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('4335c55f-df38-4e2f-8567-935c4c3d040d', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice.martin1@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('85b6663f-e80b-48b4-9d3f-d42a00fb7722', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maël.leroy2@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('15495b2c-4237-482a-a439-a8cd6ccd49ab', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sacha.blanc3@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('cd850960-4610-4e99-9c58-8528b0e4eb21', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'léa.richard4@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('879bca44-8307-4e50-9933-6cd041bb989c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'adam.muller5@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('49e37436-82a1-4441-857d-ae115cb36c46', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sacha.boyer6@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('b32bb801-147d-40d5-9cf8-732304665280', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'noah.girard7@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('61e09921-c8af-41c8-ba5f-ae3975c89c20', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maël.bertrand8@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('a8f8790c-d609-4f18-b18c-17465fe3f4d0', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'maël.faure9@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('d07f56a4-dc6d-4260-a290-6665fd1774d2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ambre.mercier10@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('a28d0bf6-542b-4c10-8948-dc6b9d8fa7e2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hugo.petit11@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('1bbbf4bb-bc8e-49de-be37-be8a0ce3379f', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ambre.bertrand12@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('9d77ff8b-aeb9-4458-b46e-4db902428adc', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agathe.muller13@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('bc390ccb-e8fd-4a51-8334-4856cdbf0f48', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'inès.bertrand14@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('03343eaa-cf12-4d0a-a4e2-c6f72d61e124', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'léa.laurent15@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('1e90d0c9-c28c-48a0-801d-cf229a2f6570', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'arthur.martin16@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('793887a1-c632-4119-bce4-fd8256a0bfcf', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'paul.bertrand17@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('2314a8d0-da30-4be6-8bb9-cb921f2e506b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jules.robert18@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('0844eb7d-1424-4b4d-a6f2-e9c3254acbd6', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'paul.leroy19@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('0320bbf5-072a-43d7-b676-1333a44a2c68', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jules.petit20@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('c457057c-12c1-49d1-90f5-09f52ca896c6', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'léo.lambert21@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('f641dabd-a719-42a4-82e3-69c87f208c52', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chloé.michel22@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('04100ca5-8ac4-4530-9838-69ca88c208ea', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'louis.andre23@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('960ebaba-d20d-4dd0-8330-c3bfe80c7169', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mia.martin24@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('98bd2921-c92d-48fb-a200-5e593fbe26f5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'inès.bertrand25@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('1fe047a7-25fe-4d6f-87ec-9538caf6617c', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jules.roux26@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('14e22e6b-1060-4c99-8b9a-bc3d5018482e', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'louise.bertrand27@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('9f0585e4-e9d7-4f19-a9c4-870a051bcab3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tiago.roux28@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', ''),
('0c8407ba-a227-47f2-8fe1-842c50912e00', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lou.leroy29@student.fr', crypt('password123', gen_salt('bf')), now(), '{"provider": "email", "providers": ["email"]}', '{}', now(), now(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.companies (id, user_id, company_name, sector, company_size, description, location, website, contact_email, contact_phone) VALUES
('13b812c8-36f0-4f31-9871-a675fbcc455f', '5ead514f-98e7-4e8d-9d66-e567e4bf01b5', 'BNP Paribas', 'Finance & Banque', '500+', 'Poste au sein de BNP Paribas', 'Grenoble', 'https://bnpparibas.com', 'contact@bnpparibas.com', '0102030405'),
('62e86a42-11e3-4efb-a917-dbf5f54c653d', '4ca419fc-fe2e-4252-a404-cd61d9bc99b4', 'Société Générale', 'Finance & Banque', '50-200', 'Poste au sein de Société Générale', 'Dijon', 'https://sociétégénérale.com', 'contact@sociétégénérale.com', '0102030405'),
('dddc4bf2-2f92-4ee7-a514-d2fb7db17618', '3f7efdc7-f2e2-4f51-ae10-5c82f06b7b67', 'AXA', 'Finance & Banque', '10-50', 'Poste au sein de AXA', 'Marseille', 'https://axa.com', 'contact@axa.com', '0102030405'),
('c5e68e43-53cc-4cf0-afd9-0a89c74fd4cd', 'b961a92c-4946-478b-8ad5-77f20f11cf35', 'LCL', 'Finance & Banque', '10-50', 'Poste au sein de LCL', 'Nice', 'https://lcl.com', 'contact@lcl.com', '0102030405'),
('9e86a05a-b529-457a-9b3a-c3688c4dd486', 'ca20160f-7c86-4007-a24d-8b3774f83644', 'Doctolib', 'Médecine & Santé', '1-10', 'Poste au sein de Doctolib', 'Montpellier', 'https://doctolib.com', 'contact@doctolib.com', '0102030405'),
('bc2f1364-1a71-442a-bd0a-22c0b2d51cf1', 'f06bdc5f-cfe2-46ff-8664-66cb81dfe9b2', 'Sanofi', 'Médecine & Santé', '1-10', 'Poste au sein de Sanofi', 'Marseille', 'https://sanofi.com', 'contact@sanofi.com', '0102030405'),
('bcef9f96-2a6a-4bcb-bb75-973a04bba7a7', '682d107f-675e-4c55-9d58-12bd8191eade', 'AP-HP', 'Médecine & Santé', '500+', 'Poste au sein de AP-HP', 'Rennes', 'https://ap-hp.com', 'contact@ap-hp.com', '0102030405'),
('0df71ee2-3ddc-4e9b-b035-e8865ae6ba4f', '39a65e88-cf04-4bd8-ae48-5d7ede52301d', 'Clinique Pasteur', 'Médecine & Santé', '50-200', 'Poste au sein de Clinique Pasteur', 'Strasbourg', 'https://cliniquepasteur.com', 'contact@cliniquepasteur.com', '0102030405'),
('bbfd9bd5-f2ab-4fa1-941a-694aa4403eca', '0aa7ce58-ea1b-4aa1-9174-08c7fc725082', 'L''Oréal', 'Commerce & Vente', '50-200', 'Poste au sein de L''Oréal', 'Angers', 'https://loréal.com', 'contact@loréal.com', '0102030405'),
('2e7121d4-4fe7-4c91-b42b-8caa147b8be3', 'c0f544b3-a491-42c8-9c2f-ffd10cd1d027', 'Carrefour', 'Commerce & Vente', '50-200', 'Poste au sein de Carrefour', 'Paris', 'https://carrefour.com', 'contact@carrefour.com', '0102030405'),
('a4e7eada-840c-4bb5-9d58-5cd042d919c4', '052d67df-3848-4b00-bf52-5955c74c9119', 'Decathlon', 'Commerce & Vente', '1-10', 'Poste au sein de Decathlon', 'Toulouse', 'https://decathlon.com', 'contact@decathlon.com', '0102030405'),
('7e3e82f0-f221-435e-939c-712979886065', '019cbd9f-04db-47d9-bdde-136d9a7a6a4b', 'Sephora', 'Commerce & Vente', '10-50', 'Poste au sein de Sephora', 'Rennes', 'https://sephora.com', 'contact@sephora.com', '0102030405'),
('3c400ec2-74fb-40d2-912a-c6d667051d88', 'ee469d79-9eba-49f9-8150-fc94558b2f68', 'Vinci', 'Immobilier', '50-200', 'Poste au sein de Vinci', 'Lille', 'https://vinci.com', 'contact@vinci.com', '0102030405'),
('323df3d8-661c-4d2a-8b18-e15d04d49d95', 'b300cade-e4ff-4d1c-887c-4487f0dfa9e3', 'Nexity', 'Immobilier', '50-200', 'Poste au sein de Nexity', 'Bordeaux', 'https://nexity.com', 'contact@nexity.com', '0102030405'),
('bea3cd00-4241-43f0-8732-3a8c579ce91a', 'c75b7b86-da96-448a-a5e6-d0ef4d46e120', 'Foncia', 'Immobilier', '500+', 'Poste au sein de Foncia', 'Grenoble', 'https://foncia.com', 'contact@foncia.com', '0102030405'),
('f634b5a3-bac8-431d-9d0c-6563c1a8c997', '84876a7e-db3c-4dec-ad74-c2afde36e640', 'Veolia', 'Environnement', '500+', 'Poste au sein de Veolia', 'Dijon', 'https://veolia.com', 'contact@veolia.com', '0102030405'),
('a4c41d8d-802d-4176-8c6b-b5ce4d64ddc9', '4385b287-0c10-496f-b9ba-5e193bd5c977', 'Engie', 'Environnement', '10-50', 'Poste au sein de Engie', 'Dijon', 'https://engie.com', 'contact@engie.com', '0102030405'),
('4630de2f-322a-4089-ac54-6977ffed8208', '7ad9aa1a-c2c1-43bd-8187-4c2aebbef8f8', 'Suez', 'Environnement', '200-500', 'Poste au sein de Suez', 'Paris', 'https://suez.com', 'contact@suez.com', '0102030405'),
('5b7c0300-a7d6-4593-b41b-d8823498d18e', '86eacaf8-6314-49b5-b04a-b5d4fddc27c5', 'Adecco', 'Ressources Humaines', '1-10', 'Poste au sein de Adecco', 'Nice', 'https://adecco.com', 'contact@adecco.com', '0102030405'),
('ec352069-e093-46ef-981b-66486b89aa1f', 'efe9be92-cdf3-40b1-bddc-d2974bc7e077', 'Randstad', 'Ressources Humaines', '500+', 'Poste au sein de Randstad', 'Grenoble', 'https://randstad.com', 'contact@randstad.com', '0102030405'),
('75e57ecc-2e0c-4e49-93b1-77a807b72d28', 'ae8e71ce-d05f-4b50-b2b7-fac3bf24d97e', 'Publicis', 'Marketing', '1-10', 'Poste au sein de Publicis', 'Marseille', 'https://publicis.com', 'contact@publicis.com', '0102030405'),
('16e0223a-6966-405a-a672-eaee202fb99f', '7bdf1ed7-2a01-47b8-b065-e2a4896728e7', 'Havas', 'Marketing', '50-200', 'Poste au sein de Havas', 'Angers', 'https://havas.com', 'contact@havas.com', '0102030405'),
('a9a951b4-7838-4a15-a1f7-7d3eef8aa1a2', 'b66bf429-c022-4175-8352-7e43954c0654', 'Capgemini', 'Informatique', '200-500', 'Poste au sein de Capgemini', 'Montpellier', 'https://capgemini.com', 'contact@capgemini.com', '0102030405'),
('de56388a-a370-41ba-91f2-c8402e33ae13', 'bc2f9985-d1d8-4a5b-9253-5cf7154f742a', 'Dassault Systèmes', 'Informatique', '50-200', 'Poste au sein de Dassault Systèmes', 'Montpellier', 'https://dassaultsystèmes.com', 'contact@dassaultsystèmes.com', '0102030405'),
('fe5663c5-4d6c-4c2a-84fb-0c497bcf1805', 'fde37f22-f012-406b-9cb0-a51aca7e2397', 'Airbus', 'Ingénierie', '200-500', 'Poste au sein de Airbus', 'Grenoble', 'https://airbus.com', 'contact@airbus.com', '0102030405'),
('716596f2-a7ef-4f7e-b0b6-1e3f415c062f', 'e4ed575d-bbcb-4995-a21d-3d1146d3b578', 'Thales', 'Ingénierie', '200-500', 'Poste au sein de Thales', 'Toulouse', 'https://thales.com', 'contact@thales.com', '0102030405'),
('6326c572-987c-46b4-8e7b-04297531e172', '197cd478-3c20-4040-a070-5a97b3223cea', 'Pharmacie Lafayette', 'Médecine & Santé', '500+', 'Poste au sein de Pharmacie Lafayette', 'Strasbourg', 'https://pharmacielafayette.com', 'contact@pharmacielafayette.com', '0102030405'),
('65d9dbcd-fad0-4332-ba2c-a67e133fa9bb', 'ce9b7f7e-2910-4f24-9df3-349ef368df3f', 'Crédit Mutuel', 'Finance & Banque', '50-200', 'Poste au sein de Crédit Mutuel', 'Lyon', 'https://créditmutuel.com', 'contact@créditmutuel.com', '0102030405'),
('63b2c03a-fa4d-4dfe-9643-5b4ffb914f47', '88517f9b-a7af-4aa3-86cf-250e22b6cfdd', 'Auchan Retail', 'Commerce & Vente', '500+', 'Poste au sein de Auchan Retail', 'Bordeaux', 'https://auchanretail.com', 'contact@auchanretail.com', '0102030405'),
('c90fe45d-66c6-49ad-a93f-cbef8e59eb11', '39be7c60-5834-4693-a760-7a8a735f5228', 'Century 21', 'Immobilier', '200-500', 'Poste au sein de Century 21', 'Strasbourg', 'https://century21.com', 'contact@century21.com', '0102030405')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.students (id, user_id, first_name, last_name, study_field, skills, city, search_type, bio, search_status, mobility_radius) VALUES
('d6edb04b-a0f2-49eb-94bc-9b994615a7bb', '0056adce-95ec-4730-8367-09067138c29c', 'Chloé', 'Michel', 'Finance & Banque', '{"Comptabilité","Analyse Financière"}', 'Bordeaux', 'both', 'Étudiant motivé pour rejoindre le secteur Finance & Banque.', 'active', 50),
('88ca0035-8573-4a52-be63-15e451ba5ad5', '4335c55f-df38-4e2f-8567-935c4c3d040d', 'Alice', 'Martin', 'Médecine & Santé', '{"Télémédecine","Recherche Médicale"}', 'Lyon', 'alternance', 'Étudiant motivé pour rejoindre le secteur Médecine & Santé.', 'active', 50),
('53ba8a84-3704-41d8-bbe2-b3f1481716fe', '85b6663f-e80b-48b4-9d3f-d42a00fb7722', 'Maël', 'Leroy', 'Marketing', '{"Stratégie Digitale","SEO"}', 'Nantes', 'stage', 'Étudiant motivé pour rejoindre le secteur Marketing.', 'active', 50),
('57c1907a-45aa-4593-a8d5-24e89f42d342', '15495b2c-4237-482a-a439-a8cd6ccd49ab', 'Sacha', 'Blanc', 'Finance & Banque', '{"Excel Avancé","Gestion de Patrimoine"}', 'Strasbourg', 'alternance', 'Étudiant motivé pour rejoindre le secteur Finance & Banque.', 'active', 50),
('69ff7ee1-d631-4661-8a5d-1c23aae57b75', 'cd850960-4610-4e99-9c58-8528b0e4eb21', 'Léa', 'Richard', 'Commerce & Vente', '{"Négociation B2B","Gestion de Boutique"}', 'Strasbourg', 'alternance', 'Étudiant motivé pour rejoindre le secteur Commerce & Vente.', 'active', 50),
('abd46c16-b9de-4aaf-a79c-0deae1f1586c', '879bca44-8307-4e50-9933-6cd041bb989c', 'Adam', 'Muller', 'Environnement', '{"RSE"}', 'Paris', 'stage', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('89986269-1d71-4b66-b6bc-15deb5414a73', '49e37436-82a1-4441-857d-ae115cb36c46', 'Sacha', 'Boyer', 'Informatique', '{"Machine Learning","Node.js"}', 'Marseille', 'stage', 'Étudiant motivé pour rejoindre le secteur Informatique.', 'active', 50),
('0487dd52-07f2-4774-b0fa-89cdcbd89171', 'b32bb801-147d-40d5-9cf8-732304665280', 'Noah', 'Girard', 'Médecine & Santé', '{"Télémédecine","Gestion Hospitalière"}', 'Montpellier', 'alternance', 'Étudiant motivé pour rejoindre le secteur Médecine & Santé.', 'active', 50),
('9cd849e5-1cc5-4559-9063-d126ea07a8ad', '61e09921-c8af-41c8-ba5f-ae3975c89c20', 'Maël', 'Bertrand', 'Marketing', '{"SEO","Réseaux Sociaux"}', 'Angers', 'both', 'Étudiant motivé pour rejoindre le secteur Marketing.', 'active', 50),
('6cfb0232-e5da-4774-b4c5-f04bacca09c4', 'a8f8790c-d609-4f18-b18c-17465fe3f4d0', 'Maël', 'Faure', 'Finance & Banque', '{"Audit","Analyse Financière"}', 'Lille', 'both', 'Étudiant motivé pour rejoindre le secteur Finance & Banque.', 'active', 50),
('2472ec1c-2dde-4b7b-b907-81fa021c85e3', 'd07f56a4-dc6d-4260-a290-6665fd1774d2', 'Ambre', 'Mercier', 'Environnement', '{"Gestion des Déchets","RSE"}', 'Lyon', 'stage', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('606f8b0e-e01b-4578-a9f4-b72369eaa7b7', 'a28d0bf6-542b-4c10-8948-dc6b9d8fa7e2', 'Hugo', 'Petit', 'Immobilier', '{"Prospection Foncière"}', 'Bordeaux', 'alternance', 'Étudiant motivé pour rejoindre le secteur Immobilier.', 'active', 50),
('3ed06d53-1c5e-4bf3-b6a2-4213ec562185', '1bbbf4bb-bc8e-49de-be37-be8a0ce3379f', 'Ambre', 'Bertrand', 'Environnement', '{"Énergies Renouvelables"}', 'Strasbourg', 'alternance', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('974edf04-2041-4ecd-8227-82a122de6244', '9d77ff8b-aeb9-4458-b46e-4db902428adc', 'Agathe', 'Muller', 'Médecine & Santé', '{"Soins Infirmiers","Gestion Hospitalière"}', 'Paris', 'stage', 'Étudiant motivé pour rejoindre le secteur Médecine & Santé.', 'active', 50),
('ab083bef-c393-49ce-9c3f-2e38903f21ee', 'bc390ccb-e8fd-4a51-8334-4856cdbf0f48', 'Inès', 'Bertrand', 'Commerce & Vente', '{"Prospection","Gestion de Boutique"}', 'Grenoble', 'stage', 'Étudiant motivé pour rejoindre le secteur Commerce & Vente.', 'active', 50),
('e25eed0b-ca5f-4330-8421-490381c44268', '03343eaa-cf12-4d0a-a4e2-c6f72d61e124', 'Léa', 'Laurent', 'Immobilier', '{"Gestion Locative","Prospection Foncière"}', 'Bordeaux', 'stage', 'Étudiant motivé pour rejoindre le secteur Immobilier.', 'active', 50),
('bdefb329-b003-4bb8-876b-273ff858505d', '1e90d0c9-c28c-48a0-801d-cf229a2f6570', 'Arthur', 'Martin', 'Informatique', '{"Machine Learning","React"}', 'Lyon', 'alternance', 'Étudiant motivé pour rejoindre le secteur Informatique.', 'active', 50),
('f4eb753f-c24d-4596-a932-506219694cd2', '793887a1-c632-4119-bce4-fd8256a0bfcf', 'Paul', 'Bertrand', 'Médecine & Santé', '{"Soins Infirmiers","Recherche Médicale"}', 'Rennes', 'alternance', 'Étudiant motivé pour rejoindre le secteur Médecine & Santé.', 'active', 50),
('0ebfd43b-39f5-47cc-b2b5-4972a86dd010', '2314a8d0-da30-4be6-8bb9-cb921f2e506b', 'Jules', 'Robert', 'Environnement', '{"Analyse Carbone"}', 'Angers', 'stage', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('78f315e8-d321-4870-b75e-6a79553d45f7', '0844eb7d-1424-4b4d-a6f2-e9c3254acbd6', 'Paul', 'Leroy', 'Finance & Banque', '{"Excel Avancé","Analyse Financière"}', 'Angers', 'alternance', 'Étudiant motivé pour rejoindre le secteur Finance & Banque.', 'active', 50),
('a7dcf791-5a9d-47bf-a8fa-59e14736d51c', '0320bbf5-072a-43d7-b676-1333a44a2c68', 'Jules', 'Petit', 'Immobilier', '{"Gestion Locative","Estimation"}', 'Strasbourg', 'alternance', 'Étudiant motivé pour rejoindre le secteur Immobilier.', 'active', 50),
('aa327557-865e-4c7b-9aca-413f541b089f', 'c457057c-12c1-49d1-90f5-09f52ca896c6', 'Léo', 'Lambert', 'Immobilier', '{"Estimation","Prospection Foncière"}', 'Strasbourg', 'alternance', 'Étudiant motivé pour rejoindre le secteur Immobilier.', 'active', 50),
('c713a0ec-55bd-4946-846a-999f86419615', 'f641dabd-a719-42a4-82e3-69c87f208c52', 'Chloé', 'Michel', 'Environnement', '{"Analyse Carbone"}', 'Angers', 'both', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('6fb313be-6d3b-4ce2-9c56-2ef88b88db62', '04100ca5-8ac4-4530-9838-69ca88c208ea', 'Louis', 'Andre', 'Informatique', '{"Cloud"}', 'Strasbourg', 'stage', 'Étudiant motivé pour rejoindre le secteur Informatique.', 'active', 50),
('cc620798-3ee0-4de3-902e-af3ba3b3b910', '960ebaba-d20d-4dd0-8330-c3bfe80c7169', 'Mia', 'Martin', 'Ressources Humaines', '{"Paie","Recrutement"}', 'Paris', 'both', 'Étudiant motivé pour rejoindre le secteur Ressources Humaines.', 'active', 50),
('d5965734-8e97-4c3f-9c2f-611dc513c49a', '98bd2921-c92d-48fb-a200-5e593fbe26f5', 'Inès', 'Bertrand', 'Médecine & Santé', '{"Recherche Médicale","Soins Infirmiers"}', 'Nice', 'stage', 'Étudiant motivé pour rejoindre le secteur Médecine & Santé.', 'active', 50),
('9257ad9a-0042-43e1-b7dd-cfdfbd22dc47', '1fe047a7-25fe-4d6f-87ec-9538caf6617c', 'Jules', 'Roux', 'Ressources Humaines', '{"Marque Employeur","Droit Social"}', 'Nice', 'both', 'Étudiant motivé pour rejoindre le secteur Ressources Humaines.', 'active', 50),
('9eb779bb-2d9b-46f5-b53f-52aa9cef0806', '14e22e6b-1060-4c99-8b9a-bc3d5018482e', 'Louise', 'Bertrand', 'Commerce & Vente', '{"Prospection","Retail"}', 'Dijon', 'stage', 'Étudiant motivé pour rejoindre le secteur Commerce & Vente.', 'active', 50),
('f6359e8e-0c9e-4c87-ae26-2e62993ef028', '9f0585e4-e9d7-4f19-a9c4-870a051bcab3', 'Tiago', 'Roux', 'Environnement', '{"Énergies Renouvelables","RSE"}', 'Angers', 'alternance', 'Étudiant motivé pour rejoindre le secteur Environnement.', 'active', 50),
('35a0b770-5bbe-443f-b908-1d7bc9665d7a', '0c8407ba-a227-47f2-8fe1-842c50912e00', 'Lou', 'Leroy', 'Informatique', '{"Cybersécurité","Machine Learning"}', 'Nantes', 'alternance', 'Étudiant motivé pour rejoindre le secteur Informatique.', 'active', 50)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.offers (id, company_id, title, description, type, sector, location, duration, salary, skills_required, start_date, is_active) VALUES
('7554cda1-9e08-4bc0-8f4b-27778dbfcee9', '13b812c8-36f0-4f31-9871-a675fbcc455f', 'Alternant Conseiller Bancaire', 'Nous sommes à la recherche de notre futur(e) Alternant Conseiller Bancaire pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Finance & Banque', 'Lille', '12 mois (Rythme 3 sem / 1 sem)', '1200 € / mois', '{"Analyse Financière","Comptabilité","Gestion de Patrimoine","Excel Avancé"}', '2026-09-01', true),
('1849cbd7-32c9-4fa6-9b71-9707f507532b', '13b812c8-36f0-4f31-9871-a675fbcc455f', 'Stagiaire Analyste Financier', 'En tant que Stagiaire Analyste Financier au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Finance & Banque', 'Angers', '6 mois', 'Indemnité légale + primes', '{"Excel Avancé","Gestion de Patrimoine","Audit"}', '2026-09-01', true),
('4e33d93c-06f1-4724-b28c-684df4a50f33', '62e86a42-11e3-4efb-a917-dbf5f54c653d', 'Stagiaire Analyste Financier', 'Nous sommes à la recherche de notre futur(e) Stagiaire Analyste Financier pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Finance & Banque', 'Angers', '6 mois (Temps plein)', 'Indemnité légale + primes', '{"Comptabilité","Analyse Financière"}', '2026-09-01', true),
('f836a941-d98e-41e2-9b81-03c334924461', '62e86a42-11e3-4efb-a917-dbf5f54c653d', 'Stagiaire Analyste Financier', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Analyste Financier.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Finance & Banque', 'Angers', '6 mois', 'Indemnité légale + primes', '{"Audit","Gestion de Patrimoine","Excel Avancé"}', '2026-09-01', true),
('5752c9d3-3c6b-4f1b-8d4c-c59fd0af8083', 'dddc4bf2-2f92-4ee7-a514-d2fb7db17618', 'Alternant Conseiller Bancaire', 'En tant que Alternant Conseiller Bancaire au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Finance & Banque', 'Lille', '24 mois', '1500 € / mois', '{"Analyse Financière","Comptabilité","Gestion de Patrimoine"}', '2026-09-01', true),
('9eb05169-f1de-4c40-8fd6-632c7db34182', 'dddc4bf2-2f92-4ee7-a514-d2fb7db17618', 'Stagiaire Analyste Financier', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Analyste Financier.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Finance & Banque', 'Toulouse', '6 mois', '1200 € / mois', '{"Excel Avancé","Comptabilité","Audit"}', '2026-09-01', true),
('5a2d0506-924e-4b85-9c66-ccb6216d50c4', 'c5e68e43-53cc-4cf0-afd9-0a89c74fd4cd', 'Alternant Conseiller Bancaire', 'Nous sommes à la recherche de notre futur(e) Alternant Conseiller Bancaire pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Finance & Banque', 'Rennes', '24 mois', '1800 € / mois', '{"Comptabilité","Excel Avancé"}', '2026-09-01', true),
('03633798-35bd-4610-a589-9dca6f4a0ba2', 'c5e68e43-53cc-4cf0-afd9-0a89c74fd4cd', 'Stagiaire Analyste Financier', 'En tant que Stagiaire Analyste Financier au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Finance & Banque', 'Dijon', '4 mois', '1000 € / mois', '{"Analyse Financière","Comptabilité","Excel Avancé"}', '2026-09-01', true),
('74db8f40-3fb9-4ccb-8d84-c143429ffa26', '9e86a05a-b529-457a-9b3a-c3688c4dd486', 'Alternant Gestion Clinique', 'En tant que Alternant Gestion Clinique au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Médecine & Santé', 'Lille', '24 mois', '1500 € / mois', '{"Soins Infirmiers","Gestion Hospitalière","Recherche Médicale","Télémédecine"}', '2026-09-01', true),
('8b214eda-e354-4539-9e8b-5058b17560e1', '9e86a05a-b529-457a-9b3a-c3688c4dd486', 'Stagiaire Assistant Médical', 'Nous sommes à la recherche de notre futur(e) Stagiaire Assistant Médical pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Médecine & Santé', 'Angers', '6 mois', '800 € / mois', '{"Soins Infirmiers","Gestion Hospitalière"}', '2026-09-01', true),
('f1e27240-2596-4273-ae0f-e07b1aa306eb', 'bc2f1364-1a71-442a-bd0a-22c0b2d51cf1', 'Stagiaire Assistant Médical', 'Nous sommes à la recherche de notre futur(e) Stagiaire Assistant Médical pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Médecine & Santé', 'Lille', '6 mois (Temps plein)', '1200 € / mois', '{"Biologie","Télémédecine","Gestion Hospitalière"}', '2026-09-01', true),
('4a2a4380-1c60-4b94-bcc8-9725fa7c3f51', 'bc2f1364-1a71-442a-bd0a-22c0b2d51cf1', 'Alternant Gestion Clinique', 'En tant que Alternant Gestion Clinique au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Médecine & Santé', 'Toulouse', '24 mois', 'Selon grille légale alternance', '{"Soins Infirmiers","Recherche Médicale"}', '2026-09-01', true),
('66b5d123-0fe6-497b-8d8d-2d157207be4f', 'bcef9f96-2a6a-4bcb-bb75-973a04bba7a7', 'Alternant Gestion Clinique', 'En tant que Alternant Gestion Clinique au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Médecine & Santé', 'Dijon', '24 mois', 'Selon grille légale alternance', '{"Recherche Médicale","Télémédecine"}', '2026-09-01', true),
('98d5b2ef-3f90-46f6-80ab-3c5fefe40ca1', 'bcef9f96-2a6a-4bcb-bb75-973a04bba7a7', 'Alternant Gestion Clinique', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Gestion Clinique.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Médecine & Santé', 'Paris', '24 mois', '1200 € / mois', '{"Télémédecine","Gestion Hospitalière","Recherche Médicale"}', '2026-09-01', true),
('234f289f-f1bf-4c33-a98d-7c2edcf3043b', '0df71ee2-3ddc-4e9b-b035-e8865ae6ba4f', 'Alternant Gestion Clinique', 'En tant que Alternant Gestion Clinique au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Médecine & Santé', 'Nice', '24 mois', '1500 € / mois', '{"Soins Infirmiers","Recherche Médicale","Gestion Hospitalière"}', '2026-09-01', true),
('c6b1253b-b550-4e3e-a960-4c10438b94de', '0df71ee2-3ddc-4e9b-b035-e8865ae6ba4f', 'Stagiaire Assistant Médical', 'Nous sommes à la recherche de notre futur(e) Stagiaire Assistant Médical pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Médecine & Santé', 'Dijon', '4 mois', '800 € / mois', '{"Biologie","Télémédecine","Recherche Médicale","Gestion Hospitalière"}', '2026-09-01', true),
('d0c724a9-6ad4-4c16-abc4-0c3e47596344', 'bbfd9bd5-f2ab-4fa1-941a-694aa4403eca', 'Stagiaire Vente & Conseil', 'Nous sommes à la recherche de notre futur(e) Stagiaire Vente & Conseil pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Commerce & Vente', 'Bordeaux', '6 mois (Temps plein)', '800 € / mois', '{"Retail","Négociation B2B","CRM"}', '2026-09-01', true),
('92d72400-c02e-4158-bf86-cf8757140e0c', 'bbfd9bd5-f2ab-4fa1-941a-694aa4403eca', 'Stagiaire Vente & Conseil', 'En tant que Stagiaire Vente & Conseil au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Commerce & Vente', 'Strasbourg', '6 mois (Temps plein)', '800 € / mois', '{"CRM","Prospection","Négociation B2B"}', '2026-09-01', true),
('7586d3ba-46c4-4790-b34b-b62185b2ddb1', '2e7121d4-4fe7-4c91-b42b-8caa147b8be3', 'Stagiaire Vente & Conseil', 'En tant que Stagiaire Vente & Conseil au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Commerce & Vente', 'Marseille', '4 mois', '1000 € / mois', '{"Négociation B2B","CRM","Gestion de Boutique","Retail"}', '2026-09-01', true),
('3b7af15d-0823-4922-b66c-8d60e911f2e1', '2e7121d4-4fe7-4c91-b42b-8caa147b8be3', 'Stagiaire Vente & Conseil', 'En tant que Stagiaire Vente & Conseil au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Commerce & Vente', 'Lille', '4 mois', '1200 € / mois', '{"Négociation B2B","CRM","Retail"}', '2026-09-01', true),
('dd8dbaf7-72b8-452e-9f70-3225e9778639', 'a4e7eada-840c-4bb5-9d58-5cd042d919c4', 'Alternant Business Developer', 'Nous sommes à la recherche de notre futur(e) Alternant Business Developer pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Commerce & Vente', 'Dijon', '1 an', '1500 € / mois', '{"Retail","CRM"}', '2026-09-01', true),
('c69bba18-6f89-4d69-8bb5-442e9a3a24cc', 'a4e7eada-840c-4bb5-9d58-5cd042d919c4', 'Alternant Business Developer', 'Nous sommes à la recherche de notre futur(e) Alternant Business Developer pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Commerce & Vente', 'Strasbourg', '1 an', '1500 € / mois', '{"Retail","Prospection","Gestion de Boutique","CRM"}', '2026-09-01', true),
('730cbf32-33a3-4e3e-9ede-4b70fe953d1e', '7e3e82f0-f221-435e-939c-712979886065', 'Stagiaire Vente & Conseil', 'En tant que Stagiaire Vente & Conseil au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Commerce & Vente', 'Montpellier', '6 mois', '1000 € / mois', '{"Prospection","Gestion de Boutique","Négociation B2B","CRM"}', '2026-09-01', true),
('3285a473-115c-4266-9cb8-a0aef65a55c3', '7e3e82f0-f221-435e-939c-712979886065', 'Alternant Business Developer', 'En tant que Alternant Business Developer au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Commerce & Vente', 'Strasbourg', '2 ans', 'Selon grille légale alternance', '{"Retail","Prospection","CRM","Gestion de Boutique"}', '2026-09-01', true),
('9ffa5789-4a2d-4cd1-a9c0-c6e800411db0', '3c400ec2-74fb-40d2-912a-c6d667051d88', 'Alternant Gestionnaire de Copropriété', 'En tant que Alternant Gestionnaire de Copropriété au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Immobilier', 'Marseille', '1 an', '1200 € / mois', '{"Estimation","Transaction Immobilière"}', '2026-09-01', true),
('fda54b5a-23b3-4719-912c-641d77982724', '3c400ec2-74fb-40d2-912a-c6d667051d88', 'Alternant Gestionnaire de Copropriété', 'En tant que Alternant Gestionnaire de Copropriété au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Immobilier', 'Strasbourg', '24 mois', '1500 € / mois', '{"Prospection Foncière","Transaction Immobilière"}', '2026-09-01', true),
('d4c77335-3dce-4498-8981-3e033daf3ac3', '323df3d8-661c-4d2a-8b18-e15d04d49d95', 'Stagiaire Négociateur', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Négociateur.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Immobilier', 'Lille', '6 mois', '800 € / mois', '{"Prospection Foncière","Estimation","Gestion Locative"}', '2026-09-01', true),
('b4079d07-4615-4666-ba98-5bdaa5ff1862', '323df3d8-661c-4d2a-8b18-e15d04d49d95', 'Stagiaire Négociateur', 'En tant que Stagiaire Négociateur au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Immobilier', 'Dijon', '6 mois', '800 € / mois', '{"Transaction Immobilière","Estimation"}', '2026-09-01', true),
('2ea59382-8ea8-4594-b9da-f6984dca1f6f', 'bea3cd00-4241-43f0-8732-3a8c579ce91a', 'Alternant Gestionnaire de Copropriété', 'En tant que Alternant Gestionnaire de Copropriété au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Immobilier', 'Rennes', '2 ans', '1200 € / mois', '{"Estimation","Transaction Immobilière"}', '2026-09-01', true),
('76b540cf-eb6b-4fc3-a1d3-9fe67cf4ddb3', 'bea3cd00-4241-43f0-8732-3a8c579ce91a', 'Stagiaire Négociateur', 'Nous sommes à la recherche de notre futur(e) Stagiaire Négociateur pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Immobilier', 'Marseille', '4 mois', 'Indemnité légale + primes', '{"Transaction Immobilière","Gestion Locative"}', '2026-09-01', true),
('01406967-c372-4379-8a41-3a0dd09aa883', 'f634b5a3-bac8-431d-9d0c-6563c1a8c997', 'Alternant Chef de Projet Vert', 'En tant que Alternant Chef de Projet Vert au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Environnement', 'Dijon', '24 mois', '1200 € / mois', '{"Énergies Renouvelables","RSE"}', '2026-09-01', true),
('b75f5b23-7c5f-4f8d-b3a7-c9615fd9e1e9', 'f634b5a3-bac8-431d-9d0c-6563c1a8c997', 'Alternant Chef de Projet Vert', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Chef de Projet Vert.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Environnement', 'Lyon', '2 ans', '1500 € / mois', '{"Énergies Renouvelables","Gestion des Déchets","Analyse Carbone"}', '2026-09-01', true),
('3cb34990-534d-4b72-9e9f-7a992231d92f', 'a4c41d8d-802d-4176-8c6b-b5ce4d64ddc9', 'Stagiaire RSE', 'Nous sommes à la recherche de notre futur(e) Stagiaire RSE pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Environnement', 'Lyon', '4 mois', '800 € / mois', '{"RSE","Énergies Renouvelables","Gestion des Déchets","Analyse Carbone"}', '2026-09-01', true),
('fb4d0458-1dec-4365-aa0d-ed9be406abd9', 'a4c41d8d-802d-4176-8c6b-b5ce4d64ddc9', 'Alternant Chef de Projet Vert', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Chef de Projet Vert.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Environnement', 'Marseille', '2 ans', '1200 € / mois', '{"Énergies Renouvelables","RSE","Gestion des Déchets"}', '2026-09-01', true),
('bc64cc03-9e83-4b39-ac78-fc82c5ff8873', '4630de2f-322a-4089-ac54-6977ffed8208', 'Alternant Chef de Projet Vert', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Chef de Projet Vert.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Environnement', 'Angers', '24 mois', '1200 € / mois', '{"Gestion des Déchets","RSE","Énergies Renouvelables"}', '2026-09-01', true),
('5ef191fd-965c-483c-9bd7-8c324a3954cb', '4630de2f-322a-4089-ac54-6977ffed8208', 'Stagiaire RSE', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire RSE.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Environnement', 'Toulouse', '6 mois (Temps plein)', 'Indemnité légale + primes', '{"Énergies Renouvelables","Gestion des Déchets","RSE","Analyse Carbone"}', '2026-09-01', true),
('bb5fef55-4f8a-476f-b2ea-5789496d0da1', '5b7c0300-a7d6-4593-b41b-d8823498d18e', 'Stagiaire Recrutement', 'Nous sommes à la recherche de notre futur(e) Stagiaire Recrutement pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Ressources Humaines', 'Nantes', '6 mois (Temps plein)', 'Indemnité légale + primes', '{"Droit Social","Paie"}', '2026-09-01', true),
('800b4156-66b0-4598-9d0d-6cc92393f6bd', '5b7c0300-a7d6-4593-b41b-d8823498d18e', 'Stagiaire Recrutement', 'En tant que Stagiaire Recrutement au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Ressources Humaines', 'Montpellier', '4 mois', '1200 € / mois', '{"Recrutement","Droit Social","Marque Employeur","Paie"}', '2026-09-01', true),
('21be672e-faa5-486c-9865-c50c6a630ca1', 'ec352069-e093-46ef-981b-66486b89aa1f', 'Stagiaire Recrutement', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Recrutement.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Ressources Humaines', 'Dijon', '4 mois', '800 € / mois', '{"Droit Social","Marque Employeur"}', '2026-09-01', true),
('063c8cc8-5f96-4789-9bd4-dd8b7605d2b5', 'ec352069-e093-46ef-981b-66486b89aa1f', 'Alternant Assistant RH', 'En tant que Alternant Assistant RH au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Ressources Humaines', 'Paris', '24 mois', 'Selon grille légale alternance', '{"Recrutement","Paie"}', '2026-09-01', true),
('5f3ad1bf-4286-491c-8fe2-0cf85831b866', '75e57ecc-2e0c-4e49-93b1-77a807b72d28', 'Alternant Traffic Manager', 'Nous sommes à la recherche de notre futur(e) Alternant Traffic Manager pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Marketing', 'Bordeaux', '24 mois', '1200 € / mois', '{"SEO","Réseaux Sociaux","Copywriting"}', '2026-09-01', true),
('7f4aacb5-270a-41d1-98e2-980b74f0eea9', '75e57ecc-2e0c-4e49-93b1-77a807b72d28', 'Alternant Traffic Manager', 'Nous sommes à la recherche de notre futur(e) Alternant Traffic Manager pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Marketing', 'Angers', '24 mois', 'Selon grille légale alternance', '{"SEO","Réseaux Sociaux","Stratégie Digitale","Figma"}', '2026-09-01', true),
('b63e563d-0bf5-4a02-a6de-403d70b4f3bd', '16e0223a-6966-405a-a672-eaee202fb99f', 'Stagiaire Assistant Marketing', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Assistant Marketing.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Marketing', 'Bordeaux', '4 mois', 'Indemnité légale + primes', '{"SEO","Réseaux Sociaux","Copywriting"}', '2026-09-01', true),
('4e8297fd-6b97-4108-9404-80d57567a788', '16e0223a-6966-405a-a672-eaee202fb99f', 'Alternant Traffic Manager', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Traffic Manager.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Marketing', 'Angers', '12 mois (Rythme 3 sem / 1 sem)', 'Selon grille légale alternance', '{"Figma","Stratégie Digitale"}', '2026-09-01', true),
('585dbe84-2fbf-407b-b7c1-e2aa38e9158c', 'a9a951b4-7838-4a15-a1f7-7d3eef8aa1a2', 'Alternant Polyvalent', 'En tant que Alternant Polyvalent au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Informatique', 'Grenoble', '24 mois', '1200 € / mois', '{"Node.js","Cybersécurité","React"}', '2026-09-01', true),
('de02b9cd-cbc5-4c99-b710-458acbcc0e8c', 'a9a951b4-7838-4a15-a1f7-7d3eef8aa1a2', 'Stagiaire Polyvalent', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Stagiaire Polyvalent.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'stage', 'Informatique', 'Angers', '6 mois', 'Indemnité légale + primes', '{"React","Cloud","Node.js"}', '2026-09-01', true),
('ab6e5cdf-fd4f-4b7f-9b90-b6d25595c0c3', 'de56388a-a370-41ba-91f2-c8402e33ae13', 'Alternant Polyvalent', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Polyvalent.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Informatique', 'Toulouse', '2 ans', '1200 € / mois', '{"React","Python"}', '2026-09-01', true),
('083dbe27-2fc9-4030-9f40-3f858bc7d110', 'de56388a-a370-41ba-91f2-c8402e33ae13', 'Alternant Polyvalent', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Polyvalent.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Informatique', 'Montpellier', '24 mois', 'Selon grille légale alternance', '{"React","Node.js"}', '2026-09-01', true),
('161fbe9c-662b-48cc-92e1-4606a5d340de', 'fe5663c5-4d6c-4c2a-84fb-0c497bcf1805', 'Alternant Polyvalent', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Polyvalent.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Ingénierie', 'Strasbourg', '24 mois', '1800 € / mois', '{"Polyvalence","Autonomie"}', '2026-09-01', true),
('89f8124e-d676-432f-9105-92f0912f5a66', 'fe5663c5-4d6c-4c2a-84fb-0c497bcf1805', 'Stagiaire Polyvalent', 'En tant que Stagiaire Polyvalent au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Ingénierie', 'Rennes', '6 mois (Temps plein)', '1000 € / mois', '{"Autonomie","Polyvalence"}', '2026-09-01', true),
('123a2758-1f90-4f5d-916a-9805c41f53a9', '716596f2-a7ef-4f7e-b0b6-1e3f415c062f', 'Alternant Polyvalent', 'Nous sommes à la recherche de notre futur(e) Alternant Polyvalent pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Ingénierie', 'Paris', '1 an', '1800 € / mois', '{"Polyvalence","Autonomie"}', '2026-09-01', true),
('d948a9f0-9963-4842-9427-73d96ea9e559', '716596f2-a7ef-4f7e-b0b6-1e3f415c062f', 'Stagiaire Polyvalent', 'Nous sommes à la recherche de notre futur(e) Stagiaire Polyvalent pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Ingénierie', 'Montpellier', '6 mois', '1000 € / mois', '{"Polyvalence","Autonomie"}', '2026-09-01', true),
('e9d97f22-e86e-476d-afac-92831bd47643', '6326c572-987c-46b4-8e7b-04297531e172', 'Alternant Gestion Clinique', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Gestion Clinique.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Médecine & Santé', 'Paris', '1 an', '1800 € / mois', '{"Recherche Médicale","Télémédecine","Gestion Hospitalière","Biologie"}', '2026-09-01', true),
('0e61522f-5281-44bb-a4dd-c3d3a6551af9', '6326c572-987c-46b4-8e7b-04297531e172', 'Alternant Gestion Clinique', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Gestion Clinique.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Médecine & Santé', 'Bordeaux', '2 ans', '1500 € / mois', '{"Recherche Médicale","Soins Infirmiers","Gestion Hospitalière"}', '2026-09-01', true),
('8997324f-d4f2-4456-a626-c7422db9d06d', '65d9dbcd-fad0-4332-ba2c-a67e133fa9bb', 'Alternant Conseiller Bancaire', 'Rejoignez un environnement dynamique et stimulant ! Nous recrutons un(e) Alternant Conseiller Bancaire.

Vos responsabilités :
- Prendre en charge des dossiers spécifiques et les mener à bien.
- Assurer le reporting et le suivi des indicateurs clés (KPIs).
- Travailler de concert avec les différents départements de l''entreprise.

Votre profil :
Doté(e) d''un excellent relationnel, vous savez faire preuve de rigueur et d''adaptabilité dans un milieu en constante évolution. Une première expérience est un atout.', 'alternance', 'Finance & Banque', 'Lille', '2 ans', '1200 € / mois', '{"Gestion de Patrimoine","Excel Avancé","Audit","Analyse Financière"}', '2026-09-01', true),
('8c2e8844-22e1-4936-ae90-deea4e10b617', '65d9dbcd-fad0-4332-ba2c-a67e133fa9bb', 'Alternant Conseiller Bancaire', 'Nous sommes à la recherche de notre futur(e) Alternant Conseiller Bancaire pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Finance & Banque', 'Grenoble', '2 ans', '1200 € / mois', '{"Gestion de Patrimoine","Analyse Financière","Audit"}', '2026-09-01', true),
('90ee392f-44da-4d39-b9e3-4ad681ebd884', '63b2c03a-fa4d-4dfe-9643-5b4ffb914f47', 'Stagiaire Vente & Conseil', 'En tant que Stagiaire Vente & Conseil au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'stage', 'Commerce & Vente', 'Dijon', '4 mois', '1000 € / mois', '{"Négociation B2B","Gestion de Boutique"}', '2026-09-01', true),
('1e015f03-0af2-438e-b0bb-cedae52f61d7', '63b2c03a-fa4d-4dfe-9643-5b4ffb914f47', 'Stagiaire Vente & Conseil', 'Nous sommes à la recherche de notre futur(e) Stagiaire Vente & Conseil pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'stage', 'Commerce & Vente', 'Nice', '4 mois', 'Indemnité légale + primes', '{"Négociation B2B","Prospection"}', '2026-09-01', true),
('6cb10bb3-fc5c-48eb-bb1d-e7fd156a929c', 'c90fe45d-66c6-49ad-a93f-cbef8e59eb11', 'Alternant Gestionnaire de Copropriété', 'Nous sommes à la recherche de notre futur(e) Alternant Gestionnaire de Copropriété pour accompagner notre forte croissance.

Le poste :
- Co-construire et déployer la stratégie de notre département.
- Analyser les données existantes pour optimiser nos processus.
- Aider à la gestion de la relation client/partenaire.

Vos qualités :
Une grande soif d''apprendre, beaucoup d''autonomie et une véritable passion pour votre domaine d''études. Rejoignez-nous pour une aventure formatrice !', 'alternance', 'Immobilier', 'Paris', '24 mois', '1500 € / mois', '{"Prospection Foncière","Transaction Immobilière","Gestion Locative"}', '2026-09-01', true),
('d692de79-8d04-44d4-b27a-78c19ade86ef', 'c90fe45d-66c6-49ad-a93f-cbef8e59eb11', 'Alternant Gestionnaire de Copropriété', 'En tant que Alternant Gestionnaire de Copropriété au sein de notre entreprise, vous serez au cœur de notre développement. 

Vos missions :
- Assister l''équipe dans ses tâches quotidiennes stratégiques.
- Participer activement aux projets en cours et proposer des solutions innovantes.
- Veiller au bon déroulement des opérations et au respect des délais.

Ce que nous recherchons :
Étudiant(e) proactif(ve), vous aimez les défis et avez un fort esprit d''équipe. Vous avez une bonne capacité d''analyse et êtes force de proposition.', 'alternance', 'Immobilier', 'Montpellier', '2 ans', '1800 € / mois', '{"Estimation","Gestion Locative","Transaction Immobilière","Prospection Foncière"}', '2026-09-01', true);
