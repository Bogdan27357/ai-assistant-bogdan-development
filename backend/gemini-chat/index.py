import json
import os
from typing import Dict, Any
import requests
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Google Gemini 2.0 Flash API integration for chat
    Args: event with httpMethod, body (message, session_id)
    Returns: AI response from Gemini
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
    
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT api_key, enabled FROM api_keys WHERE model_id = 'gemini'")
    row = cur.fetchone()
    cur.close()
    conn.close()
    
    if not row or not row[0]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Gemini API key not configured in admin panel'}),
            'isBase64Encoded': False
        }
    
    if not row[1]:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Gemini model is disabled'}),
            'isBase64Encoded': False
        }
    
    api_key = row[0]
    
    body_data = json.loads(event.get('body', '{}'))
    message = body_data.get('message', '')
    
    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Message is required'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute("SELECT file_name, content FROM knowledge_base ORDER BY created_at DESC LIMIT 10")
    knowledge_files = cur.fetchall()
    cur.close()
    conn.close()
    
    context = ""
    if knowledge_files:
        context = "\n\n=== База знаний ===\n"
        for file_name, content in knowledge_files:
            context += f"\n[{file_name}]:\n{content[:1000]}\n"
        context += "===================\n\n"
    
    enhanced_message = f"{context}Пользователь спрашивает: {message}"
    
    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}'
    
    payload = {
        'contents': [{
            'parts': [{'text': enhanced_message}]
        }]
    }
    
    response = requests.post(url, json=payload, headers={'Content-Type': 'application/json'})
    
    if response.status_code != 200:
        return {
            'statusCode': response.status_code,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': f'Gemini API error: {response.text}'}),
            'isBase64Encoded': False
        }
    
    result = response.json()
    ai_response = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No response')
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({
            'response': ai_response,
            'model': 'gemini-2.0-flash-exp'
        }),
        'isBase64Encoded': False
    }