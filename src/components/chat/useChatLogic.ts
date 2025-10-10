import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { sendMessageToAI, generateSessionId } from '@/lib/api';

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
    const savedSessionId = localStorage.getItem('currentSessionId');
    let currentSessionId = savedSessionId;
    
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      localStorage.setItem('currentSessionId', currentSessionId);
    }
    
    setSessionId(currentSessionId);
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
        
        toast.success(`Файл ${file.name} загружен`);
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
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const result = await sendMessageToAI(
        activeModel as 'qwen' | 'deepseek' | 'llama' | 'gemini', 
        userInput, 
        sessionId,
        uploadedFiles.length > 0 ? uploadedFiles : undefined,
        conversationHistory,
        (chunk: string) => {
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
      
      if (voiceEnabled) {
        await speak(result.response);
      }
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка';
      console.error('Processed error message:', errorMessage);
      
      let userFriendlyMessage = '';
      
      if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('free-models-per-day')) {
        userFriendlyMessage = '⚠️ Превышен лимит запросов на сегодня.\n\n' +
          '💡 Решения:\n' +
          '• Попробуйте другую модель в меню сверху\n' +
          '• Подождите немного и повторите попытку';
        toast.error('Лимит запросов исчерпан');
      } else if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Network')) {
        userFriendlyMessage = '⚠️ Не удалось связаться с сервером.\n\n' +
          '💡 Решения:\n' +
          '• Проверьте подключение к интернету\n' +
          '• Попробуйте перезагрузить страницу';
        toast.error('Ошибка подключения');
      } else if (errorMessage.includes('API key') || errorMessage.includes('configured')) {
        userFriendlyMessage = '⚠️ Временная ошибка сервиса. Пожалуйста, попробуйте еще раз через несколько секунд.';
        toast.error('Попробуйте еще раз');
      } else {
        userFriendlyMessage = `❌ Ошибка: ${errorMessage}\n\nПопробуйте:\n• Обновить страницу\n• Повторить запрос`;
        toast.error('Произошла ошибка');
      }
      
      setMessages(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        updated[lastIndex] = {
          role: 'assistant',
          content: userFriendlyMessage
        };
        return updated;
      });
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