import { useState } from 'react';
import { toast } from 'sonner';
import { saveApiKey, getApiKeys } from '@/lib/api';

interface ApiConfig {
  enabled: boolean;
  apiKey: string;
}

export const models = [
  { 
    id: 'openrouter', 
    name: 'OpenRouter API', 
    provider: 'OpenRouter',
    icon: 'Sparkles', 
    color: 'from-indigo-500 to-purple-500',
    description: 'Единый ключ для доступа ко всем платным AI моделям',
    status: 'PAID',
    features: ['Все модели', 'Pay-as-you-go', 'Без лимитов'],
    apiDocsUrl: 'https://openrouter.ai/keys'
  },
  { 
    id: 'gemini', 
    name: 'Google Gemini API', 
    provider: 'Google',
    icon: 'Sparkles', 
    color: 'from-blue-500 to-cyan-500',
    description: 'Бесплатный API от Google (Gemini 2.0 Flash)',
    status: 'FREE',
    features: ['60 запросов/минута', 'Бесплатно', 'Мультимодальность'],
    apiDocsUrl: 'https://aistudio.google.com/apikey'
  },
  { 
    id: 'openai', 
    name: 'OpenAI API', 
    provider: 'OpenAI',
    icon: 'Zap', 
    color: 'from-green-500 to-emerald-500',
    description: 'GPT-4o mini с бесплатным tier',
    status: 'FREE',
    features: ['Бесплатный tier', 'GPT-4o mini', 'Надёжная'],
    apiDocsUrl: 'https://platform.openai.com/api-keys'
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic API', 
    provider: 'Anthropic',
    icon: 'BookOpen', 
    color: 'from-amber-500 to-orange-500',
    description: 'Claude 3.5 Haiku - бесплатно',
    status: 'FREE',
    features: ['Бесплатный tier', 'Claude Haiku', 'Быстрая'],
    apiDocsUrl: 'https://console.anthropic.com/settings/keys'
  },
  { 
    id: 'groq', 
    name: 'Groq API', 
    provider: 'Groq',
    icon: 'Rocket', 
    color: 'from-purple-500 to-pink-500',
    description: 'Сверхбыстрые модели на Groq чипах',
    status: 'FREE',
    features: ['Очень быстро', 'Llama 3.3 70B', 'Mixtral 8x7B'],
    apiDocsUrl: 'https://console.groq.com/keys'
  }
];

export const freeModels = [
  {
    id: 'gemini',
    name: 'Google Gemini 2.0 Flash',
    model: 'google/gemini-2.0-flash-thinking-exp:free',
    icon: 'Sparkles',
    color: 'from-blue-500 to-cyan-500',
    description: 'Быстрый и точный помощник от Google',
    features: ['Быстрая обработка', 'Длинный контекст', 'Мультимодальность']
  },
  {
    id: 'llama',
    name: 'Meta Llama 3.3 70B',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    icon: 'Cpu',
    color: 'from-purple-500 to-pink-500',
    description: 'Мощная модель от Meta для аналитики',
    features: ['Глубокий анализ', 'Reasoning', 'Инструкции']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3',
    model: 'deepseek/deepseek-chat:free',
    icon: 'Brain',
    color: 'from-violet-500 to-purple-500',
    description: 'Продвинутая модель для сложных задач',
    features: ['Reasoning', 'Математика', 'Кодинг']
  },
  {
    id: 'qwen',
    name: 'Qwen 2.5 72B',
    model: 'qwen/qwen-2.5-72b-instruct:free',
    icon: 'Code',
    color: 'from-orange-500 to-red-500',
    description: 'Мощная модель с поддержкой кода',
    features: ['Кодинг', 'Многоязычность', 'Длинный контекст']
  },
  {
    id: 'mistral',
    name: 'Mistral Large',
    model: 'mistralai/mistral-large:free',
    icon: 'Wind',
    color: 'from-cyan-500 to-blue-500',
    description: 'Европейская модель с балансом качества',
    features: ['Баланс', 'Reasoning', 'Мультиязычность']
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    model: 'anthropic/claude-3.5-sonnet:free',
    icon: 'BookOpen',
    color: 'from-amber-500 to-orange-500',
    description: 'Качественный анализ и рассуждения',
    features: ['Творчество', 'Анализ', 'Длинный контекст']
  }
];

export const useApiKeyManagement = () => {
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    openrouter: { enabled: false, apiKey: '' },
    gemini: { enabled: false, apiKey: '' },
    openai: { enabled: false, apiKey: '' },
    anthropic: { enabled: false, apiKey: '' },
    groq: { enabled: false, apiKey: '' }
  });
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});

  const loadApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      const newConfigs: Record<string, ApiConfig> = {
        openrouter: { enabled: false, apiKey: '' },
        gemini: { enabled: false, apiKey: '' },
        openai: { enabled: false, apiKey: '' },
        anthropic: { enabled: false, apiKey: '' },
        groq: { enabled: false, apiKey: '' }
      };
      
      keys.forEach(key => {
        newConfigs[key.model_id] = {
          enabled: key.enabled,
          apiKey: ''
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

      const modelName = 'google/gemini-2.0-flash-thinking-exp:free';

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
    selectedModel,
    setSelectedModel,
    loadApiKeys,
    handleToggle,
    handleSaveKey,
    handleUpdateApiKey,
    handleTestApi
  };
};