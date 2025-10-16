'''
Business: API для управления настройками ИИ в базе данных
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с request_id, function_name и др.
Returns: HTTP response с настройками или статусом сохранения
'''

import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Auth',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database URL not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("""
                SELECT setting_key, setting_value 
                FROM t_p68921797_ai_assistant_bogdan_.user_settings
            """)
            rows = cur.fetchall()
            
            settings = {row[0]: row[1] for row in rows}
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(settings),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            print(f"Received POST data: {body_data}")
            
            for key, value in body_data.items():
                print(f"Updating {key} = {value}")
                escaped_key = key.replace("'", "''")
                escaped_value = str(value).replace("'", "''")
                
                query = f"""
                    INSERT INTO t_p68921797_ai_assistant_bogdan_.user_settings 
                    (setting_key, setting_value, updated_at)
                    VALUES ('{escaped_key}', '{escaped_value}', NOW())
                    ON CONFLICT (setting_key) 
                    DO UPDATE SET setting_value = '{escaped_value}', updated_at = NOW()
                """
                cur.execute(query)
                print(f"Updated {key} successfully")
            
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
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }