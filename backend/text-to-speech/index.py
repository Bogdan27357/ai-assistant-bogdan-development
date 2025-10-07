import json
import os
from typing import Dict, Any
import requests
import base64

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Конвертирует текст в речь используя Google Text-to-Speech API
    Args: event с httpMethod, body {text, lang, voice}
    Returns: HTTP response с audio в base64
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
    lang = body_data.get('lang', 'en-US')
    voice = body_data.get('voice', 'en-US-Neural2-F')
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
    
    payload = {
        'input': {'text': text},
        'voice': {
            'languageCode': lang,
            'name': voice
        },
        'audioConfig': {
            'audioEncoding': 'MP3'
        }
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Text-to-speech failed'})
        }
    
    result = response.json()
    audio_content = result.get('audioContent', '')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'audio': audio_content,
            'format': 'mp3'
        })
    }
