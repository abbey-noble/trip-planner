-- Sets a password on an account that was created by a sign-in link.
-- Run in the Supabase SQL editor. Change both values first.
--
-- Only needed once. After this, sign in with the email and password in the app.

update auth.users
set encrypted_password = crypt('CHANGE-THIS-PASSWORD', gen_salt('bf')),
    email_confirmed_at = coalesce(email_confirmed_at, now()),
    updated_at        = now()
where email = 'CHANGE-THIS@EXAMPLE.COM';

-- If the above errors with: function crypt(...) does not exist
-- then pgcrypto lives in another schema. Use this instead:
--
-- update auth.users
-- set encrypted_password = extensions.crypt('CHANGE-THIS-PASSWORD', extensions.gen_salt('bf')),
--     email_confirmed_at = coalesce(email_confirmed_at, now()),
--     updated_at        = now()
-- where email = 'CHANGE-THIS@EXAMPLE.COM';

-- Confirm it applied. password_set should be true.
select email,
       encrypted_password is not null as password_set,
       email_confirmed_at is not null as confirmed
from auth.users;
