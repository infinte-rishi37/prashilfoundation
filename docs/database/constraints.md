# Database Constraints

## Type Constraints

```sql
ALTER TABLE courses 
  ADD CONSTRAINT courses_type_check 
  CHECK (type IN ('Domestic', 'Abroad'));

ALTER TABLE courses 
  ADD CONSTRAINT courses_mode_check 
  CHECK (mode IN ('Online', 'Offline'));

ALTER TABLE eduguide_services 
  ADD CONSTRAINT eduguide_services_category_check 
  CHECK (category IN ('career_counselling', 'college_admission'));

ALTER TABLE finance_services 
  ADD CONSTRAINT finance_services_type_check 
  CHECK (type IN ('Domestic', 'Abroad'));
```

## Domain Constraints

```sql
CREATE DOMAIN cardinal_number AS integer
  CONSTRAINT cardinal_number_domain_check 
  CHECK (VALUE >= 0);

CREATE DOMAIN yes_or_no AS text
  CONSTRAINT yes_or_no_check 
  CHECK (VALUE IN ('YES', 'NO'));
```

## Authentication Constraints

```sql
ALTER TABLE auth.users
  ADD CONSTRAINT users_email_change_confirm_status_check 
  CHECK (email_change_confirm_status BETWEEN 0 AND 2);

ALTER TABLE auth.sso_providers
  ADD CONSTRAINT resource_id_not_empty 
  CHECK (resource_id IS NULL OR length(resource_id) > 0);

ALTER TABLE auth.sso_domains
  ADD CONSTRAINT domain_not_empty 
  CHECK (length(domain) > 0);

ALTER TABLE auth.saml_providers
  ADD CONSTRAINT metadata_xml_not_empty 
  CHECK (length(metadata_xml) > 0);

ALTER TABLE auth.saml_providers
  ADD CONSTRAINT metadata_url_not_empty 
  CHECK (metadata_url IS NULL OR length(metadata_url) > 0);

ALTER TABLE auth.saml_providers
  ADD CONSTRAINT entity_id_not_empty 
  CHECK (length(entity_id) > 0);

ALTER TABLE auth.saml_relay_states
  ADD CONSTRAINT request_id_not_empty 
  CHECK (length(request_id) > 0);

ALTER TABLE auth.one_time_tokens
  ADD CONSTRAINT one_time_tokens_token_hash_check 
  CHECK (length(token_hash) > 0);
```

## Encryption Constraints

```sql
ALTER TABLE pgsodium.key
  ADD CONSTRAINT key_key_context_check 
  CHECK (length(key_context) = 8);

ALTER TABLE pgsodium.key
  ADD CONSTRAINT pgsodium_raw 
  CHECK (
    CASE
      WHEN raw_key IS NOT NULL THEN 
        key_id IS NULL AND 
        key_context IS NULL AND 
        parent_key IS NOT NULL
      ELSE 
        key_id IS NOT NULL AND 
        key_context IS NOT NULL AND 
        parent_key IS NULL
    END
  );
```