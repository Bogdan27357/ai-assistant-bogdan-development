import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ApiKey {
  id: number;
  model_id: string;
  api_key: string;
  enabled: boolean;
}

const AdminPanel = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const getKeysUrl = 'https://functions.poehali.dev/ab69f8ed-fcb3-4e6e-b3c5-f5aeb6cb02f8';
  const saveKeyUrl = 'https://functions.poehali.dev/fd5aa99c-6c5c-41ad-a55a-96eb4f8bc75d';

  const modelNames: Record<string, string> = {
    gemini: 'Google Gemini 2.0 Flash',
    llama: 'Meta Llama 3.3 70B',
    qwen: 'Qwen 2.5 72B',
    deepseek: 'DeepSeek',
    gigachat: 'GigaChat',
    imagerouter: 'Image Router'
  };

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const response = await fetch(getKeysUrl);
      const data = await response.json();
      if (data.api_keys) {
        const chatModels = data.api_keys.filter((k: ApiKey) => ['gemini', 'llama', 'qwen'].includes(k.model_id));
        setApiKeys(chatModels.length > 0 ? chatModels : data.api_keys);
      }
    } catch (error) {
      toast.error('Не удалось загрузить API ключи');
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async (modelId: string, apiKey: string, enabled: boolean) => {
    setSaving(modelId);
    try {
      const response = await fetch(saveKeyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId, api_key: apiKey, enabled })
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('API ключ сохранен');
        loadApiKeys();
      } else {
        toast.error(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Не удалось сохранить ключ');
    } finally {
      setSaving(null);
    }
  };

  const handleKeyChange = (modelId: string, value: string) => {
    setApiKeys(prev =>
      prev.map(key =>
        key.model_id === modelId ? { ...key, api_key: value } : key
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pt-24">
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Настройка API ключей</h1>
          <p className="text-slate-400">Один ключ OpenRouter работает для всех моделей</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Как получить бесплатный API ключ OpenRouter</h3>
          <ol className="text-slate-300 space-y-2 list-decimal list-inside mb-6">
            <li>Перейдите на <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-semibold">openrouter.ai</a></li>
            <li>Зарегистрируйтесь через Google или GitHub</li>
            <li>Откройте раздел "Keys" в меню</li>
            <li>Создайте новый ключ</li>
            <li>Скопируйте и вставьте его в таблицу ниже</li>
          </ol>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left p-4 text-white font-semibold">Модель</th>
                  <th className="text-left p-4 text-white font-semibold">API Ключ</th>
                  <th className="text-center p-4 text-white font-semibold">Статус</th>
                  <th className="text-center p-4 text-white font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key, index) => (
                  <tr key={key.id} className={`border-t border-slate-700 ${index % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                    <td className="p-4">
                      <div className="text-white font-medium">{modelNames[key.model_id]}</div>
                      <div className="text-sm text-slate-400">{key.model_id}</div>
                    </td>
                    <td className="p-4">
                      <div className="relative max-w-md">
                        <Input
                          type={showKey[key.model_id] ? "text" : "password"}
                          value={key.api_key}
                          onChange={e => handleKeyChange(key.model_id, e.target.value)}
                          placeholder="sk-or-v1-xxxxxxxxxxxxxxxx"
                          className="bg-slate-800 border-slate-600 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(prev => ({ ...prev, [key.model_id]: !prev[key.model_id] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        >
                          <Icon name={showKey[key.model_id] ? "EyeOff" : "Eye"} size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={key.enabled}
                          onCheckedChange={checked => saveApiKey(key.model_id, key.api_key, checked)}
                        />
                        <span className={`text-sm font-medium ${key.enabled ? 'text-green-400' : 'text-slate-400'}`}>
                          {key.enabled ? 'Включено' : 'Выключено'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        onClick={() => saveApiKey(key.model_id, key.api_key, key.enabled)}
                        disabled={saving === key.model_id}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        size="sm"
                      >
                        {saving === key.model_id ? (
                          <Icon name="Loader2" size={16} className="animate-spin" />
                        ) : (
                          <>
                            <Icon name="Save" size={16} className="mr-2" />
                            Сохранить
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;