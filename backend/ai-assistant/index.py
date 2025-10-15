import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Генерация умных ответов для голосового помощника аэропорта через OpenAI
    Args: event с httpMethod POST, body с question от пользователя
    Returns: JSON с ответом ассистента
    '''
    method: str = event.get('httpMethod', 'POST')
    
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('OPENAI_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    question = body_data.get('question', '')
    
    if not question:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Question required'}),
            'isBase64Encoded': False
        }
    
    system_prompt = '''Ты - голосовой помощник аэропорта Пулково в Санкт-Петербурге. 
Твоё имя - "Полёт". Ты помогаешь пассажирам с информацией о:
- Парковках (тарифы, местоположение)
- Транспорте (как добраться, такси, автобусы)
- Услугах аэропорта (регистрация, залы ожидания, WiFi)
- Багаже (правила, потерянный багаж)
- Общей навигации по терминалам

Отвечай кратко (2-3 предложения), дружелюбно и по делу. 
Если не знаешь точной информации - посоветуй обратиться к стойке информации.'''
    
    response = requests.post(
        'https://api.openai.com/v1/chat/completions',
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        json={
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': question}
            ],
            'temperature': 0.7,
            'max_tokens': 150
        },
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        answer = data['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'answer': answer,
                'success': True
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': response.status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'error': response.text,
            'success': False
        }),
        'isBase64Encoded': False
    }
