import json
import os
import urllib.request
import urllib.error
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Proxy for YandexGPT API with secure key storage
    Args: event with httpMethod (POST, OPTIONS), body with messages array
    Returns: YandexGPT response with assistant message
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    api_key = os.environ.get('YANDEX_GPT_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    messages = body_data.get('messages', [])
    
    request_payload = {
        'modelUri': 'gpt://b1gfkd2baaso5298c7lt/yandexgpt-lite',
        'completionOptions': {
            'stream': False,
            'temperature': 0.6,
            'maxTokens': 2000
        },
        'messages': messages
    }
    
    req = urllib.request.Request(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        data=json.dumps(request_payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Api-Key {api_key}'
        },
        method='POST'
    )
    
    try:
        response = urllib.request.urlopen(req)
        response_data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(response_data)
        }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': error_body})
        }