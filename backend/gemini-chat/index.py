import json
import os
from typing import Dict, Any
import requests
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: OpenRouter chat integration with single API key for all paid AI models
    Args: event with httpMethod, body (message, session_id, model_id)
    Returns: AI response from selected model via OpenRouter
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    message = body_data.get('message', '')
    model_id = body_data.get('model_id', 'gemini')
    conversation_history = body_data.get('conversation_history', [])
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # Используем только OpenRouter ключ для всех моделей
    cur.execute(f"SELECT api_key, enabled FROM api_keys WHERE model_id = 'openrouter'")
    
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row or not row[0]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'OpenRouter API key not configured in admin panel'}),
            'isBase64Encoded': False
        }
    
    if not row[1]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'OpenRouter is disabled in admin panel'}),
            'isBase64Encoded': False
        }
    
    api_key = row[0]
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT file_name, content FROM knowledge_base ORDER BY created_at DESC LIMIT 10")
    knowledge_files = cur.fetchall()
    cur.close()
    conn.close()
    
    context = ""
    if knowledge_files:
        context = "\n\n=== База знаний ===\n"
        for file_name, content in knowledge_files:
            context += f"\n[{file_name}]:\n{content[:1000]}\n"
        context += "===================\n\n"
    
    enhanced_message = f"{context}Пользователь спрашивает: {message}"
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    
    # Умный выбор модели на основе запроса пользователя
    message_lower = message.lower()
    
    # Определяем тип задачи
    if any(word in message_lower for word in ['изображен', 'картинк', 'фото', 'image', 'picture', 'photo', 'что на', 'опиши', 'describe', 'vision']):
        # Для анализа изображений - Gemini 2.0 Flash (мультимодальная)
        auto_model = 'google/gemini-2.0-flash-exp:free'
        task_type = 'Анализ изображения'
    elif any(word in message_lower for word in ['генерир', 'нарисуй', 'создай картинк', 'generate image', 'create image', 'draw']):
        # Для генерации изображений - Flux
        auto_model = 'black-forest-labs/flux-1.1-pro'
        task_type = 'Генерация изображения'
    elif any(word in message_lower for word in ['код', 'code', 'программ', 'function', 'debug', 'script', 'python', 'javascript', 'react', 'tsx', 'jsx']):
        # Для кода - DeepSeek (лучший для программирования)
        auto_model = 'deepseek/deepseek-chat:free'
        task_type = 'Программирование'
    elif any(word in message_lower for word in ['логика', 'reasoning', 'размышл', 'анализ', 'почему', 'explain', 'докажи', 'proof']):
        # Для логики и рассуждений - Llama или Claude
        auto_model = 'anthropic/claude-3.5-sonnet:free'
        task_type = 'Логика и анализ'
    elif any(word in message_lower for word in ['творч', 'creative', 'истор', 'story', 'стих', 'poem', 'сочин', 'write']):
        # Для творчества - Claude
        auto_model = 'anthropic/claude-3.5-sonnet:free'
        task_type = 'Творчество'
    elif any(word in message_lower for word in ['матем', 'math', 'calculate', 'вычисл', 'уравнен', 'equation', 'формул']):
        # Для математики - DeepSeek
        auto_model = 'deepseek/deepseek-chat:free'
        task_type = 'Математика'
    elif any(word in message_lower for word in ['перевод', 'translate', 'на английский', 'to english', 'на русский', 'to russian']):
        # Для переводов - Qwen (мультиязычная)
        auto_model = 'qwen/qwen-2.5-72b-instruct:free'
        task_type = 'Перевод'
    elif len(message) < 50:
        # Для коротких быстрых вопросов - Gemini (самая быстрая)
        auto_model = 'google/gemini-2.0-flash-thinking-exp:free'
        task_type = 'Быстрый ответ'
    else:
        # Для всего остального - баланс (Mistral или Llama)
        auto_model = 'meta-llama/llama-3.3-70b-instruct:free'
        task_type = 'Общие вопросы'
    
    # Если пользователь явно выбрал модель через UI - используем её
    model_mapping = {
        'gemini': 'google/gemini-2.0-flash-thinking-exp:free',
        'gemini-vision': 'google/gemini-2.0-flash-exp:free',
        'llama': 'meta-llama/llama-3.3-70b-instruct:free',
        'llama-vision': 'meta-llama/llama-3.2-90b-vision-instruct:free',
        'deepseek': 'deepseek/deepseek-chat:free',
        'qwen': 'qwen/qwen-2.5-72b-instruct:free',
        'qwen-vision': 'qwen/qwen-2-vl-72b-instruct:free',
        'mistral': 'mistralai/mistral-large:free',
        'claude': 'anthropic/claude-3.5-sonnet:free',
        'flux': 'black-forest-labs/flux-1.1-pro',
        'dalle': 'openai/dall-e-3',
        'auto': auto_model
    }
    
    model_name = model_mapping.get(model_id, auto_model)
    used_model_name = task_type if model_id == 'auto' else model_id
    
    # Проверяем, это модель генерации изображений или нет
    is_image_gen = model_id in ['flux', 'dalle'] or (model_id == 'auto' and 'генерир' in message_lower)
    
    messages = []
    for msg in conversation_history:
        messages.append({'role': msg['role'], 'content': msg['content']})
    messages.append({'role': 'user', 'content': enhanced_message})
    
    # Для генерации изображений используем другой формат
    if is_image_gen:
        payload = {
            'model': model_name,
            'prompt': message,
            'n': 1,
            'size': '1024x1024'
        }
        stream_mode = False
    else:
        payload = {
            'model': model_name,
            'messages': messages,
            'stream': True
        }
        stream_mode = True
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {api_key}',
        'HTTP-Referer': 'https://ai-platform.example.com',
        'X-Title': 'AI Platform'
    }
    
    response = requests.post(url, json=payload, headers=headers, stream=stream_mode)
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'OpenRouter API error: {response.text}'}),
            'isBase64Encoded': False
        }
    
    # Обработка ответа для генерации изображений
    if is_image_gen:
        data = response.json()
        # OpenRouter может вернуть URL изображения или base64
        image_url = data.get('data', [{}])[0].get('url', '')
        if image_url:
            ai_response = f'🎨 Изображение сгенерировано!\n\n![Generated Image]({image_url})\n\nURL: {image_url}'
        else:
            ai_response = 'Ошибка генерации изображения'
    else:
        # Стандартная обработка для текстовых моделей
        ai_response = ''
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    data_str = line_str[6:]
                    if data_str.strip() == '[DONE]':
                        break
                    try:
                        chunk = json.loads(data_str)
                        content = chunk.get('choices', [{}])[0].get('delta', {}).get('content', '')
                        ai_response += content
                    except:
                        continue
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'response': ai_response,
            'model': model_name,
            'provider': 'OpenRouter',
            'task_type': used_model_name,
            'is_image': is_image_gen
        }),
        'isBase64Encoded': False
    }