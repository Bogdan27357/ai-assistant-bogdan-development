import json
import os
import urllib.request
import urllib.error
import psycopg2
import base64
import ssl
from typing import Dict, Any

def get_system_prompt(dsn: str) -> str:
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT prompt_text FROM system_prompts WHERE ai_model = 'gigachat' AND is_active = true ORDER BY created_at DESC LIMIT 1"
        )
        row = cur.fetchone()
        return row[0] if row else "Ты - полезный ассистент."
    finally:
        cur.close()
        conn.close()

def get_knowledge_base(dsn: str) -> str:
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    try:
        cur.execute("SELECT file_name, content FROM knowledge_base ORDER BY created_at DESC LIMIT 10")
        rows = cur.fetchall()
        if not rows:
            return ""
        
        kb_text = "\n\nБаза знаний:\n"
        for title, content in rows:
            kb_text += f"\n## {title}\n{content}\n"
        return kb_text
    finally:
        cur.close()
        conn.close()

def get_gigachat_token(api_key: str) -> str:
    auth_data = base64.b64encode(api_key.encode()).decode()
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(
        'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
        data=b'scope=GIGACHAT_API_PERS',
        headers={
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': 'request-id-123',
            'Authorization': f'Basic {auth_data}'
        },
        method='POST'
    )
    
    response = urllib.request.urlopen(req, context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    return data['access_token']

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: GigaChat API with system prompts and knowledge base
    Args: event with httpMethod (POST, OPTIONS), body with messages array
    Returns: GigaChat response with assistant message
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
    
    api_key = os.environ.get('GIGACHAT_API_KEY')
    dsn = os.environ.get('DATABASE_URL')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    user_messages = body_data.get('messages', [])
    
    system_prompt = get_system_prompt(dsn) if dsn else "Ты - полезный ассистент."
    knowledge_base = get_knowledge_base(dsn) if dsn else ""
    
    messages = [
        {'role': 'system', 'content': system_prompt + knowledge_base}
    ]
    
    for msg in user_messages:
        messages.append({
            'role': msg['role'],
            'content': msg.get('text', msg.get('content', ''))
        })
    
    try:
        access_token = get_gigachat_token(api_key)
        
        request_payload = {
            'model': 'GigaChat',
            'messages': messages,
            'temperature': 0.7,
            'max_tokens': 2000
        }
        
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        
        req = urllib.request.Request(
            'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            data=json.dumps(request_payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': f'Bearer {access_token}'
            },
            method='POST'
        )
        
        response = urllib.request.urlopen(req, context=ctx)
        response_data = json.loads(response.read().decode('utf-8'))
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps(response_data)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
