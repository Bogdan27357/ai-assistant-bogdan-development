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
        setApiKeys(data.api_keys);
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

  const handleToggle = (modelId: string, enabled: boolean) => {
    const key = apiKeys.find(k => k.model_id === modelId);
    if (key) {
      saveApiKey(modelId, key.api_key, enabled);
    }
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
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Панель администратора</h1>
          <p className="text-slate-400">Управление API ключами для AI моделей</p>
        </div>

        <div className="space-y-4">
          {apiKeys.map(key => (
            <Card key={key.id} className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {modelNames[key.model_id] || key.model_id}
                  </h3>
                  <p className="text-sm text-slate-400">{key.model_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`switch-${key.model_id}`} className="text-slate-300">
                    {key.enabled ? 'Включено' : 'Выключено'}
                  </Label>
                  <Switch
                    id={`switch-${key.model_id}`}
                    checked={key.enabled}
                    onCheckedChange={checked => handleToggle(key.model_id, checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`key-${key.model_id}`} className="text-slate-300">
                  API ключ
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={`key-${key.model_id}`}
                    type="password"
                    value={key.api_key}
                    onChange={e => handleKeyChange(key.model_id, e.target.value)}
                    placeholder="Введите API ключ"
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                  <Button
                    onClick={() => saveApiKey(key.model_id, key.api_key, key.enabled)}
                    disabled={saving === key.model_id}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {saving === key.model_id ? (
                      <Icon name="Loader2" size={20} className="animate-spin" />
                    ) : (
                      <Icon name="Save" size={20} />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900/50 border-slate-700 p-6 mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Как получить API ключ OpenRouter</h3>
          <ol className="text-slate-300 space-y-2 list-decimal list-inside">
            <li>Перейдите на <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">openrouter.ai</a></li>
            <li>Зарегистрируйтесь через Google или GitHub</li>
            <li>Откройте раздел "Keys" в меню</li>
            <li>Создайте новый ключ</li>
            <li>Скопируйте и вставьте его в нужную модель выше</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;