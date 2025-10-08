import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Language, getTranslations } from '@/lib/i18n';

interface FeaturesProps {
  language?: Language;
}

const Features = ({ language = 'ru' }: FeaturesProps) => {
  const t = getTranslations(language).features;
  
  const features = [
    {
      icon: 'Brain',
      title: t.reasoning,
      description: t.reasoningDesc,
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: 'Code',
      title: t.coding,
      description: t.codingDesc,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'Image',
      title: t.multimodal,
      description: t.multimodalDesc,
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: 'FileText',
      title: t.longContext,
      description: t.longContextDesc,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: 'Languages',
      title: t.translation,
      description: t.translationDesc,
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: 'Lightbulb',
      title: t.creative,
      description: t.creativeDesc,
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: 'BarChart',
      title: t.data,
      description: t.dataDesc,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      icon: 'Search',
      title: t.research,
      description: t.researchDesc,
      gradient: 'from-violet-500 to-indigo-600'
    },
    {
      icon: 'MessageSquare',
      title: t.chat,
      description: t.chatDesc,
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];
  
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Sparkles" size={18} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t.title}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t.subtitle}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 animate-scale-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <Icon name={feature.icon as any} size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
