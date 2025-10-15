import json
import os
from typing import Dict, Any
import requests

KNOWLEDGE_BASE = """
АЭРОПОРТ ПУЛКОВО - БАЗА ЗНАНИЙ

ПАРКОВКА:
- P1 (краткосрочная): 100₽/час, первые 15 минут бесплатно
- P2 (среднесрочная): 80₽/час, 500₽/сутки
- P3 (долгосрочная): 60₽/час, 350₽/сутки
- P4 (эконом): 250₽/сутки, до 7 дней
- Расположение: все парковки рядом с терминалом, 2-5 минут пешком

ТРАНСПОРТ:
- Автобус №39: до метро Московская, каждые 15 минут, 50₽
- Автобус №39Э (экспресс): до метро Московская, каждые 30 минут, 100₽
- Маршрутка К39: до метро Московская, каждые 10 минут, 70₽
- Такси: официальная стоянка у выхода, до центра 800-1200₽
- Каршеринг: Яндекс.Драйв, Delimobil - парковка на P4

УСЛУГИ АЭРОПОРТА:
- Регистрация: открывается за 2-3 часа до вылета
- Камеры хранения: 200₽/сутки за место, работают круглосуточно
- WiFi: бесплатный, сеть Pulkovo_Free
- Бизнес-залы: 3 зала, от 2500₽, доступ по Priority Pass
- Детская комната: бесплатно, 2 этаж, зона вылета
- Аптека: круглосуточно, зона прилёта
- Банкоматы: Сбербанк, ВТБ, Тинькофф - по всему терминалу

БАГАЖ:
- Ручная кладь: до 10 кг, размер 55×40×20 см
- Регистрируемый багаж: до 23 кг (эконом), до 32 кг (бизнес)
- Негабаритный багаж: регистрация на стойке Oversize
- Потерянный багаж: служба розыска, зона выдачи багажа

НАВИГАЦИЯ:
- 1 этаж: прилёт, выдача багажа, встреча
- 2 этаж: вылет, регистрация, магазины Duty Free
- Терминал 1: внутренние и международные рейсы
- Время на досмотр: закладывайте 30-40 минут

КОНТАКТЫ:
- Справочная: +7 (812) 337-38-22
- Потерянный багаж: +7 (812) 704-38-22
- Сайт: pulkovoairport.ru
"""

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Умный помощник аэропорта через Yandex GPT с базой знаний
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
    
    api_key = os.environ.get('YANDEX_API_KEY', '')
    folder_id = os.environ.get('YANDEX_FOLDER_ID', '')
    
    if not api_key or not folder_id:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Yandex API key or Folder ID not configured'}),
            'isBase64Encoded': False
        }
    
    body_str = event.get('body', '{}')
    if not body_str or body_str.strip() == '':
        body_str = '{}'
    
    body_data = json.loads(body_str)
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
    
    system_prompt = f'''Ты - голосовой помощник аэропорта Пулково. Твоё имя - "Полёт".
Отвечай кратко (2-3 предложения), дружелюбно и по делу на основе базы знаний.
Если информации нет в базе - посоветуй обратиться к стойке информации.

БАЗА ЗНАНИЙ:
{KNOWLEDGE_BASE}
'''
    
    response = requests.post(
        'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
        headers={
            'Authorization': f'Api-Key {api_key}',
            'Content-Type': 'application/json',
            'x-folder-id': folder_id
        },
        json={
            'modelUri': f'gpt://{folder_id}/yandexgpt-lite/latest',
            'completionOptions': {
                'stream': False,
                'temperature': 0.6,
                'maxTokens': 200
            },
            'messages': [
                {
                    'role': 'system',
                    'text': system_prompt
                },
                {
                    'role': 'user',
                    'text': question
                }
            ]
        },
        timeout=30
    )
    
    if response.status_code == 200:
        data = response.json()
        answer = data['result']['alternatives'][0]['message']['text']
        
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