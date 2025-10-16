import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [preset, setPreset] = useState('default');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const SETTINGS_API = 'https://functions.poehali.dev/c3585817-7caf-46b1-94b7-1c722a6f5748';

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const storedSession = localStorage.getItem('adminSession');
    
    if (storedUser && storedSession) {
      const sessionTime = parseInt(storedSession);
      const currentTime = Date.now();
      const hourInMs = 60 * 60 * 1000;
      
      if (currentTime - sessionTime < 8 * hourInMs) {
        setAdminUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SETTINGS_API);
      const data = await response.json();
      
      setSystemPrompt(data.system_prompt || '');
      setKnowledgeBase(data.knowledge_base || '');
      setPreset(data.preset || 'default');
      setSelectedModel(data.model || 'anthropic/claude-3.5-sonnet');
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      toast.error('Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    console.log('saveSettings called with:', { systemPrompt, knowledgeBase, preset, selectedModel });
    try {
      setIsSaving(true);
      const payload = {
        system_prompt: systemPrompt,
        knowledge_base: knowledgeBase,
        preset: preset,
        selected_model: selectedModel
      };
      console.log('Sending to API:', payload);
      
      const response = await fetch(SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        toast.success('Настройки сохранены');
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Не удалось сохранить настройки');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    setAdminUser(null);
    setIsAuthenticated(false);
    toast.success('Вы вышли из системы');
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pt-24">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель управления</h1>
<p className="text-slate-400">Настройки ИИ-ассистента Богдан</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-green-400" />
              <div>
                <span className="text-sm text-green-400 font-semibold block">Админ-режим</span>
                <span className="text-xs text-slate-400">{adminUser?.email}</span>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Icon name="Loader2" size={48} className="text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">Загрузка настроек...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Настройки ИИ</CardTitle>
                <CardDescription className="text-slate-400">
                  Управление поведением и параметрами чат-бота Богдан
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="preset" className="text-slate-300">
                    <Icon name="Sparkles" size={16} className="inline mr-2" />
                    Пресет
                  </Label>
                  <Select value={preset} onValueChange={setPreset}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Выберите пресет" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="default" className="text-white">По умолчанию</SelectItem>
                      <SelectItem value="creative" className="text-white">Креативный</SelectItem>
                      <SelectItem value="precise" className="text-white">Точный</SelectItem>
                      <SelectItem value="friendly" className="text-white">Дружелюбный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Icon name="Bot" size={16} />
                    Модель ИИ
                  </Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Выберите модель" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="anthropic/claude-3.5-sonnet">
                        Anthropic: Claude 3.5 Sonnet
                      </SelectItem>
                      <SelectItem value="anthropic/claude-3-opus">
                        Anthropic: Claude 3 Opus
                      </SelectItem>
                      <SelectItem value="anthropic/claude-3-haiku">
                        Anthropic: Claude 3 Haiku
                      </SelectItem>
                      <SelectItem value="openai/gpt-4o">
                        OpenAI: GPT-4o
                      </SelectItem>
                      <SelectItem value="openai/gpt-4o-mini">
                        OpenAI: GPT-4o Mini
                      </SelectItem>
                      <SelectItem value="openai/gpt-4o-audio-preview">
                        🎤 OpenAI: GPT-4o Audio Preview
                      </SelectItem>
                      <SelectItem value="openai/o1-preview">
                        OpenAI: o1-preview
                      </SelectItem>
                      <SelectItem value="openai/o1-mini">
                        OpenAI: o1-mini
                      </SelectItem>
                      <SelectItem value="google/gemini-flash-1.5">
                        Google: Gemini Flash 1.5
                      </SelectItem>
                      <SelectItem value="google/gemini-pro-1.5">
                        Google: Gemini Pro 1.5
                      </SelectItem>
                      <SelectItem value="meta-llama/llama-3.1-405b-instruct">
                        Meta: Llama 3.1 405B
                      </SelectItem>
                      <SelectItem value="meta-llama/llama-3.1-70b-instruct">
                        Meta: Llama 3.1 70B
                      </SelectItem>
                      <SelectItem value="mistralai/mistral-large">
                        Mistral: Mistral Large
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedModel && (
                    <p className="text-xs text-slate-400">
                      {selectedModel.includes('audio') && '🎤 Поддерживает голосовые сообщения'}
                      {selectedModel.includes('claude') && !selectedModel.includes('audio') && 'Высокое качество ответов'}
                      {selectedModel.includes('gpt-4o') && !selectedModel.includes('audio') && 'Универсальная модель OpenAI'}
                      {selectedModel.includes('gemini') && 'Быстрая модель Google'}
                      {selectedModel.includes('llama') && 'Открытая модель Meta'}
                      {selectedModel.includes('o1') && 'Модель с улучшенным рассуждением'}
                      {selectedModel.includes('mistral') && 'Мощная европейская модель'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt" className="text-slate-300">
                    <Icon name="MessageSquare" size={16} className="inline mr-2" />
                    Системный промпт
                  </Label>
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                    placeholder="Введите системный промпт..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="knowledgeBase" className="text-slate-300">
                    <Icon name="BookOpen" size={16} className="inline mr-2" />
                    База знаний
                  </Label>
                  <Textarea
                    id="knowledgeBase"
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-[200px]"
                    placeholder="Введите контекст и дополнительные знания для ИИ..."
                  />
                </div>

                <Button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить настройки
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  <Icon name="Info" size={20} className="inline mr-2" />
                  Справка
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400 space-y-2">
                <p>• <strong className="text-slate-300">Пресет</strong> - готовый набор настроек для разных сценариев использования</p>
                <p>• <strong className="text-slate-300">Системный промпт</strong> - инструкции для ИИ о том, как он должен себя вести</p>
                <p>• <strong className="text-slate-300">База знаний</strong> - дополнительный контекст и информация для ответов ИИ</p>
                <p className="mt-4 text-green-400">✅ Настройки синхронизируются между всеми устройствами</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;