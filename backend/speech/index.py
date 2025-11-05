import json
import os
import base64
import requests
from typing import Dict, Any

def get_sber_oauth_token(client_id: str, client_secret: str) -> str:
    auth_string = f"{client_id}:{client_secret}"
    auth_base64 = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    
    response = requests.post(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        headers={
            'Authorization': f'Basic {auth_base64}',
            'Content-Type': 'application/x-www-form-urlencoded',
            'RqUID': 'salute-speech-request'
        },
        data={'scope': 'SALUTE_SPEECH_PERS'},
        verify=False
    )
    
    data = response.json()
    return data['access_token']

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Universal speech service (STT/TTS for Yandex and Sber)
    Args: event with httpMethod (POST, OPTIONS), body with action, provider, text/audio
    Returns: Recognized text or synthesized audio
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
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    action = body_data.get('action')
    provider = body_data.get('provider', 'yandex')
    
    if action == 'stt':
        audio_base64 = body_data.get('audio', '')
        if not audio_base64:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No audio data provided'})
            }
        
        if provider == 'yandex':
            return yandex_stt(audio_base64)
        elif provider == 'sber':
            return sber_stt(audio_base64)
    
    elif action == 'tts':
        text = body_data.get('text', '')
        if not text:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'No text provided'})
            }
        
        if provider == 'yandex':
            return yandex_tts(text)
        elif provider == 'sber':
            return sber_tts(text)
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Invalid action or provider'})
    }

def yandex_stt(audio_base64: str) -> Dict[str, Any]:
    api_key = os.environ.get('YANDEX_SPEECH_API_KEY')
    folder_id = 'b1gfkd2baaso5298c7lt'
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Yandex API key not configured'})
        }
    
    audio_bytes = base64.b64decode(audio_base64)
    
    try:
        response = requests.post(
            f'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId={folder_id}&lang=ru-RU',
            headers={'Authorization': f'Api-Key {api_key}'},
            data=audio_bytes
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': response.text})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(response.json())
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }

def yandex_tts(text: str) -> Dict[str, Any]:
    api_key = os.environ.get('YANDEX_SPEECH_API_KEY')
    folder_id = 'b1gfkd2baaso5298c7lt'
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Yandex API key not configured'})
        }
    
    try:
        response = requests.post(
            'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
            headers={'Authorization': f'Api-Key {api_key}'},
            data={
                'text': text,
                'lang': 'ru-RU',
                'voice': 'alena',
                'folderId': folder_id,
                'format': 'oggopus'
            }
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': response.text})
            }
        
        audio_base64 = base64.b64encode(response.content).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'audio': audio_base64})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }

def sber_stt(audio_base64: str) -> Dict[str, Any]:
    client_id = os.environ.get('SBER_CLIENT_ID')
    client_secret = os.environ.get('SBER_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Sber credentials not configured'})
        }
    
    try:
        oauth_token = get_sber_oauth_token(client_id, client_secret)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Failed to get OAuth token: {str(e)}'})
        }
    
    audio_bytes = base64.b64decode(audio_base64)
    
    try:
        response = requests.post(
            'https://smartspeech.sber.ru/rest/v1/speech:recognize',
            headers={
                'Authorization': f'Bearer {oauth_token}',
                'Content-Type': 'audio/opus'
            },
            data=audio_bytes,
            verify=False
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': response.text})
            }
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(response.json())
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }

def sber_tts(text: str) -> Dict[str, Any]:
    client_id = os.environ.get('SBER_CLIENT_ID')
    client_secret = os.environ.get('SBER_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Sber credentials not configured'})
        }
    
    try:
        oauth_token = get_sber_oauth_token(client_id, client_secret)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Failed to get OAuth token: {str(e)}'})
        }
    
    try:
        response = requests.post(
            'https://smartspeech.sber.ru/rest/v1/text:synthesize?format=opus&voice=Nec_24000',
            headers={
                'Authorization': f'Bearer {oauth_token}',
                'Content-Type': 'application/json'
            },
            json={'text': text},
            verify=False
        )
        
        if response.status_code != 200:
            return {
                'statusCode': response.status_code,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': response.text})
            }
        
        audio_base64 = base64.b64encode(response.content).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'audio': audio_base64})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }