-- Update admin password to correct SHA256 hash of 'admin123'
UPDATE admin_users 
SET password_hash = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' 
WHERE email = 'admin@ai-platform.com';