import json
import os
import urllib.request
import urllib.error
import base64
import ssl
from typing import Dict, Any

def get_sber_oauth_token(client_id: str, client_secret: str) -> str:
    auth_data = urllib.parse.urlencode({
        'scope': 'SALUTE_SPEECH_PERS'
    }).encode('utf-8')
    
    auth_string = f"{client_id}:{client_secret}"
    auth_base64 = base64.b64encode(auth_string.encode('utf-8')).decode('utf-8')
    
    req = urllib.request.Request(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        data=auth_data,
        headers={
            'Authorization': f'Basic {auth_base64}',
            'Content-Type': 'application/x-www-form-urlencoded',
            'RqUID': 'salute-speech-request'
        },
        method='POST'
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    response = urllib.request.urlopen(req, context=ctx)
    data = json.loads(response.read().decode('utf-8'))
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
                'body': json.dumps({'error': 'No text provided'})
            }
        
        if provider == 'yandex':
            return yandex_tts(text)
        elif provider == 'sber':
            return sber_tts(text)
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid action or provider'})
    }

def yandex_stt(audio_base64: str) -> Dict[str, Any]:
    api_key = os.environ.get('YANDEX_SPEECH_API_KEY')
    folder_id = 'b1gfkd2baaso5298c7lt'
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Yandex API key not configured'})
        }
    
    audio_bytes = base64.b64decode(audio_base64)
    
    req = urllib.request.Request(
        f'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId={folder_id}&lang=ru-RU',
        data=audio_bytes,
        headers={'Authorization': f'Api-Key {api_key}'},
        method='POST'
    )
    
    try:
        response = urllib.request.urlopen(req)
        response_data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(response_data)
        }
    except urllib.error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': e.read().decode('utf-8')})
        }

def yandex_tts(text: str) -> Dict[str, Any]:
    api_key = os.environ.get('YANDEX_SPEECH_API_KEY')
    folder_id = 'b1gfkd2baaso5298c7lt'
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Yandex API key not configured'})
        }
    
    params = urllib.parse.urlencode({
        'text': text,
        'lang': 'ru-RU',
        'voice': 'alena',
        'folderId': folder_id,
        'format': 'oggopus'
    })
    
    req = urllib.request.Request(
        'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
        data=params.encode('utf-8'),
        headers={'Authorization': f'Api-Key {api_key}'},
        method='POST'
    )
    
    try:
        response = urllib.request.urlopen(req)
        audio_data = response.read()
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'audio': audio_base64})
        }
    except urllib.error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': e.read().decode('utf-8')})
        }

def sber_stt(audio_base64: str) -> Dict[str, Any]:
    client_id = os.environ.get('SBER_CLIENT_ID')
    client_secret = os.environ.get('SBER_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Sber credentials not configured'})
        }
    
    try:
        oauth_token = get_sber_oauth_token(client_id, client_secret)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to get OAuth token: {str(e)}'})
        }
    
    audio_bytes = base64.b64decode(audio_base64)
    
    req = urllib.request.Request(
        'https://smartspeech.sber.ru/rest/v1/speech:recognize',
        data=audio_bytes,
        headers={
            'Authorization': f'Bearer {oauth_token}',
            'Content-Type': 'audio/opus'
        },
        method='POST'
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        response = urllib.request.urlopen(req, context=ctx)
        response_data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps(response_data)
        }
    except urllib.error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': e.read().decode('utf-8')})
        }

def sber_tts(text: str) -> Dict[str, Any]:
    client_id = os.environ.get('SBER_CLIENT_ID')
    client_secret = os.environ.get('SBER_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Sber credentials not configured'})
        }
    
    try:
        oauth_token = get_sber_oauth_token(client_id, client_secret)
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Failed to get OAuth token: {str(e)}'})
        }
    
    request_data = json.dumps({'text': text}).encode('utf-8')
    
    req = urllib.request.Request(
        'https://smartspeech.sber.ru/rest/v1/text:synthesize?format=opus&voice=Nec_24000',
        data=request_data,
        headers={
            'Authorization': f'Bearer {oauth_token}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        response = urllib.request.urlopen(req, context=ctx)
        audio_data = response.read()
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'audio': audio_base64})
        }
    except urllib.error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': e.read().decode('utf-8')})
        }
