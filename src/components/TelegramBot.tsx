import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface BotConfig {
  token: string;
  name: string;
  username: string;
  isActive: boolean;
}

interface BotCommand {
  command: string;
  description: string;
  response: string;
  enabled: boolean;
}

interface BotMessage {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
  isBot: boolean;
}

const TelegramBot = () => {
  const [botConfig, setBotConfig] = useState<BotConfig>({
    token: '',
    name: 'AI Assistant Bot',
    username: 'my_ai_bot',
    isActive: false
  });

  const [commands, setCommands] = useState<BotCommand[]>([
    { command: '/start', description: 'Начать общение', response: 'Привет! Я AI бот. Чем могу помочь?', enabled: true },
    { command: '/help', description: 'Показать помощь', response: 'Доступные команды:\n/start - Начать\n/help - Помощь\n/settings - Настройки', enabled: true },
    { command: '/settings', description: 'Настройки бота', response: 'Настройки бота', enabled: true },
    { command: '/ask', description: 'Задать вопрос AI', response: 'Задайте ваш вопрос...', enabled: true },
  ]);

  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [newCommand, setNewCommand] = useState({ command: '', description: '', response: '' });
  const [webhookUrl, setWebhookUrl] = useState('https://your-app.com/webhook');
  const [isWebhookEnabled, setIsWebhookEnabled] = useState(false);

  const handleTokenSave = () => {
    if (!botConfig.token) {
      toast.error('Введите токен бота');
      return;
    }
    
    toast.success('Токен сохранен! (демо режим)');
  };

  const toggleBot = () => {
    if (!botConfig.token) {
      toast.error('Сначала добавьте токен бота');
      return;
    }

    setBotConfig(prev => ({ ...prev, isActive: !prev.isActive }));
    toast.success(botConfig.isActive ? 'Бот остановлен' : 'Бот запущен!');

    if (!botConfig.isActive) {
      const welcomeMsg: BotMessage = {
        id: Date.now().toString(),
        user: 'System',
        text: 'Бот запущен и готов к работе',
        timestamp: new Date(),
        isBot: true
      };
      setMessages(prev => [...prev, welcomeMsg]);
    }
  };

  const addCommand = () => {
    if (!newCommand.command || !newCommand.response) {
      toast.error('Заполните все поля');
      return;
    }

    if (!newCommand.command.startsWith('/')) {
      toast.error('Команда должна начинаться с /');
      return;
    }

    const command: BotCommand = {
      ...newCommand,
      enabled: true
    };

    setCommands(prev => [...prev, command]);
    setNewCommand({ command: '', description: '', response: '' });
    toast.success('Команда добавлена');
  };

  const toggleCommand = (index: number) => {
    setCommands(prev =>
      prev.map((cmd, i) => (i === index ? { ...cmd, enabled: !cmd.enabled } : cmd))
    );
  };

  const deleteCommand = (index: number) => {
    setCommands(prev => prev.filter((_, i) => i !== index));
    toast.success('Команда удалена');
  };

  const setupWebhook = () => {
    if (!webhookUrl) {
      toast.error('Введите URL webhook');
      return;
    }

    setIsWebhookEnabled(true);
    toast.success('Webhook настроен');
  };

  const simulateMessage = () => {
    const userMsg: BotMessage = {
      id: Date.now().toString(),
      user: 'TestUser',
      text: '/start',
      timestamp: new Date(),
      isBot: false
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const botMsg: BotMessage = {
        id: (Date.now() + 1).toString(),
        user: 'Bot',
        text: 'Привет! Я AI бот. Чем могу помочь?',
        timestamp: new Date(),
        isBot: true
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const exportConfig = () => {
    const config = {
      botConfig,
      commands: commands.filter(cmd => cmd.enabled),
      webhookUrl: isWebhookEnabled ? webhookUrl : null
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'telegram_bot_config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Конфигурация экспортирована');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon name="Send" size={40} className="text-blue-400" />
            Telegram бот
          </h1>
          <p className="text-slate-400">Создайте и настройте AI бота для Telegram</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <Tabs defaultValue="setup" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                  <TabsTrigger value="setup">Настройка</TabsTrigger>
                  <TabsTrigger value="commands">Команды</TabsTrigger>
                  <TabsTrigger value="webhook">Webhook</TabsTrigger>
                  <TabsTrigger value="test">Тест</TabsTrigger>
                </TabsList>

                <TabsContent value="setup" className="space-y-6 mt-6">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      Токен бота <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={botConfig.token}
                        onChange={(e) => setBotConfig(prev => ({ ...prev, token: e.target.value }))}
                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                        className="bg-slate-800 border-slate-700 flex-1"
                      />
                      <Button onClick={handleTokenSave} className="bg-blue-600 hover:bg-blue-700">
                        <Icon name="Save" size={16} className="mr-2" />
                        Сохранить
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Получите токен у <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@BotFather</a>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Имя бота</label>
                    <Input
                      value={botConfig.name}
                      onChange={(e) => setBotConfig(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Username</label>
                    <Input
                      value={botConfig.username}
                      onChange={(e) => setBotConfig(prev => ({ ...prev, username: e.target.value }))}
                      className="bg-slate-800 border-slate-700"
                      placeholder="my_bot"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Статус бота</p>
                      <p className="text-sm text-slate-400">
                        {botConfig.isActive ? '🟢 Активен' : '🔴 Остановлен'}
                      </p>
                    </div>
                    <Button
                      onClick={toggleBot}
                      className={botConfig.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                    >
                      <Icon name={botConfig.isActive ? "Square" : "Play"} size={16} className="mr-2" />
                      {botConfig.isActive ? 'Остановить' : 'Запустить'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="commands" className="space-y-6 mt-6">
                  <div className="bg-slate-800 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4">Добавить команду</h3>
                    <div className="space-y-3">
                      <Input
                        value={newCommand.command}
                        onChange={(e) => setNewCommand(prev => ({ ...prev, command: e.target.value }))}
                        placeholder="/mycommand"
                        className="bg-slate-900 border-slate-700"
                      />
                      <Input
                        value={newCommand.description}
                        onChange={(e) => setNewCommand(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Описание команды"
                        className="bg-slate-900 border-slate-700"
                      />
                      <Textarea
                        value={newCommand.response}
                        onChange={(e) => setNewCommand(prev => ({ ...prev, response: e.target.value }))}
                        placeholder="Ответ бота на эту команду"
                        className="bg-slate-900 border-slate-700 min-h-20"
                      />
                      <Button onClick={addCommand} className="w-full bg-blue-600 hover:bg-blue-700">
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить команду
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-4">Список команд</h3>
                    <div className="space-y-3">
                      {commands.map((cmd, index) => (
                        <div
                          key={index}
                          className="bg-slate-800 rounded-lg p-4 flex items-start justify-between gap-4"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <code className="text-blue-400 font-mono">{cmd.command}</code>
                              <Badge variant={cmd.enabled ? "default" : "secondary"}>
                                {cmd.enabled ? 'Активна' : 'Выключена'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-400 mb-2">{cmd.description}</p>
                            <p className="text-xs text-slate-500">{cmd.response}</p>
                          </div>
                          <div className="flex gap-2">
                            <Switch
                              checked={cmd.enabled}
                              onCheckedChange={() => toggleCommand(index)}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCommand(index)}
                            >
                              <Icon name="Trash2" size={16} className="text-red-400" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="webhook" className="space-y-6 mt-6">
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" size={20} className="text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-white font-medium mb-1">Что такое Webhook?</p>
                        <p className="text-xs text-slate-300">
                          Webhook позволяет Telegram отправлять обновления прямо на ваш сервер.
                          Это более эффективно, чем постоянные запросы.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">
                      URL Webhook
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-domain.com/webhook"
                        className="bg-slate-800 border-slate-700 flex-1"
                      />
                      <Button onClick={setupWebhook} className="bg-blue-600 hover:bg-blue-700">
                        Установить
                      </Button>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-white font-medium">Статус Webhook</p>
                      <Badge variant={isWebhookEnabled ? "default" : "secondary"}>
                        {isWebhookEnabled ? '✅ Активен' : '❌ Не настроен'}
                      </Badge>
                    </div>
                    {isWebhookEnabled && (
                      <div className="text-sm text-slate-300">
                        <p className="mb-1">URL: <code className="text-blue-400">{webhookUrl}</code></p>
                        <p>Последнее обновление: только что</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-3">Пример кода сервера</h4>
                    <pre className="bg-slate-900 p-4 rounded text-xs text-slate-300 overflow-x-auto">
{`// Express.js пример
app.post('/webhook', (req, res) => {
  const { message } = req.body;
  
  if (message?.text) {
    // Обработка сообщения
    const chatId = message.chat.id;
    const text = message.text;
    
    // Отправка ответа
    sendMessage(chatId, 'Ответ бота');
  }
  
  res.sendStatus(200);
});`}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="test" className="space-y-6 mt-6">
                  <div className="text-center">
                    <Button onClick={simulateMessage} className="bg-blue-600 hover:bg-blue-700">
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Симулировать сообщение
                    </Button>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
                    <h3 className="text-white font-medium mb-4">Лог сообщений</h3>
                    {messages.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">Нет сообщений</p>
                    ) : (
                      <div className="space-y-3">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded ${
                              msg.isBot ? 'bg-blue-900/30' : 'bg-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon
                                name={msg.isBot ? "Bot" : "User"}
                                size={14}
                                className={msg.isBot ? 'text-blue-400' : 'text-green-400'}
                              />
                              <span className="text-xs text-slate-400">{msg.user}</span>
                              <span className="text-xs text-slate-500 ml-auto">
                                {msg.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm text-white">{msg.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Settings" size={20} className="text-blue-400" />
                Быстрые действия
              </h3>
              <div className="space-y-3">
                <Button onClick={exportConfig} className="w-full bg-slate-800 hover:bg-slate-700 justify-start">
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт конфигурации
                </Button>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 justify-start">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Импорт конфигурации
                </Button>
                <Button className="w-full bg-slate-800 hover:bg-slate-700 justify-start">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Документация API
                </Button>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border-blue-500/30 p-6">
              <h3 className="text-lg font-bold text-white mb-3">📚 Инструкция</h3>
              <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
                <li>Получите токен у @BotFather</li>
                <li>Введите токен в настройках</li>
                <li>Настройте команды бота</li>
                <li>Установите webhook (опционально)</li>
                <li>Запустите бота</li>
                <li>Протестируйте работу</li>
              </ol>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-3">✨ Возможности</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✅ Пользовательские команды</li>
                <li>✅ AI интеграция</li>
                <li>✅ Webhook поддержка</li>
                <li>✅ Тестирование</li>
                <li>✅ Экспорт/импорт</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramBot;
