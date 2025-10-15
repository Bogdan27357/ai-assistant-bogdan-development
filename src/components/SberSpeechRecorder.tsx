import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const SberSpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
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
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success('Запись началась');
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      toast.error('Не удалось получить доступ к микрофону');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.info('Обработка записи...');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const response = await fetch('https://functions.poehali.dev/d018a504-6787-4f71-a330-3a07d40d05c3', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });
        
        const data = await response.json();
        
        if (data.success && data.text) {
          setRecognizedText(prev => [...prev, data.text]);
          toast.success('Текст распознан!');
        } else if (data.error) {
          if (data.error.includes('not configured')) {
            toast.error('Необходимо добавить SBER_SALUTE_SPEECH_TOKEN в секреты');
          } else {
            toast.error(`Ошибка: ${data.error}`);
          }
        }
        
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Ошибка обработки:', error);
      toast.error('Ошибка при распознавании речи');
      setIsProcessing(false);
    }
  };

  const clearHistory = () => {
    setRecognizedText([]);
    toast.success('История очищена');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="Mic" size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-xl">SberSpeech</h2>
                <p className="text-white/80 text-sm">Распознавание речи</p>
              </div>
            </div>
            {recognizedText.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                disabled={isRecording || isProcessing}
              >
                <Icon name="Trash2" size={18} />
              </Button>
            )}
          </div>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative mb-6">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
                  : 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
              }`}>
                <Icon name="Mic" size={48} className="text-white" />
              </div>
              {isRecording && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-full text-sm font-mono">
                  {formatTime(recordingTime)}
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg"
                >
                  <Icon name="Mic" size={24} className="mr-2" />
                  Начать запись
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg"
                >
                  <Icon name="Square" size={24} className="mr-2" />
                  Остановить
                </Button>
              )}
            </div>

            {isProcessing && (
              <div className="mt-4 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                <span>Распознавание речи...</span>
              </div>
            )}
          </div>

          {recognizedText.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Распознанный текст:
              </h3>
              {recognizedText.map((text, index) => (
                <div
                  key={index}
                  className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 flex-1 pt-1">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recognizedText.length === 0 && !isRecording && !isProcessing && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center">
                <Icon name="Volume2" size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Начните запись
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                Нажмите на кнопку и говорите. SberSpeech распознает вашу речь в текст.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SberSpeechRecorder;
