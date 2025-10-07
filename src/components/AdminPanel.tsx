import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { saveApiKey, getApiKeys } from '@/lib/api';

interface ApiConfig {
  enabled: boolean;
  apiKey: string;
}

const AdminPanel = () => {
  const [configs, setConfigs] = useState<Record<string, ApiConfig>>({
    gemini: { enabled: true, apiKey: '' },
    llama: { enabled: true, apiKey: '' },
    gigachat: { enabled: true, apiKey: '' }
  });

  useEffect(() => {
    loadApiKeys();
  }, []);

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

  const models = [
    { 
      id: 'gemini', 
      name: 'Gemini 2.0 Flash Experimental', 
      provider: 'Google',
      icon: 'Sparkles', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Мультимодальная модель с поддержкой изображений, аудио и видео',
      status: 'FREE',
      features: ['Мультимодальность', 'Быстрая обработка', 'Длинный контекст', 'Бесплатно']
    },
    { 
      id: 'llama', 
      name: 'Llama 3.3 70B Instruct', 
      provider: 'Meta',
      icon: 'Cpu', 
      color: 'from-purple-500 to-pink-500',
      description: '70B параметров для сложных задач и глубокого анализа',
      status: 'FREE',
      features: ['Open Source', 'Reasoning', 'Инструкции', 'Бесплатно']
    },
    { 
      id: 'gigachat', 
      name: 'GigaChat', 
      provider: 'Сбербанк',
      icon: 'MessageSquare', 
      color: 'from-emerald-500 to-teal-500',
      description: 'Российская языковая модель с поддержкой русского языка',
      status: 'API',
      features: ['Русский язык', 'Локальные данные', 'Безопасность', 'API ключ']
    }
  ];

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

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">Админ-панель</h1>
          <p className="text-gray-400">Управление интеграциями и настройками платформы</p>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-indigo-600">
              <Icon name="Key" size={16} className="mr-2" />
              API Ключи
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            {models.map((model, index) => (
              <Card 
                key={model.id}
                className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Icon name={model.icon as any} size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{model.provider}</p>
                      <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
                      <p className="text-gray-400 text-xs mb-2">{model.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-gray-400">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{
                      background: model.status === 'FREE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                      color: model.status === 'FREE' ? '#10b981' : '#6366f1'
                    }}>
                      {model.status}
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor={`toggle-${model.id}`} className="text-sm text-gray-400">
                        {configs[model.id].enabled ? 'Включена' : 'Отключена'}
                      </Label>
                      <Switch
                        id={`toggle-${model.id}`}
                        checked={configs[model.id].enabled}
                        onCheckedChange={() => handleToggle(model.id)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`api-${model.id}`} className="text-white mb-2 block">
                      API Ключ
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id={`api-${model.id}`}
                        type="password"
                        value={configs[model.id].apiKey}
                        onChange={(e) => handleUpdateApiKey(model.id, e.target.value)}
                        placeholder="Введите API ключ..."
                        className="bg-slate-800 border-slate-700 text-white"
                        disabled={!configs[model.id].enabled}
                      />
                      <Button
                        onClick={() => handleSaveKey(model.id)}
                        disabled={!configs[model.id].enabled || !configs[model.id].apiKey}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Icon name="Save" size={18} className="mr-2" />
                        Сохранить
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${configs[model.id].enabled ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                    <span className="text-gray-400">
                      Статус: {configs[model.id].enabled ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">Общие настройки</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Автосохранение чата</h4>
                    <p className="text-sm text-gray-400">Сохранять историю переписки автоматически</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Темная тема</h4>
                    <p className="text-sm text-gray-400">Использовать темное оформление интерфейса</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Уведомления</h4>
                    <p className="text-sm text-gray-400">Получать уведомления о новых сообщениях</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border-indigo-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <Icon name="MessageSquare" size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Всего запросов</p>
                    <p className="text-3xl font-bold text-white">1,234</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Среднее время ответа</p>
                    <p className="text-3xl font-bold text-white">1.2с</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Точность ответов</p>
                    <p className="text-3xl font-bold text-white">98%</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;