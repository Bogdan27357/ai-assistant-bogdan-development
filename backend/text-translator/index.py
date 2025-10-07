import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Переводит текст на указанный язык используя Google Gemini
    Args: event с httpMethod, body {text, target_lang, source_lang}
    Returns: HTTP response с переведенным текстом
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
    target_lang = body_data.get('target_lang', 'en')
    source_lang = body_data.get('source_lang', 'auto')
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    prompt = f"Translate the following text from {source_lang} to {target_lang}. Return ONLY the translated text without any explanations:\n\n{text}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    
    response = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}]
    })
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Translation failed'})
        }
    
    result = response.json()
    translated = result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'translated': translated,
            'source_lang': source_lang,
            'target_lang': target_lang
        })
    }
