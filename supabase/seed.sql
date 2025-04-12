SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '07171951-1c47-42c2-b6c9-6541ec56b787', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-07 21:22:47.362588+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cddf5622-597a-4684-9b36-09ad077072b3', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-07 22:21:05.211679+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fa38188a-c88d-4c3d-8d7d-5efc1165bc21', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-07 22:21:05.212279+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e215fe1c-b034-4a42-9dec-63919655c37c', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-07 23:36:09.723223+00', ''),
	('00000000-0000-0000-0000-000000000000', '01d2a51a-2e20-41c8-a1e7-648fe22811d1', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-07 23:36:09.725035+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd06829db-e919-43bf-aa68-40c417cb0819', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-08 07:50:18.01733+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bc401cf-8876-4ec2-ae51-789776b00558', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-08 07:50:18.01874+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'de446149-2826-4c16-a2d8-7e55c9253df3', 'authenticated', 'authenticated', '120lalanne@gmail.com', '$2a$06$I4dBeHeN/lsYx3zQdr5Cz.R4m.dTP.6KLNQ3a8UQW/aAYi5byBqOq', '2025-03-19 20:57:23.164763+00', NULL, '', NULL, '', '2025-03-19 20:57:23.164763+00', '', '', NULL, '2025-04-07 21:22:47.366788+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2025-03-19 20:57:23.164763+00', '2025-04-08 07:50:18.024218+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('2b7c0297-6bb8-4bc3-b3bb-b1d4e6d0ab5d', 'de446149-2826-4c16-a2d8-7e55c9253df3', '{"sub": "de446149-2826-4c16-a2d8-7e55c9253df3", "email": "120lalanne@gmail.com"}', 'email', '2025-03-19 20:57:23.164763+00', '2025-03-19 20:57:23.164763+00', '2025-03-19 20:57:23.164763+00', 'affb1051-fb17-4de4-89b9-b8b8f7b17ca0');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('f282cedb-3cf3-4f7f-80e2-4404e9454e35', 'de446149-2826-4c16-a2d8-7e55c9253df3', '2025-04-07 21:22:47.366989+00', '2025-04-08 07:50:18.027422+00', NULL, 'aal1', NULL, '2025-04-08 07:50:18.027321', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '192.168.97.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('f282cedb-3cf3-4f7f-80e2-4404e9454e35', '2025-04-07 21:22:47.372855+00', '2025-04-07 21:22:47.372855+00', 'password', 'f511fb55-ed26-4ffc-8c9b-644d6d14973c');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 1, 'ufZ_6UGXbzCFjiv83Foh8w', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-07 21:22:47.369537+00', '2025-04-07 22:21:05.212646+00', NULL, 'f282cedb-3cf3-4f7f-80e2-4404e9454e35'),
	('00000000-0000-0000-0000-000000000000', 2, 'QQDKF1Dq0IM5jUfaH6IQEg', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-07 22:21:05.213264+00', '2025-04-07 23:36:09.735528+00', 'ufZ_6UGXbzCFjiv83Foh8w', 'f282cedb-3cf3-4f7f-80e2-4404e9454e35'),
	('00000000-0000-0000-0000-000000000000', 3, '1sNA27s7Xxdw0vagQ29kAw', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-07 23:36:09.736462+00', '2025-04-08 07:50:18.020301+00', 'QQDKF1Dq0IM5jUfaH6IQEg', 'f282cedb-3cf3-4f7f-80e2-4404e9454e35'),
	('00000000-0000-0000-0000-000000000000', 4, 'ScV-9w5dJtojY6fF8Fa1Ww', 'de446149-2826-4c16-a2d8-7e55c9253df3', false, '2025-04-08 07:50:18.021004+00', '2025-04-08 07:50:18.021004+00', '1sNA27s7Xxdw0vagQ29kAw', 'f282cedb-3cf3-4f7f-80e2-4404e9454e35');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."authors" ("id", "created_at", "updated_at", "user_id", "name", "avatar") VALUES
	(1, '2025-03-19 20:57:23.202003+00', '2022-11-08 13:59:57.739+00', 'de446149-2826-4c16-a2d8-7e55c9253df3', '120', NULL),
	(2, '2025-03-19 20:57:23.202003+00', '2022-12-23 09:34:00.739+00', NULL, 'Costiloui', NULL),
	(3, '2025-03-19 20:57:23.202003+00', '2022-12-20 09:34:00.739+00', NULL, 'Duc', NULL),
	(4, '2025-03-19 20:57:23.202003+00', '2022-12-20 09:34:00.739+00', NULL, 'Le Chapelier', NULL);


--
-- Data for Name: mixtapes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."mixtapes" ("id", "created_at", "updated_at", "name", "year", "comment", "tracks_text", "cover", "authors_text") VALUES
	(2, '2020-12-23 09:34:00.739+00', '2020-12-23 09:34:00.739+00', 'Apophtegme Ducal', '2020', '', '', '', 'Duc'),
	(3, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Un peu de son frais', '2019', '', '01 Nym : Et moi\n02 La Chica : Oasis\n03 Wedel Bikri : Untitled x2\n04 Jos\u00e9 Gonzalez : Teardrop\n05 Fatoumata Diawara : Sowa\n06 Fats Domino : Blueberry Hill\n07 Fanfare Ciocarlia : Asfalt tango\n08 Nana Mouskouri : Que je sois un ange\n09 Charles A. Chepkowny : Kilyano Ratanga\n10 Valaire : Golden rule (Do the Oobopopop)\n11 J.A. Adofo & City Boys Band : Baabi Dehyee\n12 Labelle : Grand Ma\u00eetre (feat. Ballak\u00e9 Sissoko)\n13 Dr. Orlando Owoh & His Omimah Band : Mo Baju Wo Oju Orun \/ Irawo Nii Ko Ni Ku', '', 'Costiloui'),
	(4, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Vous êtes arrivés', '2019', '', 'Akua Nuru - The Block\nJoe Driscoll & Sekou Kouyate - Wonamati\nFaada Freddy - The Death Of Me\nBarbatuques - Voc\u00ea Chegou\n-M-, Toumani Diabat\u00e9, Sidiki Diabat\u00e9, Santigold, Hiba Tawaji, Ibrahim Maalouf, Seu Jorge, Nekfeu, Youssou N\u2019Dour, Sanjay Khan & ChaCha - Solidarit\u00e9\nGoran Bregovic - Cajesukarije Cocek', '', 'Costiloui'),
	(5, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Khéops', '2017', '', '', '', '120 & Le Chapelier'),
	(1, '2022-12-23 09:34:00.739+00', '2022-12-23 09:34:00.739+00', 'Funky Soul Mix', '2022', '', '01 James Brown : Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)\r\n02 Otis Redding : Security (Live)\r\n03 Mark Ronson : Valerie (feat. Amy Winehouse)\r\n04 Vigon : Harlem shuffle\r\n05 Otis Redding : I can''t turn you loose (Live)\r\n06 Rufus Thomas : Do the funky chicken\r\n07 Otis Redding : Papa''s got a brand new bag (Live)\r\n08 James Brown : There it is (Part 1)\r\n09 Amy Winehouse : Monkey man\r\n10 Macka B. : Roots Ragga\r\n11 James Brown : I got you (Feel good)\r\n12 Robert Parker : Barefootin''\r\n13 Otis Redding : I''m depending on you (Live)\r\n14 James Brown : (Get up I feel like being a) Sex machine\r\n15 The Bamboos : Step it up (feat. Alice Russell)\r\n16 Small Faces : Watcha gonna do about it\r\n17 The Contours : Do you love me\r\n18 Wilson Pickett : Land of 1000 dances\r\n19 Black Joe Lewis & The Honeybears : Sugarfoot\r\n20 Eli ''Paperboy'' Reed & The True Loves : (Doin'' the) Boom boom', '5a395f89beb2b.jpg', 'Duc');


--
-- Data for Name: mixtapes_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."mixtapes_authors" ("mixtape_id", "author_id", "position") VALUES
	(1, 3, 0),
	(2, 3, 0),
	(3, 2, 0),
	(4, 2, 0),
	(5, 1, 0),
	(5, 4, 1);


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: mixtapes_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "created_at", "updated_at", "role", "avatar", "name") VALUES
	('de446149-2826-4c16-a2d8-7e55c9253df3', '2025-04-07 20:58:23.795452+00', '2025-04-07 20:58:23.795452+00', 'user', NULL, 'Vince');


--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tracks" ("id", "created_at", "mixtape_id", "title", "artist", "start_at", "position") VALUES
	(1, '2022-11-08 13:59:57.739+00', 1, 'Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)', 'James Brown', '00:00:00', 1),
	(2, '2022-11-08 13:59:57.739+00', 1, 'Security (Live)', 'Otis Redding', '00:03:21', 2),
	(3, '2022-11-08 13:59:57.739+00', 1, 'Valerie (feat. Amy Winehouse)', 'Mark Ronson', '', 3),
	(4, '2022-11-08 13:59:57.739+00', 1, 'Harlem shuffle', 'Vigon', '', 4),
	(5, '2022-11-08 13:59:57.739+00', 1, 'I can''t turn you loose (Live)', 'Otis Redding', '', 5),
	(6, '2022-11-08 13:59:57.739+00', 1, 'Do the funky chicken', 'Rufus Thomas', '', 6),
	(7, '2022-11-08 13:59:57.739+00', 1, 'Papa''s got a brand new bag (Live)', 'Otis Redding', '', 7),
	(8, '2022-11-08 13:59:57.739+00', 1, 'There it is (Part 1)', 'James Brown', '', 8),
	(9, '2022-11-08 13:59:57.739+00', 1, 'Monkey man', 'Amy Winehouse', '', 9),
	(10, '2022-11-08 13:59:57.739+00', 1, 'Roots Ragga', 'Macka B.', '', 10),
	(11, '2022-11-08 13:59:57.739+00', 1, 'I got you (Feel good)', 'James Brown', '', 11),
	(12, '2022-11-08 13:59:57.739+00', 1, 'Barefootin''', 'Robert Parker', '', 12),
	(13, '2022-11-08 13:59:57.739+00', 1, 'I''m depending on you (Live)', 'Otis Redding', '', 13),
	(14, '2022-11-08 13:59:57.739+00', 1, '(Get up I feel like being a) Sex machine', 'James Brown', '', 14),
	(15, '2022-11-08 13:59:57.739+00', 1, 'Step it up (feat. Alice Russell)', 'The Bamboos', '', 15),
	(16, '2022-11-08 13:59:57.739+00', 1, 'Watcha gonna do about it', 'Small Faces', '', 16),
	(17, '2022-11-08 13:59:57.739+00', 1, 'Do you love me', 'The Contours', '', 17),
	(18, '2022-11-08 13:59:57.739+00', 1, 'Land of 1000 dances', 'Wilson Pickett', '', 18),
	(19, '2022-11-08 13:59:57.739+00', 1, 'Sugarfoot', 'Black Joe Lewis & The Honeybears', '', 19),
	(20, '2022-11-08 13:59:57.739+00', 1, '(Doin'' the) Boom boom', 'Eli ''Paperboy'' Reed & The True Loves', '', 20);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-04-07 20:58:23.639003+00', '2025-04-07 20:58:23.639003+00', true, false, NULL, NULL, NULL),
	('covers', 'covers', NULL, '2025-04-07 20:58:23.643958+00', '2025-04-07 20:58:23.643958+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata", "level") VALUES
	('f01b567e-1d52-4d3c-b294-1940aa5b4213', 'covers', '5a395f89beb2b.jpg', NULL, '2025-04-07 21:25:30.464949+00', '2025-04-07 21:25:41.208795+00', '2025-04-07 21:25:30.464949+00', '{"eTag": "\"111dc3699376282d587670a028330816\"", "size": 35459, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-04-07T21:25:41.200Z", "contentLength": 35459, "httpStatusCode": 200}', '84736a06-fed1-4f06-84e5-394f0b97fcc5', NULL, NULL, 1);


--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 4, true);


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."authors_id_seq"', 1, false);


--
-- Name: mixtapes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."mixtapes_id_seq"', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tags_id_seq"', 1, false);


--
-- Name: tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tracks_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
