import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

interface KnowledgeBaseManagerProps {
  onKnowledgeBaseChange: (kb: string) => void;
  onSystemPromptChange: (prompt: string) => void;
  knowledgeBase: string;
  systemPrompt: string;
}

const KnowledgeBaseManager = ({ 
  onKnowledgeBaseChange, 
  onSystemPromptChange,
  knowledgeBase,
  systemPrompt 
}: KnowledgeBaseManagerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
                <p className="font-medium mb-1">Совет:</p>
                <p>Добавьте в базу знаний информацию о вашем продукте, услугах, FAQ или любые другие данные, которые ИИ должен знать для помощи пользователям.</p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default KnowledgeBaseManager;
