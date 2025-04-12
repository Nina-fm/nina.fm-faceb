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
	('00000000-0000-0000-0000-000000000000', 'c5d8ee4b-035f-49c6-bc5f-7ddf1d665c7e', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-19 21:32:23.868724+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf18d459-647e-4f8c-8b3c-a45aee51ae1e', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-19 23:49:57.086019+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd89a6305-4ac4-406a-a2e1-340a80e6cb87', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-19 23:49:57.087715+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f398104-8336-4388-925c-0935f1f2433b', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-19 23:52:40.631065+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c3b038d-5066-4071-bb93-0de3a07408bf', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-20 00:21:54.49087+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a53bd538-2643-46a0-a838-f9c4bb2b7c01', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 08:08:29.259651+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b61797a-5fc0-4b77-a8b8-1a65b456c54a', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 08:15:14.342328+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e8a37e5-a1cc-4bff-96d2-b323bcd7971f', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 08:17:31.488387+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec134b13-92bd-4f3f-8ad0-ed34b570a2e0', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-24 09:16:26.495337+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc35f27f-cd91-48f2-a0e0-4876aad26277', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-24 09:16:26.497922+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9609b71-a4ad-4d0a-bf2f-a2a153947c71', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-24 09:16:26.524391+00', ''),
	('00000000-0000-0000-0000-000000000000', '03909900-20e3-4057-888d-643a9dd89d48', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:44:41.912663+00', ''),
	('00000000-0000-0000-0000-000000000000', '11764e38-6337-4bb4-9dcc-42ec96c84ecf', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:44:43.191489+00', ''),
	('00000000-0000-0000-0000-000000000000', '0609e4c4-0a43-404e-bf05-3f592805d878', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:45:04.101806+00', ''),
	('00000000-0000-0000-0000-000000000000', '58dc2990-1c3b-4117-b543-db0160db739e', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:45:07.116487+00', ''),
	('00000000-0000-0000-0000-000000000000', '97c3ef32-7e0a-4333-977e-a8c68d2a45a4', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:45:10.989991+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d4e2f92-6203-443f-881b-c566fa1257ab', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:45:19.957743+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c91b23a8-496c-45e5-90b0-f0a2c4a3449d', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:46:06.053762+00', ''),
	('00000000-0000-0000-0000-000000000000', 'befafd34-7e40-47ef-85d0-527351958d9b', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:46:14.81465+00', ''),
	('00000000-0000-0000-0000-000000000000', '98a83a24-8884-41a4-8ccb-a1f066a50954', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:47:33.712113+00', ''),
	('00000000-0000-0000-0000-000000000000', '546e63f5-3d63-4f10-b65d-5f3376bac8a5', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:47:36.755964+00', ''),
	('00000000-0000-0000-0000-000000000000', '564f7698-4f85-4bbe-9b47-86192b385bba', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:47:41.773871+00', ''),
	('00000000-0000-0000-0000-000000000000', '0f143758-2809-4897-9d79-fb3384437076', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:47:54.035916+00', ''),
	('00000000-0000-0000-0000-000000000000', '4d772c07-4f6d-4723-ae76-c91a79399a2e', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:47:58.087825+00', ''),
	('00000000-0000-0000-0000-000000000000', '3394092e-a372-48e9-b174-bba7d8f2672a', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:49:38.522222+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e09a992e-e3bd-4218-97cb-e43d8bdc132d', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:55:51.467282+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef90aa96-d6ed-4d17-a36f-e1d2e819c146', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:55:52.759632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7316409-12a0-476f-8708-935a0882c063', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:57:54.695136+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a9a1c585-3bd6-4eaf-8b09-f25e51c33a1d', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:58:39.879411+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a099d57d-82b8-44dc-a97e-9be1490368ae', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 09:58:49.850878+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c61ca61-2aaf-4940-98d0-678dfe71b3cb', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 09:58:58.815374+00', ''),
	('00000000-0000-0000-0000-000000000000', '70ab1e46-e281-48ca-bbd1-7a18fb3508ba', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-24 10:57:50.360613+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cc5c0026-fa70-4cbf-afdf-e34fc02821ce', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-03-24 10:57:50.363232+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ceb24a93-5e20-4161-9a7c-996d05fffc5c', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 13:50:21.936926+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dd8129ef-b3f5-44b2-b98d-ae6dfc42abea', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 13:50:57.644005+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e14adb8c-ca38-4412-87dd-f1cc211c1173', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-03-24 13:51:33.153108+00', ''),
	('00000000-0000-0000-0000-000000000000', '632cdf27-80a8-4554-a5be-7478458998ec', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-03-24 13:51:35.647372+00', ''),
	('00000000-0000-0000-0000-000000000000', '47d38be9-222c-4e8a-9536-16192d463ea4', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-03 22:47:10.261325+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f29b41e-000e-4c79-8e26-fb8e93b1c11d', '{"action":"logout","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-04-03 22:54:00.837958+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da9781d8-2bdb-49fb-b3ea-91d043c8e928', '{"action":"login","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-04-03 22:54:13.675777+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bdb35a7-452c-498f-bc38-d897cbc6476a', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 14:16:30.353442+00', ''),
	('00000000-0000-0000-0000-000000000000', '2afe2738-fbca-41f1-879a-3d4090694bb2', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 14:16:30.36333+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e71f3225-ebe6-46c6-8028-8b7e3811a29b', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 15:15:45.562646+00', ''),
	('00000000-0000-0000-0000-000000000000', '107e7abf-848e-49f5-8dde-284716409541', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 15:15:45.566191+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2d07856-bde0-4eb9-a4dd-65fc428c585a', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 16:14:42.950126+00', ''),
	('00000000-0000-0000-0000-000000000000', '2860767d-e130-4313-b0ac-f3bd97f9ecf5', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 16:14:42.95412+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eae3dc0c-50a8-45a8-881b-bb318958557f', '{"action":"token_refreshed","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 17:13:09.751042+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd83ce4c4-d56a-4bc5-be87-7932d335045d', '{"action":"token_revoked","actor_id":"de446149-2826-4c16-a2d8-7e55c9253df3","actor_username":"120lalanne@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-04-04 17:13:09.763951+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'de446149-2826-4c16-a2d8-7e55c9253df3', 'authenticated', 'authenticated', '120lalanne@gmail.com', '$2a$06$I4dBeHeN/lsYx3zQdr5Cz.R4m.dTP.6KLNQ3a8UQW/aAYi5byBqOq', '2025-03-19 20:57:23.164763+00', NULL, '', NULL, '', '2025-03-19 20:57:23.164763+00', '', '', NULL, '2025-04-03 22:54:13.680859+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2025-03-19 20:57:23.164763+00', '2025-04-04 17:13:09.781046+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('4e676185-1f8a-4032-bb57-505da00f233f', 'de446149-2826-4c16-a2d8-7e55c9253df3', '2025-04-03 22:54:13.680935+00', '2025-04-04 17:13:09.786745+00', NULL, 'aal1', NULL, '2025-04-04 17:13:09.786688', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', '192.168.65.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('4e676185-1f8a-4032-bb57-505da00f233f', '2025-04-03 22:54:13.689322+00', '2025-04-03 22:54:13.689322+00', 'password', '9e450f84-6e01-4663-a9d8-d46e1c18e3d0');


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
	('00000000-0000-0000-0000-000000000000', 27, 'Owyf3d4uLkUyDy3b37dFcg', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-03 22:54:13.683405+00', '2025-04-04 14:16:30.366987+00', NULL, '4e676185-1f8a-4032-bb57-505da00f233f'),
	('00000000-0000-0000-0000-000000000000', 28, 'o2zJa3f71mo5NZdPIdO9KA', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-04 14:16:30.373756+00', '2025-04-04 15:15:45.566966+00', 'Owyf3d4uLkUyDy3b37dFcg', '4e676185-1f8a-4032-bb57-505da00f233f'),
	('00000000-0000-0000-0000-000000000000', 29, 'pNzdYRDoDiOmA4qgvsGqWg', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-04 15:15:45.571921+00', '2025-04-04 16:14:42.955218+00', 'o2zJa3f71mo5NZdPIdO9KA', '4e676185-1f8a-4032-bb57-505da00f233f'),
	('00000000-0000-0000-0000-000000000000', 30, 'uovqJl06w338oL80QxZhvQ', 'de446149-2826-4c16-a2d8-7e55c9253df3', true, '2025-04-04 16:14:42.95787+00', '2025-04-04 17:13:09.765719+00', 'pNzdYRDoDiOmA4qgvsGqWg', '4e676185-1f8a-4032-bb57-505da00f233f'),
	('00000000-0000-0000-0000-000000000000', 31, '7ejW_gcUa0lmW35UX4s4ig', 'de446149-2826-4c16-a2d8-7e55c9253df3', false, '2025-04-04 17:13:09.772852+00', '2025-04-04 17:13:09.772852+00', 'uovqJl06w338oL80QxZhvQ', '4e676185-1f8a-4032-bb57-505da00f233f');


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
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
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
	(1, '2022-12-23 09:34:00.739+00', '2022-12-23 09:34:00.739+00', 'Funky Soul Mix', '2022', '', '01 James Brown : Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)\r\n02 Otis Redding : Security (Live)\r\n03 Mark Ronson : Valerie (feat. Amy Winehouse)\r\n04 Vigon : Harlem shuffle\r\n05 Otis Redding : I can''t turn you loose (Live)\r\n06 Rufus Thomas : Do the funky chicken\r\n07 Otis Redding : Papa''s got a brand new bag (Live)\r\n08 James Brown : There it is (Part 1)\r\n09 Amy Winehouse : Monkey man\r\n10 Macka B. : Roots Ragga\r\n11 James Brown : I got you (Feel good)\r\n12 Robert Parker : Barefootin''\r\n13 Otis Redding : I''m depending on you (Live)\r\n14 James Brown : (Get up I feel like being a) Sex machine\r\n15 The Bamboos : Step it up (feat. Alice Russell)\r\n16 Small Faces : Watcha gonna do about it\r\n17 The Contours : Do you love me\r\n18 Wilson Pickett : Land of 1000 dances\r\n19 Black Joe Lewis & The Honeybears : Sugarfoot\r\n20 Eli ''Paperboy'' Reed & The True Loves : (Doin'' the) Boom boom', '', 'Duc'),
	(2, '2020-12-23 09:34:00.739+00', '2020-12-23 09:34:00.739+00', 'Apophtegme Ducal', '2020', '', '', '', 'Duc'),
	(3, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Un peu de son frais', '2019', '', '01 Nym : Et moi\n02 La Chica : Oasis\n03 Wedel Bikri : Untitled x2\n04 Jos\u00e9 Gonzalez : Teardrop\n05 Fatoumata Diawara : Sowa\n06 Fats Domino : Blueberry Hill\n07 Fanfare Ciocarlia : Asfalt tango\n08 Nana Mouskouri : Que je sois un ange\n09 Charles A. Chepkowny : Kilyano Ratanga\n10 Valaire : Golden rule (Do the Oobopopop)\n11 J.A. Adofo & City Boys Band : Baabi Dehyee\n12 Labelle : Grand Ma\u00eetre (feat. Ballak\u00e9 Sissoko)\n13 Dr. Orlando Owoh & His Omimah Band : Mo Baju Wo Oju Orun \/ Irawo Nii Ko Ni Ku', '', 'Costiloui'),
	(4, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Vous êtes arrivés', '2019', '', 'Akua Nuru - The Block\nJoe Driscoll & Sekou Kouyate - Wonamati\nFaada Freddy - The Death Of Me\nBarbatuques - Voc\u00ea Chegou\n-M-, Toumani Diabat\u00e9, Sidiki Diabat\u00e9, Santigold, Hiba Tawaji, Ibrahim Maalouf, Seu Jorge, Nekfeu, Youssou N\u2019Dour, Sanjay Khan & ChaCha - Solidarit\u00e9\nGoran Bregovic - Cajesukarije Cocek', '', 'Costiloui'),
	(5, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Khéops', '2017', '', '', '', '120 & Le Chapelier');


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

INSERT INTO "public"."profiles" ("id", "created_at", "updated_at", "role", "avatar") VALUES
	('de446149-2826-4c16-a2d8-7e55c9253df3', '2025-03-19 20:57:23.164763+00', '2025-03-19 20:57:23.164763+00', 'admin', NULL);


--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tracks" ("id", "created_at", "mixtape_id", "title", "artist", "start_at", "position") VALUES
	(1, '2022-11-08 13:59:57.739+00', 1, 'Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)', 'James Brown', '0', 1),
	(2, '2022-11-08 13:59:57.739+00', 1, 'Security (Live)', 'Otis Redding', '0', 2),
	(3, '2022-11-08 13:59:57.739+00', 1, 'Valerie (feat. Amy Winehouse)', 'Mark Ronson', '0', 3),
	(4, '2022-11-08 13:59:57.739+00', 1, 'Harlem shuffle', 'Vigon', '0', 4),
	(5, '2022-11-08 13:59:57.739+00', 1, 'I can''t turn you loose (Live)', 'Otis Redding', '0', 5),
	(6, '2022-11-08 13:59:57.739+00', 1, 'Do the funky chicken', 'Rufus Thomas', '0', 6),
	(7, '2022-11-08 13:59:57.739+00', 1, 'Papa''s got a brand new bag (Live)', 'Otis Redding', '0', 7),
	(8, '2022-11-08 13:59:57.739+00', 1, 'There it is (Part 1)', 'James Brown', '0', 8),
	(9, '2022-11-08 13:59:57.739+00', 1, 'Monkey man', 'Amy Winehouse', '0', 9),
	(10, '2022-11-08 13:59:57.739+00', 1, 'Roots Ragga', 'Macka B.', '0', 10),
	(11, '2022-11-08 13:59:57.739+00', 1, 'I got you (Feel good)', 'James Brown', '0', 11),
	(12, '2022-11-08 13:59:57.739+00', 1, 'Barefootin''', 'Robert Parker', '0', 12),
	(13, '2022-11-08 13:59:57.739+00', 1, 'I''m depending on you (Live)', 'Otis Redding', '0', 13),
	(14, '2022-11-08 13:59:57.739+00', 1, '(Get up I feel like being a) Sex machine', 'James Brown', '0', 14),
	(15, '2022-11-08 13:59:57.739+00', 1, 'Step it up (feat. Alice Russell)', 'The Bamboos', '0', 15),
	(16, '2022-11-08 13:59:57.739+00', 1, 'Watcha gonna do about it', 'Small Faces', '0', 16),
	(17, '2022-11-08 13:59:57.739+00', 1, 'Do you love me', 'The Contours', '0', 17),
	(18, '2022-11-08 13:59:57.739+00', 1, 'Land of 1000 dances', 'Wilson Pickett', '0', 18),
	(19, '2022-11-08 13:59:57.739+00', 1, 'Sugarfoot', 'Black Joe Lewis & The Honeybears', '0', 19),
	(20, '2022-11-08 13:59:57.739+00', 1, '(Doin'' the) Boom boom', 'Eli ''Paperboy'' Reed & The True Loves', '0', 20);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('avatars', 'avatars', NULL, '2025-03-19 20:57:22.922522+00', '2025-03-19 20:57:22.922522+00', true, false, NULL, NULL, NULL),
	('covers', 'covers', NULL, '2025-03-19 20:57:22.92959+00', '2025-03-19 20:57:22.92959+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



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

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 31, true);


--
-- Name: authors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."authors_id_seq"', 4, true);


--
-- Name: mixtapes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."mixtapes_id_seq"', 5, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tags_id_seq"', 1, false);


--
-- Name: tracks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tracks_id_seq"', 20, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
