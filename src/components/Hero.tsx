import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Language, getTranslations } from '@/lib/i18n';

interface HeroProps {
  onStartChat: () => void;
  language?: Language;
}

const Hero = ({ onStartChat, language = 'ru' }: HeroProps) => {
  const t = getTranslations(language).hero;
  
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent animate-gradient-shift bg-[length:200%_200%]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-8 backdrop-blur-sm shadow-lg">
            <Icon name="Sparkles" size={18} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t.badge}
            </span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
              {t.title}
            </span>
            <br />
            <span className="text-white text-5xl md:text-6xl">
              {t.subtitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            {t.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-5xl mx-auto">
            {[
              { icon: 'Code', text: t.codeGen, color: 'indigo' },
              { icon: 'FileText', text: t.docAnalysis, color: 'purple' },
              { icon: 'Languages', text: t.translations, color: 'blue' },
              { icon: 'Lightbulb', text: t.ideas, color: 'yellow' },
              { icon: 'Search', text: t.search, color: 'green' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-all hover:scale-105 hover:border-slate-600 shadow-lg"
              >
                <Icon name={item.icon as any} size={20} className={`text-${item.color}-400`} />
                <span className="text-sm font-medium text-gray-200">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
            <Button 
              size="lg" 
              onClick={onStartChat}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-110 border border-indigo-400/30"
            >
              <Icon name="MessageCircle" size={28} className="mr-3" />
              {t.startChat}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { icon: 'Zap', title: t.fast, desc: t.fastDesc, gradient: 'from-indigo-500 to-purple-600' },
              { icon: 'Brain', title: t.smart, desc: t.smartDesc, gradient: 'from-purple-500 to-blue-600' },
              { icon: 'Shield', title: t.secure, desc: t.secureDesc, gradient: 'from-blue-500 to-cyan-600' },
              { icon: 'Infinity', title: t.limitless, desc: t.limitlessDesc, gradient: 'from-cyan-500 to-indigo-600' },
            ].map((item, idx) => (
              <div key={idx} className="text-center animate-scale-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-2xl hover:scale-110 transition-transform`}>
                  <Icon name={item.icon as any} size={32} className="text-white" />
                </div>
                <div className="text-xl font-bold text-white mb-2">{item.title}</div>
                <div className="text-sm text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;