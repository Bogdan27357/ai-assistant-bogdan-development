import json
import os
import psycopg2
from typing import Dict, Any, List, Optional
from datetime import datetime

def get_db_connection():
    '''
    Business: Create database connection using DSN from environment
    Returns: psycopg2 connection object
    '''
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage chat history - save/load messages from database
    Args: event with httpMethod, body (session_id, role, content for POST)
          context with request_id
    Returns: HTTP response with messages or success status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            session_id: str = params.get('session_id', '')
            
            if not session_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'session_id required'})
                }
            
            cursor.execute(
                "SELECT role, content, created_at FROM chat_messages WHERE session_id = %s ORDER BY created_at ASC",
                (session_id,)
            )
            
            rows = cursor.fetchall()
            messages: List[Dict[str, Any]] = [
                {
                    'role': row[0],
                    'content': row[1],
                    'timestamp': row[2].isoformat() if row[2] else None
                }
                for row in rows
            ]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'messages': messages})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            session_id: str = body_data.get('session_id', '')
            role: str = body_data.get('role', '')
            content: str = body_data.get('content', '')
            
            if not session_id or not role or not content:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'session_id, role, and content required'})
                }
            
            cursor.execute(
                "SELECT id FROM chat_sessions WHERE session_id = %s",
                (session_id,)
            )
            
            if not cursor.fetchone():
                cursor.execute(
                    "INSERT INTO chat_sessions (session_id, title) VALUES (%s, %s)",
                    (session_id, 'Yandex GPT Chat')
                )
            
            cursor.execute(
                "INSERT INTO chat_messages (session_id, model_id, role, content) VALUES (%s, %s, %s, %s)",
                (session_id, 'yandex-gpt', role, content)
            )
            
            cursor.execute(
                "UPDATE chat_sessions SET updated_at = NOW() WHERE session_id = %s",
                (session_id,)
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cursor.close()
        conn.close()