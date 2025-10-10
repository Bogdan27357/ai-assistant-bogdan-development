import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Universal chat function using Google Gemini API
    Args: event with httpMethod, body (message, model_id, session_id, conversation_history)
    Returns: HTTP response with AI response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    model_id = body_data.get('model_id', 'auto')
    conversation_history = body_data.get('conversation_history', [])
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    # Get Google Gemini API key
    api_key = os.environ.get('GOOGLE_GEMINI_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Google Gemini API key not configured'}),
            'isBase64Encoded': False
        }
    
    # Map model IDs to Gemini models
    model_mapping = {
        'auto': 'gemini-2.0-flash-exp',
        'gemini': 'gemini-2.0-flash-exp',
        'gemini-pro': 'gemini-1.5-pro',
        'gemini-vision': 'gemini-1.5-flash',
        'deepseek': 'gemini-2.0-flash-exp',
        'llama': 'gemini-2.0-flash-exp',
        'qwen': 'gemini-2.0-flash-exp',
        'mistral': 'gemini-2.0-flash-exp',
        'claude': 'gemini-1.5-pro',
    }
    
    gemini_model = model_mapping.get(model_id, 'gemini-2.0-flash-exp')
    
    # Build conversation contents for Gemini
    contents = []
    
    # Add conversation history
    for msg in conversation_history[-10:]:
        role = 'user' if msg.get('role') == 'user' else 'model'
        contents.append({
            'role': role,
            'parts': [{'text': msg.get('content', '')}]
        })
    
    # Add current message
    contents.append({
        'role': 'user',
        'parts': [{'text': message}]
    })
    
    # Call Google Gemini API
    try:
        print(f'=== GEMINI REQUEST ===')
        print(f'Model: {gemini_model}')
        print(f'Message length: {len(message)}')
        print(f'History length: {len(conversation_history)}')
        
        url = f'https://generativelanguage.googleapis.com/v1beta/models/{gemini_model}:generateContent?key={api_key}'
        
        response = requests.post(
            url,
            headers={'Content-Type': 'application/json'},
            json={
                'contents': contents,
                'generationConfig': {
                    'temperature': 0.7,
                    'maxOutputTokens': 8192,
                }
            },
            timeout=60
        )
        
        print(f'Gemini response status: {response.status_code}')
        
        if not response.ok:
            error_text = response.text
            print(f'ERROR: {error_text}')
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': f'Gemini API error: {error_text[:200]}'
                }),
                'isBase64Encoded': False
            }
        
        result = response.json()
        
        # Extract response text
        ai_response = ''
        if 'candidates' in result and len(result['candidates']) > 0:
            candidate = result['candidates'][0]
            if 'content' in candidate and 'parts' in candidate['content']:
                parts = candidate['content']['parts']
                ai_response = ''.join([part.get('text', '') for part in parts])
        
        if not ai_response:
            ai_response = 'Извините, не удалось получить ответ от ИИ.'
        
        print(f'SUCCESS: Response length: {len(ai_response)}')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': ai_response,
                'task_type': 'Gemini AI'
            }),
            'isBase64Encoded': False
        }
    
    except requests.exceptions.Timeout:
        print('Request timeout')
        return {
            'statusCode': 504,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Превышено время ожидания ответа от AI'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        print(f'Unexpected error: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Ошибка сервера: {str(e)}'}),
            'isBase64Encoded': False
        }
