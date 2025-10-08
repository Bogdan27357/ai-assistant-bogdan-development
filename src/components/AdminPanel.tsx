import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ApiKeyCard from '@/components/admin/ApiKeyCard';
import KnowledgeBase from '@/components/admin/KnowledgeBase';
import SettingsTab from '@/components/admin/SettingsTab';
import AnalyticsTab from '@/components/admin/AnalyticsTab';
import { useApiKeyManagement, models } from '@/components/admin/useApiKeyManagement';
import { useKnowledgeBase } from '@/components/admin/useKnowledgeBase';

const AdminPanel = () => {
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
    loadApiKeys();
    loadKnowledgeFiles();
  }, []);

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">Админ-панель</h1>
          <p className="text-gray-400">Управление интеграциями и настройками платформы</p>
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
            {models.map((model, index) => (
              <ApiKeyCard
                key={model.id}
                model={model}
                index={index}
                config={configs[model.id]}
                testing={testing[model.id] || false}
                testResult={testResults[model.id] || null}
                onToggle={handleToggle}
                onSaveKey={handleSaveKey}
                onUpdateApiKey={handleUpdateApiKey}
                onTestApi={handleTestApi}
              />
            ))}
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
