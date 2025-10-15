import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';
import GeneralSettings from '@/components/admin/GeneralSettings';
import ServicesSettings from '@/components/admin/ServicesSettings';
import VoiceSettings from '@/components/admin/VoiceSettings';
import ContactSettings from '@/components/admin/ContactSettings';
import AppearanceSettings from '@/components/admin/AppearanceSettings';
import ApiSettings from '@/components/admin/ApiSettings';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const storedSession = localStorage.getItem('adminSession');
    
    if (storedUser && storedSession) {
      const sessionTime = parseInt(storedSession);
      const currentTime = Date.now();
      const hourInMs = 60 * 60 * 1000;
      
      if (currentTime - sessionTime < 8 * hourInMs) {
        setAdminUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    setAdminUser(null);
    setIsAuthenticated(false);
    toast.success('Вы вышли из системы');
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Богдан - Ваш помощник',
    tagline: 'Умный голосовой помощник для вашего бизнеса',
    description: 'Богдан помогает отвечать на вопросы о ваших услугах, ценах и сроках разработки ИИ-решений',
    heroButtonText: 'Начать разговор',
    darkMode: true,
    showFooter: true,
    showScrollToTop: true,
    mainColor: '#6366f1',
    accentColor: '#10b981',
  });

  const [services, setServices] = useState([
    { id: 1, name: 'Консультации по ИИ', price: 'от 5000₽', description: 'Экспертная консультация по внедрению ИИ', icon: 'MessageSquare' },
    { id: 2, name: 'Разработка ИИ-помощников', price: 'от 50000₽', description: 'Создание кастомных ИИ-ассистентов', icon: 'Bot' },
    { id: 3, name: 'Техподдержка', price: '10000₽/мес', description: 'Мониторинг 24/7 и обслуживание', icon: 'Settings' },
    { id: 4, name: 'Обучение персонала', price: '15000₽', description: 'Корпоративное обучение работе с ИИ', icon: 'GraduationCap' },
  ]);

  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    welcomeMessage: 'Здравствуйте! Я голосовой помощник Богдана. Спросите меня об услугах, ценах или сроках разработки ИИ-решений.',
    agentId: 'TkqT87nC0bSWFpZWEJ1t',
    voiceModel: 'eleven_multilingual_v2',
  });

  const [contactInfo, setContactInfo] = useState({
    email: 'info@bogdan-ai.ru',
    phone: '+7 (999) 123-45-67',
    telegram: '@bogdan_ai_bot',
    whatsapp: '+79991234567',
    address: 'Москва, Россия',
  });

  const handleSaveSiteSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    toast.success('Настройки сайта сохранены');
  };

  const handleSaveServices = () => {
    localStorage.setItem('services', JSON.stringify(services));
    toast.success('Услуги обновлены');
  };

  const handleSaveVoiceSettings = () => {
    localStorage.setItem('voiceSettings', JSON.stringify(voiceSettings));
    toast.success('Настройки голосового помощника сохранены');
  };

  const handleSaveContactInfo = () => {
    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    toast.success('Контактная информация обновлена');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pt-24">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель управления сайтом</h1>
            <p className="text-slate-400">Полное управление контентом и настройками</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={24} className="text-green-400" />
              <div>
                <span className="text-sm text-green-400 font-semibold block">Админ-режим</span>
                <span className="text-xs text-slate-400">{adminUser?.email}</span>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="general" className="data-[state=active]:bg-indigo-600">
              <Icon name="Settings" size={16} className="mr-2" />
              Основные
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-indigo-600">
              <Icon name="Briefcase" size={16} className="mr-2" />
              Услуги
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-indigo-600">
              <Icon name="Mic" size={16} className="mr-2" />
              Голосовой помощник
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-indigo-600">
              <Icon name="Phone" size={16} className="mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-indigo-600">
              <Icon name="Palette" size={16} className="mr-2" />
              Внешний вид
            </TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-indigo-600">
              <Icon name="Key" size={16} className="mr-2" />
              API Ключи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettings 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              onSave={handleSaveSiteSettings}
            />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServicesSettings 
              services={services}
              setServices={setServices}
              onSave={handleSaveServices}
            />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceSettings 
              voiceSettings={voiceSettings}
              setVoiceSettings={setVoiceSettings}
              onSave={handleSaveVoiceSettings}
            />
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <ContactSettings 
              contactInfo={contactInfo}
              setContactInfo={setContactInfo}
              onSave={handleSaveContactInfo}
            />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              onSave={handleSaveSiteSettings}
            />
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <ApiSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;