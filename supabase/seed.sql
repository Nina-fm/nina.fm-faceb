-- Insert user
INSERT INTO 
"auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at") 
VALUES 
('00000000-0000-0000-0000-000000000000', 'ee7841ac-aa19-4f04-9560-28075f87a308', 'authenticated', 'authenticated', '120lalanne@gmail.com', '$2a$10$vRg1hTK.jW3Enqi/6NfL7ueMjTGHBVJ.jABOuiALTJHUa3zQUi8pG', '2022-11-08 13:59:36.255047+00', NULL, '', NULL, '', NULL, '', '', NULL, '2022-11-08 13:59:36.257382+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2022-11-08 13:59:36.242554+00', '2022-11-08 13:59:36.260643+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);

-- Insert user identity
INSERT INTO 
"auth"."identities" ("id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at") 
VALUES 
('ee7841ac-aa19-4f04-9560-28075f87a308', 'ee7841ac-aa19-4f04-9560-28075f87a308', '{"sub": "ee7841ac-aa19-4f04-9560-28075f87a308"}', 'email', '2022-11-08 13:59:36.251178+00', '2022-11-08 13:59:36.251215+00', '2022-11-08 13:59:36.251218+00');

-- Insert profiles
INSERT INTO 
"public"."authors" ("user_id", "updated_at", "name", "avatar")
VALUES 
('ee7841ac-aa19-4f04-9560-28075f87a308', '2022-11-08 13:59:57.739+00', '120', null),
(null, '2022-12-23 09:34:00.739+00', 'Costiloui', null),
(null, '2022-12-20 09:34:00.739+00', 'Duc', null),
(null, '2022-12-20 09:34:00.739+00', 'Le Chapelier', null);

-- Insert mixtapes
INSERT INTO
"public"."mixtapes" ("name", "year", "authors_text", "comment", "tracks_text", "cover", "created_at", "updated_at")
VALUES
('Funky Soul Mix', '2022', 'Duc', '', '01 James Brown : Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)\r\n02 Otis Redding : Security (Live)\r\n03 Mark Ronson : Valerie (feat. Amy Winehouse)\r\n04 Vigon : Harlem shuffle\r\n05 Otis Redding : I can''t turn you loose (Live)\r\n06 Rufus Thomas : Do the funky chicken\r\n07 Otis Redding : Papa''s got a brand new bag (Live)\r\n08 James Brown : There it is (Part 1)\r\n09 Amy Winehouse : Monkey man\r\n10 Macka B. : Roots Ragga\r\n11 James Brown : I got you (Feel good)\r\n12 Robert Parker : Barefootin''\r\n13 Otis Redding : I''m depending on you (Live)\r\n14 James Brown : (Get up I feel like being a) Sex machine\r\n15 The Bamboos : Step it up (feat. Alice Russell)\r\n16 Small Faces : Watcha gonna do about it\r\n17 The Contours : Do you love me\r\n18 Wilson Pickett : Land of 1000 dances\r\n19 Black Joe Lewis & The Honeybears : Sugarfoot\r\n20 Eli ''Paperboy'' Reed & The True Loves : (Doin'' the) Boom boom', '', '2022-12-23 09:34:00.739+00', '2022-12-23 09:34:00.739+00'),
('Apophtegme Ducal', '2020', 'Duc', '', '', '', '2020-12-23 09:34:00.739+00', '2020-12-23 09:34:00.739+00'),
('Un peu de son frais', '2019', 'Costiloui', '', '01 Nym : Et moi\n02 La Chica : Oasis\n03 Wedel Bikri : Untitled x2\n04 Jos\u00e9 Gonzalez : Teardrop\n05 Fatoumata Diawara : Sowa\n06 Fats Domino : Blueberry Hill\n07 Fanfare Ciocarlia : Asfalt tango\n08 Nana Mouskouri : Que je sois un ange\n09 Charles A. Chepkowny : Kilyano Ratanga\n10 Valaire : Golden rule (Do the Oobopopop)\n11 J.A. Adofo & City Boys Band : Baabi Dehyee\n12 Labelle : Grand Ma\u00eetre (feat. Ballak\u00e9 Sissoko)\n13 Dr. Orlando Owoh & His Omimah Band : Mo Baju Wo Oju Orun \/ Irawo Nii Ko Ni Ku', '', '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00'),
('Vous êtes arrivés', '2019', 'Costiloui', '', 'Akua Nuru - The Block\nJoe Driscoll & Sekou Kouyate - Wonamati\nFaada Freddy - The Death Of Me\nBarbatuques - Voc\u00ea Chegou\n-M-, Toumani Diabat\u00e9, Sidiki Diabat\u00e9, Santigold, Hiba Tawaji, Ibrahim Maalouf, Seu Jorge, Nekfeu, Youssou N\u2019Dour, Sanjay Khan & ChaCha - Solidarit\u00e9\nGoran Bregovic - Cajesukarije Cocek', '', '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00'),
('Khéops', '2017', '120 & Le Chapelier', '', '', '', '2019-12-23 09:34:00.739+00', '2019-12-23 09:34:00.739+00');

-- Insert mixtapes authors
INSERT INTO
"public"."mixtapes_authors" ("mixtape_id", "author_id", "position")
VALUES
(1, 3, 0),
(2, 3, 0),
(3, 2, 0),
(4, 2, 0),
(5, 1, 0),
(5, 4, 1);

-- Insert tracks
INSERT INTO
"public"."tracks" ("title", "artist", "position", "mixtape_id", "start_at", "created_at")
VALUES
('Doing it to death (Part 1) (feat. Fred Wesley & the J.B.''s)', 'James Brown', 1, 1, 0, '2022-11-08 13:59:57.739+00'),
('Security (Live)', 'Otis Redding', 2, 1, 0, '2022-11-08 13:59:57.739+00'),
('Valerie (feat. Amy Winehouse)', 'Mark Ronson', 3, 1, 0, '2022-11-08 13:59:57.739+00'),
('Harlem shuffle', 'Vigon', 4, 1, 0, '2022-11-08 13:59:57.739+00'),
('I can''t turn you loose (Live)', 'Otis Redding', 5, 1, 0, '2022-11-08 13:59:57.739+00'),
('Do the funky chicken', 'Rufus Thomas', 6, 1, 0, '2022-11-08 13:59:57.739+00'),
('Papa''s got a brand new bag (Live)', 'Otis Redding', 7, 1, 0, '2022-11-08 13:59:57.739+00'),
('There it is (Part 1)', 'James Brown', 8, 1, 0, '2022-11-08 13:59:57.739+00'),
('Monkey man', 'Amy Winehouse', 9, 1, 0, '2022-11-08 13:59:57.739+00'),
('Roots Ragga', 'Macka B.', 10, 1, 0, '2022-11-08 13:59:57.739+00'),
('I got you (Feel good)', 'James Brown', 11, 1, 0, '2022-11-08 13:59:57.739+00'),
('Barefootin''', 'Robert Parker', 12, 1, 0, '2022-11-08 13:59:57.739+00'),
('I''m depending on you (Live)', 'Otis Redding', 13, 1, 0, '2022-11-08 13:59:57.739+00'),
('(Get up I feel like being a) Sex machine', 'James Brown', 14, 1, 0, '2022-11-08 13:59:57.739+00'),
('Step it up (feat. Alice Russell)', 'The Bamboos', 15, 1, 0, '2022-11-08 13:59:57.739+00'),
('Watcha gonna do about it', 'Small Faces', 16, 1, 0, '2022-11-08 13:59:57.739+00'),
('Do you love me', 'The Contours', 17, 1, 0, '2022-11-08 13:59:57.739+00'),
('Land of 1000 dances', 'Wilson Pickett', 18, 1, 0, '2022-11-08 13:59:57.739+00'),
('Sugarfoot', 'Black Joe Lewis & The Honeybears', 19, 1, 0, '2022-11-08 13:59:57.739+00'),
('(Doin'' the) Boom boom', 'Eli ''Paperboy'' Reed & The True Loves', 20, 1, 0, '2022-11-08 13:59:57.739+00');