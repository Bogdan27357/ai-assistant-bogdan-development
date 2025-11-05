-- Update default admin password to 'admin123' (SHA256 hash)
UPDATE admin_users 
SET password_hash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3' 
WHERE email = 'admin@ai-platform.com';