create table "public"."mixtapes_tags" (
    "mixtape_id" bigint,
    "tag_id" bigint
);


alter table "public"."mixtapes_tags" enable row level security;

CREATE UNIQUE INDEX mixtapes_tags_pkey ON public.mixtapes_tags USING btree (mixtape_id, tag_id);

alter table "public"."mixtapes_tags" add constraint "mixtapes_tags_pkey" PRIMARY KEY using index "mixtapes_tags_pkey";

alter table "public"."mixtapes_tags" add constraint "mixtapes_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) on delete cascade not valid;

alter table "public"."mixtapes_tags" validate constraint "mixtapes_tags_tag_id_fkey";

alter table "public"."mixtapes_tags" add constraint "mixtapes_tags_mixtape_id_fkey" FOREIGN KEY (mixtape_id) REFERENCES mixtapes(id) on delete cascade;

alter table "public"."mixtapes_tags" validate constraint "mixtapes_tags_mixtape_id_fkey";

create policy "Public mixtapes_tags are viewable by everyone."
on "public"."mixtapes_tags"
as permissive
for select
to public
using (true);

create policy "Enable insert for authenticated or anon."
on "public"."mixtapes_tags"
as permissive
for insert
to authenticated, anon
with check (true);

create policy "Enable update for authenticated or anon."
on "public"."mixtapes_tags"
as permissive
for update
to authenticated, anon
using (true);

create policy "Enable delete for authenticated or anon."
on "public"."mixtapes_tags"
as permissive
for delete
to authenticated, anon
using (true);