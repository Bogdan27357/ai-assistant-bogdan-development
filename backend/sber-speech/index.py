import json
import os
import base64
import requests
import urllib3
from typing import Dict, Any

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: SberSpeech API integration for speech recognition
    Args: event with httpMethod, body (audio in base64), queryStringParameters
          context with request_id
    Returns: HTTP response with recognized text
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
    
    if method == 'POST':
        body_str = event.get('body', '{}')
        if not body_str or body_str.strip() == '':
            body_str = '{}'
        
        try:
            body_data = json.loads(body_str)
        except json.JSONDecodeError:
            body_data = {}
        
        audio_base64 = body_data.get('audio')
        
        if not audio_base64:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Audio data is required'})
            }
        
        token = os.environ.get('SBER_SALUTE_SPEECH_TOKEN')
        if not token:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'SberSpeech token not configured'})
            }
        
        try:
            audio_data = base64.b64decode(audio_base64)
            
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'audio/x-pcm;bit=16;rate=16000'
            }
            
            response = requests.post(
                'https://smartspeech.sber.ru/rest/v1/speech:recognize',
                headers=headers,
                data=audio_data,
                timeout=30,
                verify=False
            )
            
            if response.status_code == 200:
                result = response.json()
                text = result.get('result', [''])[0] if result.get('result') else ''
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'text': text,
                        'full_response': result
                    })
                }
            else:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': False,
                        'error': f'SberSpeech API error: {response.text}'
                    })
                }
                
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': False,
                    'error': f'Recognition failed: {str(e)}'
                })
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }