import json
import os
import base64
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Загружает файлы в базу знаний для обучения ИИ
    Args: event с httpMethod, body {file_name, file_content, file_type}
    Returns: HTTP response с результатом загрузки
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    conn.set_session(autocommit=False)
    cur = conn.cursor()
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            file_name = body_data.get('file_name', '')
            file_content = body_data.get('file_content', '')
            file_type = body_data.get('file_type', '')
            category = body_data.get('category', 'Без категории')
            file_size = len(file_content)
            
            content = base64.b64decode(file_content).decode('utf-8', errors='ignore')
            
            # Escape single quotes for SQL
            safe_name = file_name.replace("'", "''")
            safe_type = file_type.replace("'", "''")
            safe_category = category.replace("'", "''")
            safe_content = content.replace("'", "''")
            
            cur.execute(
                f"INSERT INTO t_p68921797_ai_assistant_bogdan_.knowledge_base (file_name, file_type, file_size, content, category) VALUES ('{safe_name}', '{safe_type}', {file_size}, '{safe_content}', '{safe_category}') RETURNING id"
            )
            file_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'id': file_id,
                    'file_name': file_name,
                    'message': 'File uploaded successfully'
                })
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters', {})
            file_id = params.get('id')
            
            if file_id:
                cur.execute(f"SELECT content FROM t_p68921797_ai_assistant_bogdan_.knowledge_base WHERE id = {file_id}")
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': {'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'File not found'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'content': row[0]})
                }
            
            cur.execute(
                "SELECT id, file_name, file_type, file_size, created_at, category FROM t_p68921797_ai_assistant_bogdan_.knowledge_base ORDER BY created_at DESC"
            )
            files = []
            for row in cur.fetchall():
                files.append({
                    'id': row[0],
                    'file_name': row[1],
                    'file_type': row[2],
                    'file_size': row[3],
                    'created_at': row[4].isoformat() if row[4] else None,
                    'category': row[5] if len(row) > 5 else 'Без категории'
                })
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'files': files})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            file_id = params.get('id')
            
            if not file_id:
                return {
                    'statusCode': 400,
                    'headers': {'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'File ID required'})
                }
            
            cur.execute(f"DELETE FROM t_p68921797_ai_assistant_bogdan_.knowledge_base WHERE id = {file_id}")
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'File deleted successfully'})
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()