import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Чат с Yandex GPT
    Args: event с httpMethod POST, body с message от пользователя
    Returns: JSON с ответом от GPT
    '''
    method: str = event.get('httpMethod', 'POST')
    
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('YANDEX_API_KEY', '')
    folder_id = os.environ.get('YANDEX_FOLDER_ID', '')
    
    if not api_key or not folder_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Yandex API key or Folder ID not configured'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    message = body_data.get('message', '')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Message required'}),
            'isBase64Encoded': False
        }
    
    try:
        response = requests.post(
            'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
            headers={
                'Authorization': f'Api-Key {api_key}',
                'Content-Type': 'application/json',
                'x-folder-id': folder_id
            },
            json={
                'modelUri': f'gpt://{folder_id}/yandexgpt-lite/latest',
                'completionOptions': {
                    'stream': False,
                    'temperature': 0.7,
                    'maxTokens': 2000
                },
                'messages': [
                    {
                        'role': 'system',
                        'text': 'Ты - полезный ассистент. Отвечай кратко и по делу.'
                    },
                    {
                        'role': 'user',
                        'text': message
                    }
                ]
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            answer = data['result']['alternatives'][0]['message']['text']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'response': answer,
                    'success': True
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
                'error': f'Yandex API error: {response.text}',
                'success': False
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Request error: {str(e)}',
                'success': False
            }),
            'isBase64Encoded': False
        }
