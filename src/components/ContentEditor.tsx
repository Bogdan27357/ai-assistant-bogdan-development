import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  telegram: string;
  photo: string;
  description: string;
}

interface ContentData {
  team: TeamMember[];
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutDescription: string;
}

const ContentEditor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<ContentData>({
    team: [],
    heroTitle: 'О нас',
    heroSubtitle: 'Работая в отделе дополнительного обслуживания пассажиров аэропорта Пулково...',
    aboutTitle: 'Работая в аэропорту Пулково',
    aboutDescription: 'мы ежедневно сталкивались с тысячами вопросов от путешественников...'
  });

  useEffect(() => {
    const savedContent = localStorage.getItem('site_content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      setContent({
        team: [
          {
            id: '1',
            name: 'Богдан Копаев',
            role: 'Создатель',
            telegram: '@Bogdan2733',
            photo: 'https://cdn.poehali.dev/files/7bf062e6-83f5-4f27-bfde-bf075558730b.png',
            description: 'Агент отдела дополнительного обслуживания пассажиров, Аэропорт Пулково'
          },
          {
            id: '2',
            name: 'Андрей Пашков',
            role: 'Заместитель создателя',
            telegram: '@suvarchikk',
            photo: 'https://cdn.poehali.dev/files/7bf062e6-83f5-4f27-bfde-bf075558730b.png',
            description: 'Агент отдела дополнительного обслуживания пассажиров, Аэропорт Пулково'
          }
        ],
        heroTitle: 'О нас',
        heroSubtitle: 'Работая в отделе дополнительного обслуживания пассажиров аэропорта Пулково, мы ежедневно сталкивались с тысячами вопросов от путешественников.',
        aboutTitle: 'Сделано с ❤️ в Пулково',
        aboutDescription: 'Богдан — это не просто ИИ-помощник. Это результат работы команды профессионалов из аэропорта Пулково, которые каждый день помогают тысячам путешественников.'
      });
    }
    
    const auth = localStorage.getItem('admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      toast.success('Доступ разрешен');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
    toast.success('Вы вышли из админ-панели');
  };

  const saveContent = () => {
    localStorage.setItem('site_content', JSON.stringify(content));
    window.dispatchEvent(new Event('content-updated'));
    toast.success('Контент сохранен и обновлен на сайте');
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    const newTeam = content.team.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    );
    setContent({ ...content, team: newTeam });
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'Новый сотрудник',
      role: 'Должность',
      telegram: '@username',
      photo: 'https://cdn.poehali.dev/files/7bf062e6-83f5-4f27-bfde-bf075558730b.png',
      description: 'Описание сотрудника'
    };
    setContent({ ...content, team: [...content.team, newMember] });
    toast.success('Новый сотрудник добавлен');
  };

  const deleteTeamMember = (id: string) => {
    if (confirm('Удалить этого сотрудника?')) {
      const newTeam = content.team.filter(member => member.id !== id);
      setContent({ ...content, team: newTeam });
      toast.success('Сотрудник удален');
    }
  };

  const uploadImage = async (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          updateTeamMember(id, 'photo', reader.result as string);
          toast.success('Фото загружено');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="bg-slate-900/50 border-slate-700 p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Icon name="Lock" size={48} className="text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Админ-панель</h2>
            <p className="text-slate-400">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="bg-slate-800 border-slate-700"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Icon name="Settings" size={40} className="text-indigo-400" />
              Редактор контента
            </h1>
            <p className="text-slate-400">Управление содержимым сайта</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-slate-700">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Icon name="Users" size={24} className="text-indigo-400" />
                Команда ({content.team.length})
              </h3>
              <Button onClick={addTeamMember} className="bg-emerald-600 hover:bg-emerald-700">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить сотрудника
              </Button>
            </div>
            
            <div className="space-y-6">
              {content.team.map((member) => (
                <Card key={member.id} className="bg-slate-800/50 border-slate-700 p-6 relative">
                  <Button
                    onClick={() => deleteTeamMember(member.id)}
                    className="absolute top-4 right-4 bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Icon name="Trash2" size={16} className="mr-1" />
                    Удалить
                  </Button>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Имя</label>
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Должность</label>
                        <Input
                          value={member.role}
                          onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Telegram</label>
                        <Input
                          value={member.telegram}
                          onChange={(e) => updateTeamMember(member.id, 'telegram', e.target.value)}
                          placeholder="@username"
                          className="bg-slate-800 border-slate-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Фото</label>
                        {member.photo && (
                          <img 
                            src={member.photo} 
                            alt={member.name}
                            className="w-32 h-32 rounded-full object-cover mb-2 border-4 border-indigo-500"
                          />
                        )}
                        <Button onClick={() => uploadImage(member.id)} variant="outline" className="border-slate-700">
                          <Icon name="Upload" size={16} className="mr-2" />
                          Загрузить фото
                        </Button>
                      </div>
                      
                      <div>
                        <label className="text-sm text-slate-400 mb-2 block">Описание</label>
                        <Textarea
                          value={member.description}
                          onChange={(e) => updateTeamMember(member.id, 'description', e.target.value)}
                          className="bg-slate-800 border-slate-700"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700 p-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="Type" size={24} className="text-indigo-400" />
              Тексты страницы
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Заголовок Hero</label>
                <Input
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Подзаголовок Hero</label>
                <Textarea
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Заголовок О нас</label>
                <Input
                  value={content.aboutTitle}
                  onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Описание О нас</label>
                <Textarea
                  value={content.aboutDescription}
                  onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button onClick={saveContent} className="bg-indigo-600 hover:bg-indigo-700">
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;