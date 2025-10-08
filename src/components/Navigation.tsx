import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { Language, languages, getTranslations } from '@/lib/i18n';

interface NavigationProps {
  currentPage: 'home' | 'chat' | 'admin' | 'features' | 'tools' | 'profile' | 'images' | 'prompts' | 'code' | 'assistants' | 'voice' | 'documents' | 'telegram' | 'history' | 'api' | 'content-editor';
  onNavigate: (page: 'home' | 'chat' | 'admin' | 'features' | 'tools' | 'profile' | 'images' | 'prompts' | 'code' | 'assistants' | 'voice' | 'documents' | 'telegram' | 'history' | 'api' | 'content-editor') => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  user?: { email: string; name: string } | null;
  onAuthClick?: () => void;
}

const Navigation = ({ currentPage, onNavigate, language = 'ru', onLanguageChange, user, onAuthClick }: NavigationProps) => {
  const t = getTranslations(language);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-indigo-500/20 transition-all duration-300 hover:border-indigo-500/40">
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

          <div className="flex items-center gap-3">
            {onLanguageChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Icon name="Globe" size={16} />
                    <span className="text-xl">{languages[language].flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-700">
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
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className={currentPage === 'home' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              size="sm"
            >
              <Icon name="Home" size={16} className="mr-2" />
              {t.navigation.home}
            </Button>
            <Button
              variant={currentPage === 'chat' ? 'default' : 'ghost'}
              onClick={() => onNavigate('chat')}
              className={currentPage === 'chat' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              size="sm"
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              {t.navigation.chat}
            </Button>
            <Button
              variant={currentPage === 'features' ? 'default' : 'ghost'}
              onClick={() => onNavigate('features')}
              className={currentPage === 'features' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              size="sm"
            >
              <Icon name="Sparkles" size={16} className="mr-2" />
              {t.navigation.features}
            </Button>
            <Button
              variant={currentPage === 'tools' ? 'default' : 'ghost'}
              onClick={() => onNavigate('tools')}
              className={currentPage === 'tools' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              size="sm"
            >
              <Icon name="Wrench" size={16} className="mr-2" />
              {t.navigation.tools}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={['images', 'prompts', 'code', 'assistants', 'voice', 'documents', 'telegram', 'history', 'api', 'content-editor'].includes(currentPage) ? 'default' : 'ghost'}
                  className={['images', 'prompts', 'code', 'assistants', 'voice', 'documents', 'telegram', 'history', 'api', 'content-editor'].includes(currentPage) ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                  size="sm"
                >
                  <Icon name="Grid3x3" size={16} className="mr-2" />
                  Ещё
                  <Icon name="ChevronDown" size={14} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border-slate-700 max-h-96 overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => onNavigate('images')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Image" size={16} className="mr-2" />
                  Генератор изображений
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('prompts')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Library" size={16} className="mr-2" />
                  Библиотека промптов
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('code')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Code" size={16} className="mr-2" />
                  Code Playground
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('assistants')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Users" size={16} className="mr-2" />
                  AI Ассистенты
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('voice')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Mic" size={16} className="mr-2" />
                  Голосовой интерфейс
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('documents')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="FileStack" size={16} className="mr-2" />
                  Обработка документов
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('telegram')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Telegram бот
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('history')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="History" size={16} className="mr-2" />
                  История диалогов
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('api')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Code2" size={16} className="mr-2" />
                  API для разработчиков
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onNavigate('content-editor')}
                  className="text-white hover:bg-slate-800 cursor-pointer"
                >
                  <Icon name="Edit" size={16} className="mr-2" />
                  Редактор контента
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant={currentPage === 'admin' ? 'default' : 'ghost'}
              onClick={() => onNavigate('admin')}
              className={currentPage === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
              size="sm"
            >
              <Icon name="Settings" size={16} className="mr-2" />
              {t.navigation.admin}
            </Button>
            
            {user ? (
              <Button
                variant={currentPage === 'profile' ? 'default' : 'ghost'}
                onClick={() => onNavigate('profile')}
                className={currentPage === 'profile' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                size="sm"
              >
                <Icon name="User" size={16} className="mr-2" />
                {user.name}
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={onAuthClick}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                size="sm"
              >
                <Icon name="LogIn" size={16} className="mr-2" />
                {t.navigation.login}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;