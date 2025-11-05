import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ApiKeysCard = () => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Key" size={24} />
          API Ключи для голосовых функций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Yandex SpeechKit (для YandexGPT)
            </h4>
            <p className="text-slate-300 text-sm mb-3">
              Для озвучки ответов YandexGPT нужен API ключ от Yandex SpeechKit
            </p>
            <ol className="text-slate-400 text-xs space-y-1 mb-3">
              <li>1. Откройте <a href="https://console.cloud.yandex.ru/folders/b1gfkd2baaso5298c7lt/speechkit" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">консоль Yandex Cloud</a></li>
              <li>2. Создайте сервисный аккаунт и API ключ</li>
              <li>3. Скопируйте ключ (формат: AQVN...)</li>
              <li>4. В редакторе poehali.dev откройте раздел "Секреты" 🔑</li>
              <li>5. Добавьте секрет: YANDEX_SPEECH_API_KEY</li>
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

          <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
            <h4 className="text-green-300 font-medium mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} />
              Salute Speech (для ГигаЧат)
            </h4>
            <p className="text-slate-300 text-sm mb-3">
              Для озвучки ответов ГигаЧат нужны Client ID и Client Secret от Salute Speech
            </p>
            <ol className="text-slate-400 text-xs space-y-1 mb-3">
              <li>1. Откройте <a href="https://developers.sber.ru/studio/" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">Sber Developers Studio</a></li>
              <li>2. Зарегистрируйтесь и создайте приложение</li>
              <li>3. В разделе SmartSpeech скопируйте Client ID и Client Secret</li>
              <li>4. В редакторе poehali.dev откройте раздел "Секреты" 🔑</li>
              <li>5. Добавьте секреты:</li>
              <li className="ml-4">• SBER_CLIENT_ID</li>
              <li className="ml-4">• SBER_CLIENT_SECRET</li>
            </ol>
            <Button
              onClick={() => window.open('https://developers.sber.ru/studio/', '_blank')}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Icon name="ExternalLink" size={14} className="mr-2" />
              Открыть Sber Developers
            </Button>
          </div>

          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <Icon name="AlertCircle" size={14} />
              <span>После добавления секретов голосовые функции заработают автоматически</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysCard;