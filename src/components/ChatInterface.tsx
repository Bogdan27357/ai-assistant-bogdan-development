import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
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
  const [activeModel, setActiveModel] = useState('auto');
  const { voiceEnabled, speak, toggleVoice } = useVoice();
  const t = getTranslations(language).chat;

  const availableModels = [
    { id: 'auto', name: 'Авто', icon: 'Wand2', color: 'from-gradient-start to-gradient-end', description: 'ИИ сам выберет лучшую модель для вашего запроса' },
    { id: 'gemini', name: 'Gemini', icon: 'Sparkles', color: 'from-blue-500 to-cyan-500', description: 'Google Gemini 2.0 Flash - быстрая и умная' },
    { id: 'deepseek', name: 'DeepSeek', icon: 'Brain', color: 'from-violet-500 to-purple-500', description: 'DeepSeek V3 - лучшая для кода и математики' },
    { id: 'claude', name: 'Claude', icon: 'BookOpen', color: 'from-amber-500 to-orange-500', description: 'Claude 3.5 Sonnet - творчество и анализ' },
    { id: 'llama', name: 'Llama', icon: 'Cpu', color: 'from-purple-500 to-pink-500', description: 'Meta Llama 3.3 70B - мощная логика' },
    { id: 'qwen', name: 'Qwen', icon: 'Code', color: 'from-orange-500 to-red-500', description: 'Qwen 2.5 72B - универсальная модель' },
    { id: 'mistral', name: 'Mistral', icon: 'Wind', color: 'from-cyan-500 to-blue-500', description: 'Mistral Large - европейский баланс' },
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
      <div className="container mx-auto max-w-5xl space-y-4">
        {/* Выбор AI модели */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Icon name="Cpu" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Выбор AI модели</h3>
                <p className="text-xs text-gray-400">Выберите модель или включите автовыбор</p>
              </div>
            </div>
            {activeModel === 'auto' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Icon name="Wand2" size={16} className="text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">Умный режим активен</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setActiveModel(model.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  activeModel === model.id
                    ? 'border-indigo-500 bg-indigo-500/20 scale-105'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
                title={model.description}
              >
                <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                  <Icon name={model.icon as any} size={16} className="text-white" />
                </div>
                <p className="text-xs font-semibold text-white text-center truncate">{model.name}</p>
                {activeModel === model.id && (
                  <Icon name="CheckCircle" size={14} className="text-indigo-400 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </Card>

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