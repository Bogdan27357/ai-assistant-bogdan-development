import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ApiKey {
  id: number;
  model_id: string;
  api_key: string;
  enabled: boolean;
}

interface KnowledgeFile {
  id: number;
  filename: string;
  content: string;
  uploaded_at: string;
}

const AdminPanel = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [uploadingFile, setUploadingFile] = useState(false);
  
  const getKeysUrl = 'https://functions.poehali.dev/e03e0273-c62e-43a4-876d-1580d86866fa';
  const saveKeyUrl = 'https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437';
  const knowledgeUrl = 'https://functions.poehali.dev/527e87c2-0d3f-4667-8c3f-302faeb8cdf6';

  const modelNames: Record<string, string> = {
    mistral: 'Mistral Small 3 24B',
    gemini: 'Google Gemini Flash',
    llama: 'Meta Llama 3.1 8B',
    qwen: 'Qwen 2.5 7B',
    deepseek: 'DeepSeek Chat',
    'deepseek-r1t2': 'DeepSeek R1T2 Chimera 671B'
  };

  useEffect(() => {
    loadApiKeys();
    loadKnowledgeFiles();
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

  const loadKnowledgeFiles = async () => {
    try {
      const response = await fetch(knowledgeUrl);
      const data = await response.json();
      if (data.files) {
        setKnowledgeFiles(data.files);
      }
    } catch (error) {
      console.error('Failed to load knowledge files:', error);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFile(true);
    
    for (const file of Array.from(files)) {
      try {
        const content = await file.text();
        
        const response = await fetch(knowledgeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            content: content
          })
        });
        
        if (response.ok) {
          toast.success(`Файл ${file.name} добавлен в базу знаний`);
        } else {
          const data = await response.json();
          toast.error(data.error || `Ошибка загрузки ${file.name}`);
        }
      } catch (error) {
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }
    
    setUploadingFile(false);
    event.target.value = '';
    loadKnowledgeFiles();
  };

  const deleteFile = async (fileId: number) => {
    try {
      const response = await fetch(`${knowledgeUrl}?id=${fileId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Файл удален');
        loadKnowledgeFiles();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Ошибка удаления');
      }
    } catch (error) {
      toast.error('Не удалось удалить файл');
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
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Панель управления Богданом</h1>
          <p className="text-slate-400">Настройка AI моделей и базы знаний</p>
        </div>

        <Tabs defaultValue="models" className="w-full">
          <TabsList className="bg-slate-900 border-slate-700 mb-6">
            <TabsTrigger value="models" className="data-[state=active]:bg-indigo-600">
              <Icon name="Bot" size={18} className="mr-2" />
              AI Модели
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-indigo-600">
              <Icon name="FileText" size={18} className="mr-2" />
              База знаний
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models">
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
          </TabsContent>

          <TabsContent value="knowledge">
            <Card className="bg-slate-900/50 border-slate-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Загрузка файлов в базу знаний</h3>
              <p className="text-slate-300 mb-4">
                Загрузите текстовые файлы, чтобы Богдан мог использовать их для ответов. Поддерживаются форматы: .txt, .md, .json
              </p>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept=".txt,.md,.json"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="bg-slate-800 border-slate-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
                {uploadingFile && <Icon name="Loader2" size={20} className="animate-spin text-white" />}
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Загруженные файлы</h3>
                {knowledgeFiles.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Icon name="FolderOpen" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Файлы не загружены</p>
                    <p className="text-sm mt-2">Загрузите первый файл в базу знаний</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {knowledgeFiles.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon name="FileText" size={20} className="text-indigo-400" />
                          <div>
                            <div className="text-white font-medium">{file.filename}</div>
                            <div className="text-sm text-slate-400">{new Date(file.uploaded_at).toLocaleString('ru-RU')}</div>
                          </div>
                        </div>
                        <Button
                          onClick={() => deleteFile(file.id)}
                          variant="outline"
                          size="sm"
                          className="bg-red-900/20 border-red-700 text-red-400 hover:bg-red-900/40"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;