import json
import os
from typing import Dict, Any
from elevenlabs.client import ElevenLabs

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Create and manage ElevenLabs conversational AI agents
    Args: event with httpMethod (POST to create agent), body with agent configuration
    Returns: HTTP response with agent ID and details
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
            'body': json.dumps({'error': 'ElevenLabs API key not configured'})
        }
    
    client = ElevenLabs(api_key=api_key)
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        agent_name = body_data.get('name', 'My conversational agent')
        prompt_text = body_data.get('prompt', 'You are a helpful assistant that can answer questions and help with tasks.')
        
        response = client.conversational_ai.agents.create(
            name=agent_name,
            conversation_config={
                "agent": {
                    "prompt": {
                        "prompt": prompt_text,
                    }
                }
            }
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'agent_id': response.agent_id,
                'name': agent_name,
                'status': 'created'
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
