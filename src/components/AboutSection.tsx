import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
  description: string;
  telegram: string;
}

interface AboutSectionProps {
  darkMode: boolean;
  teamMembers: TeamMember[];
  projectHistory: string;
}

const AboutSection = ({ darkMode, teamMembers, projectHistory }: AboutSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          О нас
        </h2>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-3xl mx-auto mb-8`}>
          {projectHistory}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className={`${
              darkMode 
                ? 'bg-slate-900/50 border-slate-800' 
                : 'bg-white border-slate-200'
            } border rounded-2xl p-8 transition-all hover:scale-105`}
          >
            <div className="flex flex-col items-center text-center">
              <img 
                src={member.photo} 
                alt={member.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-indigo-500/20"
              />
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {member.name}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                {member.role}
              </p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {member.description}
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <a href={member.telegram} target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={16} className="mr-2" />
                  Написать в Telegram
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
