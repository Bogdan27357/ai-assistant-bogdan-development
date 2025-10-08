import json
import os
from typing import Dict, Any
import psycopg2
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get chat history from database
    Args: event with httpMethod, queryStringParameters (session_id)
    Returns: Array of messages
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters', {}) or {}
    session_id = params.get('session_id')
    
    if not session_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'session_id is required'}),
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
    
    safe_session_id = session_id.replace("'", "''")
    cur.execute(
        f"SELECT model_id, role, content, created_at FROM t_p68921797_ai_assistant_bogdan_.chat_messages WHERE session_id = '{safe_session_id}' ORDER BY created_at ASC"
    )
    
    rows = cur.fetchall()
    
    messages = []
    for row in rows:
        messages.append({
            'model': row[0],
            'role': row[1],
            'content': row[2],
            'created_at': row[3].isoformat() if isinstance(row[3], datetime) else str(row[3])
        })
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'messages': messages}),
        'isBase64Encoded': False
    }