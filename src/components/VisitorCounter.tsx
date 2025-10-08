import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

const VisitorCounter = () => {
  const [stats, setStats] = useState({
    online: 0,
    today: 0,
    total: 0
  });

  useEffect(() => {
    const savedStats = localStorage.getItem('visitorStats');
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisit');

    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      
      if (lastVisit !== today) {
        const newStats = {
          online: Math.floor(Math.random() * 15) + 5,
          today: 1,
          total: parsed.total + 1
        };
        setStats(newStats);
        localStorage.setItem('visitorStats', JSON.stringify(newStats));
        localStorage.setItem('lastVisit', today);
      } else {
        setStats(parsed);
      }
    } else {
      const initialStats = {
        online: Math.floor(Math.random() * 15) + 5,
        today: 1,
        total: Math.floor(Math.random() * 1000) + 5000
      };
      setStats(initialStats);
      localStorage.setItem('visitorStats', JSON.stringify(initialStats));
      localStorage.setItem('lastVisit', today);
    }

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        online: Math.max(1, prev.online + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const counterStats = [
    {
      icon: 'Users',
      label: 'Онлайн сейчас',
      value: stats.online,
      color: 'from-green-500 to-emerald-600',
      pulse: true
    },
    {
      icon: 'TrendingUp',
      label: 'Сегодня',
      value: stats.today,
      color: 'from-blue-500 to-cyan-600',
      pulse: false
    },
    {
      icon: 'BarChart',
      label: 'Всего посещений',
      value: stats.total.toLocaleString(),
      color: 'from-purple-500 to-pink-600',
      pulse: false
    }
  ];

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-slate-950 to-indigo-950">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-6">
          {counterStats.map((stat, idx) => (
            <Card
              key={idx}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 backdrop-blur-sm"
            >
              <div className="p-6 flex items-center gap-4">
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon name={stat.icon as any} size={28} className="text-white" />
                  {stat.pulse && (
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 animate-ping opacity-30" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisitorCounter;
