import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Conversation } from '@elevenlabs/react';

interface VoiceConsultantProps {
  isOpen?: boolean;
}

const VoiceConsultant = ({ isOpen: initialOpen = false }: VoiceConsultantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [position, setPosition] = useState({ x: window.innerWidth - 432, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 400));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 500));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={cardRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      onMouseDown={handleMouseDown}
    >
      <Card className="w-96 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
        <div className="drag-handle bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-t-lg flex items-center justify-between cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <Icon name="Mic" size={20} className="text-white" />
            <h3 className="text-white font-bold">Голосовой помощник</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          <Conversation
            agentId="TkqT87nC0bSWFpZWEJ1t"
            apiKey={import.meta.env.VITE_ELEVENLABS_API_KEY}
            overrides={{
              agent: {
                prompt: {
                  prompt: `Ты - дружелюбный консультант ИИ-помощника Богдана. 
                  
Твоя задача - отвечать на вопросы клиентов о:
- Услугах: консультации по ИИ, разработка ИИ-помощников, техподдержка, обучение персонала
- Стоимости: консультация от 5000₽, разработка от 50000₽, поддержка 10000₽/мес, обучение 15000₽
- Сроках: базовая разработка 2-4 недели, сложные проекты до 2-3 месяцев
- Географии: работа по всей России, онлайн-консультации, выездные встречи в СПб и Москве
- Техподдержке: мониторинг 24/7, исправление ошибок, обновления, консультации

Говори кратко, по делу и дружелюбно. Если не знаешь ответа - предложи связаться с менеджером.`
                }
              }
            }}
          />
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50">
          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-2">
            <Icon name="Move" size={14} />
            Перетащите виджет за заголовок для перемещения
          </p>
        </div>
      </Card>
    </div>
  );
};

export default VoiceConsultant;
