import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Language, getTranslations } from '@/lib/i18n';
import { useVoice } from '@/hooks/useVoice';
import { useChatLogic } from '@/components/chat/useChatLogic';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatInput from '@/components/chat/ChatInput';
import AICapabilities from '@/components/chat/AICapabilities';
import PromptExamples from '@/components/chat/PromptExamples';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ChatInterfaceProps {
  onNavigateToAdmin?: () => void;
  language?: Language;
}

const ChatInterface = ({ onNavigateToAdmin, language = 'ru' }: ChatInterfaceProps) => {
  const [activeModel, setActiveModel] = useState('auto');
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const { voiceEnabled, speak, toggleVoice } = useVoice();
  const t = getTranslations(language).chat;

  const handleModelChange = (modelId: string) => {
    setActiveModel(modelId);
    // Убрали уведомления о смене модели - пользователю не нужна эта информация
  };

  const availableModels = [
    { id: 'auto', name: '🤖 Умный режим', icon: 'Wand2', color: 'from-gradient-start to-gradient-end', description: 'ИИ автоматически выберет лучшую модель для вашей задачи', category: 'main' },
    
    { id: 'gemini', name: '⚡ Быстрый', icon: 'Zap', color: 'from-blue-500 to-cyan-500', description: 'Мгновенные ответы на простые вопросы', category: 'text' },
    { id: 'gemini-pro', name: '🚀 Эксперт', icon: 'Sparkles', color: 'from-blue-600 to-cyan-600', description: 'Самый умный режим для сложных задач', category: 'text' },
    { id: 'deepseek', name: '💻 Программист', icon: 'Code', color: 'from-violet-500 to-purple-500', description: 'Помощь с кодом, отладкой и разработкой', category: 'text' },
    { id: 'claude', name: '✍️ Творец', icon: 'Feather', color: 'from-amber-500 to-orange-500', description: 'Тексты, истории, креативное письмо', category: 'text' },
    { id: 'llama', name: '🧠 Логик', icon: 'Brain', color: 'from-purple-500 to-pink-500', description: 'Сложные рассуждения и анализ', category: 'text' },
    { id: 'qwen', name: '🌏 Полиглот', icon: 'Languages', color: 'from-orange-500 to-red-500', description: 'Переводы и многоязычная поддержка', category: 'text' },
    { id: 'mistral', name: '⚖️ Универсал', icon: 'Scale', color: 'from-cyan-500 to-blue-500', description: 'Баланс скорости и качества', category: 'text' },
    
    { id: 'gemini-nano-banana', name: '🍌 Визор', icon: 'Image', color: 'from-cyan-400 to-blue-500', description: 'Анализ и описание изображений', category: 'vision' },
    { id: 'gemini-vision', name: '👁️ Визор-1', icon: 'Eye', color: 'from-blue-400 to-indigo-500', description: 'Анализ фото, описание изображений', category: 'vision' },
    { id: 'llama-vision', name: '📸 Визор-2', icon: 'Camera', color: 'from-purple-400 to-pink-500', description: 'Распознавание объектов на фото', category: 'vision' },
    { id: 'qwen-vision', name: '🔍 Визор-3', icon: 'ScanEye', color: 'from-orange-400 to-red-500', description: 'Детальный анализ картинок', category: 'vision' },
    
    { id: 'flux', name: '🎨 Художник-1', icon: 'Palette', color: 'from-pink-500 to-rose-500', description: 'Реалистичная генерация изображений', category: 'image-gen' },
    { id: 'dalle', name: '🖌️ Художник-2', icon: 'Paintbrush', color: 'from-green-500 to-emerald-500', description: 'Креативная генерация картинок', category: 'image-gen' },
    
    { id: 'veo-3-fast', name: '🎬 Режиссёр-1', icon: 'Video', color: 'from-rose-500 to-pink-600', description: 'Быстрая генерация видео', category: 'video-gen' },
    { id: 'kling-v2.1-standard', name: '🎥 Режиссёр-2', icon: 'Film', color: 'from-violet-500 to-purple-600', description: 'Качественные видео', category: 'video-gen' },
    { id: 'hailuo-02-standard', name: '📹 Режиссёр-3', icon: 'Clapperboard', color: 'from-blue-500 to-indigo-600', description: 'Креативная генерация видео', category: 'video-gen' },
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
    <div className="pt-20 md:pt-24 pb-6 md:pb-12 px-3 md:px-6 min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="container mx-auto max-w-5xl space-y-3 md:space-y-4">
        {/* Статус подключения и кнопка возможностей */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCapabilities(!showCapabilities)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <Icon name={showCapabilities ? 'EyeOff' : 'Sparkles'} size={16} className="mr-2" />
              {showCapabilities ? 'Скрыть' : 'Возможности'}
            </Button>
            <Button
              onClick={() => setShowExamples(!showExamples)}
              variant="outline"
              size="sm"
              className="border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <Icon name={showExamples ? 'EyeOff' : 'FileText'} size={16} className="mr-2" />
              {showExamples ? 'Скрыть' : 'Примеры'}
            </Button>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/50 border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-300">В сети</span>
          </div>
        </div>

        {/* Панель возможностей ИИ */}
        {showCapabilities && <AICapabilities />}
        
        {/* Примеры промптов */}
        {showExamples && <PromptExamples onSelectPrompt={setInput} />}

        {/* Панель выбора специализаций */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl p-3 md:p-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3 mb-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Icon name="Cpu" size={18} className="text-white md:w-5 md:h-5" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm md:text-base">Выбор режима работы</h3>
                <p className="text-xs text-gray-400 hidden md:block">Выберите специализацию или доверьтесь ИИ</p>
              </div>
            </div>
            {activeModel === 'auto' && (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Icon name="Wand2" size={14} className="text-indigo-400 md:w-4 md:h-4" />
                <span className="text-xs font-semibold text-indigo-300">Умный режим</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Авто-выбор */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="Wand2" size={12} />
                Умный режим
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {availableModels.filter(m => m.category === 'main').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      activeModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    title={model.description}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                        <Icon name={model.icon as any} size={20} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-white">{model.name}</p>
                        <p className="text-xs text-gray-400">{model.description}</p>
                      </div>
                      {activeModel === model.id && (
                        <Icon name="CheckCircle" size={18} className="text-indigo-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Текстовые модели */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="MessageSquare" size={12} />
                💬 Специализированные помощники
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-1.5 md:gap-2">
                {availableModels.filter(m => m.category === 'text').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      activeModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    title={model.description}
                  >
                    <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Icon name={model.icon as any} size={16} className="text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white text-center">{model.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Vision модели */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="Eye" size={12} />
                👁️ Визор-модели (анализ фото)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2">
                {availableModels.filter(m => m.category === 'vision').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      activeModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    title={model.description}
                  >
                    <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Icon name={model.icon as any} size={16} className="text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white text-center">{model.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Генерация изображений */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="Palette" size={12} />
                🎨 Художники (генерация картинок)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 md:gap-2">
                {availableModels.filter(m => m.category === 'image-gen').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      activeModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    title={model.description}
                  >
                    <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Icon name={model.icon as any} size={16} className="text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white text-center">{model.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Генерация видео */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                <Icon name="Video" size={12} />
                🎬 Режиссёры (генерация видео)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
                {availableModels.filter(m => m.category === 'video-gen').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      activeModel === model.id
                        ? 'border-indigo-500 bg-indigo-500/20'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                    title={model.description}
                  >
                    <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                      <Icon name={model.icon as any} size={16} className="text-white" />
                    </div>
                    <p className="text-xs font-semibold text-white text-center">{model.name}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl shadow-2xl overflow-hidden mt-0">
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
            onPromptSelect={setInput}
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
            voiceEnabled={voiceEnabled}
          />
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;