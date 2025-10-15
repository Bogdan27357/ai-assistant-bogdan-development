import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const AdminPanel = () => {
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

  const [apiKeys, setApiKeys] = useState({
    elevenlabsKey: '',
    openrouterKey: '',
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

  const handleUpdateApiKey = async (keyType: 'elevenlabs' | 'openrouter') => {
    const keyValue = keyType === 'elevenlabs' ? apiKeys.elevenlabsKey : apiKeys.openrouterKey;
    
    if (!keyValue.trim()) {
      toast.error('Введите API ключ');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_type: keyType,
          api_key: keyValue
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`${keyType === 'elevenlabs' ? 'ElevenLabs' : 'OpenRouter'} API ключ обновлён`);
        if (keyType === 'elevenlabs') {
          setApiKeys({ ...apiKeys, elevenlabsKey: '' });
        } else {
          setApiKeys({ ...apiKeys, openrouterKey: '' });
        }
      } else {
        toast.error(data.error || 'Ошибка обновления ключа');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    }
  };

  const addService = () => {
    const newService = {
      id: services.length + 1,
      name: 'Новая услуга',
      price: '0₽',
      description: 'Описание услуги',
      icon: 'Star',
    };
    setServices([...services, newService]);
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast.success('Услуга удалена');
  };

  const updateService = (id: number, field: string, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pt-24">
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Панель управления сайтом</h1>
            <p className="text-slate-400">Полное управление контентом и настройками</p>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={24} className="text-green-400" />
            <span className="text-sm text-green-400 font-semibold">Админ-режим</span>
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
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Основные настройки сайта</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="siteName" className="text-white mb-2">Название сайта</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={e => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline" className="text-white mb-2">Слоган</Label>
                  <Input
                    id="tagline"
                    value={siteSettings.tagline}
                    onChange={e => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white mb-2">Описание (для SEO)</Label>
                  <Textarea
                    id="description"
                    value={siteSettings.description}
                    onChange={e => setSiteSettings({ ...siteSettings, description: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="heroButton" className="text-white mb-2">Текст главной кнопки</Label>
                  <Input
                    id="heroButton"
                    value={siteSettings.heroButtonText}
                    onChange={e => setSiteSettings({ ...siteSettings, heroButtonText: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <Label className="text-white font-semibold">Показывать футер</Label>
                    <p className="text-sm text-slate-400">Отображение нижней части сайта</p>
                  </div>
                  <Switch
                    checked={siteSettings.showFooter}
                    onCheckedChange={checked => setSiteSettings({ ...siteSettings, showFooter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <Label className="text-white font-semibold">Кнопка "Наверх"</Label>
                    <p className="text-sm text-slate-400">Показывать кнопку прокрутки вверх</p>
                  </div>
                  <Switch
                    checked={siteSettings.showScrollToTop}
                    onCheckedChange={checked => setSiteSettings({ ...siteSettings, showScrollToTop: checked })}
                  />
                </div>

                <Button onClick={handleSaveSiteSettings} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить основные настройки
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Управление услугами</h2>
                <Button onClick={addService} className="bg-green-600 hover:bg-green-700">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить услугу
                </Button>
              </div>

              <div className="space-y-4">
                {services.map((service) => (
                  <Card key={service.id} className="bg-slate-800/50 border-slate-700 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-2">Название услуги</Label>
                        <Input
                          value={service.name}
                          onChange={e => updateService(service.id, 'name', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2">Цена</Label>
                        <Input
                          value={service.price}
                          onChange={e => updateService(service.id, 'price', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-white mb-2">Описание</Label>
                        <Textarea
                          value={service.description}
                          onChange={e => updateService(service.id, 'description', e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white mb-2">Иконка (Lucide)</Label>
                        <Input
                          value={service.icon}
                          onChange={e => updateService(service.id, 'icon', e.target.value)}
                          placeholder="MessageSquare"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={() => deleteService(service.id)}
                          variant="destructive"
                          className="w-full"
                        >
                          <Icon name="Trash2" size={18} className="mr-2" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button onClick={handleSaveServices} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить все услуги
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Настройки голосового помощника</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <Label className="text-white font-semibold">Включить голосового помощника</Label>
                    <p className="text-sm text-slate-400">Показывать виджет на сайте</p>
                  </div>
                  <Switch
                    checked={voiceSettings.enabled}
                    onCheckedChange={checked => setVoiceSettings({ ...voiceSettings, enabled: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="welcomeMessage" className="text-white mb-2">Приветственное сообщение</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={voiceSettings.welcomeMessage}
                    onChange={e => setVoiceSettings({ ...voiceSettings, welcomeMessage: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="agentId" className="text-white mb-2">ElevenLabs Agent ID</Label>
                  <Input
                    id="agentId"
                    value={voiceSettings.agentId}
                    onChange={e => setVoiceSettings({ ...voiceSettings, agentId: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="voiceModel" className="text-white mb-2">Модель голоса</Label>
                  <Input
                    id="voiceModel"
                    value={voiceSettings.voiceModel}
                    onChange={e => setVoiceSettings({ ...voiceSettings, voiceModel: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <Button onClick={handleSaveVoiceSettings} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить настройки помощника
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Контактная информация</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white mb-2 flex items-center gap-2">
                    <Icon name="Mail" size={16} />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactInfo.email}
                    onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white mb-2 flex items-center gap-2">
                    <Icon name="Phone" size={16} />
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="telegram" className="text-white mb-2 flex items-center gap-2">
                    <Icon name="Send" size={16} />
                    Telegram
                  </Label>
                  <Input
                    id="telegram"
                    value={contactInfo.telegram}
                    onChange={e => setContactInfo({ ...contactInfo, telegram: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-white mb-2 flex items-center gap-2">
                    <Icon name="MessageCircle" size={16} />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={contactInfo.whatsapp}
                    onChange={e => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-white mb-2 flex items-center gap-2">
                    <Icon name="MapPin" size={16} />
                    Адрес
                  </Label>
                  <Input
                    id="address"
                    value={contactInfo.address}
                    onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className="bg-slate-800 border-slate-600 text-white"
                  />
                </div>

                <Button onClick={handleSaveContactInfo} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить контакты
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Настройки внешнего вида</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <Label className="text-white font-semibold">Тёмная тема</Label>
                    <p className="text-sm text-slate-400">Включить тёмный режим по умолчанию</p>
                  </div>
                  <Switch
                    checked={siteSettings.darkMode}
                    onCheckedChange={checked => setSiteSettings({ ...siteSettings, darkMode: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="mainColor" className="text-white mb-2">Основной цвет</Label>
                  <div className="flex gap-3">
                    <Input
                      id="mainColor"
                      type="color"
                      value={siteSettings.mainColor}
                      onChange={e => setSiteSettings({ ...siteSettings, mainColor: e.target.value })}
                      className="w-20 h-12 bg-slate-800 border-slate-600"
                    />
                    <Input
                      value={siteSettings.mainColor}
                      onChange={e => setSiteSettings({ ...siteSettings, mainColor: e.target.value })}
                      className="flex-1 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor" className="text-white mb-2">Акцентный цвет</Label>
                  <div className="flex gap-3">
                    <Input
                      id="accentColor"
                      type="color"
                      value={siteSettings.accentColor}
                      onChange={e => setSiteSettings({ ...siteSettings, accentColor: e.target.value })}
                      className="w-20 h-12 bg-slate-800 border-slate-600"
                    />
                    <Input
                      value={siteSettings.accentColor}
                      onChange={e => setSiteSettings({ ...siteSettings, accentColor: e.target.value })}
                      className="flex-1 bg-slate-800 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSiteSettings} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить настройки вида
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Управление API ключами</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertTriangle" size={20} className="text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-amber-200 text-sm font-semibold mb-1">Важная информация о безопасности</p>
                      <p className="text-amber-300/80 text-xs">
                        API ключи хранятся в защищённой базе данных. После обновления поле очищается автоматически.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="elevenlabsKey" className="text-white mb-2 flex items-center gap-2">
                      <Icon name="Mic" size={16} />
                      ElevenLabs API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="elevenlabsKey"
                        type="password"
                        value={apiKeys.elevenlabsKey}
                        onChange={e => setApiKeys({ ...apiKeys, elevenlabsKey: e.target.value })}
                        placeholder="sk_*********************"
                        className="bg-slate-800 border-slate-600 text-white flex-1"
                      />
                      <Button 
                        onClick={() => handleUpdateApiKey('elevenlabs')}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Icon name="Upload" size={18} className="mr-2" />
                        Обновить
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Используется для голосового помощника</p>
                  </div>

                  <div>
                    <Label htmlFor="openrouterKey" className="text-white mb-2 flex items-center gap-2">
                      <Icon name="MessageSquare" size={16} />
                      OpenRouter API Key
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="openrouterKey"
                        type="password"
                        value={apiKeys.openrouterKey}
                        onChange={e => setApiKeys({ ...apiKeys, openrouterKey: e.target.value })}
                        placeholder="sk-or-v1-*********************"
                        className="bg-slate-800 border-slate-600 text-white flex-1"
                      />
                      <Button 
                        onClick={() => handleUpdateApiKey('openrouter')}
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Icon name="Upload" size={18} className="mr-2" />
                        Обновить
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Используется для чат-бота</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Info" size={16} className="text-blue-400" />
                    Где взять API ключи?
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span><strong>ElevenLabs:</strong> elevenlabs.io → Settings → API Keys</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span><strong>OpenRouter:</strong> openrouter.ai → Keys → Create Key</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;