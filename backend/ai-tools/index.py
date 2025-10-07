import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Универсальная функция для всех ИИ инструментов (перевод, озвучка, распознавание, резюме, анализ)
    Args: event с httpMethod, body {tool, text, params}
    Returns: HTTP response с результатом работы инструмента
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
    tool = body_data.get('tool', '')
    text = body_data.get('text', '')
    params = body_data.get('params', {})
    
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'API key not configured'})
        }
    
    if tool == 'translate':
        return translate_text(text, params, api_key)
    elif tool == 'tts':
        return text_to_speech(text, params, api_key)
    elif tool == 'stt':
        return speech_to_text(text, params, api_key)
    elif tool == 'summarize':
        return summarize_text(text, params, api_key)
    elif tool == 'sentiment':
        return analyze_sentiment(text, api_key)
    elif tool == 'image':
        return generate_image(text, params, api_key)
    else:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Unknown tool'})
        }

def translate_text(text: str, params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    target_lang = params.get('target_lang', 'en')
    source_lang = params.get('source_lang', 'auto')
    
    prompt = f"Translate the following text from {source_lang} to {target_lang}. Return ONLY the translated text without any explanations:\n\n{text}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    
    response = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}]
    })
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Translation failed'})
        }
    
    result = response.json()
    translated = result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'result': translated,
            'source_lang': source_lang,
            'target_lang': target_lang
        })
    }

def text_to_speech(text: str, params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    lang = params.get('lang', 'ru-RU')
    voice = params.get('voice', 'ru-RU-Standard-A')
    
    url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={api_key}"
    
    payload = {
        'input': {'text': text},
        'voice': {
            'languageCode': lang,
            'name': voice
        },
        'audioConfig': {
            'audioEncoding': 'MP3'
        }
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Text-to-speech failed'})
        }
    
    result = response.json()
    audio_content = result.get('audioContent', '')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'result': audio_content,
            'format': 'mp3'
        })
    }

def speech_to_text(audio_base64: str, params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    lang = params.get('lang', 'ru-RU')
    
    url = f"https://speech.googleapis.com/v1/speech:recognize?key={api_key}"
    
    payload = {
        'config': {
            'encoding': 'MP3',
            'languageCode': lang,
            'enableAutomaticPunctuation': True
        },
        'audio': {
            'content': audio_base64
        }
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Speech recognition failed'})
        }
    
    result = response.json()
    
    if not result.get('results'):
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'result': '',
                'confidence': 0
            })
        }
    
    transcript = result['results'][0]['alternatives'][0]['transcript']
    confidence = result['results'][0]['alternatives'][0].get('confidence', 1.0)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'result': transcript,
            'confidence': confidence
        })
    }

def summarize_text(text: str, params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    length = params.get('length', 'medium')
    
    length_map = {
        'short': '2-3 предложения',
        'medium': '5-7 предложений',
        'long': '10-15 предложений'
    }
    
    prompt = f"Создай краткое содержание следующего текста ({length_map.get(length, 'medium')}). Сохрани ключевые моменты:\n\n{text}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"
    
    response = requests.post(url, json={
        'contents': [{'parts': [{'text': prompt}]}]
    })
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Summarization failed'})
        }
    
    result = response.json()
    summary = result['candidates'][0]['content']['parts'][0]['text'].strip()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'result': summary,
            'original_length': len(text),
            'summary_length': len(summary)
        })
    }

def analyze_sentiment(text: str, api_key: str) -> Dict[str, Any]:
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
        'body': json.dumps({'result': analysis})
    }

def generate_image(prompt: str, params: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    width = params.get('width', 1024)
    height = params.get('height', 1024)
    
    url = "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict"
    
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'instances': [{
            'prompt': prompt
        }],
        'parameters': {
            'sampleCount': 1,
            'aspectRatio': f'{width}:{height}'
        }
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code != 200:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Image generation failed'})
        }
    
    result = response.json()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'result': result.get('predictions', [{}])[0].get('bytesBase64Encoded', ''),
            'prompt': prompt
        })
    }
