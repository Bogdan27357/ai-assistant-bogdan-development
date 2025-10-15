import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface KnowledgeBaseManagerProps {
  onKnowledgeBaseChange: (kb: string) => void;
  onSystemPromptChange: (prompt: string) => void;
  knowledgeBase: string;
  systemPrompt: string;
}

interface Preset {
  id: string;
  name: string;
  systemPrompt: string;
  knowledgeBase: string;
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: 'default',
    name: 'По умолчанию',
    systemPrompt: 'Ты полезный ИИ-ассистент по имени Богдан.',
    knowledgeBase: ''
  },
  {
    id: 'support',
    name: 'Техподдержка',
    systemPrompt: 'Ты специалист технической поддержки. Отвечай четко, по делу, помогай решать проблемы клиентов.',
    knowledgeBase: ''
  },
  {
    id: 'sales',
    name: 'Продажи',
    systemPrompt: 'Ты менеджер по продажам. Будь дружелюбным, помогай клиентам выбрать подходящий продукт.',
    knowledgeBase: ''
  }
];

const KnowledgeBaseManager = ({ 
  onKnowledgeBaseChange, 
  onSystemPromptChange,
  knowledgeBase,
  systemPrompt 
}: KnowledgeBaseManagerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [currentPreset, setCurrentPreset] = useState<string>('default');
  const [newPresetName, setNewPresetName] = useState('');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ai-presets');
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки пресетов:', e);
      }
    }
  }, []);

  const savePresets = (newPresets: Preset[]) => {
    setPresets(newPresets);
    localStorage.setItem('ai-presets', JSON.stringify(newPresets));
  };

  const handlePresetChange = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      onSystemPromptChange(preset.systemPrompt);
      onKnowledgeBaseChange(preset.knowledgeBase);
      toast.success(`Загружен пресет: ${preset.name}`);
    }
  };

  const handleSaveCurrentPreset = () => {
    const updatedPresets = presets.map(p => 
      p.id === currentPreset 
        ? { ...p, systemPrompt, knowledgeBase }
        : p
    );
    savePresets(updatedPresets);
    toast.success('Пресет сохранен');
  };

  const handleCreatePreset = () => {
    if (!newPresetName.trim()) {
      toast.error('Введите название пресета');
      return;
    }

    const newPreset: Preset = {
      id: `preset-${Date.now()}`,
      name: newPresetName,
      systemPrompt,
      knowledgeBase
    };

    const updatedPresets = [...presets, newPreset];
    savePresets(updatedPresets);
    setCurrentPreset(newPreset.id);
    setNewPresetName('');
    setIsCreatingPreset(false);
    toast.success(`Создан пресет: ${newPresetName}`);
  };

  const handleDeletePreset = () => {
    if (presets.length <= 1) {
      toast.error('Нельзя удалить последний пресет');
      return;
    }

    const preset = presets.find(p => p.id === currentPreset);
    const updatedPresets = presets.filter(p => p.id !== currentPreset);
    savePresets(updatedPresets);
    
    setCurrentPreset(updatedPresets[0].id);
    onSystemPromptChange(updatedPresets[0].systemPrompt);
    onKnowledgeBaseChange(updatedPresets[0].knowledgeBase);
    
    toast.success(`Удален пресет: ${preset?.name}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Файл слишком большой (макс. 5MB)');
      return;
    }

    try {
      const text = await file.text();
      onKnowledgeBaseChange(text);
      toast.success('База знаний загружена');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка чтения файла');
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
          <div className="flex items-center gap-2">
            <Icon name="Settings" size={24} />
            Настройки ИИ
          </div>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Пресет
            </label>
            <div className="flex gap-2">
              <Select value={currentPreset} onValueChange={handlePresetChange}>
                <SelectTrigger className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleSaveCurrentPreset}
                variant="outline"
                size="icon"
                className="border-slate-300 dark:border-slate-600"
                title="Сохранить изменения"
              >
                <Icon name="Save" size={16} />
              </Button>
              <Button
                onClick={() => setIsCreatingPreset(!isCreatingPreset)}
                variant="outline"
                size="icon"
                className="border-slate-300 dark:border-slate-600"
                title="Создать новый пресет"
              >
                <Icon name="Plus" size={16} />
              </Button>
              <Button
                onClick={handleDeletePreset}
                variant="outline"
                size="icon"
                className="border-slate-300 dark:border-slate-600"
                title="Удалить текущий пресет"
                disabled={presets.length <= 1}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
            {isCreatingPreset && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Название нового пресета"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePreset()}
                  className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                />
                <Button onClick={handleCreatePreset} size="sm">
                  Создать
                </Button>
                <Button onClick={() => setIsCreatingPreset(false)} size="sm" variant="outline">
                  Отмена
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              Системный промпт
            </label>
            <Textarea
              placeholder="Ты полезный ИИ-ассистент по имени Богдан..."
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              className="min-h-[100px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Определяет характер и поведение ИИ
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900 dark:text-white">
              База знаний
            </label>
            <Textarea
              placeholder="Вставьте текст базы знаний или загрузите файл..."
              value={knowledgeBase}
              onChange={(e) => onKnowledgeBaseChange(e.target.value)}
              className="min-h-[200px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600 font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById('kb-file-upload')?.click()}
                variant="outline"
                className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить файл (.txt, .md)
              </Button>
              <Button
                onClick={() => {
                  onKnowledgeBaseChange('');
                  toast.success('База знаний очищена');
                }}
                variant="outline"
                disabled={!knowledgeBase}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
            <input
              id="kb-file-upload"
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ИИ будет использовать эту информацию для ответов на вопросы
            </p>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <div className="text-xs text-indigo-900 dark:text-indigo-200">
                <p className="font-medium mb-1">Работа с пресетами:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Выберите пресет из списка</li>
                  <li>Измените промпт и базу знаний</li>
                  <li>Нажмите кнопку сохранения для обновления пресета</li>
                  <li>Создайте новый пресет кнопкой +</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default KnowledgeBaseManager;
