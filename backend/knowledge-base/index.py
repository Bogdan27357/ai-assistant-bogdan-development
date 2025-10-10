import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage knowledge base files (upload, list, delete)
    Args: event - dict with httpMethod, body, queryStringParameters
          context - object with attributes: request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        if method == 'GET':
            cursor.execute('SELECT id, filename, uploaded_at FROM t_p68921797_ai_assistant_bogdan_.knowledge_base ORDER BY uploaded_at DESC')
            rows = cursor.fetchall()
            
            files_list = [
                {
                    'id': row[0],
                    'filename': row[1],
                    'uploaded_at': row[2].isoformat() if row[2] else None
                }
                for row in rows
            ]
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'files': files_list})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            filename = body_data.get('filename', '')
            content = body_data.get('content', '')
            
            if not filename or not content:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Filename and content required'}),
                    'isBase64Encoded': False
                }
            
            filename_escaped = filename.replace("'", "''")
            content_escaped = content.replace("'", "''")
            
            query = f"INSERT INTO t_p68921797_ai_assistant_bogdan_.knowledge_base (filename, content) VALUES ('{filename_escaped}', '{content_escaped}') RETURNING id"
            cursor.execute(query)
            file_id = cursor.fetchone()[0]
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'id': file_id, 'message': 'File uploaded successfully'})
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {})
            file_id = params.get('id', '')
            
            if not file_id:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'File ID required'}),
                    'isBase64Encoded': False
                }
            
            file_id_int = int(file_id)
            query = f'DELETE FROM t_p68921797_ai_assistant_bogdan_.knowledge_base WHERE id = {file_id_int}'
            cursor.execute(query)
            conn.commit()
            
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'File deleted successfully'})
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }