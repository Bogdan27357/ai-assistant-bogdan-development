import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MarkdownMessage from '@/components/MarkdownMessage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  files?: { name: string; type: string; size: number; content?: string }[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  translations: any;
  onCopyMessage: (content: string) => void;
  onNavigateToAdmin?: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onPromptSelect?: (prompt: string) => void;
}

const ChatMessages = ({
  messages,
  isLoading,
  translations,
  onCopyMessage,
  onNavigateToAdmin,
  messagesEndRef,
  onPromptSelect,
}: ChatMessagesProps) => {
  const t = translations;

  const quickPrompts = [
    { icon: 'Code', text: 'Напиши код', prompt: 'Напиши код на Python для...', color: 'from-violet-500 to-purple-500' },
    { icon: 'FileText', text: 'Проанализируй', prompt: 'Проанализируй этот текст...', color: 'from-blue-500 to-cyan-500' },
    { icon: 'Languages', text: 'Переведи', prompt: 'Переведи на английский...', color: 'from-orange-500 to-red-500' },
    { icon: 'Lightbulb', text: 'Идеи', prompt: 'Сгенерируй креативные идеи для...', color: 'from-amber-500 to-orange-500' },
    { icon: 'Palette', text: 'Нарисуй', prompt: 'Нарисуй изображение: ', color: 'from-pink-500 to-rose-500' },
    { icon: 'Video', text: 'Видео', prompt: 'Создай видео: ', color: 'from-rose-500 to-pink-600' },
    { icon: 'Image', text: 'Опиши фото', prompt: 'Опиши что на этой картинке...', color: 'from-cyan-400 to-blue-500' },
    { icon: 'BookOpen', text: 'Объясни', prompt: 'Объясни простыми словами...', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div className="h-[400px] md:h-[600px] overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 bg-gradient-to-b from-transparent to-slate-900/20 scroll-smooth">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 md:mb-6 shadow-2xl animate-scale-in">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 animate-pulse opacity-50"></div>
            <Icon name="Sparkles" size={32} className="text-white relative z-10 md:w-12 md:h-12" />
          </div>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">{t.startConversation}</h3>
          <p className="text-gray-400 max-w-md text-sm md:text-lg">
            {t.inputPlaceholder.includes('message') ? 'Ask me anything! I\'m here to help.' : 'Задайте любой вопрос! Я готов помочь.'}
          </p>
          <div className="mt-4 md:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 max-w-4xl w-full px-4">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onPromptSelect?.(prompt.prompt)}
                className="group relative p-3 md:p-4 rounded-xl border-2 border-slate-700 bg-slate-800/50 hover:border-indigo-500 transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${prompt.color} flex items-center justify-center relative z-10`}>
                  <Icon name={prompt.icon as any} size={20} className="text-white md:w-6 md:h-6" />
                </div>
                <p className="text-xs md:text-sm font-semibold text-white text-center relative z-10">{prompt.text}</p>
              </button>
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
              className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-lg transition-all duration-300 hover:shadow-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                  : 'glass-effect text-gray-100'
              }`}
            >
              {message.role === 'assistant' ? (
                <MarkdownMessage content={message.content} />
              ) : (
                <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
              )}
              {message.role === 'assistant' && message.content && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyMessage(message.content)}
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
  );
};

export default ChatMessages;