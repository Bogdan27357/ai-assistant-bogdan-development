import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ApiKeyCard from '@/components/admin/ApiKeyCard';
import KnowledgeBase from '@/components/admin/KnowledgeBase';
import SettingsTab from '@/components/admin/SettingsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import { useApiKeyManagement, models } from '@/components/admin/useApiKeyManagement';
import { useKnowledgeBase } from '@/components/admin/useKnowledgeBase';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'admin123';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  const {
    configs,
    testing,
    testResults,
    loadApiKeys,
    handleToggle,
    handleSaveKey,
    handleUpdateApiKey,
    handleTestApi
  } = useApiKeyManagement();

  const {
    knowledgeFiles,
    uploading,
    loadKnowledgeFiles,
    handleFileUpload,
    handleDeleteFile
  } = useKnowledgeBase();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadApiKeys();
      loadKnowledgeFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      toast.success('Добро пожаловать в админ-панель!');
      setPassword('');
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      toast.error('Неверный пароль');
      setPassword('');
      
      if (attempts >= 2) {
        toast.error('Слишком много попыток. Подождите немного.');
        setTimeout(() => setAttempts(0), 5000);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    toast.success('Вы вышли из админ-панели');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Card className="w-full max-w-md p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Lock" size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Админ-панель</h1>
            <p className="text-gray-400">Введите пароль для доступа</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль..."
                className="bg-slate-800 border-slate-700 text-white"
                disabled={attempts >= 3}
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!password || attempts >= 3}
            >
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </form>

          {attempts > 0 && attempts < 3 && (
            <p className="text-sm text-red-400 text-center mt-4">
              Неверный пароль. Попыток осталось: {3 - attempts}
            </p>
          )}

          {attempts >= 3 && (
            <p className="text-sm text-red-400 text-center mt-4">
              Слишком много попыток. Подождите 5 секунд.
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Админ-панель</h1>
            <p className="text-gray-400">Управление интеграциями и настройками платформы</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-gray-300 hover:bg-slate-800"
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-indigo-600">
              <Icon name="Key" size={16} className="mr-2" />
              API Ключи
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-indigo-600">
              <Icon name="FileUp" size={16} className="mr-2" />
              База знаний
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600">
              <Icon name="BarChart3" size={16} className="mr-2" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-6">
            {models.map((model, index) => {
              const config = configs[model.id] || { enabled: false, apiKey: '' };
              return (
                <ApiKeyCard
                  key={model.id}
                  model={model}
                  index={index}
                  config={config}
                  testing={testing[model.id] || false}
                  testResult={testResults[model.id] || null}
                  onToggle={handleToggle}
                  onSaveKey={handleSaveKey}
                  onUpdateApiKey={handleUpdateApiKey}
                  onTestApi={handleTestApi}
                />
              );
            })}
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <KnowledgeBase
              knowledgeFiles={knowledgeFiles}
              uploading={uploading}
              onFileUpload={handleFileUpload}
              onDeleteFile={handleDeleteFile}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;