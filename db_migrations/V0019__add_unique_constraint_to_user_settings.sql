-- Добавляем уникальное ограничение на setting_key для корректной работы ON CONFLICT
ALTER TABLE t_p68921797_ai_assistant_bogdan_.user_settings 
ADD CONSTRAINT user_settings_setting_key_unique UNIQUE (setting_key);