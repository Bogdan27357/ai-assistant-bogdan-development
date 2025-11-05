import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header = ({ darkMode, toggleDarkMode }: HeaderProps) => {
  return (
    <header className={`border-b ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white/50'} backdrop-blur-lg sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Bot" size={24} className="text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                AI Platform
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => window.location.href = '/admin'}
              variant="ghost"
              size="sm"
              className={darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}
            >
              <Icon name="Settings" size={16} className="mr-2" />
              Админ
            </Button>
            <Button
              onClick={toggleDarkMode}
              variant="ghost"
              size="icon"
              className={darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}
            >
              <Icon name={darkMode ? 'Sun' : 'Moon'} size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;