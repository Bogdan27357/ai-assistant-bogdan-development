import json
import os
from typing import Dict, Any, List, Optional, Union
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat endpoint with custom system prompt and knowledge base
    Args: event with httpMethod, body, queryStringParameters
          context with request_id attribute
    Returns: HTTP response with AI answer
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
    user_message: str = body_data.get('message', '')
    chat_history: List[Dict[str, Any]] = body_data.get('history', [])
    system_prompt: str = body_data.get('systemPrompt', '')
    knowledge_base: str = body_data.get('knowledgeBase', '')
    preset: str = body_data.get('preset', 'default')
    

    
    openrouter_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    if not openrouter_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    model_map = {
        'default': 'anthropic/claude-3.5-sonnet',
        'creative': 'anthropic/claude-3-opus',
        'precise': 'google/gemini-flash-1.5',
        'audio': 'openai/gpt-4o-audio-preview'
    }
    
    selected_model = model_map.get(preset, 'anthropic/claude-3.5-sonnet')
    
    system_message = system_prompt if system_prompt else "Ты полезный ИИ-ассистент по имени Богдан."
    
    if knowledge_base:
        system_message += f"\n\nБаза знаний:\n{knowledge_base}\n\nИспользуй информацию из базы знаний для ответов на вопросы пользователя."
    
    messages = [{'role': 'system', 'content': system_message}]
    
    for msg in chat_history[-10:]:
        messages.append({'role': msg['role'], 'content': msg['content']})
    
    if user_message:
        messages.append({'role': 'user', 'content': user_message})
    
    try:
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {openrouter_key}',
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://bogdan-ai.poehali.dev',
            },
            json={
                'model': selected_model,
                'messages': messages,
            },
            timeout=60
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'OpenRouter error: {response.text}'}),
                'isBase64Encoded': False
            }
        
        result = response.json()
        ai_response = result['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'response': ai_response}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Request failed: {str(e)}'}),
            'isBase64Encoded': False
        }