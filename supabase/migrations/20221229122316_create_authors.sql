create table "public"."authors" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "user_id" uuid,
    "name" text,
    "avatar" text
);


alter table "public"."authors" enable row level security;

CREATE UNIQUE INDEX authors_name_key ON public.authors USING btree (name);

CREATE UNIQUE INDEX authors_pkey ON public.authors USING btree (id);

alter table "public"."authors" add constraint "authors_pkey" PRIMARY KEY using index "authors_pkey";

alter table "public"."authors" add constraint "name_length" CHECK ((char_length(name) >= 2)) not valid;

alter table "public"."authors" validate constraint "name_length";

alter table "public"."authors" add constraint "authors_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."authors" validate constraint "authors_user_id_fkey";

alter table "public"."authors" add constraint "authors_name_key" UNIQUE using index "authors_name_key";

set check_function_bodies = off;

create policy "Public authors are viewable by everyone."
on "public"."authors"
as permissive
for select
to public
using (true);

create policy "Enable insert for authenticated or anon."
on "public"."authors"
as permissive
for insert
to authenticated, anon
with check (true);

create policy "Enable update for authenticated or anon."
on "public"."authors"
as permissive
for update
to authenticated, anon
using (true);

create policy "Enable delete for authenticated or anon."
on "public"."authors"
as permissive
for delete
to authenticated, anon
using (true);



