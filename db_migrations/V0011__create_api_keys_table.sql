-- Create api_keys table for storing API configurations
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    model_id VARCHAR(100) UNIQUE NOT NULL,
    api_key TEXT,
    enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_model_id ON api_keys(model_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_enabled ON api_keys(enabled);
