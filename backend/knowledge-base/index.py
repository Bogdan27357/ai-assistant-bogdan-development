import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API for managing knowledge base documents
    Args: event with httpMethod (GET, POST, PUT, DELETE), body with document data
    Returns: JSON with knowledge base documents or operation result
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
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    finally:
        cur.close()
        conn.close()
