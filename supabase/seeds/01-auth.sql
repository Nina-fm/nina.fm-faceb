--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") 
VALUES
	('00000000-0000-0000-0000-000000000000', 'de446149-2826-4c16-a2d8-7e55c9253df3', 'authenticated', 'authenticated', '120lalanne@gmail.com', '$2a$06$I4dBeHeN/lsYx3zQdr5Cz.R4m.dTP.6KLNQ3a8UQW/aAYi5byBqOq', '2025-03-19 20:57:23.164763+00', NULL, '', NULL, '', '2025-03-19 20:57:23.164763+00', '', '', NULL, '2025-04-03 22:54:13.680859+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2025-03-19 20:57:23.164763+00', '2025-04-04 17:13:09.781046+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") 
VALUES
	('2b7c0297-6bb8-4bc3-b3bb-b1d4e6d0ab5d', 'de446149-2826-4c16-a2d8-7e55c9253df3', '{"sub": "de446149-2826-4c16-a2d8-7e55c9253df3", "email": "120lalanne@gmail.com"}', 'email', '2025-03-19 20:57:23.164763+00', '2025-03-19 20:57:23.164763+00', '2025-03-19 20:57:23.164763+00', 'affb1051-fb17-4de4-89b9-b8b8f7b17ca0');


UPDATE public.profiles 
SET "name" = 'Vince', "avatar" = NULL 
WHERE "id" = 'de446149-2826-4c16-a2d8-7e55c9253df3';