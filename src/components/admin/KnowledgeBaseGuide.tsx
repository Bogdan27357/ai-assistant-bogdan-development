import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const KnowledgeBaseGuide = () => {
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-700/50">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <Icon name="Info" size={20} className="text-indigo-400" />
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg mb-2">Как работает база знаний?</h4>
          <div className="space-y-3 text-gray-300 text-sm">
            <div className="flex gap-2">
              <Icon name="Check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p>Загружайте документы, инструкции, FAQ и любые текстовые файлы</p>
            </div>
            <div className="flex gap-2">
              <Icon name="Check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p>ИИ автоматически использует эти данные при ответе на вопросы</p>
            </div>
            <div className="flex gap-2">
              <Icon name="Check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p>Последние 10 файлов всегда доступны в контексте беседы</p>
            </div>
            <div className="flex gap-2">
              <Icon name="Check" size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <p>Используйте поиск для быстрого нахождения нужных файлов</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-indigo-700/50">
        <p className="text-xs text-gray-400">
          💡 <strong>Совет:</strong> Загрузите корпоративные документы, базу знаний продуктов или FAQ, 
          чтобы ИИ мог давать точные ответы на специфичные вопросы
        </p>
      </div>
    </Card>
  );
};

export default KnowledgeBaseGuide;
