import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

const OpenRouterChat = () => {
  const [message, setMessage] = useState('');
  const [model, setModel] = useState('anthropic/claude-3.5-sonnet');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const models = [
    { value: 'anthropic/claude-3.5-sonnet', label: 'Богдан ИИ' },
  ];

  useEffect(() => {
    if (chatHistory.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Введите сообщение');
      return;
    }

    setIsLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);

    try {
      const response = await fetch('https://functions.poehali.dev/67edc815-4794-4df2-a27f-1112e55549b7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
        setMessage('');
        toast.success('Ответ получен');
      } else {
        toast.error(data.error || 'Ошибка при отправке');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка соединения');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setMessage('');
    toast.success('История очищена');
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 shadow-xl h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Icon name="MessageSquare" size={24} />
          Чат с Богданом
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto border rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50 space-y-3"
        >
          {chatHistory.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <Icon name="Sparkles" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Начните диалог с Богданом</p>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white ml-12'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white mr-12'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1 opacity-75">
                    {msg.role === 'user' ? 'Вы' : 'Богдан'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        <div className="space-y-3">
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            placeholder="Введите ваше сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            onFocus={(e) => e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' })}
            className="min-h-[100px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </>
              )}
            </Button>
            <Button
              onClick={clearChat}
              variant="outline"
              disabled={chatHistory.length === 0}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenRouterChat;