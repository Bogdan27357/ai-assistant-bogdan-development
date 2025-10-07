import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создает краткое содержание текста используя Gemini
    Args: event с httpMethod, body {text, length}
    Returns: HTTP response с кратким содержанием
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    text = body_data.get('text', '')
    length = body_data.get('length', 'medium')
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    length_map = {
        'short': '2-3 предложения',
        'medium': '5-7 предложений',
        'long': '10-15 предложений'
    }
    
    prompt = f"Создай краткое содержание следующего текста ({length_map.get(length, 'medium')}). Сохрани ключевые моменты:\n\n{text}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    
    response = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}]
    })
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Summarization failed'})
        }
    
    result = response.json()
    summary = result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary)
        })
    }
