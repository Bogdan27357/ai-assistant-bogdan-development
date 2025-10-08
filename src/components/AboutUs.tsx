import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/i18n';

interface AboutUsProps {
  language?: Language;
}

const AboutUs = ({ language = 'ru' }: AboutUsProps) => {
  const isRu = language === 'ru';

  const stats = [
    { value: '99.9%', label: isRu ? 'Точность' : 'Accuracy', icon: 'Target' },
    { value: '<1s', label: isRu ? 'Скорость ответа' : 'Response Time', icon: 'Zap' },
    { value: '24/7', label: isRu ? 'Доступность' : 'Availability', icon: 'Clock' },
    { value: '∞', label: isRu ? 'Возможности' : 'Capabilities', icon: 'Infinity' },
  ];

  const features = [
    {
      icon: 'Brain',
      title: isRu ? 'Интеллектуальный анализ' : 'Intelligent Analysis',
      desc: isRu 
        ? 'Глубокое понимание контекста и намерений пользователя для точных ответов'
        : 'Deep understanding of context and user intent for precise responses',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      icon: 'Globe',
      title: isRu ? 'Мультиязычность' : 'Multilingual',
      desc: isRu 
        ? 'Поддержка 70+ языков для общения с людьми по всему миру'
        : 'Support for 70+ languages to communicate with people worldwide',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'Shield',
      title: isRu ? 'Безопасность данных' : 'Data Security',
      desc: isRu 
        ? 'Современные технологии шифрования и защиты конфиденциальности'
        : 'Modern encryption and privacy protection technologies',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: 'Rocket',
      title: isRu ? 'Постоянное развитие' : 'Continuous Evolution',
      desc: isRu 
        ? 'Регулярные обновления и новые возможности на основе обратной связи'
        : 'Regular updates and new features based on feedback',
      gradient: 'from-cyan-500 to-green-600'
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Info" size={18} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {isRu ? 'О проекте' : 'About Project'}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {isRu ? 'Сделано с ❤️ в Пулково' : 'Made with ❤️ at Pulkovo'}
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {isRu 
              ? 'Богдан — это не просто ИИ-помощник. Это результат работы команды профессионалов из аэропорта Пулково, которые каждый день помогают тысячам путешественников.'
              : 'Bogdan is not just an AI assistant. It\'s the result of work by professionals from Pulkovo Airport who help thousands of travelers every day.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <Card 
              key={idx}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 p-8 text-center hover:scale-105 transition-transform animate-scale-in backdrop-blur-sm shadow-2xl"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Icon name={stat.icon as any} size={28} className="text-white" />
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, idx) => (
            <Card 
              key={idx}
              className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 p-8 hover:border-indigo-500/50 transition-all animate-fade-in backdrop-blur-sm shadow-xl hover:shadow-2xl group"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <div className="flex items-start gap-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon name={feature.icon as any} size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 p-12 text-center backdrop-blur-sm shadow-2xl animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
              <Icon name="Heart" size={40} className="text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">
              {isRu ? 'Наша миссия' : 'Our Mission'}
            </h3>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {isRu 
                ? 'Мы создали Богдана, чтобы сделать общение с технологиями максимально простым и эффективным. Наш опыт работы в одном из крупнейших аэропортов России помог нам понять, что нужно людям в современном мире.'
                : 'We created Bogdan to make communication with technology as simple and efficient as possible. Our experience working at one of Russia\'s largest airports helped us understand what people need in the modern world.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20">
                <Icon name="Users" size={20} className="text-indigo-400" />
                <span className="text-white font-semibold">{isRu ? 'Для людей' : 'For People'}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20">
                <Icon name="Sparkles" size={20} className="text-purple-400" />
                <span className="text-white font-semibold">{isRu ? 'С технологиями' : 'With Technology'}</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 border border-white/20">
                <Icon name="Heart" size={20} className="text-pink-400" />
                <span className="text-white font-semibold">{isRu ? 'От сердца' : 'From Heart'}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutUs;
