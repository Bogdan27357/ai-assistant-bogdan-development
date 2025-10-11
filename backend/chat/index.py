import json
from typing import Dict, Any
import requests
import os
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat with AI models via OpenRouter
    Args: event with httpMethod, body (message, model_id)
    Returns: HTTP response with AI response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute("SELECT current_schema()")
        schema_name = cur.fetchone()[0]
        
        cur.execute(f"SELECT model_id, enabled FROM {schema_name}.api_keys")
        rows = cur.fetchall()
        enabled_map = {row[0]: row[1] for row in rows}
        
        models = [
            {
                'id': 'mistral',
                'name': 'Google Gemini 2.0 Flash',
                'description': 'Быстрая бесплатная модель от Google',
                'free': True,
                'enabled': enabled_map.get('mistral', False),
                'provider': 'openrouter'
            },
            {
                'id': 'deepseek-r1t2',
                'name': 'DeepSeek R1',
                'description': 'Продвинутая модель с reasoning',
                'free': True,
                'enabled': enabled_map.get('deepseek-r1t2', False),
                'provider': 'openrouter'
            },
            {
                'id': 'ollama',
                'name': 'Ollama (локально)',
                'description': 'Локальные модели через Ollama',
                'free': True,
                'enabled': enabled_map.get('ollama', False),
                'provider': 'ollama'
            }
        ]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'models': models}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        message: str = body_data.get('message', '')
        model_id: str = body_data.get('model_id', 'mistral')
        
        if not message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        cur.execute("SELECT current_schema()")
        schema_name = cur.fetchone()[0]
        
        model_id_escaped = model_id.replace("'", "''")
        query_api = f"SELECT api_key, enabled FROM {schema_name}.api_keys WHERE model_id = '{model_id_escaped}'"
        cur.execute(query_api)
        row = cur.fetchone()
        
        if not row or not row[1]:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Model not enabled'}),
                'isBase64Encoded': False
            }
        
        api_key = row[0] if row[0] else ''
        
        cur.close()
        conn.close()
        
        if model_id == 'ollama':
            ollama_url = api_key if api_key else 'http://localhost:11434'
            
            response = requests.post(
                f'{ollama_url}/api/generate',
                headers={'Content-Type': 'application/json'},
                json={
                    'model': 'llama3.2',
                    'prompt': message,
                    'stream': False
                },
                timeout=120
            )
        else:
            if not api_key:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'API key not configured. Please add OpenRouter API key in admin panel.'}),
                    'isBase64Encoded': False
                }
            
            model_map = {
                'mistral': 'google/gemini-2.0-flash-exp:free',
                'deepseek-r1t2': 'deepseek/deepseek-r1:free'
            }
            model_name = model_map.get(model_id, 'google/gemini-2.0-flash-exp:free')
            
            response = requests.post(
                'https://openrouter.ai/api/v1/chat/completions',
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {api_key}',
                    'HTTP-Referer': 'https://poehali.dev',
                    'X-Title': 'AI Chat'
                },
                json={
                    'model': model_name,
                    'messages': [{'role': 'user', 'content': message}]
                },
                timeout=60
            )
        
        if response.status_code == 200:
            result = response.json()
            
            if model_id == 'ollama':
                ai_message = result.get('response', '')
                model_name = result.get('model', 'llama3.2')
            else:
                ai_message = result['choices'][0]['message']['content']
                model_name = model_map.get(model_id, 'google/gemini-2.0-flash-exp:free')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'response': ai_message,
                    'model': model_name
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'API error: {response.text}'
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }