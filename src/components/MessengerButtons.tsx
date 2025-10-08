import Icon from '@/components/ui/icon';
import { useState, useRef, useEffect } from 'react';

const MessengerButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPosition = localStorage.getItem('messengerButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'A') return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      localStorage.setItem('messengerButtonPosition', JSON.stringify(position));
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  const messengers = [
    {
      name: 'Telegram',
      icon: 'Send',
      href: 'https://t.me/Bogdan2733',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      href: 'https://wa.me/79218572049',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      name: 'VK',
      icon: 'Share2',
      href: 'https://vk.com/im',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800'
    },
    {
      name: 'Позвонить',
      icon: 'Phone',
      href: 'tel:+79218572049',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  const style = position.x === 0 && position.y === 0
    ? { bottom: '2rem', right: '2rem' }
    : { left: `${position.x}px`, top: `${position.y}px` };

  return (
    <div 
      ref={buttonRef}
      className={`fixed z-50 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={style}
      onMouseDown={handleMouseDown}
    >
      {/* Кнопки мессенджеров */}
      <div className={`flex flex-col gap-3 mb-3 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        {messengers.map((messenger, idx) => (
          <a
            key={messenger.name}
            href={messenger.href}
            target={messenger.name === 'Позвонить' ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className={`group flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r ${messenger.color} ${messenger.hoverColor} text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer`}
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <Icon name={messenger.icon as any} size={20} />
            <span className="font-semibold pr-2">{messenger.name}</span>
          </a>
        ))}
      </div>

      {/* Главная кнопка */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center hover:shadow-indigo-500/50 ${isExpanded ? 'rotate-45' : ''}`}
      >
        <Icon name={isExpanded ? 'X' : 'MessageSquare'} size={28} />
      </button>
    </div>
  );
};

export default MessengerButtons;
