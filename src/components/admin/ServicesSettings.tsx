import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Service {
  id: number;
  name: string;
  price: string;
  description: string;
  icon: string;
}

interface ServicesSettingsProps {
  services: Service[];
  setServices: (services: Service[]) => void;
  onSave: () => void;
}

const ServicesSettings = ({ services, setServices, onSave }: ServicesSettingsProps) => {
  const addService = () => {
    const newService = {
      id: services.length + 1,
      name: 'Новая услуга',
      price: '0₽',
      description: 'Описание услуги',
      icon: 'Star',
    };
    setServices([...services, newService]);
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast.success('Услуга удалена');
  };

  const updateService = (id: number, field: string, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Управление услугами</h2>
        <Button onClick={addService} className="bg-green-600 hover:bg-green-700">
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить услугу
        </Button>
      </div>

      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id} className="bg-slate-800/50 border-slate-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2">Название услуги</Label>
                <Input
                  value={service.name}
                  onChange={e => updateService(service.id, 'name', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2">Цена</Label>
                <Input
                  value={service.price}
                  onChange={e => updateService(service.id, 'price', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-white mb-2">Описание</Label>
                <Textarea
                  value={service.description}
                  onChange={e => updateService(service.id, 'description', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white mb-2">Иконка (Lucide)</Label>
                <Input
                  value={service.icon}
                  onChange={e => updateService(service.id, 'icon', e.target.value)}
                  placeholder="MessageSquare"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => deleteService(service.id)}
                  variant="destructive"
                  className="w-full"
                >
                  <Icon name="Trash2" size={18} className="mr-2" />
                  Удалить
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={onSave} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
        <Icon name="Save" size={18} className="mr-2" />
        Сохранить все услуги
      </Button>
    </Card>
  );
};

export default ServicesSettings;
