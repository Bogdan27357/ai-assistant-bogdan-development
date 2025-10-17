import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
  social: {
    linkedin: string;
    twitter: string;
  };
}

interface AboutSectionProps {
  darkMode: boolean;
  teamMembers: TeamMember[];
}

const AboutSection = ({ darkMode, teamMembers }: AboutSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          О нас
        </h2>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-3xl mx-auto`}>
          Команда экспертов, объединенных одной целью — сделать искусственный интеллект доступным каждому
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
        {teamMembers.map((member, idx) => (
          <Card
            key={idx}
            className={`${
              darkMode 
                ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            } transition-all hover:scale-105`}
          >
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4">{member.avatar}</div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {member.name}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                {member.role}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {member.description}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className={darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                >
                  <Icon name="Linkedin" size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                >
                  <Icon name="Twitter" size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
