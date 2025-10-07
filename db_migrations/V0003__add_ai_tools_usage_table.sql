CREATE TABLE IF NOT EXISTS ai_tools_usage (
    id SERIAL PRIMARY KEY,
    tool_name VARCHAR(100) NOT NULL,
    session_id VARCHAR(255),
    input_text TEXT,
    output_text TEXT,
    parameters JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ai_tools_session ON ai_tools_usage(session_id);
CREATE INDEX idx_ai_tools_created ON ai_tools_usage(created_at);
