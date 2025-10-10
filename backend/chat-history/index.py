import json
from typing import Dict, Any
import os
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage chat history - save and load messages
    Args: event with httpMethod, body (session_id, model_id, role, content)
    Returns: HTTP response with saved/loaded messages
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL', '')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        session_id = params.get('session_id', '')
        
        if not session_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'session_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "SELECT role, content, model_id, created_at FROM t_p68921797_ai_assistant_bogdan_.chat_messages WHERE session_id = %s ORDER BY created_at ASC",
            (session_id,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        messages = [
            {
                'role': row[0],
                'content': row[1],
                'model_id': row[2],
                'created_at': row[3].isoformat() if row[3] else None
            }
            for row in rows
        ]
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'messages': messages}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        session_id = body_data.get('session_id', '')
        model_id = body_data.get('model_id', 'gemini')
        role = body_data.get('role', 'user')
        content = body_data.get('content', '')
        
        if not session_id or not content:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'session_id and content required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO t_p68921797_ai_assistant_bogdan_.chat_messages (session_id, model_id, role, content, created_at) VALUES (%s, %s, %s, %s, %s)",
            (session_id, model_id, role, content, datetime.utcnow())
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        session_id = params.get('session_id', '')
        
        if not session_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'session_id required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "DELETE FROM t_p68921797_ai_assistant_bogdan_.chat_messages WHERE session_id = %s",
            (session_id,)
        )
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True}),
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
