import json
import os
from typing import Dict, Any
import requests
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Meta Llama 3.3 70B API integration via OpenRouter
    Args: event with httpMethod, body (message, session_id)
    Returns: AI response from Llama
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
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT api_key, enabled FROM api_keys WHERE model_id = 'llama'")
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row or not row[0]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Llama API key not configured in admin panel'}),
            'isBase64Encoded': False
        }
    
    if not row[1]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Llama model is disabled'}),
            'isBase64Encoded': False
        }
    
    api_key = row[0]
    
    body_data = json.loads(event.get('body', '{}'))
    message = body_data.get('message', '')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    url = 'https://openrouter.ai/api/v1/chat/completions'
    
    payload = {
        'model': 'meta-llama/llama-3.3-70b-instruct',
        'messages': [
            {'role': 'user', 'content': message}
        ]
    }
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Llama API error: {response.text}'}),
            'isBase64Encoded': False
        }
    
    result = response.json()
    ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', 'No response')
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'response': ai_response,
            'model': 'llama-3.3-70b-instruct'
        }),
        'isBase64Encoded': False
    }