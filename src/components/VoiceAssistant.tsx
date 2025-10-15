import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VoiceAssistantProps {
  agentId?: string;
  embedded?: boolean;
  onOpen?: () => void;
}

const VoiceAssistant = ({ agentId = 'agent_0801k7c6w3tne7atwjrk3xc066s3', embedded = false, onOpen }: VoiceAssistantProps) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
  }, [embedded]);

  const startConversation = async () => {
    try {
      setConversationStarted(true);
      setStatusMessage('Подключаюсь...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);
      audioProcessorRef.current = processor;

      const ws = new WebSocket(`wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${agentId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatusMessage('Подключено! Говорите...');
        setIsListening(true);
        
        source.connect(processor);
        processor.connect(audioContextRef.current!.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcm16 = new Int16Array(inputData.length);
            
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            
            ws.send(JSON.stringify({
              user_audio_chunk: btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))
            }));
          }
        };
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'audio') {
          setIsSpeaking(true);
          setIsListening(false);
          
          const audioData = atob(data.audio);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }
          
          const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onended = () => {
            setIsSpeaking(false);
            setIsListening(true);
          };
          
          await audio.play();
        }
        
        if (data.type === 'interruption') {
          setIsListening(true);
          setIsSpeaking(false);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatusMessage('Ошибка подключения');
      };

      ws.onclose = () => {
        setStatusMessage('Соединение закрыто');
        stopConversation();
      };

    } catch (error) {
      console.error('Error starting conversation:', error);
      setStatusMessage('Ошибка доступа к микрофону');
      setConversationStarted(false);
    }
  };

  const stopConversation = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
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
          <p className="text-white/90 text-sm">Голосовой ассистент аэропорта</p>
        </div>

        <div className="p-6 bg-white/95 min-h-[400px] flex flex-col items-center justify-center">
          {!conversationStarted ? (
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div 
                  className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-shadow cursor-pointer"
                  onClick={startConversation}
                >
                  <Icon name="Mic" size={64} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
              </div>
              
              <p className="text-slate-700 text-base max-w-sm">
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
                  <Icon name={isSpeaking ? "Volume2" : isListening ? "Mic" : "MicOff"} size={64} className="text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-slate-700 text-lg font-semibold">
                  {isSpeaking ? 'Помощник говорит...' : isListening ? 'Слушаю вас...' : 'Обработка...'}
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
