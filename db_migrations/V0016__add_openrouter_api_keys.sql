INSERT INTO t_p68921797_ai_assistant_bogdan_.api_keys (model_id, api_key, enabled, updated_at)
VALUES 
  ('mistral', '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', true, CURRENT_TIMESTAMP),
  ('deepseek-r1t2', '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', true, CURRENT_TIMESTAMP)
ON CONFLICT (model_id) DO UPDATE 
SET api_key = EXCLUDED.api_key, 
    enabled = EXCLUDED.enabled, 
    updated_at = CURRENT_TIMESTAMP;