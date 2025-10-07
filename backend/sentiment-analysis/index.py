import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Анализирует тональность текста (позитивный/негативный/нейтральный)
    Args: event с httpMethod, body {text}
    Returns: HTTP response с анализом тональности
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
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    text = body_data.get('text', '')
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    prompt = f"""Проанализируй тональность следующего текста и верни ответ СТРОГО в формате JSON без дополнительного текста:
{{
  "sentiment": "positive" | "negative" | "neutral",
  "score": число от -1 до 1,
  "emotions": ["радость", "грусть", и т.д.],
  "explanation": "краткое объяснение"
}}

Текст: {text}"""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    
    response = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}]
    })
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Sentiment analysis failed'})
        }
    
    result = response.json()
    analysis_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    analysis_text = analysis_text.replace('```json', '').replace('```', '').strip()
    
    try:
        analysis = json.loads(analysis_text)
    except:
        analysis = {
            'sentiment': 'neutral',
            'score': 0,
            'emotions': [],
            'explanation': analysis_text
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(analysis)
    }
