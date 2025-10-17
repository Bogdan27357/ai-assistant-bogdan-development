import Icon from '@/components/ui/icon';

interface SiteFooterProps {
  darkMode: boolean;
}

const SiteFooter = ({ darkMode }: SiteFooterProps) => {
  return (
    <footer className={`border-t ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'} py-8`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Icon name="Bot" size={18} className="text-white" />
            </div>
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              МашаGPT
            </span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            © 2024 МашаGPT. Все нейросети в одном месте.
          </p>
          <div className="flex gap-4">
            <a href="#" className={`text-sm ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              Политика
            </a>
            <a href="#" className={`text-sm ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
              Условия
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;