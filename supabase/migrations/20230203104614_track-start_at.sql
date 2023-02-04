alter table "public"."tracks" drop column "duration";

alter table "public"."tracks" alter column "start_at" set data type text using "start_at"::text;


