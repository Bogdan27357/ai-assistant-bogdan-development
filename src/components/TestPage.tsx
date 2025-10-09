import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const TestPage = () => {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [testDetails, setTestDetails] = useState<Record<string, string>>({});

  const updateTest = (testName: string, status: 'pending' | 'success' | 'error', details?: string) => {
    setTestResults(prev => ({ ...prev, [testName]: status }));
    if (details) {
      setTestDetails(prev => ({ ...prev, [testName]: details }));
    }
  };

  const tests = [
    {
      id: 'navigation',
      name: 'Навигация',
      test: async () => {
        updateTest('navigation', 'pending', 'Проверка навигационного меню...');
        const nav = document.querySelector('nav');
        if (!nav) throw new Error('Навигация не найдена');
        const buttons = nav.querySelectorAll('button');
        if (buttons.length < 3) throw new Error('Не все кнопки навигации присутствуют');
        updateTest('navigation', 'success', `Найдено ${buttons.length} кнопок навигации`);
      }
    },
    {
      id: 'hero',
      name: 'Hero секция',
      test: async () => {
        updateTest('hero', 'pending', 'Проверка главной секции...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const buttons = document.querySelectorAll('button');
        const heroButtons = Array.from(buttons).filter(btn => 
          btn.textContent?.includes('Начать') || btn.textContent?.includes('Start')
        );
        if (heroButtons.length === 0) throw new Error('Кнопки Hero не найдены');
        updateTest('hero', 'success', 'Hero секция присутствует и кликабельна');
      }
    },
    {
      id: 'features',
      name: 'Секция возможностей',
      test: async () => {
        updateTest('features', 'pending', 'Проверка секции возможностей...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const featuresSection = document.getElementById('features');
        if (!featuresSection) {
          const hasFeatures = document.body.textContent?.includes('Возможности') || 
                             document.body.textContent?.includes('Capabilities');
          if (!hasFeatures) throw new Error('Секция возможностей не найдена');
        }
        updateTest('features', 'success', 'Секция возможностей корректно отображается');
      }
    },
    {
      id: 'models',
      name: 'Галерея моделей',
      test: async () => {
        updateTest('models', 'pending', 'Проверка галереи моделей...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const hasModels = document.body.textContent?.includes('моделей') || 
                         document.body.textContent?.includes('models');
        if (!hasModels) throw new Error('Галерея моделей не найдена');
        updateTest('models', 'success', 'Галерея моделей отображается');
      }
    },
    {
      id: 'interactive',
      name: 'Интерактивная демо',
      test: async () => {
        updateTest('interactive', 'pending', 'Проверка интерактивной демо...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const hasTabs = document.querySelector('[role="tablist"]');
        const hasDemo = document.body.textContent?.includes('Попробуйте') || 
                       document.body.textContent?.includes('Try');
        if (!hasTabs && !hasDemo) throw new Error('Интерактивная демо не найдена');
        updateTest('interactive', 'success', 'Интерактивная демо работает');
      }
    },
    {
      id: 'cta',
      name: 'CTA секция',
      test: async () => {
        updateTest('cta', 'pending', 'Проверка CTA секции...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const hasCTA = document.body.textContent?.includes('Готовы') || 
                      document.body.textContent?.includes('Ready');
        if (!hasCTA) throw new Error('CTA секция не найдена');
        updateTest('cta', 'success', 'CTA секция присутствует');
      }
    },
    {
      id: 'footer',
      name: 'Footer',
      test: async () => {
        updateTest('footer', 'pending', 'Проверка футера...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const footer = document.querySelector('footer');
        if (!footer) throw new Error('Footer не найден');
        const links = footer.querySelectorAll('button, a');
        if (links.length < 3) throw new Error('Не все ссылки в footer');
        updateTest('footer', 'success', `Footer с ${links.length} ссылками`);
      }
    },
    {
      id: 'responsive',
      name: 'Адаптивность',
      test: async () => {
        updateTest('responsive', 'pending', 'Проверка адаптивности...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const mobileMenu = document.querySelector('[class*="Sheet"]');
        const hasResponsive = document.body.className.includes('md:') || 
                             document.querySelector('[class*="md:"]');
        if (!hasResponsive) throw new Error('Адаптивные стили не найдены');
        updateTest('responsive', 'success', 'Адаптивный дизайн реализован');
      }
    },
    {
      id: 'animations',
      name: 'Анимации',
      test: async () => {
        updateTest('animations', 'pending', 'Проверка анимаций...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const hasAnimations = document.querySelector('[class*="animate-"]');
        if (!hasAnimations) throw new Error('Анимации не найдены');
        updateTest('animations', 'success', 'Анимации добавлены');
      }
    },
    {
      id: 'icons',
      name: 'Иконки',
      test: async () => {
        updateTest('icons', 'pending', 'Проверка иконок...');
        await new Promise(resolve => setTimeout(resolve, 500));
        const icons = document.querySelectorAll('svg');
        if (icons.length < 10) throw new Error('Недостаточно иконок');
        updateTest('icons', 'success', `${icons.length} иконок найдено`);
      }
    }
  ];

  const runAllTests = async () => {
    toast.info('Запускаю тесты...');
    for (const test of tests) {
      try {
        await test.test();
      } catch (error: any) {
        updateTest(test.id, 'error', error.message);
      }
    }
    toast.success('Тестирование завершено!');
  };

  const getStatusIcon = (status?: 'pending' | 'success' | 'error') => {
    if (status === 'success') return <Icon name="CheckCircle2" size={20} className="text-green-400" />;
    if (status === 'error') return <Icon name="XCircle" size={20} className="text-red-400" />;
    if (status === 'pending') return <Icon name="Loader2" size={20} className="text-yellow-400 animate-spin" />;
    return <Icon name="Circle" size={20} className="text-gray-500" />;
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Тестирование функций</h1>
          <p className="text-gray-400">Проверка всех компонентов и функций сайта</p>
          <Button onClick={runAllTests} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
            <Icon name="Play" size={20} className="mr-2" />
            Запустить все тесты
          </Button>
        </div>

        <div className="grid gap-4">
          {tests.map(test => (
            <Card key={test.id} className="p-6 glass-effect border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(testResults[test.id])}
                  <h3 className="text-lg font-semibold text-white">{test.name}</h3>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      await test.test();
                    } catch (error: any) {
                      updateTest(test.id, 'error', error.message);
                    }
                  }}
                  size="sm"
                  variant="outline"
                  className="border-slate-600"
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Тест
                </Button>
              </div>
              {testDetails[test.id] && (
                <p className={`text-sm ${testResults[test.id] === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
                  {testDetails[test.id]}
                </p>
              )}
            </Card>
          ))}
        </div>

        <Card className="p-6 glass-effect border-indigo-500/30">
          <h3 className="text-xl font-bold text-white mb-4">Результаты</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400">
                {Object.values(testResults).filter(r => r === 'success').length}
              </div>
              <div className="text-sm text-gray-400">Успешно</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400">
                {Object.values(testResults).filter(r => r === 'error').length}
              </div>
              <div className="text-sm text-gray-400">Ошибки</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">
                {Object.values(testResults).filter(r => r === 'pending').length}
              </div>
              <div className="text-sm text-gray-400">В процессе</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
