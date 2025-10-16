import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OpenRouterChat = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string | { type: string; text?: string; image_url?: { url: string }; input_audio?: { data: string; format: string } }[] }>>([]);
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный ИИ-ассистент по имени Богдан.');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [preset, setPreset] = useState('default');
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedAudios, setUploadedAudios] = useState<Array<{ data: string; format: string; name: string }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const SETTINGS_API = 'https://functions.poehali.dev/c3585817-7caf-46b1-94b7-1c722a6f5748';

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (chatHistory.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const loadSettings = async () => {
    try {
      const response = await fetch(SETTINGS_API);
      const data = await response.json();
      setSystemPrompt(data.system_prompt || 'Ты полезный ИИ-ассистент по имени Богдан.');
      setKnowledgeBase(data.knowledge_base || '');
      setPreset(data.preset || 'default');
      setSelectedModel(data.selected_model || 'anthropic/claude-3.5-sonnet');
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Можно загружать только изображения');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setUploadedImages(prev => [...prev, base64]);
        toast.success('Изображение загружено');
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('audio/')) {
        toast.error('Можно загружать только аудиофайлы');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];
        const format = file.type.split('/')[1] || 'mp3';
        
        setUploadedAudios(prev => [...prev, { 
          data: base64Data, 
          format: format,
          name: file.name 
        }]);
        toast.success('Аудио загружено');
      };
      reader.readAsDataURL(file);
    });

    if (audioInputRef.current) {
      audioInputRef.current.value = '';
    }
  };

  const removeAudio = (index: number) => {
    setUploadedAudios(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          setUploadedAudios(prev => [...prev, {
            data: base64Data,
            format: 'webm',
            name: `Запись ${new Date().toLocaleTimeString()}`
          }]);
          toast.success('Голосовое сообщение записано');
        };
        reader.readAsDataURL(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Запись началась...');
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      toast.error('Не удалось получить доступ к микрофону');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() && uploadedImages.length === 0 && uploadedAudios.length === 0) {
      toast.error('Введите сообщение, загрузите изображение или аудио');
      return;
    }

    if (selectedModel.includes('audio') && uploadedAudios.length === 0) {
      toast.error('Эта модель работает только с аудио. Загрузите аудиофайл или запишите голосовое сообщение.');
      return;
    }

    setIsLoading(true);

    let userContent: string | Array<{ type: string; text?: string; image_url?: { url: string }; input_audio?: { data: string; format: string } }>;
    let messageToSend = message.trim();
    
    if (uploadedImages.length > 0 || uploadedAudios.length > 0) {
      const contentParts = [];
      
      if (messageToSend) {
        contentParts.push({ type: 'text', text: messageToSend });
      } else if (uploadedAudios.length > 0) {
        contentParts.push({ type: 'text', text: 'Послушай это аудио' });
        messageToSend = 'Послушай это аудио';
      }
      
      contentParts.push(...uploadedImages.map(img => ({ type: 'image_url', image_url: { url: img } })));
      contentParts.push(...uploadedAudios.map(audio => ({ type: 'input_audio', input_audio: { data: audio.data, format: audio.format } })));
      
      userContent = contentParts;
    } else {
      userContent = messageToSend;
    }

    setChatHistory(prev => [...prev, { role: 'user', content: userContent }]);

    try {
      const response = await fetch('https://functions.poehali.dev/fe95d04c-888f-4cda-9351-5728f7b8641a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          history: chatHistory,
          systemPrompt,
          knowledgeBase,
          preset,
          selectedModel,
        }),
      });

      const data = await response.json();

      if (data.response) {
        setChatHistory(prev => [...prev, { role: 'assistant', content: data.response }]);
        setMessage('');
        setUploadedImages([]);
        setUploadedAudios([]);
      } else {
        toast.error(data.error || 'Ошибка при отправке');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error('Ошибка соединения');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setMessage('');
    setUploadedImages([]);
    setUploadedAudios([]);
    toast.success('История очищена');
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 shadow-xl h-[600px] flex flex-col">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Icon name="MessageSquare" size={24} />
          Чат с Богданом
        </CardTitle>
        <div className="flex items-center gap-2">
          <Icon name="Bot" size={18} className="text-slate-600 dark:text-slate-400" />
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
              <SelectValue placeholder="Выберите модель" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
              <SelectItem value="anthropic/claude-3.5-sonnet" className="text-slate-900 dark:text-white">Anthropic: Claude 3.5 Sonnet</SelectItem>
              <SelectItem value="anthropic/claude-3-opus" className="text-slate-900 dark:text-white">Anthropic: Claude 3 Opus</SelectItem>
              <SelectItem value="anthropic/claude-3-haiku" className="text-slate-900 dark:text-white">Anthropic: Claude 3 Haiku</SelectItem>
              <SelectItem value="openai/gpt-4o" className="text-slate-900 dark:text-white">OpenAI: GPT-4o</SelectItem>
              <SelectItem value="openai/gpt-4o-mini" className="text-slate-900 dark:text-white">OpenAI: GPT-4o Mini</SelectItem>
              <SelectItem value="openai/gpt-4o-audio-preview" className="text-slate-900 dark:text-white">🎤 OpenAI: GPT-4o Audio</SelectItem>
              <SelectItem value="openai/o1-preview" className="text-slate-900 dark:text-white">OpenAI: o1-preview</SelectItem>
              <SelectItem value="openai/o1-mini" className="text-slate-900 dark:text-white">OpenAI: o1-mini</SelectItem>
              <SelectItem value="google/gemini-flash-1.5" className="text-slate-900 dark:text-white">Google: Gemini Flash 1.5</SelectItem>
              <SelectItem value="google/gemini-pro-1.5" className="text-slate-900 dark:text-white">Google: Gemini Pro 1.5</SelectItem>
              <SelectItem value="meta-llama/llama-3.1-405b-instruct" className="text-slate-900 dark:text-white">Meta: Llama 3.1 405B</SelectItem>
              <SelectItem value="meta-llama/llama-3.1-70b-instruct" className="text-slate-900 dark:text-white">Meta: Llama 3.1 70B</SelectItem>
              <SelectItem value="mistralai/mistral-large" className="text-slate-900 dark:text-white">Mistral: Mistral Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto border rounded-lg p-4 bg-slate-50 dark:bg-slate-900/50 space-y-3"
        >
          {chatHistory.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
              <Icon name="Sparkles" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Начните диалог с Богданом</p>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-500 text-white ml-12'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white mr-12'
                  }`}
                >
                  <div className="font-semibold text-xs mb-1 opacity-75">
                    {msg.role === 'user' ? 'Вы' : 'Богдан'}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {typeof msg.content === 'string' ? (
                      msg.content
                    ) : (
                      <div className="space-y-2">
                        {msg.content.map((item, idx) => (
                          <div key={idx}>
                            {item.type === 'text' && item.text}
                            {item.type === 'image_url' && item.image_url && (
                              <img 
                                src={item.image_url.url} 
                                alt="Uploaded" 
                                className="max-w-xs rounded-lg border border-white/20"
                              />
                            )}
                            {item.type === 'input_audio' && item.input_audio && (
                              <div className="flex items-center gap-2 bg-slate-700/50 p-2 rounded">
                                <Icon name="Music" size={16} />
                                <span className="text-xs">Аудио ({item.input_audio.format})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        <div className="space-y-3">
          {(uploadedImages.length > 0 || uploadedAudios.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((img, idx) => (
                <div key={`img-${idx}`} className="relative group">
                  <img 
                    src={img} 
                    alt={`Upload ${idx + 1}`} 
                    className="h-20 w-20 object-cover rounded-lg border border-slate-300 dark:border-slate-600"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
              {uploadedAudios.map((audio, idx) => (
                <div key={`audio-${idx}`} className="relative group">
                  <div className="h-20 w-32 flex flex-col items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-2">
                    <Icon name="Music" size={24} className="mb-1" />
                    <span className="text-xs truncate w-full text-center">{audio.name}</span>
                  </div>
                  <button
                    onClick={() => removeAudio(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <Textarea
            placeholder="Введите ваше сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}

            className="min-h-[100px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              multiple
              onChange={handleAudioUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              disabled={isLoading}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              <Icon name="Image" size={16} />
            </Button>
            <Button
              onClick={() => audioInputRef.current?.click()}
              variant="outline"
              disabled={isLoading || isRecording}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              title="Загрузить аудиофайл"
            >
              <Icon name="Music" size={16} />
            </Button>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'destructive' : 'outline'}
              disabled={isLoading}
              className={isRecording ? 'animate-pulse' : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'}
              title={isRecording ? 'Остановить запись' : 'Записать голосовое сообщение'}
            >
              <Icon name={isRecording ? 'MicOff' : 'Mic'} size={16} />
            </Button>
            <Button
              onClick={handleSend}
              disabled={isLoading || (!message.trim() && uploadedImages.length === 0 && uploadedAudios.length === 0)}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </>
              )}
            </Button>
            <Button
              onClick={clearChat}
              variant="outline"
              disabled={chatHistory.length === 0}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpenRouterChat;