import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  currentPage: 'home' | 'chat' | 'admin';
  onNavigate: (page: 'home' | 'chat' | 'admin') => void;
}

const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-blue-950/90 backdrop-blur-lg border-b border-indigo-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Brain" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Богдан
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className={currentPage === 'home' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </Button>
            <Button
              variant={currentPage === 'chat' ? 'default' : 'ghost'}
              onClick={() => onNavigate('chat')}
              className={currentPage === 'chat' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Чат
            </Button>
            <Button
              variant={currentPage === 'admin' ? 'default' : 'ghost'}
              onClick={() => onNavigate('admin')}
              className={currentPage === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              <Icon name="Settings" size={18} className="mr-2" />
              Админ
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
