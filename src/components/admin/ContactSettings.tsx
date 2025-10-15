import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ContactSettingsProps {
  contactInfo: {
    email: string;
    phone: string;
    telegram: string;
    whatsapp: string;
    address: string;
  };
  setContactInfo: (info: any) => void;
  onSave: () => void;
}

const ContactSettings = ({ contactInfo, setContactInfo, onSave }: ContactSettingsProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Контактная информация</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-white mb-2 flex items-center gap-2">
            <Icon name="Mail" size={16} />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white mb-2 flex items-center gap-2">
            <Icon name="Phone" size={16} />
            Телефон
          </Label>
          <Input
            id="phone"
            value={contactInfo.phone}
            onChange={e => setContactInfo({ ...contactInfo, phone: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="telegram" className="text-white mb-2 flex items-center gap-2">
            <Icon name="Send" size={16} />
            Telegram
          </Label>
          <Input
            id="telegram"
            value={contactInfo.telegram}
            onChange={e => setContactInfo({ ...contactInfo, telegram: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="whatsapp" className="text-white mb-2 flex items-center gap-2">
            <Icon name="MessageCircle" size={16} />
            WhatsApp
          </Label>
          <Input
            id="whatsapp"
            value={contactInfo.whatsapp}
            onChange={e => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-white mb-2 flex items-center gap-2">
            <Icon name="MapPin" size={16} />
            Адрес
          </Label>
          <Input
            id="address"
            value={contactInfo.address}
            onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <Button onClick={onSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Icon name="Save" size={18} className="mr-2" />
          Сохранить контакты
        </Button>
      </div>
    </Card>
  );
};

export default ContactSettings;
