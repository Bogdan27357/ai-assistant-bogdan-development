export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
  social: {
    linkedin: string;
    twitter: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    name: 'Алексей Иванов',
    role: 'Основатель & CEO',
    avatar: '👨‍💼',
    description: 'Эксперт в области AI с 10-летним опытом',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Мария Петрова',
    role: 'CTO',
    avatar: '👩‍💻',
    description: 'Бывший инженер Google, специалист по ML',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Дмитрий Сидоров',
    role: 'Head of Product',
    avatar: '👨‍🎨',
    description: 'Создатель продуктов для миллионов пользователей',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Анна Козлова',
    role: 'Head of AI Research',
    avatar: '👩‍🔬',
    description: 'PhD в Computer Science, автор 20+ публикаций',
    social: { linkedin: '#', twitter: '#' }
  }
];
