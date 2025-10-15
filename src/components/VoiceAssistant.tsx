import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Conversation } from '@11labs/client';

interface VoiceAssistantProps {
  agentId?: string;
  embedded?: boolean;
  onOpen?: () => void;
}

const ELEVENLABS_API_KEY = 'sk_1e608b539cd4469d0eafdc4a2090cdf5e3f39967e83a76aa';

const VoiceAssistant = ({ agentId = 'agent_0801k7c6w3tne7atwjrk3xc066s3', embedded = false, onOpen }: VoiceAssistantProps) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const conversationRef = useRef<Conversation | null>(null);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
  }, [embedded]);

  const startConversation = async () => {
    try {
      setConversationStarted(true);
      setStatusMessage('Запрашиваю доступ к микрофону...');

      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setStatusMessage('Подключаюсь к помощнику...');

      const conversation = await Conversation.startSession({
        agentId: agentId,
        apiKey: ELEVENLABS_API_KEY,
        onConnect: () => {
          console.log('✅ Connected to ElevenLabs');
          setStatusMessage('Подключено! Говорите...');
          setIsListening(true);
        },
        onDisconnect: () => {
          console.log('Disconnected');
          setStatusMessage('Соединение закрыто');
          setConversationStarted(false);
          setIsListening(false);
          setIsSpeaking(false);
        },
        onError: (error) => {
          console.error('Conversation error:', error);
          setStatusMessage('Ошибка: ' + error.message);
          setConversationStarted(false);
          setIsListening(false);
          setIsSpeaking(false);
        },
        onModeChange: (mode) => {
          console.log('Mode changed:', mode.mode);
          if (mode.mode === 'speaking') {
            setIsSpeaking(true);
            setIsListening(false);
          } else if (mode.mode === 'listening') {
            setIsSpeaking(false);
            setIsListening(true);
          }
        },
      });

      conversationRef.current = conversation;

    } catch (error) {
      console.error('Error starting conversation:', error);
      const errorMessage = (error as Error).message || 'Неизвестная ошибка';
      setStatusMessage('Ошибка: ' + errorMessage);
      setConversationStarted(false);
      setIsListening(false);
      setIsSpeaking(false);
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
          <p className="text-white/90 text-sm">Голосовой ассистент аэропорта</p>
        </div>

        <div className="p-6 bg-white/95 min-h-[400px] flex flex-col items-center justify-center">
          {!conversationStarted ? (
            <div className="text-center space-y-6">
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
                Нажмите на микрофон для начала разговора
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
          ) : (
            <div className="text-center space-y-6 w-full">
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
          )}
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;