import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ApiKeysCard = () => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Key" size={24} />
          API Ключи
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Yandex SpeechKit API Key
            </h4>
            <p className="text-slate-300 text-sm mb-3">
              Для работы озвучки ответов нужен API ключ от Yandex SpeechKit
            </p>
            <ol className="text-slate-400 text-xs space-y-1 mb-3">
              <li>1. Откройте <a href="https://console.cloud.yandex.ru/folders/b1gfkd2baaso5298c7lt/speechkit" target="_blank" className="text-blue-400 underline">консоль Yandex Cloud</a></li>
              <li>2. Создайте сервисный аккаунт и API ключ</li>
              <li>3. Скопируйте ключ (формат: AQVN...)</li>
              <li>4. Добавьте в секреты проекта как YANDEX_SPEECH_API_KEY</li>
            </ol>
            <Button
              onClick={() => window.open('https://console.cloud.yandex.ru/', '_blank')}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Icon name="ExternalLink" size={14} className="mr-2" />
              Открыть Yandex Cloud
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysCard;
