import json
import os
from typing import Dict, Any
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create and manage ElevenLabs conversational AI agents
    Args: event with httpMethod (GET list agents, POST create, DELETE remove), body with agent configuration
    Returns: HTTP response with agent ID and details
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    api_key = os.environ.get('ELEVENLABS_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'ElevenLabs API key not configured'}),
            'isBase64Encoded': False
        }
    
    base_url = 'https://api.elevenlabs.io/v1'
    headers = {
        'xi-api-key': api_key,
        'Content-Type': 'application/json'
    }
    
    if method == 'GET':
        try:
            response = requests.get(
                f'{base_url}/convai/agents',
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                agents_list = data.get('agents', [])
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'agents': agents_list}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': response.status_code,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': response.text}),
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
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        agent_name = body_data.get('name', 'My conversational agent')
        prompt_text = body_data.get('prompt', 'You are a helpful assistant that can answer questions and help with tasks.')
        
        payload = {
            'name': agent_name,
            'conversation_config': {
                'agent': {
                    'prompt': {
                        'prompt': prompt_text
                    }
                }
            }
        }
        
        response = requests.post(
            f'{base_url}/convai/agents/create',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code in [200, 201]:
            data = response.json()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'agent_id': data.get('agent_id'),
                    'name': agent_name,
                    'status': 'created'
                }),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': response.text}),
                'isBase64Encoded': False
            }
    
    if method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        agent_id_to_delete = body_data.get('agent_id')
        
        if not agent_id_to_delete:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'agent_id required'}),
                'isBase64Encoded': False
            }
        
        response = requests.delete(
            f'{base_url}/convai/agents/{agent_id_to_delete}',
            headers=headers,
            timeout=30
        )
        
        if response.status_code in [200, 204]:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'status': 'deleted', 'agent_id': agent_id_to_delete}),
                'isBase64Encoded': False
            }
        else:
            return {
                'statusCode': response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': response.text}),
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