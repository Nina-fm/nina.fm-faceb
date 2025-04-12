drop policy "Enable delete for authenticated or anon." on "public"."authors";

create policy "Enable delete for authenticated or anon."
on "public"."authors"
as permissive
for delete
to authenticated, anon
using (
   (NOT (EXISTS ( SELECT 1
   FROM mixtapes_authors
  WHERE (mixtapes_authors.author_id = authors.id))))
);