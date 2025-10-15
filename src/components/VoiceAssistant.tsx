import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VoiceAssistantProps {
  embedded?: boolean;
  onOpen?: () => void;
}

const VoiceAssistant = ({ embedded = false, onOpen }: VoiceAssistantProps) => {
  const [isOpen, setIsOpen] = useState(embedded);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (embedded) {
      setIsOpen(true);
    }
  }, [embedded]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setStatusMessage('Говорите...');
      
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      setStatusMessage('Ошибка доступа к микрофону');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setStatusMessage('Обрабатываю...');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const recognizeResponse = await fetch('https://functions.poehali.dev/51113e35-683f-4746-ad24-22a2726b7c2d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio })
        });
        
        const recognizeData = await recognizeResponse.json();
        
        if (recognizeData.success && recognizeData.text) {
          setStatusMessage(`Вы сказали: ${recognizeData.text}`);
          
          const responseText = await getAIResponse(recognizeData.text);
          await synthesizeSpeech(responseText);
        } else {
          setStatusMessage('Не удалось распознать речь');
          setIsProcessing(false);
        }
      };
      
    } catch (error) {
      console.error('Ошибка обработки аудио:', error);
      setStatusMessage('Ошибка обработки');
      setIsProcessing(false);
    }
  };

  const getAIResponse = async (userText: string): Promise<string> => {
    return `Вы сказали: ${userText}. Это тестовый ответ помощника аэропорта Пулково.`;
  };

  const synthesizeSpeech = async (text: string) => {
    try {
      setIsSpeaking(true);
      setStatusMessage('Отвечаю...');
      
      const synthesizeResponse = await fetch('https://functions.poehali.dev/4d515303-ee4e-424b-b220-ca432f3379a1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const synthesizeData = await synthesizeResponse.json();
      
      if (synthesizeData.success && synthesizeData.audio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(synthesizeData.audio), c => c.charCodeAt(0))],
          { type: 'audio/ogg' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsSpeaking(false);
          setIsProcessing(false);
          setStatusMessage('Нажмите для начала разговора');
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      } else {
        setIsSpeaking(false);
        setIsProcessing(false);
        setStatusMessage('Ошибка синтеза речи');
      }
      
    } catch (error) {
      console.error('Ошибка синтеза речи:', error);
      setIsSpeaking(false);
      setIsProcessing(false);
      setStatusMessage('Ошибка воспроизведения');
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isProcessing && !isSpeaking) {
      startRecording();
    }
  };

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
            <h3 className="text-white font-bold text-xl">Голосовой помощник Полёт</h3>
            {!embedded && (
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>
          <p className="text-white/90 text-sm">Yandex SpeechKit · Аэропорт Пулково</p>
        </div>

        <div className="p-6 bg-white/95 min-h-[400px] flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative inline-block">
              <button
                onClick={handleMicClick}
                disabled={isProcessing || isSpeaking}
                className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isRecording 
                    ? 'bg-red-500 animate-pulse' 
                    : isProcessing 
                    ? 'bg-yellow-500' 
                    : isSpeaking 
                    ? 'bg-blue-500 animate-pulse' 
                    : 'bg-green-500 hover:scale-105'
                } ${(isProcessing || isSpeaking) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Icon 
                  name={
                    isRecording ? 'Mic' : 
                    isProcessing ? 'Loader' : 
                    isSpeaking ? 'Volume2' : 
                    'Mic'
                  } 
                  size={64} 
                  className={`text-white ${isProcessing ? 'animate-spin' : ''}`} 
                />
              </button>
              {!isRecording && !isProcessing && !isSpeaking && (
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20 pointer-events-none"></div>
              )}
            </div>
            
            <p className="text-slate-700 text-lg font-semibold">
              {isRecording ? '🎤 Слушаю вас...' : 
               isProcessing ? '⏳ Обрабатываю...' : 
               isSpeaking ? '🔊 Отвечаю...' : 
               'Нажмите для начала разговора'}
            </p>

            {statusMessage && (
              <p className="text-slate-600 text-sm max-w-sm">
                {statusMessage}
              </p>
            )}

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-left max-w-sm mx-auto">
              <p className="text-slate-700 text-sm">
                Нажмите кнопку микрофона, задайте вопрос о парковках, транспорте или услугах аэропорта
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
        </div>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
