-- Add new categories for document services
INSERT INTO finance_categories (name, type, description) VALUES
  ('PAN Services', 'document', 'PAN card application and modification services'),
  ('Aadhar Services', 'document', 'Aadhar card update and modification services');

-- Add specific services for each category
INSERT INTO finance_services (
  category_id,
  name,
  description,
  requirements,
  documents_required
) VALUES
  -- PAN Services
  (
    (SELECT id FROM finance_categories WHERE name = 'PAN Services' LIMIT 1),
    'PAN Card Application',
    'New PAN card application service with complete assistance',
    ARRAY['Age proof', 'Identity proof', 'Address proof'],
    ARRAY['Aadhar card', 'Birth certificate/Passport', 'Utility bills']
  ),
  (
    (SELECT id FROM finance_categories WHERE name = 'PAN Services' LIMIT 1),
    'PAN Card Correction',
    'Modification and correction in existing PAN card details',
    ARRAY['Existing PAN card', 'Supporting documents for correction'],
    ARRAY['Current PAN card', 'Proof for correction']
  ),
  -- Aadhar Services
  (
    (SELECT id FROM finance_categories WHERE name = 'Aadhar Services' LIMIT 1),
    'Aadhar Card Update',
    'Update or modify existing Aadhar card details',
    ARRAY['Existing Aadhar card', 'Supporting documents for update'],
    ARRAY['Current Aadhar card', 'Proof for update']
  ),
  (
    (SELECT id FROM finance_categories WHERE name = 'Aadhar Services' LIMIT 1),
    'Aadhar Address Change',
    'Change of address in Aadhar card',
    ARRAY['Existing Aadhar card', 'New address proof'],
    ARRAY['Current Aadhar card', 'Utility bills/Rental agreement']
  );