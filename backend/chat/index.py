import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Universal chat function for all AI models via OpenRouter
    Args: event with httpMethod, body (message, model_id, session_id, conversation_history, stream)
    Returns: HTTP response with AI response (streaming or complete)
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
    session_id = body_data.get('session_id', '')
    conversation_history = body_data.get('conversation_history', [])
    stream = body_data.get('stream', False)
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    # Get OpenRouter API key from environment
    api_key = os.environ.get('OPENROUTER_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY secret.'}),
            'isBase64Encoded': False
        }
    
    # Map model_id to OpenRouter model
    model_mapping = {
        'auto': 'google/gemini-2.0-flash-thinking-exp:free',
        'gemini': 'google/gemini-2.0-flash-thinking-exp:free',
        'llama': 'meta-llama/llama-3.3-70b-instruct:free',
        'deepseek': 'deepseek/deepseek-chat:free',
        'qwen': 'qwen/qwen-2.5-72b-instruct:free',
        'mistral': 'mistralai/mistral-large:free',
        'claude': 'anthropic/claude-3.5-sonnet:free',
        'gemini-vision': 'google/gemini-2.0-flash-thinking-exp:free',
        'llama-vision': 'meta-llama/llama-3.2-90b-vision-instruct:free',
        'qwen-vision': 'qwen/qwen-2-vl-72b-instruct:free',
        'flux': 'black-forest-labs/flux-1.1-pro',
        'dalle': 'openai/dall-e-3'
    }
    
    openrouter_model = model_mapping.get(model_id, 'google/gemini-2.0-flash-thinking-exp:free')
    
    # Build messages array
    messages = []
    for msg in conversation_history[-10:]:
        messages.append({
            'role': msg.get('role', 'user'),
            'content': msg.get('content', '')
        })
    messages.append({'role': 'user', 'content': message})
    
    # Call OpenRouter API
    try:
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'https://preview--ai-assistant-bogdan-development.poehali.dev',
                'X-Title': 'AI Platform'
            },
            json={
                'model': openrouter_model,
                'messages': messages,
                'stream': stream
            },
            stream=stream,
            timeout=120
        )
        
        if not response.ok:
            error_data = response.json() if response.text else {}
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': error_data.get('error', {}).get('message', f'OpenRouter API error: {response.status_code}')
                }),
                'isBase64Encoded': False
            }
        
        if stream:
            # Streaming response
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'text/event-stream',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache'
                },
                'body': response.text,
                'isBase64Encoded': False
            }
        else:
            # Complete response
            result = response.json()
            ai_response = result.get('choices', [{}])[0].get('message', {}).get('content', '')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'response': ai_response,
                    'usedModel': model_id,
                    'openrouterModel': openrouter_model
                }),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

