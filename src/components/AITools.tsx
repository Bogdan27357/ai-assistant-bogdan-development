import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import TranslatorTab from '@/components/AITools/TranslatorTab';
import DemoTab from '@/components/AITools/DemoTab';
import CapabilitiesSection from '@/components/AITools/CapabilitiesSection';

const AITools = () => {
  const [showCapabilities, setShowCapabilities] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Wrench" size={20} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              ИИ Инструменты
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Мощные инструменты ИИ
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Попробуйте возможности искусственного интеллекта прямо сейчас
          </p>
          
          <Button
            onClick={() => setShowCapabilities(!showCapabilities)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all mb-8"
          >
            <Icon name="List" size={24} className="mr-3" />
            {showCapabilities ? 'Скрыть возможности' : 'Показать все возможности ИИ'}
          </Button>

          <CapabilitiesSection show={showCapabilities} />
        </div>

        <Tabs defaultValue="translator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger value="translator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600">
              <Icon name="Languages" size={18} className="mr-2" />
              Переводчик
            </TabsTrigger>
            <TabsTrigger value="demo" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Демо возможностей
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            <TranslatorTab />
          </TabsContent>

          <TabsContent value="demo">
            <DemoTab />
          </TabsContent>
        </Tabs>

        <Card className="mt-12 p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 backdrop-blur-sm text-center">
          <div className="max-w-3xl mx-auto">
            <Icon name="Zap" size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-3">Это только начало!</h3>
            <p className="text-xl text-gray-300 mb-6">
              Полный функционал доступен в главном чате. Переходите в чат для работы со всеми возможностями ИИ!
            </p>
            <Button
              onClick={() => window.location.href = '/?page=chat'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 text-lg"
            >
              <Icon name="MessageCircle" size={24} className="mr-2" />
              Открыть чат
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AITools;
