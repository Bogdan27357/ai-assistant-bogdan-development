-- Таблица с системными промптами
CREATE TABLE IF NOT EXISTS system_prompts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    prompt_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    ai_model VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_system_prompts_model ON system_prompts(ai_model);
CREATE INDEX IF NOT EXISTS idx_system_prompts_active ON system_prompts(is_active);

-- Вставка дефолтных промптов
INSERT INTO system_prompts (name, prompt_text, ai_model) 
VALUES 
  ('Default YandexGPT', 'Ты - полезный ассистент. Отвечай на вопросы пользователя, используя предоставленную базу знаний.', 'yandex-gpt'),
  ('Default GigaChat', 'Ты - полезный ассистент. Отвечай на вопросы пользователя, используя предоставленную базу знаний.', 'gigachat');