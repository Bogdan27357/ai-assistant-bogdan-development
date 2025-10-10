import { useState } from 'react';
import { toast } from 'sonner';
import { saveApiKey, getApiKeys } from '@/lib/api';

interface ApiConfig {
  enabled: boolean;
  apiKey: string;
}

export const models = [
  { 
    id: 'imagerouter', 
    name: 'ImageRouter API', 
    provider: 'ImageRouter',
    icon: 'Video', 
    color: 'from-pink-500 to-rose-500',
    description: 'API для генерации видео (опционально)',
    status: 'OPTIONAL',
    features: ['11 видео-моделей', 'Veo 2/3', 'Kling v2.1', 'Hailuo-02'],
    apiDocsUrl: 'https://imagerouter.io'
  }
];

export const freeImageModels = [
  {
    id: 'flux',
    name: 'FLUX.1 Schnell',
    model: 'flux',
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-500',
    description: 'Быстрая генерация реалистичных изображений',
    features: ['Фотореализм', 'Скорость', 'Качество']
  },
  {
    id: 'flux-realism',
    name: 'FLUX Realism',
    model: 'flux-realism',
    icon: 'Camera',
    color: 'from-blue-500 to-cyan-500',
    description: 'Максимальный реализм и детализация',
    features: ['Фотографическое качество', 'Детали', 'Освещение']
  },
  {
    id: 'flux-anime',
    name: 'FLUX Anime',
    model: 'flux-anime',
    icon: 'Sparkles',
    color: 'from-pink-500 to-purple-500',
    description: 'Аниме и манга стиль',
    features: ['Аниме стиль', 'Персонажи', 'Яркие цвета']
  },
  {
    id: 'flux-3d',
    name: 'FLUX 3D',
    model: 'flux-3d',
    icon: 'Box',
    color: 'from-purple-500 to-indigo-500',
    description: '3D рендеринг и визуализация',
    features: ['3D стиль', 'Рендеринг', 'Объём']
  }
];

export const freeModels = [
  {
    id: 'qwen',
    name: 'Qwen 2.5 72B',
    model: 'qwen',
    icon: 'Code',
    color: 'from-orange-500 to-red-500',
    description: 'Универсальная мощная модель',
    features: ['Кодинг', 'Многоязычность', 'Длинный контекст']
  },
  {
    id: 'deepseek',
    name: 'DeepSeek R1',
    model: 'deepseek',
    icon: 'Brain',
    color: 'from-violet-500 to-purple-500',
    description: 'Продвинутая модель для сложных задач',
    features: ['Reasoning', 'Математика', 'Анализ']
  },
  {
    id: 'llama',
    name: 'Meta Llama 3.3 70B',
    model: 'llama',
    icon: 'Cpu',
    color: 'from-purple-500 to-pink-500',
    description: 'Мощная модель от Meta',
    features: ['Глубокий анализ', 'Reasoning', 'Инструкции']
  },
  {
    id: 'gemini',
    name: 'Google Gemma 2',
    model: 'gemini',
    icon: 'Sparkles',
    color: 'from-blue-500 to-cyan-500',
    description: 'Модель Google с балансом качества',
    features: ['Быстрые ответы', 'Точность', 'Эффективность']
  }
];

export const useApiKeyManagement = () => {
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    imagerouter: { enabled: false, apiKey: '' }
  });
  const [selectedModel, setSelectedModel] = useState('qwen');
  const [selectedImageModel, setSelectedImageModel] = useState('flux');
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});

  const loadApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      const newConfigs: Record<string, ApiConfig> = {
        imagerouter: { enabled: false, apiKey: '' }
      };
      
      keys.forEach(key => {
        newConfigs[key.model_id] = {
          enabled: key.enabled,
          apiKey: key.api_key || ''
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

      const modelName = 'meta-llama/llama-3.3-70b-instruct';

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
    selectedImageModel,
    setSelectedModel,
    setSelectedImageModel,
    loadApiKeys,
    handleToggle,
    handleSaveKey,
    handleUpdateApiKey,
    handleTestApi
  };
};