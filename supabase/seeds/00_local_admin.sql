-- Local development only: one editor for the backoffice.
--   email:    admin@josezambudiobernabeu.local
--   password: admin-local
-- In production, create the user in the dashboard and insert its id into
-- public.admins by hand; this file is never run there.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values (
  '00000000-0000-0000-0000-000000000000',
  'a0000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated',
  'admin@josezambudiobernabeu.local',
  extensions.crypt('admin-local', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}', '{}',
  '', '', '', ''
);

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values (
  gen_random_uuid(),
  'a0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001',
  '{"sub":"a0000000-0000-4000-8000-000000000001","email":"admin@josezambudiobernabeu.local"}',
  'email', now(), now(), now()
);

insert into public.admins (user_id) values ('a0000000-0000-4000-8000-000000000001');
