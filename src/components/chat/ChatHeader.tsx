import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { promptCategories } from '@/data/promptCategories';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Model {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ChatHeaderProps {
  title: string;
  subtitle: string;
  activeModel: string;
  availableModels: Model[];
  voiceEnabled: boolean;
  messagesCount: number;
  translations: any;
  onModelChange: (modelId: string) => void;
  onVoiceToggle: () => void;
  onExport: () => void;
  onClear: () => void;
  onPromptSelect: (prompt: string) => void;
}

const ChatHeader = ({
  title,
  subtitle,
  activeModel,
  availableModels,
  voiceEnabled,
  messagesCount,
  translations,
  onModelChange,
  onVoiceToggle,
  onExport,
  onClear,
  onPromptSelect,
}: ChatHeaderProps) => {
  const currentModel = availableModels.find(m => m.id === activeModel) || availableModels[0];
  const t = translations;

  return (
    <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Icon name="MessageCircle" size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
              >
                <Icon name="Sparkles" size={16} className="mr-2" />
                Промпты
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gradient">
                  Библиотека промптов
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {promptCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                        <Icon name={category.icon as any} size={20} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {category.prompts.map((prompt) => (
                        <Card
                          key={prompt.id}
                          className="p-4 glass-effect border-slate-700/50 hover:border-indigo-500/50 cursor-pointer transition-all"
                          onClick={() => {
                            onPromptSelect(prompt.prompt);
                            toast.success('Промпт добавлен! Заполните переменные.');
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <Icon name={prompt.icon as any} size={18} className="text-indigo-400 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{prompt.title}</h4>
                              <p className="text-xs text-gray-400">{prompt.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
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
                    onModelChange(model.id);
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
              <DropdownMenuItem onClick={onVoiceToggle} className="text-white hover:bg-slate-800 cursor-pointer">
                <Icon name={voiceEnabled ? 'VolumeX' : 'Volume2'} size={16} className="mr-2" />
                {voiceEnabled ? (t.inputPlaceholder.includes('message') ? 'Disable Voice' : 'Выключить озвучку') : (t.inputPlaceholder.includes('message') ? 'Enable Voice' : 'Включить озвучку')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
            disabled={messagesCount === 0}
          >
            <Icon name="Download" size={16} className="mr-2" />
            {t.export}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="border-slate-600 text-gray-300 hover:text-white hover:bg-slate-700"
            disabled={messagesCount === 0}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
