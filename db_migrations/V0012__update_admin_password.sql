-- Update admin password to 'admin123'
UPDATE t_p68921797_ai_assistant_bogdan_.users 
SET password_hash = '$2b$12$LQv3c1yqBwcXgRfTvNqFD.EqKhF5eMZWqP5rU8tXqYvKZJ5YqG8n2'
WHERE email = 'admin@ai-platform.com';
