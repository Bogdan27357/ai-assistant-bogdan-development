import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { sendMessageToAI, saveMessageToDB, generateSessionId } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp?: Date;
  attachments?: string[];
}

interface ChatInterfaceProps {
  onNavigateToAdmin?: () => void;
}

const ChatInterface = ({ onNavigateToAdmin }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [systemPrompt, setSystemPrompt] = useState('Ты Богдан - умный и дружелюбный помощник.');
  const [showSettings, setShowSettings] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const models = [
    { id: 'gemini', name: 'Основной помощник', icon: 'Sparkles', color: 'text-blue-400', fullName: 'Основной помощник' },
    { id: 'llama', name: 'Резервный помощник', icon: 'Cpu', color: 'text-purple-400', fullName: 'Резервный помощник' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map(f => f.name);
      toast.success(`Файлы загружены: ${fileNames.join(', ')}`);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      await saveMessageToDB(sessionId, activeModel, 'user', userInput);

      const aiResponse = await sendMessageToAI(activeModel as 'gemini' | 'llama' | 'gigachat', userInput, sessionId);

      const aiMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        model: activeModel
      };

      await saveMessageToDB(sessionId, activeModel, 'assistant', aiResponse);

      setMessages(prev => [...prev, aiMessage]);
      toast.success('Ответ получен!');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      
      let userFriendlyMessage = '';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('API ключи')) {
        userFriendlyMessage = '⚠️ API ключи не настроены.\n\n' +
          '📋 Инструкция:\n' +
          '1. Перейдите в "Админ-панель" (верхнее меню)\n' +
          '2. Откройте "Настройка API ключей"\n' +
          '3. Введите API ключ от Gemini, Llama или GigaChat\n' +
          '4. Включите модель и сохраните\n\n' +
          'После этого я смогу отвечать на ваши вопросы! 🚀';
        toast.error('Настройте API ключи в админ-панели');
      } else {
        userFriendlyMessage = `❌ Ошибка: ${errorMessage}\n\nПопробуйте:\n• Проверить подключение к интернету\n• Обновить страницу\n• Настроить API ключи в админ-панели`;
        toast.error(errorMessage);
      }
      
      const fallbackMessage: Message = {
        role: 'assistant',
        content: userFriendlyMessage,
        model: activeModel
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map(m => `[${m.role === 'user' ? 'Вы' : 'Богдан'}]: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success('Чат экспортирован!');
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Скопировано в буфер обмена!');
  };

  const regenerateResponse = async () => {
    if (messages.length < 2) return;
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) return;
    
    setMessages(prev => prev.filter(m => m !== messages[messages.length - 1]));
    setInput(lastUserMessage.content);
    await handleSend();
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Чат с Богданом</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChat}
                  className="border-slate-600 text-gray-400 hover:text-white"
                  disabled={messages.length === 0}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="border-slate-600 text-gray-400 hover:text-white"
                >
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessages([])}
                  className="border-slate-600 text-gray-400 hover:text-white"
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Очистить
                </Button>
              </div>
            </div>

            <Tabs value={activeModel} onValueChange={setActiveModel}>
              <TabsList className="bg-slate-800 border border-slate-700">
                {models.map(model => (
                  <TabsTrigger
                    key={model.id}
                    value={model.id}
                    className="data-[state=active]:bg-indigo-600"
                  >
                    <Icon name={model.icon as any} size={16} className={`mr-2 ${model.color}`} />
                    {model.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6">
                  <Icon name="MessageCircle" size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Начните беседу</h3>
                <p className="text-gray-400 max-w-md mb-6">
                  Выберите ИИ модель выше и задайте любой вопрос. Богдан готов помочь!
                </p>
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 max-w-md">
                  <div className="flex items-start gap-3 mb-3">
                    <Icon name="Info" size={20} className="text-amber-400 mt-0.5" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-amber-300 mb-1">Настройка API ключей</p>
                      <p className="text-xs text-amber-200/80 mb-3">
                        Для работы ИИ-помощника нужно настроить API ключи в админ-панели. 
                        Перейдите в раздел "Админ-панель" → "Настройка API ключей".
                      </p>
                      {onNavigateToAdmin && (
                        <Button
                          onClick={onNavigateToAdmin}
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          <Icon name="Settings" size={16} className="mr-2" />
                          Перейти к настройкам
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-slate-800 text-gray-100'
                    }`}
                  >
                    {message.role === 'assistant' && message.model && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
                        <Icon 
                          name={models.find(m => m.id === message.model)?.icon as any} 
                          size={14} 
                        />
                        <span>{models.find(m => m.id === message.model)?.name}</span>
                      </div>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                        {message.content.includes('API ключи не настроены') && onNavigateToAdmin && (
                          <Button
                            size="sm"
                            onClick={onNavigateToAdmin}
                            className="text-xs bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Icon name="Settings" size={14} className="mr-1" />
                            Настроить API
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyMessage(message.content)}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          <Icon name="Copy" size={14} className="mr-1" />
                          Копировать
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={regenerateResponse}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          <Icon name="RefreshCw" size={14} className="mr-1" />
                          Переделать
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-slate-700">
            {showSettings && (
              <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-4">
                <h3 className="text-white font-semibold mb-3">Расширенные настройки</h3>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Системный промпт
                  </label>
                  <Textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white text-sm"
                    rows={2}
                    placeholder="Введите инструкции для ИИ..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Температура: {temperature}
                    </label>
                    <Slider
                      value={[temperature]}
                      onValueChange={(v) => setTemperature(v[0])}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">
                      Макс. токенов: {maxTokens}
                    </label>
                    <Slider
                      value={[maxTokens]}
                      onValueChange={(v) => setMaxTokens(v[0])}
                      min={500}
                      max={4000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="mb-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Напиши код на Python')}
              >
                <Icon name="Code" size={14} className="mr-1" />
                Код
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Проанализируй этот текст')}
              >
                <Icon name="FileText" size={14} className="mr-1" />
                Анализ
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Переведи на английский')}
              >
                <Icon name="Languages" size={14} className="mr-1" />
                Перевод
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Создай креативный текст')}
              >
                <Icon name="Lightbulb" size={14} className="mr-1" />
                Креатив
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Объясни простыми словами')}
              >
                <Icon name="BookOpen" size={14} className="mr-1" />
                Объяснение
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Создай план проекта')}
              >
                <Icon name="List" size={14} className="mr-1" />
                План
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-gray-400 hover:text-white text-xs"
                onClick={() => setInput('Напиши email письмо')}
              >
                <Icon name="Mail" size={14} className="mr-1" />
                Email
              </Button>
            </div>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-600 text-gray-400 hover:text-white shrink-0"
              >
                <Icon name="Paperclip" size={20} />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Напишите сообщение... (Shift+Enter для новой строки)"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 min-h-[60px] resize-none"
                disabled={isLoading}
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0 h-[60px]"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;