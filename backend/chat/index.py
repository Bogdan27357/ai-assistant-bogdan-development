import json
from typing import Dict, Any
import requests
import os
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat with free AI models via OpenRouter with DB-stored API keys
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
        cur.execute("SELECT model_id, enabled FROM t_p68921797_ai_assistant_bogdan_.api_keys WHERE model_id IN ('gemini', 'llama', 'qwen')")
        rows = cur.fetchall()
        enabled_map = {row[0]: row[1] for row in rows}
        
        models = [
            {
                'id': 'gemini',
                'name': 'Google Gemini 2.0 Flash',
                'description': 'Fastest Google model, multimodal',
                'free': True,
                'enabled': enabled_map.get('gemini', False)
            },
            {
                'id': 'llama',
                'name': 'Meta Llama 3.3 70B',
                'description': 'Powerful open-source model',
                'free': True,
                'enabled': enabled_map.get('llama', False)
            },
            {
                'id': 'qwen',
                'name': 'Qwen 2.5 72B',
                'description': 'Advanced Chinese-English model',
                'free': True,
                'enabled': enabled_map.get('qwen', False)
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
        model_id: str = body_data.get('model_id', 'gemini')
        
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
        
        cur.execute("SELECT api_key, enabled FROM t_p68921797_ai_assistant_bogdan_.api_keys WHERE model_id = %s", (model_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if not row or not row[1]:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Model not enabled or API key not configured'}),
                'isBase64Encoded': False
            }
        
        api_key = row[0]
        
        model_map = {
            'gemini': 'google/gemini-2.0-flash-exp:free',
            'llama': 'meta-llama/llama-3.3-70b-instruct:free',
            'qwen': 'qwen/qwen-2.5-72b-instruct:free'
        }
        
        model_name = model_map.get(model_id, model_map['gemini'])
        
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
            timeout=30
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
