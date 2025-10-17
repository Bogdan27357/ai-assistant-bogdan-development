import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  darkMode: boolean;
  showChat: boolean;
  toggleDarkMode: () => void;
  onToggleChat: () => void;
}

const Header = ({ darkMode, showChat, toggleDarkMode, onToggleChat }: HeaderProps) => {
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
                БогданGPT
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleDarkMode}
              variant="ghost"
              size="icon"
              className={darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}
            >
              <Icon name={darkMode ? 'Sun' : 'Moon'} size={20} />
            </Button>
            <Button
              onClick={onToggleChat}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Icon name="MessageSquare" size={18} className="mr-2" />
              {showChat ? 'На главную' : 'Начать общение'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;