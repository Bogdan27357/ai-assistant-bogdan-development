import json
import os
import base64
import requests
import urllib3
from typing import Dict, Any

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: SberSpeech text-to-speech synthesis
    Args: event with httpMethod, body (text to synthesize), queryStringParameters
          context with request_id
    Returns: HTTP response with synthesized audio in base64
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
        
        text = body_data.get('text', '')
        voice = body_data.get('voice', 'Natalia')
        
        if not text:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Text is required'})
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
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/text'
            }
            
            params = {
                'voice': voice,
                'format': 'opus',
                'sample_rate': 48000
            }
            
            response = requests.post(
                'https://smartspeech.sber.ru/rest/v1/text:synthesize',
                headers=headers,
                params=params,
                data=text.encode('utf-8'),
                timeout=30,
                verify=False
            )
            
            if response.status_code == 200:
                audio_base64 = base64.b64encode(response.content).decode('utf-8')
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'audio': audio_base64,
                        'format': 'opus'
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
                    'error': f'Synthesis failed: {str(e)}'
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