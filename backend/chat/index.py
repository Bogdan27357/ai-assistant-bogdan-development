import json
from typing import Dict, Any
import requests
import os
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat with Mistral AI via OpenRouter
    Args: event with httpMethod, body (message, model_id)
    Returns: HTTP response with AI response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '') if params else ''
    
    if action == 'knowledge':
        if method == 'GET':
            cur.execute("SELECT id, filename, uploaded_at FROM t_p68921797_ai_assistant_bogdan_.knowledge_base ORDER BY uploaded_at DESC")
            rows = cur.fetchall()
            files_list = [{'id': r[0], 'filename': r[1], 'uploaded_at': r[2].isoformat() if r[2] else None} for r in rows]
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'files': files_list}),
                'isBase64Encoded': False
            }
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            filename = body_data.get('filename', '').replace("'", "''")
            content = body_data.get('content', '').replace("'", "''")
            if not filename or not content:
                cur.close()
                conn.close()
                return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Filename and content required'}), 'isBase64Encoded': False}
            query = f"INSERT INTO t_p68921797_ai_assistant_bogdan_.knowledge_base (filename, content) VALUES ('{filename}', '{content}') RETURNING id"
            cur.execute(query)
            file_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'id': file_id, 'message': 'File uploaded successfully'}), 'isBase64Encoded': False}
        elif method == 'DELETE':
            file_id = params.get('id', '')
            if not file_id:
                cur.close()
                conn.close()
                return {'statusCode': 400, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'File ID required'}), 'isBase64Encoded': False}
            query = f"DELETE FROM t_p68921797_ai_assistant_bogdan_.knowledge_base WHERE id = {int(file_id)}"
            cur.execute(query)
            conn.commit()
            cur.close()
            conn.close()
            return {'statusCode': 200, 'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'message': 'File deleted successfully'}), 'isBase64Encoded': False}
    
    if method == 'GET':
        cur.execute("SELECT model_id, enabled FROM t_p68921797_ai_assistant_bogdan_.api_keys")
        rows = cur.fetchall()
        enabled_map = {row[0]: row[1] for row in rows}
        
        models = [
            {
                'id': 'mistral',
                'name': 'Mistral Small 3 24B',
                'description': 'Продвинутая модель 24B параметров',
                'free': True,
                'enabled': enabled_map.get('mistral', False)
            },
            {
                'id': 'deepseek-r1t2',
                'name': 'DeepSeek R1T2 Chimera 671B',
                'description': 'Мощнейшая модель с reasoning (пошаговые рассуждения)',
                'free': True,
                'enabled': enabled_map.get('deepseek-r1t2', False)
            }
        ]
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'models': models}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        message: str = body_data.get('message', '')
        model_id: str = body_data.get('model_id', 'mistral')
        
        if not message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Message is required'}),
                'isBase64Encoded': False
            }
        
        model_id_escaped = model_id.replace("'", "''")
        query_api = f"SELECT api_key, enabled FROM t_p68921797_ai_assistant_bogdan_.api_keys WHERE model_id = '{model_id_escaped}'"
        cur.execute(query_api)
        row = cur.fetchone()
        
        if not row or not row[1]:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Model not enabled or API key not configured'}),
                'isBase64Encoded': False
            }
        
        api_key = row[0]
        
        model_map = {
            'mistral': 'mistralai/mistral-small-3.24b:free',
            'deepseek-r1t2': 'deepseek/deepseek-r1t2-chimera:free'
        }
        model_name = model_map.get(model_id, 'mistralai/mistral-small-3.24b:free')
        
        cur.execute("SELECT current_schema()")
        schema_name = cur.fetchone()[0]
        
        query_kb = f"SELECT content FROM {schema_name}.knowledge_base ORDER BY uploaded_at DESC LIMIT 5"
        cur.execute(query_kb)
        kb_rows = cur.fetchall()
        cur.close()
        conn.close()
        
        knowledge_context = ''
        if kb_rows:
            knowledge_context = 'База знаний:\n' + '\n---\n'.join([row[0] for row in kb_rows]) + '\n\n'
        
        user_message = knowledge_context + message
        
        response = requests.post(
            'https://openrouter.ai/api/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {api_key}',
                'HTTP-Referer': 'https://poehali.dev',
                'X-Title': 'Bogdan AI'
            },
            json={
                'model': model_name,
                'messages': [
                    {'role': 'system', 'content': 'Ты - Богдан, умный AI-ассистент. Отвечай кратко и по делу.'},
                    {'role': 'user', 'content': user_message}
                ]
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            ai_message = result['choices'][0]['message']['content']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'response': ai_message,
                    'model': model_name
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
                'error': f'API error: {response.text}'
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }