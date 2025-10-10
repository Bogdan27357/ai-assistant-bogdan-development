import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { setupDeepSeekKey } from '@/utils/setupKey';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  free: boolean;
  enabled: boolean;
}

interface ChatInterfaceProps {
  onNavigateAdmin?: () => void;
}

const ChatInterface = ({ onNavigateAdmin }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatUrl = 'https://functions.poehali.dev/2de7375b-0cb3-42d8-9542-1ad0bd90ad35';
  const historyUrl = 'https://functions.poehali.dev/199fa287-f2b3-4190-b276-d4a8f4ff80b3';

  useEffect(() => {
    setupDeepSeekKey().catch(console.error);
    loadModels();
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadModels = async () => {
    try {
      const response = await fetch(chatUrl);
      const data = await response.json();
      console.log('Loaded models from backend:', data.models);
      if (data.models) {
        setModels(data.models);
        const enabledModel = data.models.find((m: Model) => m.enabled);
        if (enabledModel) {
          setSelectedModel(enabledModel.id);
        }
      }
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${historyUrl}?session_id=${sessionId}`);
      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages.map((m: any) => ({
          role: m.role,
          content: m.content
        })));
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const saveMessage = async (role: string, content: string) => {
    try {
      await fetch(historyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          model_id: selectedModel,
          role,
          content
        })
      });
    } catch (err) {
      console.error('Failed to save message:', err);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${historyUrl}?session_id=${sessionId}`, {
        method: 'DELETE'
      });
      setMessages([]);
      toast.success('История очищена');
    } catch (err) {
      toast.error('Не удалось очистить историю');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    await saveMessage('user', input);
    
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          model_id: selectedModel
        })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: Message = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, aiMessage]);
        await saveMessage('assistant', data.response);
      } else {
        toast.error(data.error || 'Ошибка при отправке сообщения');
      }
    } catch (error) {
      toast.error('Не удалось отправить сообщение');
    } finally {
      setLoading(false);
    }
  };

  const enabledModels = models.filter(m => m.enabled);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pt-24">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">AI Чат</h1>
          <div className="flex gap-3">
            {enabledModels.length > 0 ? (
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-64 bg-slate-900 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {enabledModels.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.free && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Free</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Button
                onClick={onNavigateAdmin}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                <Icon name="Settings" size={20} className="mr-2" />
                Настроить API ключ
              </Button>
            )}
            <Button
              onClick={onNavigateAdmin}
              variant="outline"
              className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
              title="Настройки"
            >
              <Icon name="Settings" size={20} />
            </Button>
            <Button
              onClick={clearHistory}
              variant="outline"
              className="bg-slate-900 border-slate-700 text-white hover:bg-slate-800"
              title="Очистить историю"
            >
              <Icon name="Trash2" size={20} />
            </Button>
          </div>
        </div>

        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm p-4 mb-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Начните диалог с AI</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </Card>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Напишите сообщение..."
            className="bg-slate-900 border-slate-700 text-white resize-none"
            rows={3}
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? (
              <Icon name="Loader2" size={20} className="animate-spin" />
            ) : (
              <Icon name="Send" size={20} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;