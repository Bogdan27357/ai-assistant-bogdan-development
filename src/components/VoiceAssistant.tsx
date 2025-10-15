import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Conversation } from '@11labs/client';

interface VoiceAssistantProps {
  agentId?: string;
  embedded?: boolean;
  onOpen?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant = ({ agentId = 'agent_0801k7c6w3tne7atwjrk3xc066s3', embedded = false, onOpen }: VoiceAssistantProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoadingKey, setIsLoadingKey] = useState(true);
  const [isOpen, setIsOpen] = useState(embedded);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mode, setMode] = useState<'voice' | 'chat'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  const conversationRef = useRef<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
    fetchApiKey();
  }, [embedded]);

  const fetchApiKey = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/65118fed-e2ff-445d-a81e-395ef4c07974');
      if (response.ok) {
        const data = await response.json();
        setApiKey(data.api_key || '');
      }
    } catch (error) {
      console.error('Ошибка загрузки API ключа:', error);
    } finally {
      setIsLoadingKey(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async () => {
    try {
      setConversationStarted(true);
      setStatusMessage('Подключаюсь к помощнику...');

      if (!apiKey) {
        setStatusMessage('API ключ не настроен');
        setConversationStarted(false);
        return;
      }

      const sessionConfig: any = {
        agentId: agentId,
        apiKey: apiKey,
        onConnect: () => {
          console.log('✅ Подключено к ElevenLabs');
          setStatusMessage('Подключено!');
          if (mode === 'voice') {
            setIsListening(true);
          }
        },
        onDisconnect: () => {
          console.log('Отключено');
          setStatusMessage('Соединение закрыто');
          setConversationStarted(false);
          setIsListening(false);
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.error('Ошибка разговора:', error);
          setStatusMessage('Ошибка: ' + error.message);
          setConversationStarted(false);
          setIsListening(false);
          setIsSpeaking(false);
        },
        onMessage: (message) => {
          console.log('Сообщение:', message);
          if (message.message) {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: message.message,
              timestamp: new Date()
            }]);
          }
        },
        onModeChange: (modeChange) => {
          console.log('Режим изменен:', modeChange.mode);
          if (modeChange.mode === 'speaking') {
            setIsSpeaking(true);
            setIsListening(false);
          } else if (modeChange.mode === 'listening') {
            setIsSpeaking(false);
            setIsListening(true);
          }
        },
      };

      if (mode === 'chat') {
        sessionConfig.clientTools = { mute: true };
      }

      const conversation = await Conversation.startSession(sessionConfig);

      conversationRef.current = conversation;

    } catch (error) {
      console.error('Ошибка запуска разговора:', error);
      const errorMessage = (error as Error).message || 'Неизвестная ошибка';
      setStatusMessage('Ошибка: ' + errorMessage);
      setConversationStarted(false);
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  const sendTextMessage = async (e?: any) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    
    if (!conversationRef.current) {
      await startConversation();
      if (!conversationRef.current) return;
    }

    setMessages(prev => [...prev, {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }]);

    const messageToSend = inputText;
    setInputText('');

    try {
      await conversationRef.current.sendTextInput(messageToSend);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Произошла ошибка при отправке сообщения',
        timestamp: new Date()
      }]);
    }
  };

  const stopConversation = async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }

    setConversationStarted(false);
    setIsListening(false);
    setIsSpeaking(false);
    setStatusMessage('');
    setMessages([]);
  };

  const switchMode = async (newMode: 'voice' | 'chat') => {
    const wasStarted = conversationStarted;
    if (wasStarted) {
      await stopConversation();
    }
    setMode(newMode);
    if (wasStarted) {
      await startConversation();
    }
  };

  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  if (!isOpen && !embedded) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          onOpen?.();
        }}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center hover:shadow-green-500/50 animate-pulse"
        title="Голосовой помощник"
      >
        <Icon name="Mic" size={28} />
      </button>
    );
  }

  if (!isOpen && embedded) {
    return null;
  }

  return (
    <div className={embedded ? 'w-full' : 'fixed bottom-8 right-8 z-50 w-[420px]'}>
      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 shadow-2xl overflow-hidden">
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-xl">Ваш помощник Полёт</h3>
            {!embedded && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  stopConversation();
                }}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
          <p className="text-white/90 text-sm mb-4">Голосовой ассистент аэропорта</p>
          
          <div className="flex gap-2">
            <button
              onClick={() => switchMode('voice')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'voice' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Icon name="Mic" size={16} className="inline mr-2" />
              Голос
            </button>
            <button
              onClick={() => switchMode('chat')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === 'chat' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Icon name="MessageSquare" size={16} className="inline mr-2" />
              Чат
            </button>
          </div>
        </div>

        <div className="p-6 bg-white/95 min-h-[400px] flex flex-col">
          {isLoadingKey ? (
            <div className="text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <Icon name="Loader" size={48} className="text-blue-500 animate-spin" />
              <p className="text-slate-600">Загрузка...</p>
            </div>
          ) : !apiKey ? (
            <div className="text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <Icon name="AlertCircle" size={48} className="text-red-500" />
              <p className="text-slate-700 font-semibold">API ключ не настроен</p>
              <p className="text-slate-500 text-sm">Обратитесь к администратору</p>
            </div>
          ) : !conversationStarted && mode === 'voice' ? (
            <div className="text-center space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="relative inline-block">
                <div 
                  className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-shadow cursor-pointer hover:scale-105"
                  onClick={startConversation}
                >
                  <Icon name="Mic" size={64} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
              </div>
              
              <p className="text-slate-700 text-base max-w-sm font-semibold">
                Нажмите для начала голосового разговора
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-left max-w-sm">
                <p className="text-slate-700 text-sm">
                  Добро пожаловать! Спросите о парковках, транспорте или услугах аэропорта Пулково.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="ParkingCircle" size={18} className="text-pink-500" />
                  <span>Парковка</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="Truck" size={18} className="text-orange-500" />
                  <span>Транспорт</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="LifeBuoy" size={18} className="text-blue-500" />
                  <span>Помощь</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="Briefcase" size={18} className="text-gray-500" />
                  <span>Услуги</span>
                </div>
              </div>
            </div>
          ) : conversationStarted && mode === 'voice' ? (
            <div className="text-center space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="relative inline-block">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isSpeaking ? 'bg-blue-500 animate-pulse' : isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                }`}>
                  <Icon name={isSpeaking ? "Volume2" : isListening ? "Mic" : "Loader"} size={64} className="text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-700 text-lg font-semibold">
                  {isSpeaking ? '🔊 Помощник говорит...' : isListening ? '🎤 Слушаю вас...' : '⏳ Обработка...'}
                </p>
                {statusMessage && (
                  <p className="text-slate-600 text-sm">
                    {statusMessage}
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={stopConversation}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 px-6"
                >
                  <Icon name="X" size={16} className="mr-2" />
                  Завершить разговор
                </Button>
              </div>
            </div>
          ) : mode === 'chat' ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[350px]">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Напишите сообщение для начала</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendTextMessage} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendTextMessage();
                    }
                  }}
                  placeholder="Напишите сообщение..."
                  className="flex-1"
                  disabled={isSpeaking}
                />
                <Button
                  type="submit"
                  disabled={!inputText.trim() || isSpeaking}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </form>

              {isSpeaking && (
                <div className="mt-2 text-center text-sm text-blue-600 animate-pulse">
                  🔊 Помощник отвечает...
                </div>
              )}

              {conversationStarted && (
                <div className="mt-3 text-center">
                  <Button
                    onClick={stopConversation}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Icon name="X" size={14} className="mr-1" />
                    Завершить
                  </Button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;