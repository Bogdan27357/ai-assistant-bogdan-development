import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  onPasswordChange: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ onPasswordChange, onLogout }: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <Icon name="Settings" size={32} />
        Админ панель
      </h1>
      <div className="flex gap-2">
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Icon name="Home" size={16} className="mr-2" />
          Главная
        </Button>
        <Button
          onClick={onPasswordChange}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Icon name="Key" size={16} className="mr-2" />
          Сменить пароль
        </Button>
        <Button
          onClick={onLogout}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;
