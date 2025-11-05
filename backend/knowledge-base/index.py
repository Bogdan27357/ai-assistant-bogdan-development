import json
import os
import psycopg2
import hashlib
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API for knowledge base and admin auth (auth_action query param)
    Args: event with httpMethod, body with document/auth data
    Returns: JSON with documents or auth result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'isBase64Encoded': False,
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        params = event.get('queryStringParameters', {}) or {}
        auth_action = params.get('auth_action')
        
        if auth_action == 'login':
            return handle_login(event, conn)
        elif auth_action == 'change_password':
            return handle_change_password(event, conn)
        
        if method == 'GET':
            doc_id = params.get('id')
            
            if doc_id:
                cur.execute(
                    "SELECT id, file_name, content, category, created_at, updated_at FROM knowledge_base WHERE id = %s",
                    (doc_id,)
                )
                row = cur.fetchone()
                if row:
                    result = {
                        'id': row[0],
                        'title': row[1],
                        'content': row[2],
                        'category': row[3],
                        'created_at': row[4].isoformat() if row[4] else None,
                        'updated_at': row[5].isoformat() if row[5] else None
                    }
                else:
                    result = None
            else:
                cur.execute(
                    "SELECT id, file_name, content, category, created_at, updated_at FROM knowledge_base ORDER BY created_at DESC"
                )
                rows = cur.fetchall()
                result = [
                    {
                        'id': row[0],
                        'title': row[1],
                        'content': row[2],
                        'category': row[3],
                        'created_at': row[4].isoformat() if row[4] else None,
                        'updated_at': row[5].isoformat() if row[5] else None
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
            title = body_data.get('title', '')
            content = body_data.get('content', '')
            category = body_data.get('category', 'Без категории')
            
            cur.execute(
                "INSERT INTO knowledge_base (file_name, content, category) VALUES (%s, %s, %s) RETURNING id",
                (title, content, category)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': new_id, 'message': 'Document created'})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            doc_id = body_data.get('id')
            title = body_data.get('title')
            content = body_data.get('content')
            category = body_data.get('category')
            
            cur.execute(
                "UPDATE knowledge_base SET file_name = %s, content = %s, category = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                (title, content, category, doc_id)
            )
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Document updated'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            doc_id = params.get('id')
            
            cur.execute("DELETE FROM knowledge_base WHERE id = %s", (doc_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Document deleted'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()

def handle_login(event: Dict[str, Any], conn) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '')
    password = body_data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email and password required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    cursor.execute(
        "SELECT id, email, is_admin FROM admin_users WHERE email = %s AND password_hash = %s",
        (email, password_hash)
    )
    
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user[0],
                    'email': user[1],
                    'is_admin': user[2]
                }
            }),
            'isBase64Encoded': False
        }
    else:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid credentials'}),
            'isBase64Encoded': False
        }

def handle_change_password(event: Dict[str, Any], conn) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '')
    old_password = body_data.get('old_password', '')
    new_password = body_data.get('new_password', '')
    
    if not email or not old_password or not new_password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'All fields required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    old_password_hash = hashlib.sha256(old_password.encode()).hexdigest()
    
    cursor.execute(
        "SELECT id FROM admin_users WHERE email = %s AND password_hash = %s",
        (email, old_password_hash)
    )
    
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid current password'}),
            'isBase64Encoded': False
        }
    
    new_password_hash = hashlib.sha256(new_password.encode()).hexdigest()
    
    cursor.execute(
        "UPDATE admin_users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP WHERE email = %s",
        (new_password_hash, email)
    )
    
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'message': 'Password changed successfully'}),
        'isBase64Encoded': False
    }