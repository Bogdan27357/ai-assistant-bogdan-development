import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, name: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedModel(data.selected_model || 'openai/gpt-4o');
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      toast.error('Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          knowledge_base: knowledgeBase,
          selected_model: selectedModel,
        }),
      });
      
      const data = await response.json();
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} не является изображением`);
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          
          setUploadedImages(prev => [...prev, {
            url: base64,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Не удалось загрузить ${file.name}`);
      }
    }

    toast.success('Картинки загружены!');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL скопирован! Добавьте в базу знаний как ![название](URL)');
  };

  const insertImageToKnowledge = (url: string, name: string) => {
    const imageMarkdown = `\n\n![${name}](${url})\n`;
    setKnowledgeBase(prev => prev + imageMarkdown);
    toast.success('Картинка добавлена в базу знаний');
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Картинка удалена');
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="Settings" size={32} />
            Админ панель
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="Home" size={16} className="mr-2" />
              Главная
            </Button>
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
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Key" size={24} />
                  API Ключи
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
                    <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                      <Icon name="Info" size={16} />
                      Yandex SpeechKit API Key
                    </h4>
                    <p className="text-slate-300 text-sm mb-3">
                      Для работы озвучки ответов нужен API ключ от Yandex SpeechKit
                    </p>
                    <ol className="text-slate-400 text-xs space-y-1 mb-3">
                      <li>1. Откройте <a href="https://console.cloud.yandex.ru/folders/b1gfkd2baaso5298c7lt/speechkit" target="_blank" className="text-blue-400 underline">консоль Yandex Cloud</a></li>
                      <li>2. Создайте сервисный аккаунт и API ключ</li>
                      <li>3. Скопируйте ключ (формат: AQVN...)</li>
                      <li>4. Добавьте в секреты проекта как YANDEX_SPEECH_API_KEY</li>
                    </ol>
                    <Button
                      onClick={() => window.open('https://console.cloud.yandex.ru/', '_blank')}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Icon name="ExternalLink" size={14} className="mr-2" />
                      Открыть Yandex Cloud
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Bot" size={24} />
                  Модель ИИ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Выберите модель" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="anthropic/claude-3.5-sonnet">Anthropic: Claude 3.5 Sonnet</SelectItem>
                    <SelectItem value="anthropic/claude-3-opus">Anthropic: Claude 3 Opus</SelectItem>
                    <SelectItem value="anthropic/claude-3-sonnet">Anthropic: Claude 3 Sonnet</SelectItem>
                    <SelectItem value="openai/gpt-4o">OpenAI: GPT-4o</SelectItem>
                    <SelectItem value="openai/gpt-4o-mini">OpenAI: GPT-4o Mini</SelectItem>
                    <SelectItem value="openai/o1-mini">OpenAI: O1 Mini</SelectItem>
                    <SelectItem value="openai/o1-preview">OpenAI: O1 Preview</SelectItem>
                    <SelectItem value="google/gemini-pro-1.5">Google: Gemini Pro 1.5</SelectItem>
                    <SelectItem value="google/gemini-flash-1.5">Google: Gemini Flash 1.5</SelectItem>
                    <SelectItem value="x-ai/grok-beta">xAI: Grok Beta</SelectItem>
                    <SelectItem value="meta-llama/llama-3.1-8b-instruct">Meta: Llama 3.1 8B</SelectItem>
                    <SelectItem value="meta-llama/llama-3.1-70b-instruct">Meta: Llama 3.1 70B</SelectItem>
                    <SelectItem value="meta-llama/llama-3.1-405b-instruct">Meta: Llama 3.1 405B</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-400 mt-2">
                  Выберите модель ИИ для чата
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="MessageSquare" size={24} />
                  Системный промпт
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                  placeholder="Например: Ты менеджер по продажам. Будь дружелюбным, помогай клиентам выбрать подходящий продукт."
                />
                <p className="text-xs text-slate-400 mt-2">
                  Определяет характер и поведение ИИ
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="Image" size={24} />
                  Загрузка картинок
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузить картинки
                </Button>
                
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={img.url} 
                          alt={img.name}
                          className="w-full h-32 object-cover rounded-lg border border-slate-700"
                        />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => insertImageToKnowledge(img.url, img.name)}
                            className="text-xs"
                          >
                            <Icon name="Plus" size={14} className="mr-1" />
                            В базу знаний
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyImageUrl(img.url)}
                            className="text-white text-xs"
                          >
                            <Icon name="Copy" size={14} className="mr-1" />
                            Копировать URL
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeImage(idx)}
                            className="text-red-400 text-xs"
                          >
                            <Icon name="Trash2" size={14} />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate text-center">{img.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Icon name="BookOpen" size={24} />
                  База знаний
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white min-h-[300px] font-mono text-sm"
                  placeholder="Добавьте информацию и картинки в формате:&#10;&#10;# Наши продукты&#10;&#10;![Название](URL картинки)&#10;Описание продукта&#10;&#10;![Еще продукт](URL)&#10;Другое описание"
                />
                <p className="text-xs text-slate-400 mt-2">
                  ИИ использует эту информацию для ответов. Картинки добавляются в формате: ![название](URL)
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg"
            >
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;