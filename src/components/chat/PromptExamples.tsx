import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PromptExamplesProps {
  onSelectPrompt: (prompt: string) => void;
}

const PromptExamples = ({ onSelectPrompt }: PromptExamplesProps) => {
  const examples = [
    {
      category: '💬 Текст',
      prompts: [
        'Напиши продающий текст для Instagram про новую коллекцию одежды',
        'Переведи на английский: "Добрый день, как ваши дела?"',
        'Объясни простыми словами что такое блокчейн',
        'Напиши статью на 500 слов про искусственный интеллект',
      ]
    },
    {
      category: '💻 Код',
      prompts: [
        'Напиши функцию на Python для сортировки списка',
        'Создай React компонент кнопки с анимацией',
        'Помоги исправить ошибку в моём коде',
        'Напиши SQL запрос для выборки всех пользователей',
      ]
    },
    {
      category: '🎨 Креатив',
      prompts: [
        'Придумай 10 названий для нового приложения',
        'Напиши короткий рассказ про путешествие в космос',
        'Составь меню для романтического ужина',
        'Создай план контента для Instagram на неделю',
      ]
    },
    {
      category: '👁️ Анализ',
      prompts: [
        'Что изображено на этой фотографии? (прикрепи фото)',
        'Проанализируй этот график и дай выводы',
        'Извлеки ключевую информацию из документа',
        'Опиши стиль и настроение на этом изображении',
      ]
    },
    {
      category: '🧠 Помощь',
      prompts: [
        'Реши уравнение: x² + 5x + 6 = 0',
        'Дай совет как справиться со стрессом',
        'Составь план тренировок на неделю',
        'Помоги разобрать юридический договор',
      ]
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Icon name="FileText" size={20} className="text-white md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Примеры промптов</h3>
          <p className="text-xs md:text-sm text-gray-400">Кликни на пример чтобы использовать</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {examples.map((category, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-sm font-bold text-white mb-3">{category.category}</h4>
            <div className="space-y-2">
              {category.prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-full text-left p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:border-indigo-500 hover:bg-slate-700/50 transition-all group"
                >
                  <p className="text-xs text-gray-300 group-hover:text-white line-clamp-2">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-indigo-400 shrink-0" />
          <div className="text-xs md:text-sm text-gray-300">
            <p className="font-semibold text-white mb-1">💡 Совет: Будьте конкретны</p>
            <p>Чем детальнее ваш запрос, тем лучше результат. Указывайте стиль, формат, объём и другие детали.</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PromptExamples;