import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API for managing AI system prompts
    Args: event with httpMethod (GET, POST, PUT), body with prompt data
    Returns: JSON with prompts or operation result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            ai_model = params.get('model')
            
            if ai_model:
                cur.execute(
                    "SELECT id, name, prompt_text, is_active, ai_model, created_at FROM system_prompts WHERE ai_model = %s AND is_active = true ORDER BY created_at DESC LIMIT 1",
                    (ai_model,)
                )
                row = cur.fetchone()
                if row:
                    result = {
                        'id': row[0],
                        'name': row[1],
                        'prompt_text': row[2],
                        'is_active': row[3],
                        'ai_model': row[4],
                        'created_at': row[5].isoformat() if row[5] else None
                    }
                else:
                    result = None
            else:
                cur.execute(
                    "SELECT id, name, prompt_text, is_active, ai_model, created_at FROM system_prompts ORDER BY ai_model, created_at DESC"
                )
                rows = cur.fetchall()
                result = [
                    {
                        'id': row[0],
                        'name': row[1],
                        'prompt_text': row[2],
                        'is_active': row[3],
                        'ai_model': row[4],
                        'created_at': row[5].isoformat() if row[5] else None
                    }
                    for row in rows
                ]
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            name = body_data.get('name', '')
            prompt_text = body_data.get('prompt_text', '')
            ai_model = body_data.get('ai_model', 'yandex-gpt')
            
            cur.execute(
                "INSERT INTO system_prompts (name, prompt_text, ai_model) VALUES (%s, %s, %s) RETURNING id",
                (name, prompt_text, ai_model)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': new_id, 'message': 'Prompt created'})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            prompt_id = body_data.get('id')
            name = body_data.get('name')
            prompt_text = body_data.get('prompt_text')
            is_active = body_data.get('is_active', True)
            
            cur.execute(
                "UPDATE system_prompts SET name = %s, prompt_text = %s, is_active = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (name, prompt_text, is_active, prompt_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Prompt updated'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()
