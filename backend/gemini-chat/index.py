import json
import os
from typing import Dict, Any
import requests
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Multi-model API integration (Gemini, Llama, DeepSeek, GigaChat)
    Args: event with httpMethod, body (message, session_id, model_id)
    Returns: AI response from selected model
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
    
    # Для всех моделей кроме GigaChat используем OpenRouter ключ
    if model_id == 'gigachat':
        cur.execute(f"SELECT api_key, enabled FROM api_keys WHERE model_id = 'gigachat'")
    else:
        cur.execute(f"SELECT api_key, enabled FROM api_keys WHERE model_id = 'openrouter'")
    
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row or not row[0]:
        provider = 'GigaChat' if model_id == 'gigachat' else 'OpenRouter'
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'{provider} API key not configured in admin panel'}),
            'isBase64Encoded': False
        }
    
    if not row[1]:
        provider = 'GigaChat' if model_id == 'gigachat' else 'OpenRouter'
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'{provider} is disabled in admin panel'}),
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
    
    if model_id == 'gigachat':
        # Формируем историю для GigaChat
        gigachat_messages = []
        for msg in conversation_history:
            gigachat_messages.append({'role': msg['role'], 'content': msg['content']})
        gigachat_messages.append({'role': 'user', 'content': enhanced_message})
        
        token_response = requests.post(
            'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
            headers={'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json', 'RqUID': 'AI-Platform'},
            data={'scope': 'GIGACHAT_API_PERS'},
            auth=(api_key, ''),
            verify=False
        )
        
        if token_response.status_code != 200:
            return {
                'statusCode': token_response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'GigaChat auth error: {token_response.text}'}),
                'isBase64Encoded': False
            }
        
        access_token = token_response.json().get('access_token')
        
        response = requests.post(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {access_token}'},
            json={'model': 'GigaChat-Pro', 'messages': gigachat_messages},
            verify=False
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'GigaChat API error: {response.text}'}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', 'No response')
    else:
        url = 'https://openrouter.ai/api/v1/chat/completions'
        
        model_mapping = {
            'gemini': 'google/gemini-2.0-flash-exp:free',
            'llama': 'meta-llama/llama-3.3-70b-instruct',
            'deepseek': 'deepseek/deepseek-chat',
            'qwen': 'qwen/qwen-2.5-72b-instruct',
            'mistral': 'mistralai/mistral-large',
            'claude': 'anthropic/claude-3.5-sonnet'
        }
        model_name = model_mapping.get(model_id, 'google/gemini-2.0-flash-exp:free')
        
        # Формируем историю для OpenRouter
        messages = []
        for msg in conversation_history:
            messages.append({'role': msg['role'], 'content': msg['content']})
        messages.append({'role': 'user', 'content': enhanced_message})
        
        payload = {
            'model': model_name,
            'messages': messages,
            'stream': True
        }
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}',
            'HTTP-Referer': 'https://ai-platform.example.com',
            'X-Title': 'AI Platform'
        }
        
        response = requests.post(url, json=payload, headers=headers, stream=True)
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'OpenRouter API error: {response.text}'}),
                'isBase64Encoded': False
            }
        
        # Собираем streaming ответ
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
            'provider': 'OpenRouter'
        }),
        'isBase64Encoded': False
    }