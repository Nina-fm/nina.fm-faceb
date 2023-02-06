create policy "Allow delete if not linked to any mixtape."
on "public"."authors"
as permissive
for delete
to authenticated, anon
using (
   (NOT (EXISTS ( SELECT 1
   FROM mixtapes_authors
  WHERE (mixtapes_authors.author_id = authors.id))))
);