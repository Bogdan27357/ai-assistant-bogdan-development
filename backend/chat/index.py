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
                'name': 'Dolphin 3.0 Mistral 24B',
                'description': 'Мощная бесплатная модель от Cognitive Computations',
                'free': True,
                'enabled': enabled_map.get('mistral', False)
            },
            {
                'id': 'deepseek-r1t2',
                'name': 'DeepSeek R1T2 Chimera 671B',
                'description': 'Мощнейшая модель с reasoning (пошаговые рассуждения)',
                'free': True,
                'enabled': enabled_map.get('deepseek-r1t2', False)
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
        
        if not api_key:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'API key not configured. Please add OpenRouter API key in admin panel.'}),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        
        model_map = {
            'mistral': 'cognitivecomputations/dolphin-3.0-mistral-24b:free',
            'deepseek-r1t2': 'deepseek/deepseek-r1t2-chimera:free'
        }
        model_name = model_map.get(model_id, 'cognitivecomputations/dolphin-3.0-mistral-24b:free')
        
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
            ai_message = result['choices'][0]['message']['content']
            
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
