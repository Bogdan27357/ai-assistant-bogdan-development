import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CTASectionProps {
  darkMode: boolean;
}

const CTASection = ({ darkMode }: CTASectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className={`max-w-4xl mx-auto rounded-3xl p-12 text-center ${
        darkMode 
          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-800' 
          : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
      }`}>
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Начните работу с AI прямо сейчас
        </h2>
        <p className={`text-lg ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Откройте виджет в правом нижнем углу и начните диалог с помощником
        </p>
      </div>
    </section>
  );
};

export default CTASection;