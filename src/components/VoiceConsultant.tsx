import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface VoiceConsultantProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const VoiceConsultant = ({ isOpen: initialOpen = false, onClose }: VoiceConsultantProps) => {
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
      className="fixed z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
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
            <Icon name="Mic" size={20} className="text-white animate-pulse" />
            <h3 className="text-white font-bold">Голосовой помощник</h3>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              onClose?.();
            }}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-800/70 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Icon name="Bot" size={20} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold">Богдан AI</h4>
                <p className="text-xs text-gray-400">Готов помочь</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              Здравствуйте! Я голосовой помощник Богдана. Спросите меня об услугах, ценах или сроках разработки ИИ-решений.
            </p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <p className="text-xs text-gray-400 font-semibold mb-2">Популярные вопросы:</p>
            <button className="w-full text-left text-sm text-gray-300 hover:text-green-400 transition-colors p-2 rounded hover:bg-slate-700/50">
              💰 Сколько стоит разработка?
            </button>
            <button className="w-full text-left text-sm text-gray-300 hover:text-green-400 transition-colors p-2 rounded hover:bg-slate-700/50">
              ⏱️ Какие сроки разработки?
            </button>
            <button className="w-full text-left text-sm text-gray-300 hover:text-green-400 transition-colors p-2 rounded hover:bg-slate-700/50">
              🎯 Какие услуги вы предлагаете?
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/50">
              <Icon name="Mic" size={20} />
              <span className="font-semibold">Начать разговор</span>
            </button>
          </div>
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
