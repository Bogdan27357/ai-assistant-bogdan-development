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
  },
  { 
    id: 'gigachat', 
    name: 'GigaChat Pro', 
    provider: 'Sber',
    icon: 'Zap', 
    color: 'from-green-500 to-emerald-500',
    description: 'Российская нейросеть от Сбера для бизнеса и разработки',
    status: 'PAID',
    features: ['Русский язык', 'Специализация РФ', 'Безопасность'],
    apiDocsUrl: 'https://developers.sber.ru/docs/ru/gigachat/api/reference/rest/get-token'
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek V3.1', 
    provider: 'OpenRouter',
    icon: 'Brain', 
    color: 'from-violet-500 to-purple-500',
    description: 'Продвинутая модель DeepSeek для сложных задач через OpenRouter',
    status: 'FREE',
    features: ['Reasoning', 'Математика', 'Кодинг', 'Бесплатно'],
    apiDocsUrl: 'https://openrouter.ai/keys'
  }
];

export const useApiKeyManagement = () => {
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    gemini: { enabled: true, apiKey: '' },
    llama: { enabled: true, apiKey: '' },
    gigachat: { enabled: false, apiKey: '' },
    deepseek: { enabled: true, apiKey: '' }
  });
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});

  const loadApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      const newConfigs: Record<string, ApiConfig> = {
        gemini: { enabled: true, apiKey: '' },
        llama: { enabled: true, apiKey: '' },
        gigachat: { enabled: false, apiKey: '' },
        deepseek: { enabled: true, apiKey: '' }
      };
      
      keys.forEach(key => {
        newConfigs[key.model_id] = {
          enabled: key.enabled,
          apiKey: '' // Всегда пустое поле для безопасности
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
      // Отправляем пустую строку если нет ключа
      await saveApiKey(modelId, configs[modelId].apiKey || '', newEnabled);
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
      const currentKey = configs[modelId].apiKey;
      await saveApiKey(modelId, currentKey, configs[modelId].enabled);
      toast.success(`API ключ для ${models.find(m => m.id === modelId)?.name} сохранён`);
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
      const apiKey = configs[modelId].apiKey;
      
      if (!apiKey || apiKey.trim().length < 10) {
        setTestResults(prev => ({
          ...prev,
          [modelId]: { success: false, message: 'Введите API ключ (минимум 10 символов)' }
        }));
        setTesting(prev => ({ ...prev, [modelId]: false }));
        return;
      }

      const modelName = modelId === 'gemini' 
        ? 'google/gemini-2.0-flash-exp:free'
        : modelId === 'llama'
        ? 'meta-llama/llama-3.3-70b-instruct'
        : 'deepseek/deepseek-chat';

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
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        })
      });

      if (response && response.ok) {
        const data = await response.json();
        setTestResults(prev => ({
          ...prev,
          [modelId]: { 
            success: true, 
            message: '✅ API ключ работает! Тест пройден.' 
          }
        }));
        toast.success(`${models.find(m => m.id === modelId)?.name} - тест пройден!`);
      } else {
        const errorData = await response?.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `HTTP ${response?.status}`;
        setTestResults(prev => ({
          ...prev,
          [modelId]: { 
            success: false, 
            message: `❌ ${errorMsg}. Ключ можно сохранить, но он может не работать.` 
          }
        }));
        toast.error(`Тест не пройден: ${errorMsg}`);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Неизвестная ошибка';
      setTestResults(prev => ({
        ...prev,
        [modelId]: { 
          success: false, 
          message: `⚠️ ${errorMessage}. Возможно CORS блокировка браузера. Ключ можно сохранить - проверка будет на сервере.` 
        }
      }));
      toast.warning('Не удалось протестировать. Сохраните ключ - он будет проверен при использовании.');
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