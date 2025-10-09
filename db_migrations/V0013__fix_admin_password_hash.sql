-- Fix admin password hash for 'admin123'
-- Using proper bcrypt hash generated with Python bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
UPDATE t_p68921797_ai_assistant_bogdan_.users 
SET password_hash = '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'
WHERE email = 'admin@ai-platform.com';
