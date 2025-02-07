# Database Indexes

## Primary Key Indexes

```sql
CREATE UNIQUE INDEX courses_pkey ON public.courses USING btree (id);
CREATE UNIQUE INDEX college_plans_pkey ON public.college_plans USING btree (id);
CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);
CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);
CREATE UNIQUE INDEX admin_users_pkey ON public.admin_users USING btree (id);
CREATE UNIQUE INDEX admin_roles_pkey ON public.admin_roles USING btree (id);
CREATE UNIQUE INDEX admin_permissions_pkey ON public.admin_permissions USING btree (id);
CREATE UNIQUE INDEX eduguide_services_pkey ON public.eduguide_services USING btree (id);
CREATE UNIQUE INDEX finance_services_pkey ON public.finance_services USING btree (id);
CREATE UNIQUE INDEX applications_pkey ON public.applications USING btree (id);
CREATE UNIQUE INDEX admin_audit_logs_pkey ON public.admin_audit_logs USING btree (id);
```

## Unique Indexes

```sql
CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);
CREATE UNIQUE INDEX admin_users_email_key ON public.admin_users USING btree (email);
CREATE UNIQUE INDEX admin_roles_name_key ON public.admin_roles USING btree (name);
CREATE UNIQUE INDEX admin_permissions_name_key ON public.admin_permissions USING btree (name);
```

## Foreign Key Indexes

```sql
CREATE INDEX applications_user_id_idx ON public.applications USING btree (user_id);
CREATE INDEX applications_service_id_idx ON public.applications USING btree (service_id);
CREATE INDEX messages_user_id_idx ON public.messages USING btree (user_id);
CREATE INDEX admin_users_role_id_idx ON public.admin_users USING btree (role_id);
CREATE INDEX admin_role_permissions_role_id_idx ON public.admin_role_permissions USING btree (role_id);
CREATE INDEX admin_role_permissions_permission_id_idx ON public.admin_role_permissions USING btree (permission_id);
CREATE INDEX admin_audit_logs_admin_id_idx ON public.admin_audit_logs USING btree (admin_id);
```

## Performance Indexes

```sql
CREATE INDEX applications_status_idx ON public.applications USING btree (status);
CREATE INDEX applications_created_at_idx ON public.applications USING btree (created_at DESC);
CREATE INDEX messages_is_read_idx ON public.messages USING btree (is_read);
CREATE INDEX messages_created_at_idx ON public.messages USING btree (created_at DESC);
CREATE INDEX admin_audit_logs_created_at_idx ON public.admin_audit_logs USING btree (created_at DESC);
```