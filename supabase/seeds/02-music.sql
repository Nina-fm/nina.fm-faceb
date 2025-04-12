--
-- Data for Name: authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.authors ("id", "created_at", "updated_at", "user_id", "name", "avatar") 
VALUES
	(1, '2025-03-19 20:57:23.202003+00', '2022-11-08 13:59:57.739+00', 'de446149-2826-4c16-a2d8-7e55c9253df3', '120', NULL),
	(2, '2025-03-19 20:57:23.202003+00', '2022-12-23 09:34:00.739+00', NULL, 'Costiloui', NULL),
	(3, '2025-03-19 20:57:23.202003+00', '2022-12-20 09:34:00.739+00', NULL, 'Duc', NULL),
	(4, '2025-03-19 20:57:23.202003+00', '2022-12-20 09:34:00.739+00', NULL, 'Le Chapelier', NULL);

--
-- Data for Name: mixtapes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.mixtapes ("id", "created_at", "updated_at", "name", "year", "comment", "tracks_text", "cover", "authors_text") 
VALUES
	(1, '2022-12-23 09:34:00.739+00', '2022-12-23 09:34:00.739+00', 'Funky Soul Mix', '2022', '', '01 James Brown : Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)\r\n02 Otis Redding : Security (Live)\r\n03 Mark Ronson : Valerie (feat. Amy Winehouse)\r\n04 Vigon : Harlem shuffle\r\n05 Otis Redding : I can''t turn you loose (Live)\r\n06 Rufus Thomas : Do the funky chicken\r\n07 Otis Redding : Papa''s got a brand new bag (Live)\r\n08 James Brown : There it is (Part 1)\r\n09 Amy Winehouse : Monkey man\r\n10 Macka B. : Roots Ragga\r\n11 James Brown : I got you (Feel good)\r\n12 Robert Parker : Barefootin''\r\n13 Otis Redding : I''m depending on you (Live)\r\n14 James Brown : (Get up I feel like being a) Sex machine\r\n15 The Bamboos : Step it up (feat. Alice Russell)\r\n16 Small Faces : Watcha gonna do about it\r\n17 The Contours : Do you love me\r\n18 Wilson Pickett : Land of 1000 dances\r\n19 Black Joe Lewis & The Honeybears : Sugarfoot\r\n20 Eli ''Paperboy'' Reed & The True Loves : (Doin'' the) Boom boom', '', 'Duc'),
	(2, '2020-12-23 09:34:00.739+00', '2020-12-23 09:34:00.739+00', 'Apophtegme Ducal', '2020', '', '', '', 'Duc'),
	(3, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Un peu de son frais', '2019', '', '01 Nym : Et moi\n02 La Chica : Oasis\n03 Wedel Bikri : Untitled x2\n04 Jos\u00e9 Gonzalez : Teardrop\n05 Fatoumata Diawara : Sowa\n06 Fats Domino : Blueberry Hill\n07 Fanfare Ciocarlia : Asfalt tango\n08 Nana Mouskouri : Que je sois un ange\n09 Charles A. Chepkowny : Kilyano Ratanga\n10 Valaire : Golden rule (Do the Oobopopop)\n11 J.A. Adofo & City Boys Band : Baabi Dehyee\n12 Labelle : Grand Ma\u00eetre (feat. Ballak\u00e9 Sissoko)\n13 Dr. Orlando Owoh & His Omimah Band : Mo Baju Wo Oju Orun \/ Irawo Nii Ko Ni Ku', '', 'Costiloui'),
	(4, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Vous êtes arrivés', '2019', '', 'Akua Nuru - The Block\nJoe Driscoll & Sekou Kouyate - Wonamati\nFaada Freddy - The Death Of Me\nBarbatuques - Voc\u00ea Chegou\n-M-, Toumani Diabat\u00e9, Sidiki Diabat\u00e9, Santigold, Hiba Tawaji, Ibrahim Maalouf, Seu Jorge, Nekfeu, Youssou N\u2019Dour, Sanjay Khan & ChaCha - Solidarit\u00e9\nGoran Bregovic - Cajesukarije Cocek', '', 'Costiloui'),
	(5, '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00', 'Khéops', '2017', '', '', '', '120 & Le Chapelier');


--
-- Data for Name: mixtapes_authors; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.mixtapes_authors ("mixtape_id", "author_id", "position") 
VALUES
	(1, 3, 0),
	(2, 3, 0),
	(3, 2, 0),
	(4, 2, 0),
	(5, 1, 0),
	(5, 4, 1);

--
-- Data for Name: tracks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tracks ("id", "created_at", "mixtape_id", "title", "artist", "start_at", "position") 
VALUES
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