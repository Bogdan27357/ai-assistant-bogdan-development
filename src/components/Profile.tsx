import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface ProfileProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

const Profile = ({ user, onLogout }: ProfileProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const updatedUser = { email, name };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Профиль обновлён!');
      setSaving(false);
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Вы вышли из аккаунта');
    onLogout();
  };

  const stats = [
    { icon: 'MessageCircle', label: 'Всего запросов', value: '142', gradient: 'from-indigo-500 to-purple-600' },
    { icon: 'Clock', label: 'Время в системе', value: '8ч 24м', gradient: 'from-purple-500 to-pink-600' },
    { icon: 'Zap', label: 'Активных сессий', value: '3', gradient: 'from-blue-500 to-cyan-600' },
    { icon: 'Star', label: 'Рейтинг', value: '4.9', gradient: 'from-yellow-500 to-orange-600' },
  ];

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">Личный кабинет</h1>
          <p className="text-gray-400">Управляйте своим профилем и настройками</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 p-6 text-center hover:scale-105 transition-all animate-scale-in backdrop-blur-xl shadow-xl group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon name={stat.icon as any} size={24} className="text-white" />
              </div>
              <div className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-indigo-600">
              <Icon name="History" size={16} className="mr-2" />
              История
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-indigo-600">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 p-8 backdrop-blur-xl shadow-xl">
              <div className="flex items-start gap-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                    <Icon name="User" size={64} className="text-white" />
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Icon name="Camera" size={16} />
                  </Button>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-white mb-2 block">
                      Имя
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {saving ? (
                        <>
                          <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Icon name="Save" size={18} className="mr-2" />
                          Сохранить
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Icon name="LogOut" size={18} className="mr-2" />
                      Выйти
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 p-8 backdrop-blur-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">История запросов</h3>
              <div className="space-y-4">
                {[
                  { question: 'Напиши код для сортировки массива', time: '2 часа назад', model: 'Gemini' },
                  { question: 'Переведи текст на английский', time: '5 часов назад', model: 'Llama' },
                  { question: 'Объясни квантовую механику', time: 'Вчера', model: 'DeepSeek' },
                  { question: 'Создай план проекта', time: '2 дня назад', model: 'GigaChat' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{item.question}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{item.time}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                            {item.model}
                          </span>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={20} className="text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 p-8 backdrop-blur-xl shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Настройки аккаунта</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-white font-medium">Уведомления по email</p>
                    <p className="text-sm text-gray-400">Получать уведомления на почту</p>
                  </div>
                  <Button variant="outline" className="border-slate-600">
                    Включить
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-white font-medium">Темная тема</p>
                    <p className="text-sm text-gray-400">Использовать темное оформление</p>
                  </div>
                  <Button variant="outline" className="border-slate-600">
                    Активна
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="text-white font-medium">Автосохранение</p>
                    <p className="text-sm text-gray-400">Сохранять историю чатов</p>
                  </div>
                  <Button variant="outline" className="border-slate-600">
                    Включено
                  </Button>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                    <Icon name="Trash2" size={18} className="mr-2" />
                    Удалить аккаунт
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
