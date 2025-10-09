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
    { id: 'auto', name: '🤖 Умный режим', icon: 'Wand2', color: 'from-gradient-start to-gradient-end', description: 'ИИ автоматически выберет лучшую модель для вашей задачи', category: 'main' },
    
    { id: 'gemini', name: '⚡ Быстрый', icon: 'Zap', color: 'from-blue-500 to-cyan-500', description: 'Мгновенные ответы на простые вопросы', category: 'text' },
    { id: 'deepseek', name: '💻 Программист', icon: 'Code', color: 'from-violet-500 to-purple-500', description: 'Помощь с кодом, отладкой и разработкой', category: 'text' },
    { id: 'claude', name: '✍️ Творец', icon: 'Feather', color: 'from-amber-500 to-orange-500', description: 'Тексты, истории, креативное письмо', category: 'text' },
    { id: 'llama', name: '🧠 Логик', icon: 'Brain', color: 'from-purple-500 to-pink-500', description: 'Сложные рассуждения и анализ', category: 'text' },
    { id: 'qwen', name: '🌏 Полиглот', icon: 'Languages', color: 'from-orange-500 to-red-500', description: 'Переводы и многоязычная поддержка', category: 'text' },
    { id: 'mistral', name: '⚖️ Универсал', icon: 'Scale', color: 'from-cyan-500 to-blue-500', description: 'Баланс скорости и качества', category: 'text' },
    
    { id: 'gemini-vision', name: '👁️ Визор-1', icon: 'Eye', color: 'from-blue-400 to-indigo-500', description: 'Анализ фото, описание изображений', category: 'vision' },
    { id: 'llama-vision', name: '📸 Визор-2', icon: 'Camera', color: 'from-purple-400 to-pink-500', description: 'Распознавание объектов на фото', category: 'vision' },
    { id: 'qwen-vision', name: '🔍 Визор-3', icon: 'ScanEye', color: 'from-orange-400 to-red-500', description: 'Детальный анализ картинок', category: 'vision' },
    
    { id: 'flux', name: '🎨 Художник-1', icon: 'Palette', color: 'from-pink-500 to-rose-500', description: 'Реалистичная генерация изображений', category: 'image-gen' },
    { id: 'dalle', name: '🖌️ Художник-2', icon: 'Paintbrush', color: 'from-green-500 to-emerald-500', description: 'Креативная генерация картинок', category: 'image-gen' },
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
        {/* Информация о платформе */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 backdrop-blur-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">🤖 12 AI моделей в одной платформе</h3>
              <p className="text-sm text-gray-300 mb-3">
                Универсальная AI-платформа для любых задач: диалоги, код, анализ фото, генерация изображений, переводы и многое другое
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Icon name="CheckCircle" size={14} className="text-green-400" />
                  <span>Умный автовыбор</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Icon name="CheckCircle" size={14} className="text-green-400" />
                  <span>6 текстовых моделей</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Icon name="CheckCircle" size={14} className="text-green-400" />
                  <span>3 визор-модели</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Icon name="CheckCircle" size={14} className="text-green-400" />
                  <span>2 художника</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Выбор AI модели */}
        <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Icon name="Cpu" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Выбор режима работы</h3>
                <p className="text-xs text-gray-400">Выберите специализацию или доверьтесь ИИ</p>
              </div>
            </div>
            {activeModel === 'auto' && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Icon name="Wand2" size={16} className="text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">Умный режим активен</span>
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
                    onClick={() => setActiveModel(model.id)}
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
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {availableModels.filter(m => m.category === 'text').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
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
              <div className="grid grid-cols-3 gap-2">
                {availableModels.filter(m => m.category === 'vision').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
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
              <div className="grid grid-cols-2 gap-2">
                {availableModels.filter(m => m.category === 'image-gen').map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id)}
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