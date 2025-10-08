import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Language, getTranslations } from '@/lib/i18n';
import { useVoice } from '@/hooks/useVoice';
import { useChatLogic } from '@/components/chat/useChatLogic';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';

interface ChatInterfaceProps {
  onNavigateToAdmin?: () => void;
  language?: Language;
}

const ChatInterface = ({ onNavigateToAdmin, language = 'ru' }: ChatInterfaceProps) => {
  const [activeModel, setActiveModel] = useState('gemini');
  const { voiceEnabled, speak, toggleVoice } = useVoice();
  const t = getTranslations(language).chat;

  const availableModels = [
    { id: 'gemini', name: 'Скорость', icon: 'Sparkles', color: 'from-blue-500 to-cyan-500' },
    { id: 'llama', name: 'Логика', icon: 'Cpu', color: 'from-purple-500 to-pink-500' },
    { id: 'deepseek', name: 'Размышление', icon: 'Brain', color: 'from-violet-500 to-purple-500' },
    { id: 'qwen', name: 'Код', icon: 'Code', color: 'from-orange-500 to-red-500' },
    { id: 'mistral', name: 'Баланс', icon: 'Wind', color: 'from-cyan-500 to-blue-500' },
    { id: 'claude', name: 'Творчество', icon: 'BookOpen', color: 'from-amber-500 to-orange-500' },
  ];

  const {
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
  } = useChatLogic(activeModel, voiceEnabled, speak, t);

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-5xl">
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden">
          <ChatHeader
            title={t.title}
            subtitle={t.inputPlaceholder.includes('message') ? 'Your intelligent assistant' : 'Ваш умный помощник'}
            activeModel={activeModel}
            availableModels={availableModels}
            voiceEnabled={voiceEnabled}
            messagesCount={messages.length}
            translations={t}
            onModelChange={setActiveModel}
            onVoiceToggle={toggleVoice}
            onExport={exportChat}
            onClear={clearMessages}
            onPromptSelect={setInput}
            onNewChat={startNewChat}
          />

          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            translations={t}
            onCopyMessage={copyMessage}
            onNavigateToAdmin={onNavigateToAdmin}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            input={input}
            uploadedFiles={uploadedFiles}
            isLoading={isLoading}
            placeholder={t.inputPlaceholder}
            fileInputRef={fileInputRef}
            onInputChange={setInput}
            onSend={handleSend}
            onFileUpload={handleFileUpload}
            onFileRemove={removeFile}
            onFileButtonClick={() => fileInputRef.current?.click()}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;