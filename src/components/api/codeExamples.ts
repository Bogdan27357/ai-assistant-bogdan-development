import { CodeLanguage } from './types';

export const getCodeExample = (
  endpoint: string,
  language: CodeLanguage,
  apiKey: string
): string => {
  const baseUrl = 'https://api.yourapp.com';

  const examples: Record<string, Record<CodeLanguage, string>> = {
    chat: {
      curl: `curl -X POST ${baseUrl}/api/v1/chat \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Привет, как дела?",
    "model": "gpt-4"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/api/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Привет, как дела?',
    model: 'gpt-4'
  })
});

const data = await response.json();
console.log(data.response);`,
      python: `import requests

headers = {
    'Authorization': f'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

data = {
    'message': 'Привет, как дела?',
    'model': 'gpt-4'
}

response = requests.post(
    '${baseUrl}/api/v1/chat',
    headers=headers,
    json=data
)

print(response.json()['response'])`
    },
    image: {
      curl: `curl -X POST ${baseUrl}/api/v1/image/generate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Beautiful sunset over mountains",
    "size": "1024x1024",
    "style": "realistic"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/api/v1/image/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Beautiful sunset over mountains',
    size: '1024x1024',
    style: 'realistic'
  })
});

const data = await response.json();
console.log(data.imageUrl);`,
      python: `import requests

response = requests.post(
    '${baseUrl}/api/v1/image/generate',
    headers={'Authorization': f'Bearer ${apiKey}'},
    json={
        'prompt': 'Beautiful sunset over mountains',
        'size': '1024x1024',
        'style': 'realistic'
    }
)

print(response.json()['imageUrl'])`
    },
    translate: {
      curl: `curl -X POST ${baseUrl}/api/v1/translate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "text": "Hello World",
    "from": "en",
    "to": "ru"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/api/v1/translate', {
  method: 'POST',
  headers: {'Authorization': 'Bearer ${apiKey}'},
  body: JSON.stringify({
    text: 'Hello World',
    from: 'en',
    to: 'ru'
  })
});`,
      python: `response = requests.post(
    '${baseUrl}/api/v1/translate',
    headers={'Authorization': f'Bearer ${apiKey}'},
    json={'text': 'Hello World', 'from': 'en', 'to': 'ru'}
)`
    },
    analyze: {
      curl: `curl -X POST ${baseUrl}/api/v1/analyze \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "text": "Текст для анализа"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/api/v1/analyze', {
  method: 'POST',
  headers: {'Authorization': 'Bearer ${apiKey}'},
  body: JSON.stringify({
    text: 'Текст для анализа'
  })
});`,
      python: `response = requests.post(
    '${baseUrl}/api/v1/analyze',
    headers={'Authorization': f'Bearer ${apiKey}'},
    json={'text': 'Текст для анализа'}
)`
    },
    voice: {
      curl: `curl -X POST ${baseUrl}/api/v1/voice/synthesize \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "text": "Текст для озвучки",
    "voice": "ru-RU"
  }'`,
      javascript: `const response = await fetch('${baseUrl}/api/v1/voice/synthesize', {
  method: 'POST',
  headers: {'Authorization': 'Bearer ${apiKey}'},
  body: JSON.stringify({
    text: 'Текст для озвучки',
    voice: 'ru-RU'
  })
});`,
      python: `response = requests.post(
    '${baseUrl}/api/v1/voice/synthesize',
    headers={'Authorization': f'Bearer ${apiKey}'},
    json={'text': 'Текст для озвучки', 'voice': 'ru-RU'}
)`
    }
  };

  return examples[endpoint]?.[language] || examples.chat[language];
};
