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
}

const ChatMessages = ({
  messages,
  isLoading,
  translations,
  onCopyMessage,
  onNavigateToAdmin,
  messagesEndRef,
}: ChatMessagesProps) => {
  const t = translations;

  const quickPrompts = [
    { icon: 'Code', text: t.inputPlaceholder.includes('message') ? 'Write Python code' : 'Напиши код на Python', prompt: t.inputPlaceholder.includes('message') ? 'Write Python code for...' : 'Напиши код на Python для...' },
    { icon: 'FileText', text: t.inputPlaceholder.includes('message') ? 'Analyze text' : 'Проанализируй текст', prompt: t.inputPlaceholder.includes('message') ? 'Analyze this text...' : 'Проанализируй этот текст...' },
    { icon: 'Languages', text: t.inputPlaceholder.includes('message') ? 'Translate' : 'Переведи', prompt: t.inputPlaceholder.includes('message') ? 'Translate to English...' : 'Переведи на английский...' },
    { icon: 'Lightbulb', text: t.inputPlaceholder.includes('message') ? 'Creative ideas' : 'Креативные идеи', prompt: t.inputPlaceholder.includes('message') ? 'Generate creative ideas for...' : 'Создай креативные идеи для...' },
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
          <div className="mt-4 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-w-md w-full px-4">
            {quickPrompts.map((prompt, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => {}}
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