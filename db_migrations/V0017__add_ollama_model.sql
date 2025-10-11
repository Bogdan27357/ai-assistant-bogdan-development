INSERT INTO t_p68921797_ai_assistant_bogdan_.api_keys (model_id, api_key, enabled) 
VALUES ('ollama', 'http://localhost:11434', true) 
ON CONFLICT (model_id) DO NOTHING;