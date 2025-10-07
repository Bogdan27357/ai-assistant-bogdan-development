CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    model_id VARCHAR(50) UNIQUE NOT NULL,
    api_key TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO api_keys (model_id, api_key, enabled) VALUES
    ('gemini', '', true),
    ('llama', '', true),
    ('gigachat', '', true)
ON CONFLICT (model_id) DO NOTHING;