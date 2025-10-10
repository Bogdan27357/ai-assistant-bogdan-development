import json
from typing import Dict, Any
import requests
import os

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat with free AI models via HuggingFace
    Args: event with httpMethod, body (message, model_id, session_id)
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
    
    body_data = json.loads(event.get('body', '{}'))
    message = body_data.get('message', '')
    model_id = body_data.get('model_id', 'qwen')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    model_endpoints = {
        'qwen': 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct',
        'deepseek': 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
        'llama': 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.3-70B-Instruct',
        'gemini': 'https://api-inference.huggingface.co/models/google/gemma-2-27b-it'
    }
    
    api_url = model_endpoints.get(model_id, model_endpoints['qwen'])
    api_key = os.environ.get('HUGGINGFACE_API_KEY', '')
    
    try:
        headers = {'Content-Type': 'application/json'}
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
            
        response = requests.post(
            api_url,
            headers=headers,
            json={
                'inputs': message,
                'parameters': {
                    'max_new_tokens': 1000,
                    'temperature': 0.7,
                    'top_p': 0.9,
                    'return_full_text': False
                }
            },
            timeout=60
        )
        
        if response.status_code != 200:
            return {
                'statusCode': 500,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({'error': f'API error: {response.text[:200]}'}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        
        if isinstance(result, list) and len(result) > 0:
            ai_response = result[0].get('generated_text', '')
        elif isinstance(result, dict):
            ai_response = result.get('generated_text', result.get('text', ''))
        else:
            ai_response = str(result)
        
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