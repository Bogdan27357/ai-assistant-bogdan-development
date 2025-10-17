import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const OpenRouterChat = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string | { type: string; text?: string; image_url?: { url: string } }[] }>>([]);
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный ИИ-ассистент по имени Богдан.');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [preset, setPreset] = useState('default');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const SETTINGS_API = 'https://functions.poehali.dev/c3585817-7caf-46b1-94b7-1c722a6f5748';

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadSettings = async () => {
    try {
      const response = await fetch(SETTINGS_API);
      const data = await response.json();
      setSystemPrompt(data.system_prompt || 'Ты полезный ИИ-ассистент по имени Богдан.');
      setKnowledgeBase(data.knowledge_base || '');
      setPreset(data.preset || 'default');
      setSelectedModel(data.selected_model || 'openai/gpt-4o');
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };







  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Введите сообщение');
      return;
    }

    setIsLoading(true);
    const messageToSend = message.trim();
    const newHistory = [...chatHistory, { role: 'user', content: messageToSend }];
    setChatHistory(newHistory);

    const limitedHistory = chatHistory.slice(-10);

    try {
      const response = await fetch('https://functions.poehali.dev/fe95d04c-888f-4cda-9351-5728f7b8641a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          history: limitedHistory,
          systemPrompt,
          knowledgeBase,
          preset,
          selectedModel,
        }),
      });

      const data = await response.json();

      if (data.response) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
        setMessage('');
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
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {typeof msg.content === 'string' ? (
                      msg.role === 'assistant' ? (
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            img: ({node, ...props}) => (
                              <img 
                                {...props} 
                                className="max-w-full rounded-lg my-2" 
                                loading="lazy"
                              />
                            ),
                            a: ({node, ...props}) => (
                              <a 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                              />
                            )
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )
                    ) : (
                      <div className="space-y-2">
                        {msg.content.map((item, idx) => (
                          <div key={idx}>
                            {item.type === 'text' && <div className="whitespace-pre-wrap">{item.text}</div>}
                            {item.type === 'image_url' && item.image_url && (
                              <img 
                                src={item.image_url.url} 
                                alt="Uploaded" 
                                className="max-w-xs rounded-lg border border-white/20"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        <div className="space-y-3">
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

            className="min-h-[100px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <Button
              onClick={clearChat}
              variant="outline"
              disabled={isLoading || chatHistory.length === 0}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              title="Очистить историю"
            >
              <Icon name="Trash2" size={16} />
            </Button>

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