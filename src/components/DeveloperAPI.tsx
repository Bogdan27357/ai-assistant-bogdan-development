import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import APIKeyManager from './api/APIKeyManager';
import APIDocumentation from './api/APIDocumentation';
import APITester from './api/APITester';
import CodeExamples from './api/CodeExamples';
import { APIKey, Endpoint, CodeLanguage } from './api/types';

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
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('curl');

  const endpoints: Endpoint[] = [
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
          <APIKeyManager
            apiKeys={apiKeys}
            newKeyName={newKeyName}
            onNewKeyNameChange={setNewKeyName}
            onGenerateKey={generateAPIKey}
            onDeleteKey={deleteKey}
            onToggleKey={toggleKey}
            onCopyToClipboard={copyToClipboard}
          />

          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <Tabs defaultValue="docs" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="docs">Документация</TabsTrigger>
                  <TabsTrigger value="test">Тестирование</TabsTrigger>
                  <TabsTrigger value="examples">Примеры</TabsTrigger>
                </TabsList>

                <TabsContent value="docs" className="mt-6">
                  <APIDocumentation
                    endpoints={endpoints}
                    onSelectEndpoint={setSelectedEndpoint}
                  />
                </TabsContent>

                <TabsContent value="test" className="mt-6">
                  <APITester
                    endpoints={endpoints}
                    selectedEndpoint={selectedEndpoint}
                    testRequest={testRequest}
                    testResponse={testResponse}
                    onSelectEndpoint={setSelectedEndpoint}
                    onRequestChange={setTestRequest}
                    onTest={testAPI}
                  />
                </TabsContent>

                <TabsContent value="examples" className="mt-6">
                  <CodeExamples
                    selectedEndpoint={selectedEndpoint}
                    selectedLanguage={selectedLanguage}
                    apiKey={apiKeys[0]?.key || 'YOUR_API_KEY'}
                    onLanguageChange={setSelectedLanguage}
                    onCopyToClipboard={copyToClipboard}
                  />
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
