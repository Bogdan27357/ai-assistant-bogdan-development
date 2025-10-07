import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { sendMessageToAI, saveMessageToDB, generateSessionId } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  const models = [
    { id: 'gemini', name: 'Основной помощник', icon: 'Sparkles', color: 'text-blue-400', fullName: 'Основной помощник' },
    { id: 'llama', name: 'Резервный помощник', icon: 'Cpu', color: 'text-purple-400', fullName: 'Резервный помощник' }
  ];

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = { role: 'user', content: input };
    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      toast.error(errorMessage);
      
      const fallbackMessage: Message = {
        role: 'assistant',
        content: `Ошибка: ${errorMessage}. Убедитесь, что API ключи настроены в админ-панели.`,
        model: activeModel
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white">Чат с Богданом</h2>
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
                <p className="text-gray-400 max-w-md">
                  Выберите ИИ модель выше и задайте любой вопрос. Богдан готов помочь!
                </p>
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
                    <p className="leading-relaxed">{message.content}</p>
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
          </div>

          <div className="p-6 border-t border-slate-700">
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
            </div>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className="bg-slate-800 border-slate-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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