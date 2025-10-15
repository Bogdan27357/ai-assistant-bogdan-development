import json
import os
import base64
import requests
import urllib3
from typing import Dict, Any

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_access_token(client_id: str, client_secret: str) -> str:
    '''Get OAuth 2.0 access token from Sber'''
    auth_url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth'
    
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': client_id
    }
    
    data = {
        'scope': 'SALUTE_SPEECH_PERS'
    }
    
    response = requests.post(
        auth_url,
        headers=headers,
        data=data,
        auth=(client_id, client_secret),
        verify=False,
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        return result.get('access_token', '')
    else:
        raise Exception(f'Failed to get token: {response.status_code} - {response.text}')

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
        voice = body_data.get('voice', 'Nec_24000')
        
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
        
        client_id = os.environ.get('SBER_CLIENT_ID')
        client_secret = os.environ.get('SBER_CLIENT_SECRET')
        
        if not client_id or not client_secret:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'SberSpeech credentials not configured'})
            }
        
        try:
            access_token = get_access_token(client_id, client_secret)
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/text'
            }
            
            params = {
                'voice': voice,
                'format': 'opus48000',
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
