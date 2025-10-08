import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
  requests: number;
  isActive: boolean;
}

const DeveloperAPI = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'sk_live_' + Math.random().toString(36).substring(2, 15),
      created: new Date(Date.now() - 86400000 * 30),
      lastUsed: new Date(),
      requests: 15420,
      isActive: true
    }
  ]);

  const [newKeyName, setNewKeyName] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState('chat');
  const [testRequest, setTestRequest] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'javascript' | 'python'>('curl');

  const endpoints = [
    {
      id: 'chat',
      name: 'Chat Completion',
      method: 'POST',
      path: '/api/v1/chat',
      description: 'Отправка сообщения в чат AI'
    },
    {
      id: 'image',
      name: 'Image Generation',
      method: 'POST',
      path: '/api/v1/image/generate',
      description: 'Генерация изображений'
    },
    {
      id: 'translate',
      name: 'Translation',
      method: 'POST',
      path: '/api/v1/translate',
      description: 'Перевод текста'
    },
    {
      id: 'analyze',
      name: 'Text Analysis',
      method: 'POST',
      path: '/api/v1/analyze',
      description: 'Анализ текста'
    },
    {
      id: 'voice',
      name: 'Text to Speech',
      method: 'POST',
      path: '/api/v1/voice/synthesize',
      description: 'Синтез речи'
    }
  ];

  const generateAPIKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Введите название ключа');
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: 'sk_live_' + Math.random().toString(36).substring(2, 20),
      created: new Date(),
      requests: 0,
      isActive: true
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName('');
    toast.success('API ключ создан!');
  };

  const deleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    toast.success('Ключ удален');
  };

  const toggleKey = (id: string) => {
    setApiKeys(prev =>
      prev.map(k => (k.id === id ? { ...k, isActive: !k.isActive } : k))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано!');
  };

  const getCodeExample = (endpoint: string, language: 'curl' | 'javascript' | 'python') => {
    const apiKey = apiKeys[0]?.key || 'YOUR_API_KEY';
    const baseUrl = 'https://api.yourapp.com';

    const examples: Record<string, Record<string, string>> = {
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
      }
    };

    return examples[endpoint]?.[language] || examples.chat[language];
  };

  const testAPI = () => {
    toast.loading('Отправляю запрос...');
    
    setTimeout(() => {
      const mockResponse = {
        success: true,
        data: {
          response: 'Это тестовый ответ от API. В реальной версии здесь будет настоящий ответ.',
          requestId: 'req_' + Math.random().toString(36).substring(2, 15),
          timestamp: new Date().toISOString()
        },
        usage: {
          promptTokens: 10,
          completionTokens: 25,
          totalTokens: 35
        }
      };

      setTestResponse(JSON.stringify(mockResponse, null, 2));
      toast.dismiss();
      toast.success('Запрос выполнен успешно!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon name="Code2" size={40} className="text-emerald-400" />
            API для разработчиков
          </h1>
          <p className="text-slate-400">Интегрируйте AI в ваши приложения</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">API Ключи</h3>
              
              <div className="space-y-3 mb-4">
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Название ключа"
                  className="bg-slate-800 border-slate-700"
                />
                <Button onClick={generateAPIKey} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать новый ключ
                </Button>
              </div>

              <div className="space-y-3">
                {apiKeys.map(key => (
                  <div key={key.id} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{key.name}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-xs text-emerald-400 font-mono bg-slate-900 px-2 py-1 rounded">
                            {key.key}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(key.key)}
                            className="h-6 w-6 p-0"
                          >
                            <Icon name="Copy" size={12} />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{key.requests.toLocaleString()} запросов</span>
                          <span>•</span>
                          <span>{key.created.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <Switch
                          checked={key.isActive}
                          onCheckedChange={() => toggleKey(key.id)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteKey(key.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Icon name="Trash2" size={14} className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                    <Badge variant={key.isActive ? "default" : "secondary"} className="text-xs">
                      {key.isActive ? '🟢 Активен' : '🔴 Отключен'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30 p-6">
              <h3 className="text-lg font-bold text-white mb-3">📊 Лимиты</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Запросов в день:</span>
                  <span className="font-semibold">10,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Использовано:</span>
                  <span className="font-semibold">2,340</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23.4%' }} />
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <Tabs defaultValue="docs" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="docs">Документация</TabsTrigger>
                  <TabsTrigger value="test">Тестирование</TabsTrigger>
                  <TabsTrigger value="examples">Примеры</TabsTrigger>
                </TabsList>

                <TabsContent value="docs" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">Доступные Endpoints</h3>
                    <div className="space-y-3">
                      {endpoints.map(endpoint => (
                        <div
                          key={endpoint.id}
                          className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
                          onClick={() => setSelectedEndpoint(endpoint.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className="bg-emerald-600">{endpoint.method}</Badge>
                                <code className="text-emerald-400 font-mono text-sm">{endpoint.path}</code>
                              </div>
                              <h4 className="text-white font-medium mb-1">{endpoint.name}</h4>
                              <p className="text-sm text-slate-400">{endpoint.description}</p>
                            </div>
                            <Icon name="ChevronRight" size={20} className="text-slate-500 mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-white font-medium mb-1">Аутентификация</p>
                        <p className="text-xs text-slate-300">
                          Все запросы требуют заголовок <code className="bg-slate-800 px-1">Authorization: Bearer YOUR_API_KEY</code>
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Endpoint</label>
                    <select
                      value={selectedEndpoint}
                      onChange={(e) => setSelectedEndpoint(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
                    >
                      {endpoints.map(ep => (
                        <option key={ep.id} value={ep.id}>
                          {ep.method} {ep.path}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Тело запроса (JSON)</label>
                    <Textarea
                      value={testRequest}
                      onChange={(e) => setTestRequest(e.target.value)}
                      placeholder='{\n  "message": "Привет!",\n  "model": "gpt-4"\n}'
                      className="bg-slate-800 border-slate-700 font-mono text-sm min-h-32"
                    />
                  </div>

                  <Button onClick={testAPI} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Icon name="Play" size={16} className="mr-2" />
                    Отправить запрос
                  </Button>

                  {testResponse && (
                    <div>
                      <label className="text-sm font-medium text-white mb-2 block">Ответ</label>
                      <div className="bg-slate-800 rounded-lg p-4 max-h-64 overflow-auto scrollbar-thin">
                        <pre className="text-xs text-emerald-400 font-mono">
                          {testResponse}
                        </pre>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="examples" className="space-y-6 mt-6">
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={selectedLanguage === 'curl' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('curl')}
                      size="sm"
                    >
                      cURL
                    </Button>
                    <Button
                      variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('javascript')}
                      size="sm"
                    >
                      JavaScript
                    </Button>
                    <Button
                      variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                      onClick={() => setSelectedLanguage('python')}
                      size="sm"
                    >
                      Python
                    </Button>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-white">Пример кода</label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(getCodeExample(selectedEndpoint, selectedLanguage))}
                      >
                        <Icon name="Copy" size={14} className="mr-1" />
                        Копировать
                      </Button>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-slate-300 font-mono">
                        {getCodeExample(selectedEndpoint, selectedLanguage)}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="AlertTriangle" size={20} className="text-yellow-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-white font-medium mb-1">Важно</p>
                        <p className="text-xs text-slate-300">
                          Никогда не публикуйте API ключи в публичных репозиториях.
                          Используйте переменные окружения.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperAPI;
