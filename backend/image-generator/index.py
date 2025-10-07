import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерирует изображение по текстовому описанию через Stability AI
    Args: event с httpMethod, body {prompt, width, height, style}
    Returns: HTTP response с изображением в base64
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
    prompt = body_data.get('prompt', '')
    width = body_data.get('width', 1024)
    height = body_data.get('height', 1024)
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict"
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'instances': [{
            'prompt': prompt
        }],
        'parameters': {
            'sampleCount': 1,
            'aspectRatio': f'{width}:{height}'
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Image generation failed', 'details': response.text})
        }
    
    result = response.json()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'image': result.get('predictions', [{}])[0].get('bytesBase64Encoded', ''),
            'prompt': prompt
        })
    }
