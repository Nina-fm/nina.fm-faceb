-- Set up Storage!
insert into storage.buckets (id, name, public)
  values ('covers', 'covers', true);

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage#policy-examples for more details.
create policy "Cover images are publicly accessible." on storage.objects
  for select using (bucket_id = 'covers');

create policy "Anyone can upload a cover." on storage.objects
  for insert with check (bucket_id = 'covers');