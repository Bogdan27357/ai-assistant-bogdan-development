import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate videos using ImageRouter API with various models
    Args: event with httpMethod, body (prompt, model)
    Returns: HTTP response with video URL
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
    prompt = body_data.get('prompt', '')
    model = body_data.get('model', 'veo-3-fast')
    
    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Prompt is required'}),
            'isBase64Encoded': False
        }
    
    # Get ImageRouter API key from environment
    api_key = os.environ.get('IMAGEROUTER_API_KEY', '')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'ImageRouter API key not configured'}),
            'isBase64Encoded': False
        }
    
    # Map model IDs to ImageRouter model names
    model_mapping = {
        'veo-3-fast': 'veo-3-fast',
        'kling-v2.1-standard': 'kling-v2.1-standard',
        'hailuo-02-standard': 'hailuo-02-standard'
    }
    
    imagerouter_model = model_mapping.get(model, 'veo-3-fast')
    
    try:
        # Call ImageRouter API for video generation
        response = requests.post(
            'https://api.imagerouter.com/v1/video/generations',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': imagerouter_model,
                'prompt': prompt,
                'duration': 5,  # 5 seconds
                'aspect_ratio': '16:9'
            },
            timeout=180
        )
        
        if not response.ok:
            error_data = response.json() if response.text else {}
            return {
                'statusCode': response.status_code,
                'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'error': error_data.get('error', {}).get('message', f'ImageRouter API error: {response.status_code}')
                }),
                'isBase64Encoded': False
            }
        
        result = response.json()
        video_url = result.get('data', [{}])[0].get('url', '')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'video_url': video_url,
                'model': model,
                'prompt': prompt
            }),
            'isBase64Encoded': False
        }
        
    except requests.exceptions.Timeout:
        return {
            'statusCode': 504,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Video generation timeout - please try again'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
