import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const SPEECH_API_URL = 'https://functions.poehali.dev/46fb1993-e9c6-4d5e-b05a-d78aaa64113d';

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

interface UnifiedAIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnifiedAIChat = ({ isOpen, onClose }: UnifiedAIChatProps) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>('yandex-gpt');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentConfig = AI_CONFIGS[selectedModel];

  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputText('');
    }
  }, [isOpen]);

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

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || 'Ошибка API';
        throw new Error(errorMsg);
      }
      
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
      
      // Автоматическая озвучка отключена из-за возможных проблем с кодировкой
      // await playTextToSpeech(assistantText);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка подключения';
      
      if (errorMessage.includes('API key not configured')) {
        toast.error(`${currentConfig.name}: API ключ не настроен. Добавьте ключ в секреты проекта.`);
      } else {
        toast.error(`${currentConfig.name}: ${errorMessage}`);
      }
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
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
      toast.success('Запись голоса началась');
    } catch (error) {
      toast.error('Не удалось получить доступ к микрофону');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Запись остановлена, обработка...');
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const provider = selectedModel === 'yandex-gpt' ? 'yandex' : 'sber';
        const response = await fetch(SPEECH_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'stt',
            provider,
            audio: base64Audio
          })
        });
        
        if (!response.ok) {
          throw new Error('Ошибка распознавания речи');
        }
        
        const data = await response.json();
        const recognizedText = data.result || data.text || '';
        
        if (recognizedText) {
          setInputText(recognizedText);
          toast.success('Текст распознан!');
        } else {
          toast.error('Не удалось распознать речь');
        }
      };
    } catch (error) {
      toast.error('Ошибка при распознавании речи');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const playTextToSpeech = async (text: string) => {
    if (!text) return;
    
    setIsPlayingAudio(true);
    try {
      const provider = selectedModel === 'yandex-gpt' ? 'yandex' : 'sber';
      const response = await fetch(SPEECH_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'tts',
          provider,
          text
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка синтеза речи');
      }
      
      const data = await response.json();
      const audioBase64 = data.audio;
      
      if (audioBase64) {
        const audioBlob = base64ToBlob(audioBase64, 'audio/ogg');
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setIsPlayingAudio(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Ошибка воспроизведения:', error);
      setIsPlayingAudio(false);
    }
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-4xl h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700">
          <div className={`flex flex-col p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r ${currentConfig.gradient} rounded-t-2xl`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {currentConfig.logo}
                <h3 className="text-xl font-semibold text-white">{currentConfig.name}</h3>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={24} />
              </Button>
            </div>
            
            <Select value={selectedModel} onValueChange={(v) => handleModelChange(v as AIModel)}>
              <SelectTrigger className="bg-white/20 border-white/30 text-white w-64">
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

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 dark:text-slate-400 mt-16">
                <div className="mb-4 flex justify-center">{currentConfig.logo}</div>
                <p className="text-lg">Начните диалог с {currentConfig.name}</p>
                <p className="text-sm mt-2">Задайте любой вопрос или попросите помощи</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-lg ${
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
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant="outline"
                  size="icon"
                  className={isRecording ? 'border-red-500 text-red-500 animate-pulse' : ''}
                  disabled={isLoading}
                >
                  <Icon name={isRecording ? 'MicOff' : 'Mic'} size={20} />
                </Button>
                {isPlayingAudio && (
                  <Button
                    onClick={stopAudio}
                    variant="outline"
                    size="icon"
                  >
                    <Icon name="Volume2" size={20} />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-3">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Напишите сообщение или используйте голосовой ввод..."
                  className="flex-1 resize-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className={`bg-gradient-to-r ${currentConfig.gradient} hover:${currentConfig.hoverGradient} h-auto px-6`}
                >
                  <Icon name="Send" size={24} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedAIChat;