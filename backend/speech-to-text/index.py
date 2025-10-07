import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Распознает речь из аудио используя Google Speech-to-Text
    Args: event с httpMethod, body {audio_base64, lang}
    Returns: HTTP response с распознанным текстом
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
    audio_base64 = body_data.get('audio_base64', '')
    lang = body_data.get('lang', 'ru-RU')
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    url = f"https://speech.googleapis.com/v1/speech:recognize?key={api_key}"
    
    payload = {
        'config': {
            'encoding': 'MP3',
            'languageCode': lang,
            'enableAutomaticPunctuation': True
        },
        'audio': {
            'content': audio_base64
        }
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Speech recognition failed'})
        }
    
    result = response.json()
    
    if not result.get('results'):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'text': '',
                'confidence': 0
            })
        }
    
    transcript = result['results'][0]['alternatives'][0]['transcript']
    confidence = result['results'][0]['alternatives'][0].get('confidence', 1.0)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'text': transcript,
            'confidence': confidence
        })
    }
