import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { sendMessageToAI, saveMessageToDB, generateSessionId, uploadToKnowledgeBase, getChatHistory } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  files?: { name: string; type: string; size: number; content?: string }[];
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

export const useChatLogic = (
  activeModel: string,
  voiceEnabled: boolean,
  speak: (text: string) => Promise<void>,
  translations: any
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations;

  useEffect(() => {
    const initSession = async () => {
      const savedSessionId = localStorage.getItem('currentSessionId');
      let currentSessionId = savedSessionId;
      
      if (!currentSessionId) {
        currentSessionId = generateSessionId();
        localStorage.setItem('currentSessionId', currentSessionId);
      }
      
      setSessionId(currentSessionId);
      
      const history = await getChatHistory(currentSessionId);
      if (history.length > 0) {
        setMessages(history.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        })));
      }
    };
    
    initSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];

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
        
        await uploadToKnowledgeBase(file.name, content, file.type);
        
        toast.success(`Файл ${file.name} добавлен в базу знаний`);
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

    const emptyAiMessage: Message = {
      role: 'assistant',
      content: ''
    };
    setMessages(prev => [...prev, emptyAiMessage]);

    try {
      await saveMessageToDB(sessionId, activeModel, 'user', messageContent);
      
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const videoModels = ['veo-3-fast', 'kling-v2.1-standard', 'hailuo-02-standard'];
      const isVideoModel = videoModels.includes(activeModel);
      
      const result = await sendMessageToAI(
        activeModel as 'gemini' | 'llama' | 'deepseek' | 'qwen' | 'mistral' | 'claude' | 'auto' | 'gemini-vision' | 'llama-vision' | 'qwen-vision' | 'flux' | 'dalle' | 'veo-3-fast' | 'kling-v2.1-standard' | 'hailuo-02-standard', 
        userInput, 
        sessionId,
        uploadedFiles.length > 0 ? uploadedFiles : undefined,
        conversationHistory,
        isVideoModel ? undefined : (chunk: string) => {
          setMessages(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: updated[lastIndex].content + chunk
            };
            return updated;
          });
        }
      );

      if (activeModel === 'auto' && result.taskType) {
        toast.success(`🤖 ${result.taskType}`, { duration: 3000 });
      } else if (result.usedModel !== activeModel) {
        const modelNames: Record<string, string> = {
          gemini: 'Gemini Flash',
          'gemini-pro': 'Gemini Pro',
          'gemini-nano-banana': 'Gemini Nano Banana',
          llama: 'Llama 70B',
          deepseek: 'DeepSeek',
          qwen: 'Qwen 72B',
          mistral: 'Mistral Large',
          claude: 'Claude Sonnet'
        };
        toast.info(`Переключено на ${modelNames[result.usedModel]} (основная модель недоступна)`);
      }

      await saveMessageToDB(sessionId, result.usedModel, 'assistant', result.response);
      
      if (voiceEnabled) {
        await speak(result.response);
      }
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      
      let userFriendlyMessage = '';
      
      if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('free-models-per-day')) {
        userFriendlyMessage = '⚠️ Превышен лимит запросов на сегодня.\n\n' +
          '💡 Решения:\n' +
          '• Попробуйте другую модель в меню сверху\n' +
          '• Подождите немного и повторите попытку';
        toast.error('Лимит запросов исчерпан');
      } else if (errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage = '⚠️ Не удалось связаться с сервером.\n\n' +
          '💡 Решения:\n' +
          '• Проверьте подключение к интернету\n' +
          '• Попробуйте перезагрузить страницу';
        toast.error('Ошибка подключения');
      } else {
        userFriendlyMessage = `❌ Ошибка: ${errorMessage}\n\nПопробуйте:\n• Переключиться на другую модель\n• Обновить страницу`;
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

  const clearMessages = () => {
    setMessages([]);
  };
  
  const startNewChat = () => {
    const newSessionId = generateSessionId();
    localStorage.setItem('currentSessionId', newSessionId);
    setSessionId(newSessionId);
    setMessages([]);
    toast.success('Начат новый диалог');
  };

  return {
    messages,
    input,
    isLoading,
    uploadedFiles,
    messagesEndRef,
    fileInputRef,
    setInput,
    handleFileUpload,
    removeFile,
    handleSend,
    exportChat,
    copyMessage,
    clearMessages,
    startNewChat,
  };
};