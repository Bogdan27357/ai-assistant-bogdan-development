import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Admin {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

const AdminManagement = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/c19987e7-4131-461a-b588-ffe95460e8de', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'list_admins'
        })
      });

      const data = await response.json();
      
      if (response.ok && data.admins) {
        setAdmins(data.admins);
      }
    } catch (error) {
      toast.error('Ошибка загрузки списка администраторов');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.email.trim() || !newAdmin.password.trim() || !newAdmin.name.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    if (newAdmin.password.length < 6) {
      toast.error('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/c19987e7-4131-461a-b588-ffe95460e8de', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_admin',
          email: newAdmin.email,
          password: newAdmin.password,
          name: newAdmin.name
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Администратор успешно создан');
        setNewAdmin({ email: '', password: '', name: '' });
        setShowCreateForm(false);
        loadAdmins();
      } else {
        toast.error(data.error || 'Ошибка создания администратора');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: number, email: string) => {
    if (!confirm(`Удалить администратора ${email}?`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/c19987e7-4131-461a-b588-ffe95460e8de', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_admin',
          admin_id: adminId
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Администратор удалён');
        loadAdmins();
      } else {
        toast.error(data.error || 'Ошибка удаления');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Управление администраторами</h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Icon name={showCreateForm ? "X" : "Plus"} size={18} className="mr-2" />
          {showCreateForm ? 'Отмена' : 'Добавить администратора'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-slate-800/50 border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Создание нового администратора</h3>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <Label htmlFor="newName" className="text-white mb-2">Имя</Label>
              <Input
                id="newName"
                value={newAdmin.name}
                onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Иван Иванов"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="newEmail" className="text-white mb-2">Email</Label>
              <Input
                id="newEmail"
                type="email"
                value={newAdmin.email}
                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="admin@example.com"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-white mb-2">Пароль</Label>
              <Input
                id="newPassword"
                type="password"
                value={newAdmin.password}
                onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder="Минимум 6 символов"
                className="bg-slate-700 border-slate-600 text-white"
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={loading}
            >
              <Icon name="UserPlus" size={18} className="mr-2" />
              Создать администратора
            </Button>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {loading && admins.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={32} className="text-slate-400 animate-spin mx-auto mb-2" />
            <p className="text-slate-400">Загрузка...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400">Нет администраторов</p>
          </div>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id} className="bg-slate-800/50 border-slate-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{admin.name}</p>
                    <p className="text-slate-400 text-sm">{admin.email}</p>
                    <p className="text-slate-500 text-xs">
                      Создан: {new Date(admin.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                  variant="destructive"
                  size="sm"
                  disabled={loading}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Удалить
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Icon name="Info" size={16} className="text-blue-400" />
          Важная информация
        </h3>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">•</span>
            <span>Администраторы имеют полный доступ к панели управления</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">•</span>
            <span>Пароль должен быть не менее 6 символов</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-bold">•</span>
            <span>Будьте осторожны при удалении администраторов</span>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default AdminManagement;
