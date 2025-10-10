import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ApiKeyCard from '@/components/admin/ApiKeyCard';
import KnowledgeBase from '@/components/admin/KnowledgeBase';
import KnowledgeBaseGuide from '@/components/admin/KnowledgeBaseGuide';
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
    selectedModel,
    setSelectedModel,
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
      <div className="min-h-screen flex items-center justify-center px-4 md:px-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Card className="w-full max-w-md p-6 md:p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <div className="text-center mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Lock" size={32} className="text-white md:w-10 md:h-10" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Админ-панель</h1>
            <p className="text-sm md:text-base text-gray-400">Введите пароль для доступа</p>
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
    <div className="pt-20 md:pt-24 pb-6 md:pb-12 px-4 md:px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 md:mb-8 animate-fade-in flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">Админ-панель</h1>
            <p className="text-sm md:text-base text-gray-400">Управление интеграциями и настройками</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-gray-300 hover:bg-slate-800 w-full md:w-auto"
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="api-keys" className="space-y-4 md:space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700 w-full flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="api-keys" className="data-[state=active]:bg-indigo-600 flex-1 text-xs md:text-sm min-w-[100px]">
              <Icon name="Key" size={14} className="mr-1 md:mr-2 md:w-4 md:h-4" />
              <span className="hidden sm:inline">API Ключи</span>
              <span className="sm:hidden">API</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-indigo-600 flex-1 text-xs md:text-sm min-w-[100px]">
              <Icon name="FileUp" size={14} className="mr-1 md:mr-2 md:w-4 md:h-4" />
              <span className="hidden sm:inline">База знаний</span>
              <span className="sm:hidden">База</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600 flex-1 text-xs md:text-sm min-w-[100px]">
              <Icon name="Settings" size={14} className="mr-1 md:mr-2 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Настройки</span>
              <span className="sm:hidden">Настр.</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600 flex-1 text-xs md:text-sm min-w-[100px]">
              <Icon name="BarChart3" size={14} className="mr-1 md:mr-2 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Аналитика</span>
              <span className="sm:hidden">Стат.</span>
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
            <KnowledgeBaseGuide />
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