import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { Language, languages, getTranslations } from '@/lib/i18n';

interface NavigationProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const Navigation = ({ language = 'ru', onLanguageChange, darkMode = true, onToggleDarkMode }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslations(language);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 border border-white/20">
                <Icon name="Mic" size={20} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <h1 className="text-xl font-black text-white hidden md:block tracking-tight">
              SberSpeech
            </h1>
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

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-gray-300">
                  <Icon name="Menu" size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-slate-900/95 backdrop-blur-xl border-slate-700 w-64">
                <div className="flex flex-col gap-2 mt-8">
                  <p className="text-slate-400 text-sm px-2">SberSpeech Integration</p>
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
