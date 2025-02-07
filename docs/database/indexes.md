# Database Indexes

## Primary Key Indexes

```sql
CREATE UNIQUE INDEX courses_pkey ON public.courses USING btree (id);
CREATE UNIQUE INDEX college_plans_pkey ON public.college_plans USING btree (id);
CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);
CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);
CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (id);
CREATE UNIQUE INDEX eduguide_services_pkey ON public.eduguide_services USING btree (id);
CREATE UNIQUE INDEX finance_services_pkey ON public.finance_services USING btree (id);
```

## Unique Indexes

```sql
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);
CREATE UNIQUE INDEX admin_users_email_key ON public.admin_users USING btree (email);
```