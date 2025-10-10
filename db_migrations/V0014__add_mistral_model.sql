-- Disable all existing models
UPDATE t_p68921797_ai_assistant_bogdan_.api_keys 
SET enabled = false, api_key = '' 
WHERE model_id IN ('gemini', 'llama', 'qwen', 'gigachat', 'deepseek', 'openrouter', 'imagerouter');

-- Add Mistral model
INSERT INTO t_p68921797_ai_assistant_bogdan_.api_keys (model_id, api_key, enabled, updated_at)
VALUES ('mistral', '', true, NOW())
ON CONFLICT DO NOTHING;
