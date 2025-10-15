import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import KnowledgeBaseManager from '@/components/KnowledgeBaseManager';

const ADMIN_PASSWORD = 'admin123';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('Ты полезный ИИ-ассистент по имени Богдан.');
  const [knowledgeBase, setKnowledgeBase] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const savedPrompt = localStorage.getItem('system-prompt');
    const savedKB = localStorage.getItem('knowledge-base');
    if (savedPrompt) setSystemPrompt(savedPrompt);
    if (savedKB) setKnowledgeBase(savedKB);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      toast.success('Вход выполнен');
      setPassword('');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
    toast.success('Вы вышли из админ панели');
  };

  const handleSystemPromptChange = (prompt: string) => {
    setSystemPrompt(prompt);
    localStorage.setItem('system-prompt', prompt);
  };

  const handleKnowledgeBaseChange = (kb: string) => {
    setKnowledgeBase(kb);
    localStorage.setItem('knowledge-base', kb);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <Icon name="Lock" size={24} />
              Админ панель
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900 dark:text-white">
                Пароль
              </label>
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Icon name="Settings" size={32} />
            Админ панель
          </h1>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <Icon name="Home" size={16} className="mr-2" />
              На главную
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <KnowledgeBaseManager
          onKnowledgeBaseChange={handleKnowledgeBaseChange}
          onSystemPromptChange={handleSystemPromptChange}
          knowledgeBase={knowledgeBase}
          systemPrompt={systemPrompt}
        />

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white">
              Информация
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>• Пароль по умолчанию: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">admin123</code></p>
            <p>• Все настройки сохраняются в браузере</p>
            <p>• Пресеты доступны для быстрого переключения</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
