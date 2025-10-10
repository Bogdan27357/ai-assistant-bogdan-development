import json
from typing import Dict, Any
import requests
import os

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat with free AI models via OpenRouter
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
    
    if method == 'GET':
        models = [
            {
                'id': 'gemini',
                'name': 'Google Gemini 2.0 Flash',
                'description': 'Fastest Google model, multimodal',
                'free': True
            },
            {
                'id': 'llama',
                'name': 'Meta Llama 3.3 70B',
                'description': 'Powerful open-source model',
                'free': True
            },
            {
                'id': 'qwen',
                'name': 'Qwen 2.5 72B',
                'description': 'Advanced Chinese-English model',
                'free': True
            }
        ]
        
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
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        model_map = {
            'gemini': 'google/gemini-2.0-flash-exp:free',
            'llama': 'meta-llama/llama-3.3-70b-instruct:free',
            'qwen': 'qwen/qwen-2.5-72b-instruct:free'
        }
        
        model_name = model_map.get(model_id, model_map['gemini'])
        api_key = os.environ.get('OPENROUTER_API_KEY', '')
        
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
