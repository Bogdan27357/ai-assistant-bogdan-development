import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Universal chat function for all AI models via OpenRouter
    Args: event with httpMethod, body (message, model_id, session_id, conversation_history, stream)
    Returns: HTTP response with AI response (streaming or complete)
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
    
    body_data = json.loads(event.get('body', '{}'))
    message = body_data.get('message', '')
    model_id = body_data.get('model_id', 'auto')
    session_id = body_data.get('session_id', '')
    conversation_history = body_data.get('conversation_history', [])
    # Стриминг отключен для стабильности
    stream = False
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    # Get OpenRouter API key from environment
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    # Умный выбор модели в зависимости от типа запроса
    def detect_task_type(message: str, files: list) -> tuple[str, str]:
        msg_lower = message.lower()
        
        # Анализ изображений
        if files or any(word in msg_lower for word in ['фото', 'картинк', 'изображени', 'что на фото', 'опиши картинку', 'analyze image', 'photo', 'picture']):
            return 'google/gemini-2.5-flash-image-preview:free', 'Визор'
        
        # Генерация изображений
        if any(word in msg_lower for word in ['нарисуй', 'создай картинку', 'сгенерируй изображение', 'draw', 'create image', 'generate picture']):
            return 'black-forest-labs/flux-1.1-pro', 'Художник'
        
        # Математика и расчеты
        if any(word in msg_lower for word in ['вычисли', 'посчитай', 'реши', 'уравнение', 'формула', 'интеграл', 'производная', 'calculate', 'solve', 'equation', 'math', 'derivative', 'integral', '+', '-', '×', '÷', '=']):
            if any(x in message for x in ['∫', '∑', 'lim', 'derivative', 'integral', 'дифференц', 'интеграл']):
                return 'google/gemini-2.5-pro-experimental:free', 'Математик'
            return 'deepseek/deepseek-chat:free', 'Математик'
        
        # Программирование
        if any(word in msg_lower for word in ['код', 'функци', 'программ', 'баг', 'ошибк', 'debug', 'code', 'function', 'python', 'javascript', 'typescript', 'react', 'api', 'sql', 'database', 'алгоритм', 'algorithm']):
            return 'deepseek/deepseek-chat:free', 'Программист'
        
        # История и даты
        if any(word in msg_lower for word in ['история', 'когда произошл', 'в каком году', 'исторически', 'history', 'historical', 'century', 'война', 'революци', 'империя', 'dynasty']):
            return 'google/gemini-2.5-pro-experimental:free', 'Историк'
        
        # Бизнес и экономика
        if any(word in msg_lower for word in ['бизнес', 'стратеги', 'маркетинг', 'продажи', 'инвестици', 'стартап', 'бюджет', 'прибыль', 'business', 'strategy', 'marketing', 'sales', 'investment', 'startup', 'revenue', 'profit', 'swot', 'конкурент']):
            return 'anthropic/claude-3.5-sonnet:free', 'Бизнес-аналитик'
        
        # Наука и технологии
        if any(word in msg_lower for word in ['физика', 'химия', 'биология', 'квантов', 'молекул', 'атом', 'physics', 'chemistry', 'biology', 'quantum', 'molecule', 'atom', 'энергия', 'energy', 'эволюци', 'evolution']):
            return 'google/gemini-2.5-pro-experimental:free', 'Учёный'
        
        # Юриспруденция и право
        if any(word in msg_lower for word in ['закон', 'право', 'юридическ', 'договор', 'иск', 'суд', 'law', 'legal', 'contract', 'court', 'statute', 'regulation', 'законодательств']):
            return 'anthropic/claude-3.5-sonnet:free', 'Юрист'
        
        # Медицина и здоровье
        if any(word in msg_lower for word in ['симптом', 'лечени', 'болезн', 'диагноз', 'здоровь', 'медицин', 'symptom', 'treatment', 'disease', 'diagnosis', 'health', 'medical', 'врач', 'doctor']):
            return 'google/gemini-2.5-pro-experimental:free', 'Медицинский консультант'
        
        # Переводы
        if any(word in msg_lower for word in ['переведи', 'translate', 'на английский', 'на русский', 'на китайский', 'на испанский', 'to english', 'to russian']):
            return 'qwen/qwen-2.5-72b-instruct:free', 'Переводчик'
        
        # Творческие задачи (тексты, истории, статьи)
        if any(word in msg_lower for word in ['напиши статью', 'создай текст', 'сочини', 'рассказ', 'поэм', 'стих', 'write article', 'compose', 'story', 'poem', 'essay', 'blog']):
            return 'anthropic/claude-3.5-sonnet:free', 'Писатель'
        
        # Образование и обучение
        if any(word in msg_lower for word in ['объясни как', 'научи', 'урок', 'лекци', 'обучени', 'teach', 'explain how', 'lesson', 'tutorial', 'learn', 'курс', 'course']):
            return 'google/gemini-2.5-pro-experimental:free', 'Преподаватель'
        
        # Кулинария и рецепты
        if any(word in msg_lower for word in ['рецепт', 'приготовь', 'как готовить', 'блюдо', 'кухня', 'recipe', 'cook', 'cooking', 'dish', 'cuisine', 'ингредиент', 'ingredient']):
            return 'anthropic/claude-3.5-sonnet:free', 'Шеф-повар'
        
        # Путешествия и туризм
        if any(word in msg_lower for word in ['путешестви', 'туризм', 'город', 'страна', 'достопримечательност', 'travel', 'tourism', 'city', 'country', 'attraction', 'отель', 'hotel', 'виза', 'visa']):
            return 'qwen/qwen-2.5-72b-instruct:free', 'Гид'
        
        # Психология и личностный рост
        if any(word in msg_lower for word in ['психолог', 'стресс', 'мотивац', 'эмоци', 'отношени', 'psychology', 'stress', 'motivation', 'emotion', 'relationship', 'self-help', 'саморазвитие']):
            return 'anthropic/claude-3.5-sonnet:free', 'Психолог'
        
        # Спорт и фитнес
        if any(word in msg_lower for word in ['тренировк', 'упражнени', 'фитнес', 'спорт', 'мышц', 'workout', 'exercise', 'fitness', 'sport', 'muscle', 'диета', 'diet']):
            return 'google/gemini-2.5-pro-experimental:free', 'Фитнес-тренер'
        
        # Музыка и искусство
        if any(word in msg_lower for word in ['музык', 'песн', 'инструмент', 'живопись', 'искусств', 'music', 'song', 'instrument', 'painting', 'art', 'guitar', 'piano']):
            return 'anthropic/claude-3.5-sonnet:free', 'Музыкант'
        
        # Технологии и гаджеты
        if any(word in msg_lower for word in ['смартфон', 'компьютер', 'гаджет', 'технолог', 'устройств', 'smartphone', 'computer', 'gadget', 'technology', 'device', 'app', 'приложение']):
            return 'deepseek/deepseek-chat:free', 'Техник'
        
        # Финансы и инвестиции
        if any(word in msg_lower for word in ['акци', 'крипто', 'биткоин', 'инвестиц', 'портфел', 'финанс', 'stock', 'crypto', 'bitcoin', 'investment', 'portfolio', 'finance', 'трейдинг', 'trading']):
            return 'google/gemini-2.5-pro-experimental:free', 'Финансовый аналитик'
        
        # Автомобили и техника
        if any(word in msg_lower for word in ['автомобиль', 'машина', 'двигател', 'ремонт авто', 'car', 'vehicle', 'engine', 'automotive', 'repair', 'тюнинг', 'tuning']):
            return 'deepseek/deepseek-chat:free', 'Автомеханик'
        
        # Садоводство и растения
        if any(word in msg_lower for word in ['растени', 'сад', 'огород', 'цвет', 'выращива', 'plant', 'garden', 'flower', 'grow', 'soil', 'почва', 'удобрение']):
            return 'google/gemini-2.5-pro-experimental:free', 'Садовод'
        
        # Сложный анализ и рассуждения
        if any(word in msg_lower for word in ['проанализируй', 'почему', 'как работает', 'reasoning', 'analyze', 'в чем причина', 'why', 'how does']):
            return 'google/gemini-2.5-pro-experimental:free', 'Аналитик'
        
        # Длинные сложные запросы (более 500 символов)
        if len(message) > 500:
            return 'google/gemini-2.5-pro-experimental:free', 'Эксперт'
        
        # По умолчанию - быстрая универсальная модель
        return 'google/gemini-2.0-flash-thinking-exp:free', 'Ассистент'
    
    # Маппинг ID моделей на OpenRouter модели
    model_mapping = {
        'auto': None,  # Будет определено автоматически
        'gemini': 'google/gemini-2.0-flash-thinking-exp:free',
        'gemini-pro': 'google/gemini-2.5-pro-experimental:free',
        'gemini-nano-banana': 'google/gemini-2.5-flash-image-preview:free',
        'llama': 'meta-llama/llama-3.3-70b-instruct:free',
        'deepseek': 'deepseek/deepseek-chat:free',
        'qwen': 'qwen/qwen-2.5-72b-instruct:free',
        'mistral': 'mistralai/mistral-large:free',
        'claude': 'anthropic/claude-3.5-sonnet:free',
        'gemini-vision': 'google/gemini-2.5-flash-image-preview:free',
        'llama-vision': 'meta-llama/llama-3.2-90b-vision-instruct:free',
        'qwen-vision': 'qwen/qwen-2-vl-72b-instruct:free',
        'flux': 'black-forest-labs/flux-1.1-pro',
        'dalle': 'openai/dall-e-3'
    }
    
    # Определяем модель
    files = body_data.get('files', [])
    if model_id == 'auto':
        openrouter_model, task_type = detect_task_type(message, files)
    else:
        openrouter_model = model_mapping.get(model_id, 'google/gemini-2.0-flash-thinking-exp:free')
        task_type = None
    
    # Build messages array
    messages = []
    for msg in conversation_history[-10:]:
        messages.append({
            'role': msg.get('role', 'user'),
            'content': msg.get('content', '')
        })
    messages.append({'role': 'user', 'content': message})
    
    # Call OpenRouter API
    try:
        print(f'Calling OpenRouter with model: {openrouter_model}, stream: {stream}')
        
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'https://preview--ai-assistant-bogdan-development.poehali.dev',
                'X-Title': 'AI Platform'
            },
            json={
                'model': openrouter_model,
                'messages': messages,
                'stream': stream,
                'route': 'fallback'
            },
            stream=stream,
            timeout=120
        )
        
        print(f'OpenRouter response status: {response.status_code}')
        
        if not response.ok:
            error_data = response.json() if response.text else {}
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': error_data.get('error', {}).get('message', f'OpenRouter API error: {response.status_code}')
                }),
                'isBase64Encoded': False
            }
        
        # Complete response
        result = response.json()
        ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': ai_response,
                'task_type': task_type
            }),
            'isBase64Encoded': False
        }
    
    except requests.exceptions.Timeout:
        print('Request timeout error')
        return {
            'statusCode': 504,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Превышено время ожидания ответа от AI. Попробуйте сократить запрос.'}),
            'isBase64Encoded': False
        }
    except requests.exceptions.ConnectionError:
        print('Connection error')
        return {
            'statusCode': 503,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Не удалось подключиться к AI сервису. Проверьте интернет-соединение.'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        print(f'Unexpected error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }