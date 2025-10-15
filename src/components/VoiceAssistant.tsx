import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

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

const ELEVENLABS_API_KEY = 'sk_1e608b539cd4469d0eafdc4a2090cdf5e3f39967e83a76aa';

const VoiceAssistant = ({ agentId = 'agent_0801k7c6w3tne7atwjrk3xc066s3', embedded = false, onOpen }: VoiceAssistantProps) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [mode, setMode] = useState<'voice' | 'chat'>('voice');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
  }, [embedded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startConversation = async (isVoiceMode = true) => {
    try {
      setConversationStarted(true);
      
      if (isVoiceMode) {
        setStatusMessage('Запрашиваю доступ к микрофону...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000
          } 
        });
        mediaStreamRef.current = stream;
      }
      
      setStatusMessage('Подключаюсь к помощнику...');

      const ws = new WebSocket(
        `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket подключен');
        
        ws.send(JSON.stringify({
          type: 'conversation_initiation_client_data',
          conversation_config_override: {
            agent: {
              prompt: {
                prompt: 'Ты голосовой помощник аэропорта Пулково. Отвечай кратко и по делу на русском языке.'
              },
              language: 'ru',
              first_message: 'Здравствуйте! Чем могу помочь?'
            },
            tts: {
              voice_id: 'pNInz6obpgDQGcFmaJgB'
            }
          },
          custom_llm_extra_body: {
            xi_api_key: ELEVENLABS_API_KEY
          }
        }));
        
        setStatusMessage('Подключено!');
        
        if (isVoiceMode && mediaStreamRef.current) {
          setIsListening(true);
          audioContextRef.current = new AudioContext({ sampleRate: 16000 });
          const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
          const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);
          processorRef.current = processor;

          source.connect(processor);
          processor.connect(audioContextRef.current.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN && isListening) {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              
              for (let i = 0; i < inputData.length; i++) {
                const s = Math.max(-1, Math.min(1, inputData[i]));
                pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
              }
              
              const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
              ws.send(JSON.stringify({
                user_audio_chunk: base64Audio
              }));
            }
          };
        }
      };

      ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Получено:', data.type);
          
          if (data.type === 'agent_response' && data.agent_response_event?.agent_response) {
            const responseText = data.agent_response_event.agent_response;
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: responseText,
              timestamp: new Date()
            }]);
          }
          
          if (data.type === 'audio' && data.audio_event?.audio_base_64) {
            setIsSpeaking(true);
            setIsListening(false);
            
            const audioBase64 = data.audio_event.audio_base_64;
            const binaryString = atob(audioBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            const audioBlob = new Blob([bytes.buffer], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
              setIsSpeaking(false);
              if (mode === 'voice') {
                setIsListening(true);
              }
              URL.revokeObjectURL(audioUrl);
            };
            
            await audio.play();
          }
          
          if (data.type === 'interruption') {
            setIsListening(true);
            setIsSpeaking(false);
          }
        } catch (e) {
          console.error('Ошибка обработки сообщения:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('Ошибка WebSocket:', error);
        setStatusMessage('Ошибка подключения');
        setConversationStarted(false);
        setIsListening(false);
        setIsSpeaking(false);
      };

      ws.onclose = () => {
        console.log('WebSocket закрыт');
        setStatusMessage('Соединение закрыто');
        setConversationStarted(false);
        setIsListening(false);
        setIsSpeaking(false);
      };

    } catch (error) {
      console.error('Ошибка запуска:', error);
      setStatusMessage('Ошибка: ' + (error as Error).message);
      setConversationStarted(false);
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  const sendTextMessage = () => {
    if (!inputText.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    setMessages(prev => [...prev, {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    }]);

    wsRef.current.send(JSON.stringify({
      type: 'user_text_message',
      text: inputText
    }));

    setInputText('');
  };

  const stopConversation = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setConversationStarted(false);
    setIsListening(false);
    setIsSpeaking(false);
    setStatusMessage('');
    setMessages([]);
  };

  const switchMode = (newMode: 'voice' | 'chat') => {
    setMode(newMode);
    if (conversationStarted) {
      stopConversation();
    }
    if (newMode === 'voice') {
      startConversation(true);
    } else {
      startConversation(false);
    }
  };

  useEffect(() => {
    return () => {
      stopConversation();
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
          {!conversationStarted ? (
            <div className="text-center space-y-6 flex-1 flex flex-col items-center justify-center">
              <div className="relative inline-block">
                <div 
                  className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-shadow cursor-pointer hover:scale-105"
                  onClick={() => startConversation(mode === 'voice')}
                >
                  <Icon name={mode === 'voice' ? 'Mic' : 'MessageSquare'} size={64} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
              </div>
              
              <p className="text-slate-700 text-base max-w-sm font-semibold">
                {mode === 'voice' ? 'Нажмите для начала голосового разговора' : 'Нажмите для начала переписки'}
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
          ) : mode === 'voice' ? (
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
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[350px]">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Icon name="MessageCircle" size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Начните переписку</p>
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

              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendTextMessage()}
                  placeholder="Напишите сообщение..."
                  className="flex-1"
                  disabled={isSpeaking}
                />
                <Button
                  onClick={sendTextMessage}
                  disabled={!inputText.trim() || isSpeaking}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>

              {isSpeaking && (
                <div className="mt-2 text-center text-sm text-blue-600 animate-pulse">
                  🔊 Помощник отвечает...
                </div>
              )}

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
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
