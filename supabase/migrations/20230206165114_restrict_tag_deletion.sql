drop policy "Enable delete for authenticated or anon." on "public"."tags";

create policy "Enable delete for authenticated or anon."
on "public"."tags"
as permissive
for delete
to authenticated, anon
using (
   (NOT (EXISTS ( SELECT 1
   FROM mixtapes_tags
  WHERE (mixtapes_tags.tag_id = tags.id))))
);