import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AdminLoginProps {
  onSuccess: () => void;
}

const AdminLogin = ({ onSuccess }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/5fedd0d4-3448-4585-bd85-f0e04e5983d3?auth_action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.user) {
        if (data.user.is_admin) {
          localStorage.setItem('adminUser', JSON.stringify(data.user));
          localStorage.setItem('adminSession', Date.now().toString());
          toast.success('Вход выполнен успешно');
          onSuccess();
        } else {
          toast.error('У вас нет прав администратора');
        }
      } else {
        toast.error(data.error || 'Неверный email или пароль');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <Card className="bg-slate-900/80 border-slate-700 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <Icon name="Shield" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Вход в админ-панель</h1>
          <p className="text-slate-400 text-sm">Введите учетные данные администратора</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white mb-2">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-slate-800 border-slate-600 text-white"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white mb-2">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-800 border-slate-600 text-white"
              disabled={loading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-400 text-center">
            <Icon name="Info" size={14} className="inline mr-1" />
            Доступ только для администраторов
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;