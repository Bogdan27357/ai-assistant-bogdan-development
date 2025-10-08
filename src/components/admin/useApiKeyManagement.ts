import { useState } from 'react';
import { toast } from 'sonner';
import { saveApiKey, getApiKeys } from '@/lib/api';

interface ApiConfig {
  enabled: boolean;
  apiKey: string;
}

export const models = [
  { 
    id: 'gemini', 
    name: 'Google Gemini 2.0 Flash', 
    provider: 'OpenRouter',
    icon: 'Sparkles', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Быстрый и точный помощник от Google через OpenRouter',
    status: 'FREE',
    features: ['Быстрая обработка', 'Длинный контекст', 'Pay-as-you-go'],
    apiDocsUrl: 'https://openrouter.ai/keys'
  },
  { 
    id: 'llama', 
    name: 'Meta Llama 3.3 70B', 
    provider: 'OpenRouter',
    icon: 'Cpu', 
    color: 'from-purple-500 to-pink-500',
    description: 'Мощная модель от Meta для сложных аналитических задач через OpenRouter',
    status: 'FREE',
    features: ['Глубокий анализ', 'Reasoning', 'Инструкции', 'Pay-as-you-go'],
    apiDocsUrl: 'https://openrouter.ai/keys'
  }
];

export const useApiKeyManagement = () => {
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    gemini: { enabled: true, apiKey: '' },
    llama: { enabled: true, apiKey: '' }
  });
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});

  const loadApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      const newConfigs: Record<string, ApiConfig> = {};
      keys.forEach(key => {
        newConfigs[key.model_id] = {
          enabled: key.enabled,
          apiKey: key.has_key ? '••••••••••••' : ''
        };
      });
      setConfigs(newConfigs);
    } catch (error) {
      toast.error('Ошибка загрузки ключей');
    }
  };

  const handleToggle = async (modelId: string) => {
    const newEnabled = !configs[modelId].enabled;
    try {
      await saveApiKey(modelId, configs[modelId].apiKey.replace(/•/g, ''), newEnabled);
      setConfigs(prev => ({
        ...prev,
        [modelId]: { ...prev[modelId], enabled: newEnabled }
      }));
      toast.success(`${models.find(m => m.id === modelId)?.name} ${newEnabled ? 'включена' : 'отключена'}`);
    } catch (error) {
      toast.error('Ошибка сохранения');
    }
  };

  const handleSaveKey = async (modelId: string) => {
    try {
      await saveApiKey(modelId, configs[modelId].apiKey, configs[modelId].enabled);
      toast.success(`API ключ для ${models.find(m => m.id === modelId)?.name} сохранён`);
      await loadApiKeys();
    } catch (error) {
      toast.error('Ошибка сохранения ключа');
    }
  };

  const handleUpdateApiKey = (modelId: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [modelId]: { ...prev[modelId], apiKey: value }
    }));
  };

  const handleTestApi = async (modelId: string) => {
    setTesting(prev => ({ ...prev, [modelId]: true }));
    setTestResults(prev => ({ ...prev, [modelId]: null }));

    try {
      const apiKey = configs[modelId].apiKey.replace(/•/g, '');
      
      if (!apiKey || apiKey.length < 10) {
        setTestResults(prev => ({
          ...prev,
          [modelId]: { success: false, message: 'Введите корректный API ключ' }
        }));
        setTesting(prev => ({ ...prev, [modelId]: false }));
        return;
      }

      const modelName = modelId === 'gemini' 
        ? 'google/gemini-2.0-flash-exp:free'
        : 'meta-llama/llama-3.3-70b-instruct';

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Platform Test'
        },
        body: JSON.stringify({
          model: modelName,
          messages: [{ role: 'user', content: 'Привет! Ответь одним словом: работает?' }],
          max_tokens: 10
        })
      });

      if (response && response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          [modelId]: { 
            success: true, 
            message: '✅ API ключ работает! Модель ответила успешно.' 
          }
        }));
        toast.success(`${models.find(m => m.id === modelId)?.name} - тест пройден!`);
      } else {
        const errorData = await response?.json().catch(() => ({}));
        setTestResults(prev => ({
          ...prev,
          [modelId]: { 
            success: false, 
            message: `❌ Ошибка: ${errorData?.error?.message || 'Неверный API ключ'}` 
          }
        }));
        toast.error('Тест не пройден. Проверьте API ключ.');
      }
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [modelId]: { 
          success: false, 
          message: `❌ Ошибка подключения: ${error.message}` 
        }
      }));
      toast.error('Ошибка тестирования API');
    } finally {
      setTesting(prev => ({ ...prev, [modelId]: false }));
    }
  };

  return {
    configs,
    testing,
    testResults,
    loadApiKeys,
    handleToggle,
    handleSaveKey,
    handleUpdateApiKey,
    handleTestApi
  };
};