import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Save or update API key in database
    Args: event with httpMethod, body (model_id, api_key, enabled)
    Returns: Success confirmation
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    model_id = body_data.get('model_id')
    api_key = body_data.get('api_key')
    enabled = body_data.get('enabled', True)
    
    if not model_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'model_id is required'}),
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
    
    # Get schema name
    cur.execute("SELECT current_schema()")
    schema_name = cur.fetchone()[0]
    
    # Escape strings for simple query protocol
    model_id_escaped = model_id.replace("'", "''")
    
    if api_key is not None:
        api_key_escaped = api_key.replace("'", "''")
        enabled_val = 'TRUE' if enabled else 'FALSE'
        
        query = f"""
        INSERT INTO {schema_name}.api_keys (model_id, api_key, enabled, updated_at) 
        VALUES ('{model_id_escaped}', '{api_key_escaped}', {enabled_val}, CURRENT_TIMESTAMP) 
        ON CONFLICT (model_id) DO UPDATE 
        SET api_key = EXCLUDED.api_key, enabled = EXCLUDED.enabled, updated_at = CURRENT_TIMESTAMP
        """
        cur.execute(query)
    else:
        enabled_val = 'TRUE' if enabled else 'FALSE'
        query = f"UPDATE {schema_name}.api_keys SET enabled = {enabled_val}, updated_at = CURRENT_TIMESTAMP WHERE model_id = '{model_id_escaped}'"
        cur.execute(query)
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
        'isBase64Encoded': False
    }