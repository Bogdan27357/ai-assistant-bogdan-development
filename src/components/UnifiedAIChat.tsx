import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type AIModel = 'yandex-gpt' | 'gigachat';

const AI_CONFIGS = {
  'yandex-gpt': {
    name: 'YandexGPT',
    url: 'https://functions.poehali.dev/f986b49c-0ef9-4d28-b758-94d0fd26052b',
    gradient: 'from-purple-600 to-indigo-600',
    hoverGradient: 'from-purple-700 to-indigo-700',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    )
  },
  'gigachat': {
    name: 'ГигаЧат',
    url: 'https://functions.poehali.dev/be992a8b-9252-4860-8bda-92bfa3e59d24',
    gradient: 'from-green-600 to-emerald-600',
    hoverGradient: 'from-green-700 to-emerald-700',
    logo: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  }
};

const UnifiedAIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('yandex-gpt');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentConfig = AI_CONFIGS[selectedModel];

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(currentConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ 
              role: m.role, 
              text: m.content,
              content: m.content 
            })),
            { role: 'user', text: inputText, content: inputText }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Ошибка API');
      }

      const data = await response.json();
      
      let assistantText = '';
      if (selectedModel === 'yandex-gpt') {
        assistantText = data.result?.alternatives?.[0]?.message?.text || 'Ошибка ответа';
      } else {
        assistantText = data.choices?.[0]?.message?.content || 'Ошибка ответа';
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantText
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(`Ошибка подключения к ${currentConfig.name}. Проверьте API ключ.`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (newModel: AIModel) => {
    setSelectedModel(newModel);
    setMessages([]);
    toast.success(`Переключено на ${AI_CONFIGS[newModel].name}`);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentConfig.gradient} hover:${currentConfig.hoverGradient} shadow-lg transition-all flex items-center justify-center`}
        >
          {currentConfig.logo}
        </Button>
      ) : (
        <div className="w-[420px] h-[650px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700">
          <div className={`flex flex-col p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r ${currentConfig.gradient} rounded-t-2xl`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {currentConfig.logo}
                <h3 className="font-semibold text-white">{currentConfig.name}</h3>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <Select value={selectedModel} onValueChange={(v) => handleModelChange(v as AIModel)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="yandex-gpt" className="text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                    YandexGPT
                  </div>
                </SelectItem>
                <SelectItem value="gigachat" className="text-white">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    ГигаЧат
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 dark:text-slate-400 mt-8">
                <div className="mb-2">{currentConfig.logo}</div>
                <p>Начните диалог с {currentConfig.name}</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? `bg-gradient-to-r ${currentConfig.gradient} text-white`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Напишите сообщение..."
                className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className={`bg-gradient-to-r ${currentConfig.gradient} hover:${currentConfig.hoverGradient}`}
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedAIChat;
