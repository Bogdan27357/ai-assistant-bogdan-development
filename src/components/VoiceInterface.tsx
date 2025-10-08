import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

const VoiceInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('ru-RU');
  const [speechRate, setSpeechRate] = useState([1]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedVoice;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Ошибка распознавания речи');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = synthRef.current?.getVoices() || [];
        setAvailableVoices(voices);
      };

      loadVoices();
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [selectedVoice]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      recognitionRef.current.lang = selectedVoice;
      recognitionRef.current.start();
      setIsListening(true);
      toast.success('Слушаю...');
    } else {
      toast.error('Браузер не поддерживает распознавание речи');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      if (transcript.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: transcript,
          timestamp: new Date(),
          isUser: true
        };
        setMessages(prev => [...prev, newMessage]);
        
        setTimeout(() => {
          const aiResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: `Я услышал: "${transcript}". Это демо режим голосового интерфейса.`,
            timestamp: new Date(),
            isUser: false
          };
          setMessages(prev => [...prev, aiResponse]);
          speakText(aiResponse.text);
        }, 1000);
      }
      
      setTranscript('');
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedVoice;
      utterance.rate = speechRate[0];
      utterance.pitch = pitch[0];
      utterance.volume = volume[0];

      const voices = synthRef.current.getVoices();
      const selectedVoiceObj = voices.find(v => v.lang === selectedVoice);
      if (selectedVoiceObj) {
        utterance.voice = selectedVoiceObj;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast.error('Ошибка озвучивания');
      };

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    toast.success('История очищена');
  };

  const languages = [
    { code: 'ru-RU', name: '🇷🇺 Русский' },
    { code: 'en-US', name: '🇺🇸 English' },
    { code: 'es-ES', name: '🇪🇸 Español' },
    { code: 'fr-FR', name: '🇫🇷 Français' },
    { code: 'de-DE', name: '🇩🇪 Deutsch' },
    { code: 'it-IT', name: '🇮🇹 Italiano' },
    { code: 'ja-JP', name: '🇯🇵 日本語' },
    { code: 'zh-CN', name: '🇨🇳 中文' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon name="Mic" size={40} className="text-indigo-400" />
            Голосовой интерфейс
          </h1>
          <p className="text-slate-400">Говорите с AI используя голос</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <Tabs defaultValue="voice" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                  <TabsTrigger value="voice">Голосовой ввод</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="voice" className="space-y-6 mt-6">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <button
                        onClick={isListening ? stopListening : startListening}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isListening
                            ? 'bg-gradient-to-br from-red-500 to-pink-500 animate-pulse shadow-lg shadow-red-500/50'
                            : 'bg-gradient-to-br from-indigo-500 to-purple-500 hover:shadow-lg hover:shadow-indigo-500/50'
                        }`}
                      >
                        <Icon 
                          name={isListening ? "MicOff" : "Mic"} 
                          size={48} 
                          className="text-white" 
                        />
                      </button>
                      {isListening && (
                        <div className="absolute -inset-4 border-4 border-red-500 rounded-full animate-ping opacity-20" />
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold text-white mb-2">
                        {isListening ? '🎤 Слушаю...' : '🎙️ Нажмите для записи'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {isListening ? 'Говорите четко и ясно' : 'Кликните на микрофон чтобы начать'}
                      </p>
                    </div>

                    {transcript && (
                      <div className="w-full bg-slate-800 rounded-lg p-4 border border-indigo-500/30">
                        <p className="text-sm text-slate-400 mb-2">Распознанный текст:</p>
                        <p className="text-white">{transcript}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        onClick={() => speakText('Привет! Это тест голосового вывода.')}
                        disabled={isSpeaking}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Icon name="Volume2" size={16} className="mr-2" />
                        Тест озвучки
                      </Button>
                      
                      {isSpeaking && (
                        <Button
                          onClick={stopSpeaking}
                          variant="destructive"
                        >
                          <Icon name="VolumeX" size={16} className="mr-2" />
                          Остановить
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Язык</label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {languages.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Скорость речи: {speechRate[0].toFixed(1)}x
                    </label>
                    <Slider
                      value={speechRate}
                      onValueChange={setSpeechRate}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Высота тона: {pitch[0].toFixed(1)}
                    </label>
                    <Slider
                      value={pitch}
                      onValueChange={setPitch}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Громкость: {Math.round(volume[0] * 100)}%
                    </label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">История диалогов</h3>
                {messages.length > 0 && (
                  <Button onClick={clearMessages} variant="outline" size="sm">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Очистить
                  </Button>
                )}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="MessageSquare" size={48} className="text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">Пока нет сообщений</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md p-4 rounded-lg ${
                          msg.isUser
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p className="text-xs opacity-70 mt-2">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                        {!msg.isUser && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakText(msg.text)}
                            className="mt-2 h-8 text-xs"
                          >
                            <Icon name="Volume2" size={14} className="mr-1" />
                            Озвучить
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Info" size={20} className="text-indigo-400" />
                О функции
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>✅ Распознавание речи на 8+ языках</p>
                <p>✅ Озвучивание ответов</p>
                <p>✅ Настройка голоса (скорость, тон, громкость)</p>
                <p>✅ История диалогов</p>
                <p>✅ Поддержка Chrome, Edge, Safari</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30 p-6">
              <h3 className="text-lg font-bold text-white mb-3">💡 Советы</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Говорите четко и не слишком быстро</li>
                <li>• Используйте наушники для лучшего качества</li>
                <li>• Минимизируйте фоновый шум</li>
                <li>• Держите микрофон на расстоянии 15-30 см</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
