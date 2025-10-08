import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { sendMessageToAI, saveMessageToDB, generateSessionId } from '@/lib/api';
import { Language, getTranslations } from '@/lib/i18n';
import { useVoice } from '@/hooks/useVoice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  files?: { name: string; type: string; size: number; content?: string }[];
}

interface ChatInterfaceProps {
  onNavigateToAdmin?: () => void;
  language?: Language;
}

const ChatInterface = ({ onNavigateToAdmin, language = 'ru' }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeModel, setActiveModel] = useState('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; size: number; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voiceEnabled, selectedVoice, speak, toggleVoice, changeVoice } = useVoice();

  const t = getTranslations(language).chat;

  const availableModels = [
    { id: 'gemini', name: 'ИИ Скорость', icon: 'Zap', color: 'from-blue-500 to-cyan-500' },
    { id: 'llama', name: 'ИИ Логика', icon: 'Brain', color: 'from-purple-500 to-pink-500' },
    { id: 'deepseek', name: 'ИИ Код', icon: 'Code', color: 'from-violet-500 to-purple-500' },
  ];

  const currentModel = availableModels.find(m => m.id === activeModel) || availableModels[0];

  useEffect(() => {
    setSessionId(generateSessionId());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: { name: string; type: string; size: number; content: string }[] = [];

    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        const content = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          content: content
        });
        
        toast.success(`Файл ${file.name} добавлен`);
      } catch (error) {
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('Файл удален');
  };

  const handleSend = async () => {
    if ((!input.trim() && uploadedFiles.length === 0) || !sessionId) return;

    let messageContent = input;
    if (uploadedFiles.length > 0) {
      const filesInfo = uploadedFiles.map(f => `📎 ${f.name} (${(f.size / 1024).toFixed(1)}KB)`).join('\n');
      messageContent = `${input}\n\n${filesInfo}`;
    }

    const userMessage: Message = { 
      role: 'user', 
      content: messageContent,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined
    };
    const userInput = input;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      await saveMessageToDB(sessionId, activeModel, 'user', messageContent);
      const result = await sendMessageToAI(
        activeModel as 'gemini' | 'llama' | 'gigachat' | 'deepseek', 
        userInput, 
        sessionId,
        uploadedFiles.length > 0 ? uploadedFiles : undefined
      );

      // Уведомляем если модель переключилась автоматически
      if (result.usedModel !== activeModel) {
        const modelNames: Record<string, string> = {
          gemini: 'ИИ Скорость',
          llama: 'ИИ Логика',
          deepseek: 'ИИ Код'
        };
        toast.info(`Переключено на ${modelNames[result.usedModel]} (основная модель недоступна)`);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: result.response
      };

      await saveMessageToDB(sessionId, result.usedModel, 'assistant', result.response);
      setMessages(prev => [...prev, aiMessage]);
      
      if (voiceEnabled) {
        await speak(aiResponse);
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      
      let userFriendlyMessage = '';
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('API ключи')) {
        userFriendlyMessage = '⚠️ Для начала работы необходимо настроить API ключи.\n\n' +
          '📋 Перейдите в настройки (иконка ⚙️ в правом верхнем углу) и добавьте API ключ от одного из сервисов.\n\n' +
          'После настройки я смогу отвечать на ваши вопросы! 🚀';
        toast.error('Настройте API ключи в админ-панели');
      } else {
        userFriendlyMessage = `❌ Ошибка: ${errorMessage}\n\nПопробуйте:\n• Проверить подключение к интернету\n• Обновить страницу\n• Настроить API ключи`;
        toast.error(errorMessage);
      }
      
      const fallbackMessage: Message = {
        role: 'assistant',
        content: userFriendlyMessage
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map(m => `[${m.role === 'user' ? t.you : 'Богдан'}]: ${m.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    toast.success(t.chatExported);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success(t.copied);
  };

  const quickPrompts = [
    { icon: 'Code', text: t.inputPlaceholder.includes('message') ? 'Write Python code' : 'Напиши код на Python', prompt: t.inputPlaceholder.includes('message') ? 'Write Python code for...' : 'Напиши код на Python для...' },
    { icon: 'FileText', text: t.inputPlaceholder.includes('message') ? 'Analyze text' : 'Проанализируй текст', prompt: t.inputPlaceholder.includes('message') ? 'Analyze this text...' : 'Проанализируй этот текст...' },
    { icon: 'Languages', text: t.inputPlaceholder.includes('message') ? 'Translate' : 'Переведи', prompt: t.inputPlaceholder.includes('message') ? 'Translate to English...' : 'Переведи на английский...' },
    { icon: 'Lightbulb', text: t.inputPlaceholder.includes('message') ? 'Creative ideas' : 'Креативные идеи', prompt: t.inputPlaceholder.includes('message') ? 'Generate creative ideas for...' : 'Создай креативные идеи для...' },
  ];

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Icon name="MessageCircle" size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                  <p className="text-sm text-gray-400">{t.inputPlaceholder.includes('message') ? 'Your intelligent assistant' : 'Ваш умный помощник'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                    >
                      <Icon name={currentModel.icon as any} size={16} className="mr-2" />
                      {currentModel.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-700">
                    <DropdownMenuLabel className="text-gray-400">Выбрать модель ИИ</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    {availableModels.map((model) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => {
                          setActiveModel(model.id);
                          toast.success(`Переключено на ${model.name}`);
                        }}
                        className="text-white hover:bg-slate-800 cursor-pointer"
                      >
                        <Icon name={model.icon as any} size={16} className="mr-2" />
                        <span className={activeModel === model.id ? 'font-bold' : ''}>
                          {model.name}
                          {activeModel === model.id && ' ✓'}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                    >
                      <Icon name="Volume2" size={16} className="mr-2" />
                      {voiceEnabled ? (t.inputPlaceholder.includes('message') ? 'Voice On' : 'Озвучка вкл') : (t.inputPlaceholder.includes('message') ? 'Voice Off' : 'Озвучка выкл')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900 border-slate-700">
                    <DropdownMenuLabel className="text-gray-400">{t.inputPlaceholder.includes('message') ? 'Voice Settings' : 'Настройки озвучки'}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem onClick={toggleVoice} className="text-white hover:bg-slate-800 cursor-pointer">
                      <Icon name={voiceEnabled ? 'VolumeX' : 'Volume2'} size={16} className="mr-2" />
                      {voiceEnabled ? (t.inputPlaceholder.includes('message') ? 'Disable Voice' : 'Выключить озвучку') : (t.inputPlaceholder.includes('message') ? 'Enable Voice' : 'Включить озвучку')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportChat}
                  className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  disabled={messages.length === 0}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  {t.export}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMessages([])}
                  className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
                  disabled={messages.length === 0}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-slate-900/20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-2xl animate-scale-in">
                  <Icon name="Sparkles" size={48} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">{t.startConversation}</h3>
                <p className="text-gray-400 max-w-md text-lg">
                  {t.inputPlaceholder.includes('message') ? 'Ask me anything! I\'m here to help.' : 'Задайте любой вопрос! Я готов помочь.'}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
                  {quickPrompts.map((prompt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => setInput(prompt.prompt)}
                      className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700 justify-start"
                    >
                      <Icon name={prompt.icon as any} size={16} className="mr-2" />
                      {prompt.text}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-slate-800/80 text-gray-100 backdrop-blur-sm border border-slate-700/50'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                        {message.content.includes('API ключи') && onNavigateToAdmin && (
                          <Button
                            size="sm"
                            onClick={onNavigateToAdmin}
                            className="text-xs bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            <Icon name="Settings" size={14} className="mr-1" />
                            {t.inputPlaceholder.includes('message') ? 'Setup API' : 'Настроить'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyMessage(message.content)}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          <Icon name="Copy" size={14} className="mr-1" />
                          {t.inputPlaceholder.includes('message') ? 'Copy' : 'Копировать'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
            {uploadedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-gray-300">
                    <Icon name="FileText" size={16} />
                    <span>{file.name}</span>
                    <span className="text-gray-500">({(file.size / 1024).toFixed(1)}KB)</span>
                    <button onClick={() => removeFile(idx)} className="ml-2 text-red-400 hover:text-red-300">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx,.json,.csv"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                disabled={isLoading}
                className="border-slate-600 text-gray-300 hover:bg-slate-700 shrink-0 h-[60px]"
              >
                <Icon name="Paperclip" size={20} />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={t.inputPlaceholder}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 min-h-[60px] resize-none focus:border-indigo-500 transition-colors"
                disabled={isLoading}
                rows={2}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0 h-[60px] shadow-lg hover:shadow-xl transition-all"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;