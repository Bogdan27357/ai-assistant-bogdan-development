import json
import os
import base64
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Convert audio to text using OpenAI Whisper
    Args: event with httpMethod, body containing base64 audio
    Returns: HTTP response with transcribed text
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
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    audio_base64: str = body_data.get('audio', '')
    audio_format: str = body_data.get('format', 'webm')
    
    if not audio_base64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No audio provided'}),
            'isBase64Encoded': False
        }
    
    openrouter_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    if not openrouter_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        audio_bytes = base64.b64decode(audio_base64)
        
        files = {
            'file': (f'audio.{audio_format}', audio_bytes, f'audio/{audio_format}')
        }
        data = {
            'model': 'whisper-1'
        }
        
        response = requests.post(
            'https://openrouter.ai/api/v1/audio/transcriptions',
            headers={
                'Authorization': f'Bearer {openrouter_key}'
            },
            files=files,
            data=data,
            timeout=30
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'Transcription error: {response.text}'}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        text = result.get('text', '')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'text': text}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed: {str(e)}'}),
            'isBase64Encoded': False
        }
