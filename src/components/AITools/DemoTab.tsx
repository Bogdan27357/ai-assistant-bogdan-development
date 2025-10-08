import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const DemoTab = () => {
  const [loading, setLoading] = useState(false);
  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState('');
  const [codePrompt, setCodePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleImageAnalysis = () => {
    toast.success('Демо: анализ изображений доступен в главном чате!', { duration: 3000 });
  };

  const handleDocumentAnalysis = () => {
    toast.success('Демо: анализ документов доступен в главном чате!', { duration: 3000 });
  };

  const handleCodeGeneration = () => {
    if (!codePrompt.trim()) {
      toast.error('Опишите, какой код нужно сгенерировать');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const codeExamples: Record<string, string> = {
        'сортировка': `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
        'api': `async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
        'sql': `SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as revenue
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id
ORDER BY revenue DESC
LIMIT 10;`
      };

      const keyword = Object.keys(codeExamples).find(k => 
        codePrompt.toLowerCase().includes(k)
      );

      if (keyword) {
        setGeneratedCode(codeExamples[keyword]);
      } else {
        setGeneratedCode(`# Пример кода для: ${codePrompt}\n\ndef solution():\n    # Ваш код здесь\n    pass\n\nif __name__ == "__main__":\n    solution()`);
      }
      
      setLoading(false);
      toast.success('Код сгенерирован! Для полного функционала перейдите в чат');
    }, 1000);
  };

  const analyzeSentiment = () => {
    if (!sentimentText.trim()) {
      toast.error('Введите текст для анализа');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const positive = ['отлично', 'прекрасно', 'здорово', 'супер', 'восхитительно', 'замечательно', 'люблю', 'рад'];
      const negative = ['плохо', 'ужасно', 'отвратительно', 'хуже', 'разочарован', 'ненавижу', 'грустно'];
      
      const text = sentimentText.toLowerCase();
      const positiveCount = positive.filter(w => text.includes(w)).length;
      const negativeCount = negative.filter(w => text.includes(w)).length;

      let sentiment = 'Нейтральный 😐';
      let color = 'text-gray-400';
      let description = 'Текст не содержит явной эмоциональной окраски';

      if (positiveCount > negativeCount) {
        sentiment = 'Позитивный 😊';
        color = 'text-green-400';
        description = 'Текст содержит положительные эмоции и настроение';
      } else if (negativeCount > positiveCount) {
        sentiment = 'Негативный 😔';
        color = 'text-red-400';
        description = 'Текст содержит негативные эмоции';
      }

      setSentimentResult(`${sentiment}\n${description}\n\nПозитивных слов: ${positiveCount}\nНегативных слов: ${negativeCount}`);
      setLoading(false);
      toast.success('Анализ завершен!');
    }, 800);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-indigo-500/50 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Icon name="Image" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Анализ изображений</h3>
        </div>
        <p className="text-gray-400 mb-4">Загрузите изображение для анализа содержимого, распознавания объектов и получения описания</p>
        <Button onClick={handleImageAnalysis} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Icon name="Upload" size={20} className="mr-2" />
          Загрузить изображение
        </Button>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-purple-500/50 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Icon name="FileText" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Анализ документов</h3>
        </div>
        <p className="text-gray-400 mb-4">Загрузите PDF или Word документ для извлечения ключевой информации и создания саммари</p>
        <Button onClick={handleDocumentAnalysis} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Icon name="Upload" size={20} className="mr-2" />
          Загрузить документ
        </Button>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-green-500/50 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Icon name="Code" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Генератор кода</h3>
        </div>
        <p className="text-gray-400 mb-4">Опишите задачу и получите готовое решение на Python, JavaScript, SQL или другом языке</p>
        <Textarea
          value={codePrompt}
          onChange={(e) => setCodePrompt(e.target.value)}
          placeholder="Например: быстрая сортировка массива, API запрос, SQL запрос..."
          className="bg-slate-800/50 border-slate-700 text-white mb-3 min-h-[80px]"
        />
        {generatedCode && (
          <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-3 text-green-400 text-sm overflow-x-auto">
            {generatedCode}
          </pre>
        )}
        <Button onClick={handleCodeGeneration} disabled={loading} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
          {loading ? (
            <><Icon name="Loader2" size={20} className="mr-2 animate-spin" />Генерация...</>
          ) : (
            <><Icon name="Terminal" size={20} className="mr-2" />Создать код</>
          )}
        </Button>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-orange-500/50 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Icon name="MessageSquare" size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">Анализ тональности</h3>
        </div>
        <p className="text-gray-400 mb-4">Определите эмоциональную окраску текста: позитивный, негативный или нейтральный</p>
        <Textarea
          value={sentimentText}
          onChange={(e) => setSentimentText(e.target.value)}
          placeholder="Введите текст для анализа эмоциональной окраски..."
          className="bg-slate-800/50 border-slate-700 text-white mb-3 min-h-[80px]"
        />
        {sentimentResult && (
          <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 mb-3 text-gray-300 whitespace-pre-line">
            {sentimentResult}
          </div>
        )}
        <Button onClick={analyzeSentiment} disabled={loading} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
          {loading ? (
            <><Icon name="Loader2" size={20} className="mr-2 animate-spin" />Анализ...</>
          ) : (
            <><Icon name="Smile" size={20} className="mr-2" />Проанализировать</>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default DemoTab;
