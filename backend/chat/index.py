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
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
    message = body_data.get('message', '')
    model_id = body_data.get('model_id', 'qwen')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    model_map = {
        'qwen': 'qwen/qwen-2.5-72b-instruct',
        'deepseek': 'deepseek/deepseek-r1-distill-qwen-32b',
        'llama': 'meta-llama/llama-3.3-70b-instruct',
        'gemini': 'google/gemma-2-27b-it'
    }
    
    model_name = model_map.get(model_id, model_map['qwen'])
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    try:
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'https://poehali.dev',
                'X-Title': 'Poehali AI Test'
            },
            json={
                'model': model_name,
                'messages': [
                    {'role': 'user', 'content': message}
                ],
                'max_tokens': 1000,
                'temperature': 0.7
            },
            timeout=60
        )
        
        if response.status_code != 200:
            error_msg = f'API error (status {response.status_code}): {response.text[:300]}'
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': error_msg}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', 'No response')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'response': ai_response}),
            'isBase64Encoded': False
        }
    
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Timeout'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }