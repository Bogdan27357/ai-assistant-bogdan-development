-- Добавляем настройки ИИ в таблицу user_settings
INSERT INTO t_p68921797_ai_assistant_bogdan_.user_settings (setting_key, setting_value, updated_at)
VALUES 
  ('knowledge_base', '', NOW()),
  ('preset', 'default', NOW())
ON CONFLICT DO NOTHING;