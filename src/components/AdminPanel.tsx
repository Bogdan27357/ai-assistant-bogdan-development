import { useState, useEffect, useRef } from 'react';
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
    llama: { enabled: true, apiKey: '' }
  });
  const [knowledgeFiles, setKnowledgeFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string } | null>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadApiKeys();
    loadKnowledgeFiles();
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

  const loadKnowledgeFiles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8');
      const data = await response.json();
      setKnowledgeFiles(data.files || []);
    } catch (error) {
      console.error('Ошибка загрузки файлов');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(',')[1];
              
              const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  file_name: file.name,
                  file_content: base64,
                  file_type: file.type || 'text/plain'
                })
              });
              
              if (response.ok) {
                toast.success(`Файл ${file.name} загружен`);
              }
              resolve(true);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch (error) {
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }
    
    setUploading(false);
    loadKnowledgeFiles();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await fetch(`https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8?id=${fileId}`, {
        method: 'DELETE'
      });
      toast.success('Файл удален');
      loadKnowledgeFiles();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const models = [
    { 
      id: 'gemini', 
      name: 'Модель A', 
      provider: 'Основной помощник',
      icon: 'Sparkles', 
      color: 'from-blue-500 to-cyan-500',
      description: 'Быстрый и точный помощник для большинства задач',
      status: 'FREE',
      features: ['Быстрая обработка', 'Длинный контекст', 'Бесплатно']
    },
    { 
      id: 'llama', 
      name: 'Модель B', 
      provider: 'Резервный помощник',
      icon: 'Cpu', 
      color: 'from-purple-500 to-pink-500',
      description: 'Мощный помощник для сложных аналитических задач',
      status: 'FREE',
      features: ['Глубокий анализ', 'Reasoning', 'Инструкции', 'Бесплатно']
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

      let response;
      if (modelId === 'gemini') {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Привет! Ответь одним словом: работает?' }] }]
          })
        });
      } else if (modelId === 'llama') {
        response = await fetch('https://api.together.xyz/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
            messages: [{ role: 'user', content: 'Привет! Ответь одним словом: работает?' }],
            max_tokens: 10
          })
        });
      }

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
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-indigo-600">
              <Icon name="FileUp" size={16} className="mr-2" />
              База знаний
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
                      <Button
                        onClick={() => handleTestApi(model.id)}
                        disabled={!configs[model.id].enabled || !configs[model.id].apiKey || testing[model.id]}
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:bg-slate-800"
                      >
                        {testing[model.id] ? (
                          <>
                            <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                            Тестирую...
                          </>
                        ) : (
                          <>
                            <Icon name="Play" size={18} className="mr-2" />
                            Тест
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {testResults[model.id] && (
                    <div className={`p-4 rounded-xl border ${
                      testResults[model.id]?.success 
                        ? 'bg-emerald-500/10 border-emerald-500/30' 
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <p className={`text-sm ${
                        testResults[model.id]?.success ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {testResults[model.id]?.message}
                      </p>
                    </div>
                  )}

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

          <TabsContent value="knowledge" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Icon name="FileUp" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">База знаний</h3>
                  <p className="text-gray-400 text-sm">Загружайте файлы для обучения помощника</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                    multiple 
                    accept=".txt,.pdf,.doc,.docx" 
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Icon name="Upload" size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-white font-semibold mb-2">{uploading ? 'Загрузка...' : 'Перетащите файлы сюда'}</p>
                    <p className="text-gray-400 text-sm mb-4">или нажмите для выбора</p>
                    <p className="text-xs text-gray-500">Поддерживаются: TXT, PDF, DOC, DOCX</p>
                  </label>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">Загруженные файлы ({knowledgeFiles.length})</h4>
                  {knowledgeFiles.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Файлы еще не загружены</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {knowledgeFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon name="FileText" size={20} className="text-indigo-400" />
                            <div>
                              <p className="text-white font-medium">{file.file_name}</p>
                              <p className="text-xs text-gray-500">
                                {(file.file_size / 1024).toFixed(2)} KB • {new Date(file.created_at).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Icon name="Trash2" size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
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