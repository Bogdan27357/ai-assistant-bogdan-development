import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/i18n';

interface AboutUsProps {
  language?: Language;
}

const AboutUs = ({ language = 'ru' }: AboutUsProps) => {
  const isRu = language === 'ru';

  const stats = [
    { value: '99.9%', label: isRu ? 'Точность ответов' : 'Answer Accuracy', icon: 'Target', gradient: 'from-emerald-500 to-green-600' },
    { value: '<1s', label: isRu ? 'Скорость ответа' : 'Response Time', icon: 'Zap', gradient: 'from-yellow-500 to-orange-600' },
    { value: '24/7', label: isRu ? 'Доступность' : 'Availability', icon: 'Clock', gradient: 'from-blue-500 to-cyan-600' },
    { value: '∞', label: isRu ? 'Возможности' : 'Capabilities', icon: 'Infinity', gradient: 'from-purple-500 to-pink-600' },
  ];

  const team = [
    {
      name: 'Богдан Копаев',
      role: isRu ? 'Создатель' : 'Creator',
      position: isRu ? 'Агент отдела дополнительного обслуживания пассажиров' : 'Passenger Service Agent',
      image: 'https://cdn.poehali.dev/files/5fc6fcd5-6e3d-43da-853e-c5244ae6d026.png',
      gradient: 'from-purple-500 to-violet-600',
      borderGradient: 'from-purple-500/50 to-violet-600/50'
    },
    {
      name: 'Андрей Пашков',
      role: isRu ? 'Заместитель создателя' : 'Co-Creator',
      position: isRu ? 'Агент отдела дополнительного обслуживания пассажиров' : 'Passenger Service Agent',
      image: 'https://cdn.poehali.dev/files/b273b4f3-9e5a-4903-9a20-079f3956ace6.png',
      gradient: 'from-indigo-500 to-blue-600',
      borderGradient: 'from-indigo-500/50 to-blue-600/50'
    }
  ];

  const features = [
    {
      icon: 'Brain',
      title: isRu ? 'Интеллектуальный анализ' : 'Intelligent Analysis',
      desc: isRu 
        ? 'Глубокое понимание контекста и намерений пользователя для точных ответов'
        : 'Deep understanding of context and user intent for precise responses',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-500/10 to-purple-600/10'
    },
    {
      icon: 'Globe',
      title: isRu ? 'Мультиязычность' : 'Multilingual',
      desc: isRu 
        ? 'Свободное общение на 70+ языках мира для комфортной работы с международной аудиторией'
        : 'Fluent communication in 70+ world languages for comfortable work with international audience',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10'
    },
    {
      icon: 'Shield',
      title: isRu ? 'Безопасность данных' : 'Data Security',
      desc: isRu 
        ? 'Современные технологии шифрования и многоуровневая защита конфиденциальной информации'
        : 'Modern encryption technologies and multi-level protection of confidential information',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-600/10'
    },
    {
      icon: 'Rocket',
      title: isRu ? 'Постоянное развитие' : 'Continuous Evolution',
      desc: isRu 
        ? 'Регулярные обновления и новые возможности на основе обратной связи пользователей'
        : 'Regular updates and new features based on user feedback',
      gradient: 'from-cyan-500 to-green-600',
      bgGradient: 'from-cyan-500/10 to-green-600/10'
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent" />
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm shadow-lg">
            <Icon name="Heart" size={20} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {isRu ? 'О проекте' : 'About Project'}
            </span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
            {isRu ? 'Сделано с ❤️ в Пулково' : 'Made with ❤️ at Pulkovo'}
          </h2>
          
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            {isRu 
              ? 'Богдан — это не просто ИИ-помощник. Это результат работы команды профессионалов из аэропорта Пулково, которые каждый день помогают тысячам путешественников.'
              : 'Bogdan is not just an AI assistant. It\'s the result of work by professionals from Pulkovo Airport who help thousands of travelers every day.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <Card 
              key={idx}
              className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 p-10 text-center hover:scale-110 transition-all duration-500 animate-scale-in backdrop-blur-xl shadow-2xl hover:shadow-indigo-500/30 group cursor-pointer"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={stat.icon as any} size={36} className="text-white" />
              </div>
              <div className={`text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="mb-24">
          <h3 className="text-4xl font-black text-center text-white mb-4">
            {isRu ? 'Люди, которые создали Богдана' : 'People Who Created Bogdan'}
          </h3>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            {isRu 
              ? 'Профессионалы аэропорта Пулково, каждый день помогающие тысячам путешественников'
              : 'Pulkovo Airport professionals helping thousands of travelers every day'}
          </p>
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {team.map((member, idx) => (
              <Card 
                key={idx}
                className="p-0 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-slate-700/50 hover:border-transparent transition-all duration-500 animate-scale-in backdrop-blur-xl shadow-2xl hover:shadow-indigo-500/40 group cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${member.borderGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                      <div className={`relative w-48 h-48 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-br ${member.gradient} p-1`}>
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-3xl font-black text-white mb-2 group-hover:text-indigo-300 transition-colors">{member.name}</h4>
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${member.gradient} mb-4`}>
                      <p className="text-white font-bold text-sm">{member.role}</p>
                    </div>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {member.position}
                      <br />
                      <span className="text-indigo-400 font-semibold">{isRu ? 'Аэропорт Пулково' : 'Pulkovo Airport'}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-indigo-900/60 via-purple-900/50 to-pink-900/40 border-2 border-indigo-500/40 p-16 text-center backdrop-blur-xl shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift bg-[length:200%_200%]" />
          <div className="relative max-w-4xl mx-auto">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-50" />
              <div className="relative w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Icon name="Heart" size={48} className="text-white" />
              </div>
            </div>
            <h3 className="text-5xl font-black text-white mb-6">
              {isRu ? 'Наша миссия' : 'Our Mission'}
            </h3>
            <p className="text-2xl text-gray-200 leading-relaxed mb-8 font-light">
              {isRu 
                ? 'Мы создали Богдана, чтобы сделать общение с технологиями максимально простым и эффективным. Наш опыт работы в одном из крупнейших аэропортов России помог нам понять, что нужно людям в современном мире.'
                : 'We created Bogdan to make communication with technology as simple and efficient as possible. Our experience working at one of Russia\'s largest airports helped us understand what people need in the modern world.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: 'Users', text: isRu ? 'Для людей' : 'For People', gradient: 'from-indigo-500 to-blue-600' },
                { icon: 'Sparkles', text: isRu ? 'С технологиями' : 'With Technology', gradient: 'from-purple-500 to-pink-600' },
                { icon: 'Heart', text: isRu ? 'От сердца' : 'From Heart', gradient: 'from-pink-500 to-red-600' }
              ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r ${item.gradient} shadow-xl hover:scale-110 transition-transform cursor-pointer`}>
                  <Icon name={item.icon as any} size={24} className="text-white" />
                  <span className="text-white font-bold text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AboutUs;