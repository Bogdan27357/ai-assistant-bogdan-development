-- Устанавливаем правильные настройки по умолчанию
UPDATE t_p68921797_ai_assistant_bogdan_.user_settings 
SET setting_value = 'Ты полезный ИИ-ассистент по имени Богдан.', updated_at = NOW()
WHERE setting_key = 'system_prompt';

UPDATE t_p68921797_ai_assistant_bogdan_.user_settings 
SET setting_value = '', updated_at = NOW()
WHERE setting_key = 'knowledge_base';

UPDATE t_p68921797_ai_assistant_bogdan_.user_settings 
SET setting_value = 'default', updated_at = NOW()
WHERE setting_key = 'preset';