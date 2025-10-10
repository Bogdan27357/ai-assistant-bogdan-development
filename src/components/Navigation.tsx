import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { Language, languages, getTranslations } from '@/lib/i18n';

interface NavigationProps {
  currentPage: 'home' | 'chat' | 'admin' | 'tools' | 'profile' | 'images' | 'prompts' | 'code' | 'assistants' | 'voice' | 'documents' | 'telegram' | 'history' | 'api' | 'auth';
  onNavigate: (page: any) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  user?: { email: string; name: string } | null;
  onAuthClick?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Navigation = ({ currentPage, onNavigate, language = 'ru', onLanguageChange, user, onAuthClick, darkMode = true, onToggleDarkMode }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslations(language);

  const menuItems = [
    { id: 'home', icon: 'Home', label: t.navigation.home },
    { id: 'chat', icon: 'MessageSquare', label: t.navigation.chat },
    { id: 'admin', icon: 'Settings', label: 'Админка' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 border border-white/20">
                <span className="text-2xl font-black text-white">B</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <h1 className="text-xl font-black text-white hidden md:block tracking-tight">
              Богдан
            </h1>
          </button>

          <div className="hidden md:flex items-center gap-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => handleNavigate(item.id)}
                className={currentPage === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white' : 'text-gray-300 hover:text-white'}
                size="sm"
              >
                <Icon name={item.icon as any} size={16} className="mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {onToggleDarkMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleDarkMode}
                className="text-gray-300 hover:text-white"
              >
                <Icon name={darkMode ? 'Sun' : 'Moon'} size={18} />
              </Button>
            )}
            
            {onLanguageChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
                    <Icon name="Globe" size={16} />
                    <span className="text-xl">{languages[language].flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700">
                  {Object.entries(languages).map(([code, lang]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => onLanguageChange(code as Language)}
                      className="text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <span className="mr-2 text-xl">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-300 hover:text-white">
                    <Icon name="User" size={16} />
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700">
                  <DropdownMenuItem
                    onClick={() => handleNavigate('profile')}
                    className="text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigate('admin')}
                    className="text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Настройки
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onAuthClick}
                className="hidden md:flex text-gray-300 hover:text-white"
              >
                <Icon name="LogIn" size={16} className="mr-2" />
                Вход
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-gray-300">
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900/95 backdrop-blur-xl border-slate-700 w-64">
                <div className="flex flex-col gap-2 mt-8">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentPage === item.id ? 'default' : 'ghost'}
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full justify-start ${currentPage === item.id ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
                    >
                      <Icon name={item.icon as any} size={16} className="mr-2" />
                      {item.label}
                    </Button>
                  ))}
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigate('profile')}
                        className="w-full justify-start text-gray-300 hover:text-white"
                      >
                        <Icon name="User" size={16} className="mr-2" />
                        Профиль
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigate('admin')}
                        className="w-full justify-start text-gray-300 hover:text-white"
                      >
                        <Icon name="Settings" size={16} className="mr-2" />
                        Настройки
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={onAuthClick}
                      className="w-full justify-start text-gray-300 hover:text-white"
                    >
                      <Icon name="LogIn" size={16} className="mr-2" />
                      Вход
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;