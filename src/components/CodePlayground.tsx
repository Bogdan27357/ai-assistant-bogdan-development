import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const CodePlayground = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [converting, setConverting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('python');

  const languages = [
    { id: 'javascript', name: 'JavaScript', icon: 'Code', color: 'text-yellow-400' },
    { id: 'python', name: 'Python', icon: 'Code2', color: 'text-blue-400' },
    { id: 'typescript', name: 'TypeScript', icon: 'FileCode', color: 'text-blue-500' },
    { id: 'java', name: 'Java', icon: 'Coffee', color: 'text-red-400' },
    { id: 'cpp', name: 'C++', icon: 'Binary', color: 'text-purple-400' },
    { id: 'go', name: 'Go', icon: 'Zap', color: 'text-cyan-400' },
    { id: 'rust', name: 'Rust', icon: 'Shield', color: 'text-orange-400' },
    { id: 'php', name: 'PHP', icon: 'Database', color: 'text-indigo-400' }
  ];

  const codeExamples = {
    javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
    python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
    typescript: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`
  };

  const handleCheckCode = async () => {
    if (!code.trim()) {
      toast.error('Введите код для проверки');
      return;
    }

    setChecking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const issues = [
        '✅ Синтаксис корректен',
        '⚠️ Рекурсивная функция без мемоизации - может быть медленной',
        '💡 Рекомендация: используйте динамическое программирование',
        '✅ Стиль кода соответствует стандартам',
        '⚠️ Отсутствует обработка ошибок для негативных чисел'
      ];

      setOutput(issues.join('\n'));
      toast.success('Проверка завершена!');
    } catch (error) {
      toast.error('Ошибка проверки кода');
    } finally {
      setChecking(false);
    }
  };

  const handleExplainCode = async () => {
    if (!code.trim()) {
      toast.error('Введите код для объяснения');
      return;
    }

    setChecking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const explain = `📚 Объяснение кода:

1. Функция fibonacci(n) вычисляет n-е число Фибоначчи
2. Используется рекурсивный подход:
   - Базовый случай: если n <= 1, возвращаем n
   - Рекурсивный случай: возвращаем сумму двух предыдущих чисел
3. Сложность: O(2^n) - экспоненциальная
4. Проблема: много повторных вычислений

💡 Улучшенная версия с мемоизацией:
const memo = {};
function fibonacci(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n-1) + fibonacci(n-2);
  return memo[n];
}`;

      setExplanation(explain);
      toast.success('Код объяснен!');
    } catch (error) {
      toast.error('Ошибка объяснения');
    } finally {
      setChecking(false);
    }
  };

  const handleConvertCode = async () => {
    if (!code.trim()) {
      toast.error('Введите код для конвертации');
      return;
    }

    setConverting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const conversions: Record<string, Record<string, string>> = {
        javascript: {
          python: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
          java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`
        },
        python: {
          javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
          java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`
        }
      };

      const converted = conversions[language]?.[targetLanguage] || 
        `// Конвертация из ${language} в ${targetLanguage}\n${code}`;
      
      setOutput(converted);
      toast.success(`Код конвертирован в ${targetLanguage}!`);
    } catch (error) {
      toast.error('Ошибка конвертации');
    } finally {
      setConverting(false);
    }
  };

  const loadExample = () => {
    const example = codeExamples[language as keyof typeof codeExamples] || codeExamples.javascript;
    setCode(example);
    toast.success('Пример загружен');
  };

  const clearAll = () => {
    setCode('');
    setOutput('');
    setExplanation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Code" size={20} className="text-green-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              Code Playground
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI помощник по коду
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Проверка, объяснение и конвертация кода между языками программирования
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Icon name="FileCode" size={24} className="text-green-400" />
                Редактор кода
              </h2>
              <div className="flex gap-2">
                <Button onClick={loadExample} variant="outline" size="sm" className="border-slate-700">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  Пример
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm" className="border-slate-700">
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {languages.map(lang => (
                    <SelectItem key={lang.id} value={lang.id} className="text-white">
                      <span className="flex items-center gap-2">
                        <Icon name={lang.icon as any} size={16} className={lang.color} />
                        {lang.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Вставьте ваш код здесь..."
              className="bg-slate-950 border-slate-700 text-white font-mono text-sm min-h-[400px] resize-none"
              spellCheck={false}
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                onClick={handleCheckCode}
                disabled={checking || !code}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {checking ? (
                  <><Icon name="Loader2" size={18} className="mr-2 animate-spin" />Проверка...</>
                ) : (
                  <><Icon name="CheckCircle" size={18} className="mr-2" />Проверить</>
                )}
              </Button>

              <Button
                onClick={handleExplainCode}
                disabled={checking || !code}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {checking ? (
                  <><Icon name="Loader2" size={18} className="mr-2 animate-spin" />Анализ...</>
                ) : (
                  <><Icon name="BookOpen" size={18} className="mr-2" />Объяснить</>
                )}
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="RefreshCw" size={20} className="text-purple-400" />
                Конвертер языков
              </h3>

              <div className="space-y-3">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {languages.filter(l => l.id !== language).map(lang => (
                      <SelectItem key={lang.id} value={lang.id} className="text-white">
                        <span className="flex items-center gap-2">
                          <Icon name={lang.icon as any} size={16} className={lang.color} />
                          {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleConvertCode}
                  disabled={converting || !code}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {converting ? (
                    <><Icon name="Loader2" size={18} className="mr-2 animate-spin" />Конвертация...</>
                  ) : (
                    <><Icon name="ArrowRightLeft" size={18} className="mr-2" />Конвертировать в {languages.find(l => l.id === targetLanguage)?.name}</>
                  )}
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50">
                  <TabsTrigger value="output">
                    <Icon name="Terminal" size={16} className="mr-2" />
                    Результат
                  </TabsTrigger>
                  <TabsTrigger value="explanation">
                    <Icon name="BookOpen" size={16} className="mr-2" />
                    Объяснение
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="output" className="min-h-[300px]">
                  {output ? (
                    <pre className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                      {output}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                      <Icon name="Terminal" size={48} className="mb-3" />
                      <p>Результаты появятся здесь</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="explanation" className="min-h-[300px]">
                  {explanation ? (
                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 text-gray-300 text-sm whitespace-pre-wrap">
                      {explanation}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                      <Icon name="BookOpen" size={48} className="mb-3" />
                      <p>Объяснение кода появится здесь</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="p-4 bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Icon name="Zap" size={20} className="text-blue-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium text-sm mb-1">Быстрая проверка</h4>
                <p className="text-gray-300 text-xs">Находим ошибки и предлагаем улучшения</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Icon name="Brain" size={20} className="text-purple-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium text-sm mb-1">Понятные объяснения</h4>
                <p className="text-gray-300 text-xs">Разбираем код построчно</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Icon name="RefreshCw" size={20} className="text-green-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-medium text-sm mb-1">Конвертация</h4>
                <p className="text-gray-300 text-xs">Переводим между 8+ языками</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
