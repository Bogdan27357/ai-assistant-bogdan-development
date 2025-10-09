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
    
    # Получаем все доступные API ключи
    cur.execute("SELECT model_id, api_key, enabled FROM api_keys WHERE enabled = true")
    
    api_keys = {}
    for row in cur.fetchall():
        api_keys[row[0]] = row[1]
    
    cur.close()
    conn.close()
    
    # Проверяем, есть ли хотя бы один ключ
    if not api_keys:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'No API keys configured. Please add at least one API key in admin panel'}),
            'isBase64Encoded': False
        }
    
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
    
    # Маппинг моделей на провайдеров и их API
    model_providers = {
        # OpenRouter (платные и бесплатные модели через один ключ)
        'gemini': {'provider': 'openrouter', 'model': 'google/gemini-2.0-flash-thinking-exp:free'},
        'gemini-vision': {'provider': 'openrouter', 'model': 'google/gemini-2.0-flash-exp:free'},
        'llama': {'provider': 'openrouter', 'model': 'meta-llama/llama-3.3-70b-instruct:free'},
        'llama-vision': {'provider': 'openrouter', 'model': 'meta-llama/llama-3.2-90b-vision-instruct:free'},
        'deepseek': {'provider': 'openrouter', 'model': 'deepseek/deepseek-chat:free'},
        'qwen': {'provider': 'openrouter', 'model': 'qwen/qwen-2.5-72b-instruct:free'},
        'qwen-vision': {'provider': 'openrouter', 'model': 'qwen/qwen-2-vl-72b-instruct:free'},
        'mistral': {'provider': 'openrouter', 'model': 'mistralai/mistral-large:free'},
        'claude': {'provider': 'openrouter', 'model': 'anthropic/claude-3.5-sonnet:free'},
        'flux': {'provider': 'openrouter', 'model': 'black-forest-labs/flux-1.1-pro'},
        'dalle': {'provider': 'openrouter', 'model': 'openai/dall-e-3'},
        
        # Бесплатные модели с собственными API ключами
        'gemini-free': {'provider': 'gemini', 'model': 'gemini-2.0-flash-exp'},
        'gpt-free': {'provider': 'openai', 'model': 'gpt-4o-mini'},
        'claude-free': {'provider': 'anthropic', 'model': 'claude-3-5-haiku-20241022'},
        'groq-llama': {'provider': 'groq', 'model': 'llama-3.3-70b-versatile'},
        'groq-mixtral': {'provider': 'groq', 'model': 'mixtral-8x7b-32768'},
        
        'auto': {'provider': 'openrouter', 'model': auto_model}
    }
    
    # Получаем информацию о выбранной модели
    model_info = model_providers.get(model_id, model_providers['auto'])
    provider = model_info['provider']
    model_name = model_info['model']
    used_model_name = task_type if model_id == 'auto' else model_id
    
    # Проверяем наличие ключа для провайдера
    if provider not in api_keys:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'{provider.upper()} API key not configured. Please add it in admin panel'}),
            'isBase64Encoded': False
        }
    
    api_key = api_keys[provider]
    
    # Проверяем, это модель генерации изображений или нет
    is_image_gen = model_id in ['flux', 'dalle'] or (model_id == 'auto' and 'генерир' in message_lower)
    
    messages = []
    for msg in conversation_history:
        messages.append({'role': msg['role'], 'content': msg['content']})
    messages.append({'role': 'user', 'content': enhanced_message})
    
    # Определяем URL и формат запроса в зависимости от провайдера
    if provider == 'openrouter':
        url = 'https://openrouter.ai/api/v1/chat/completions'
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
            'HTTP-Referer': 'https://ai-platform.example.com',
            'X-Title': 'AI Platform'
        }
        if is_image_gen:
            payload = {'model': model_name, 'prompt': message, 'n': 1, 'size': '1024x1024'}
            stream_mode = False
        else:
            payload = {'model': model_name, 'messages': messages, 'stream': True}
            stream_mode = True
    
    elif provider == 'gemini':
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{model_name}:streamGenerateContent?key={api_key}'
        headers = {'Content-Type': 'application/json'}
        payload = {'contents': [{'parts': [{'text': msg['content']}], 'role': 'user' if msg['role'] == 'user' else 'model'} for msg in messages]}
        stream_mode = True
    
    elif provider == 'openai':
        url = 'https://api.openai.com/v1/chat/completions'
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'}
        payload = {'model': model_name, 'messages': messages, 'stream': True}
        stream_mode = True
    
    elif provider == 'anthropic':
        url = 'https://api.anthropic.com/v1/messages'
        headers = {
            'Content-Type': 'application/json',
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01'
        }
        payload = {'model': model_name, 'messages': messages, 'max_tokens': 4096, 'stream': True}
        stream_mode = True
    
    elif provider == 'groq':
        url = 'https://api.groq.com/openai/v1/chat/completions'
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'}
        payload = {'model': model_name, 'messages': messages, 'stream': True}
        stream_mode = True
    
    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Unknown provider: {provider}'}),
            'isBase64Encoded': False
        }
    
    response = requests.post(url, json=payload, headers=headers, stream=stream_mode)
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'{provider.upper()} API error: {response.text}'}),
            'isBase64Encoded': False
        }
    
    # Обработка ответа в зависимости от провайдера
    ai_response = ''
    
    if is_image_gen:
        data = response.json()
        image_url = data.get('data', [{}])[0].get('url', '')
        if image_url:
            ai_response = f'🎨 Изображение сгенерировано!\n\n![Generated Image]({image_url})\n\nURL: {image_url}'
        else:
            ai_response = 'Ошибка генерации изображения'
    
    elif provider == 'gemini':
        for line in response.iter_lines():
            if line:
                try:
                    chunk = json.loads(line.decode('utf-8'))
                    content = chunk.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                    ai_response += content
                except:
                    continue
    
    elif provider == 'anthropic':
        for line in response.iter_lines():
            if line:
                line_str = line.decode('utf-8')
                if line_str.startswith('data: '):
                    data_str = line_str[6:]
                    try:
                        chunk = json.loads(data_str)
                        if chunk.get('type') == 'content_block_delta':
                            content = chunk.get('delta', {}).get('text', '')
                            ai_response += content
                    except:
                        continue
    
    else:
        # OpenAI-совместимый формат (openrouter, openai, groq)
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
            'provider': provider,
            'task_type': used_model_name,
            'is_image': is_image_gen
        }),
        'isBase64Encoded': False
    }