import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface PasswordChangeCardProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  setOldPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PasswordChangeCard = ({
  oldPassword,
  newPassword,
  confirmPassword,
  setOldPassword,
  setNewPassword,
  setConfirmPassword,
  onSave,
  onCancel
}: PasswordChangeCardProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Lock" size={24} />
          Смена пароля
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="oldPassword" className="text-white mb-2">Текущий пароль</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
            placeholder="Введите текущий пароль"
          />
        </div>
        <div>
          <Label htmlFor="newPassword" className="text-white mb-2">Новый пароль</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
            placeholder="Минимум 6 символов"
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword" className="text-white mb-2">Подтвердите пароль</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
            placeholder="Повторите новый пароль"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Icon name="Check" size={16} className="mr-2" />
            Сохранить
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-slate-600 text-slate-300"
          >
            Отмена
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordChangeCard;
