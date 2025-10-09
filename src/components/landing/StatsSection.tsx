import { Language } from '@/lib/i18n';
import { useEffect, useState } from 'react';

interface StatsSectionProps {
  language: Language;
}

const StatsSection = ({ language }: StatsSectionProps) => {
  const [counters, setCounters] = useState({ models: 0, requests: 0, uptime: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { models: 15, requests: 100000, uptime: 99.9 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounters({
        models: Math.floor(targets.models * progress),
        requests: Math.floor(targets.requests * progress),
        uptime: parseFloat((targets.uptime * progress).toFixed(1))
      });

      if (currentStep >= steps) {
        setCounters(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const content = {
    ru: {
      stats: [
        { value: `${counters.models}+`, label: 'ИИ моделей' },
        { value: `${(counters.requests / 1000).toFixed(0)}K+`, label: 'Запросов в день' },
        { value: `${counters.uptime}%`, label: 'Uptime' }
      ]
    },
    en: {
      stats: [
        { value: `${counters.models}+`, label: 'AI Models' },
        { value: `${(counters.requests / 1000).toFixed(0)}K+`, label: 'Daily Requests' },
        { value: `${counters.uptime}%`, label: 'Uptime' }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="relative py-20 border-y border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10" />
      
      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-5xl md:text-6xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-lg text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
