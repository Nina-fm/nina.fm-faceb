create table "public"."mixtapes_authors" (
    "mixtape_id" bigint,
    "author_id" bigint,
    "position" smallint
);


alter table "public"."mixtapes_authors" enable row level security;

CREATE UNIQUE INDEX mixtapes_authors_pkey ON public.mixtapes_authors USING btree (mixtape_id, author_id);

alter table "public"."mixtapes_authors" add constraint "mixtapes_authors_pkey" PRIMARY KEY using index "mixtapes_authors_pkey";

alter table "public"."mixtapes_authors" add constraint "mixtapes_authors_author_id_fkey" FOREIGN KEY (author_id) REFERENCES authors(id) on delete cascade not valid;

alter table "public"."mixtapes_authors" validate constraint "mixtapes_authors_author_id_fkey";

alter table "public"."mixtapes_authors" add constraint "mixtapes_authors_mixtape_id_fkey" FOREIGN KEY (mixtape_id) REFERENCES mixtapes(id) on delete cascade not valid;

alter table "public"."mixtapes_authors" validate constraint "mixtapes_authors_mixtape_id_fkey";

create policy "Public mixtapes_authors are viewable by everyone."
on "public"."mixtapes_authors"
as permissive
for select
to public
using (true);

create policy "Enable insert for anon."
on "public"."mixtapes_authors"
as permissive
for insert
to authenticated, anon
with check (true);

create policy "Enable update for anon."
on "public"."mixtapes_authors"
as permissive
for update
to authenticated, anon
using (true);

create policy "Enable delete for anon."
on "public"."mixtapes_authors"
as permissive
for delete
to authenticated, anon
using (true);