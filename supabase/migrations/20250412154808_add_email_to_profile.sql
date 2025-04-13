-- Add email column to the profiles table
alter table "public"."profiles"
add column "email" text;

-- Update the function triggered on user creation to include the email field
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;