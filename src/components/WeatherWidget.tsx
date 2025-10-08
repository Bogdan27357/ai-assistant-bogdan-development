import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  city: string;
  wind_speed: number;
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('Санкт-Петербург');
  const [inputCity, setInputCity] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (cityName: string) => {
    setLoading(true);
    try {
      const mockData: Record<string, WeatherData> = {
        'Санкт-Петербург': {
          temp: 12,
          feels_like: 10,
          humidity: 75,
          description: 'облачно с прояснениями',
          icon: '02d',
          city: 'Санкт-Петербург',
          wind_speed: 5
        },
        'Москва': {
          temp: 15,
          feels_like: 13,
          humidity: 65,
          description: 'ясно',
          icon: '01d',
          city: 'Москва',
          wind_speed: 3
        },
        'Пулково': {
          temp: 11,
          feels_like: 9,
          humidity: 80,
          description: 'небольшая облачность',
          icon: '02d',
          city: 'Пулково',
          wind_speed: 6
        }
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      const weatherData = mockData[cityName] || {
        temp: Math.floor(Math.random() * 15) + 10,
        feels_like: Math.floor(Math.random() * 15) + 8,
        humidity: Math.floor(Math.random() * 30) + 60,
        description: 'переменная облачность',
        icon: '03d',
        city: cityName,
        wind_speed: Math.floor(Math.random() * 5) + 2
      };

      setWeather(weatherData);
      setCity(weatherData.city);
    } catch (error) {
      console.error('Ошибка загрузки погоды:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleCityChange = () => {
    if (inputCity.trim()) {
      fetchWeather(inputCity);
      setInputCity('');
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: Record<string, string> = {
      '01d': 'Sun',
      '01n': 'Moon',
      '02d': 'CloudSun',
      '02n': 'Cloud',
      '03d': 'Cloud',
      '03n': 'Cloud',
      '04d': 'Cloud',
      '04n': 'Cloud',
      '09d': 'CloudRain',
      '09n': 'CloudRain',
      '10d': 'CloudRain',
      '10n': 'CloudRain',
      '11d': 'CloudLightning',
      '11n': 'CloudLightning',
      '13d': 'CloudSnow',
      '13n': 'CloudSnow',
      '50d': 'CloudFog',
      '50n': 'CloudFog',
    };
    return iconMap[iconCode] || 'Cloud';
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-900/60 via-blue-900/50 to-cyan-900/40 border-2 border-indigo-500/40 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 animate-gradient-shift bg-[length:200%_200%]" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Icon name="CloudSun" size={28} className="text-cyan-400" />
            Погода
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCityChange()}
              placeholder="Введите город"
              className="px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button
              onClick={handleCityChange}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Icon name="Search" size={16} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Icon name="Loader2" size={48} className="text-indigo-400 animate-spin mx-auto" />
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg text-gray-300 mb-2">{weather.city}</div>
              <div className="flex items-center justify-center gap-4 mb-2">
                <Icon name={getWeatherIcon(weather.icon) as any} size={64} className="text-cyan-400" />
                <div className="text-6xl font-black text-white">{weather.temp}°</div>
              </div>
              <div className="text-xl text-gray-300 capitalize mb-4">{weather.description}</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                <Icon name="Thermometer" size={24} className="text-orange-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Ощущается</div>
                <div className="text-lg font-bold text-white">{weather.feels_like}°</div>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                <Icon name="Droplets" size={24} className="text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Влажность</div>
                <div className="text-lg font-bold text-white">{weather.humidity}%</div>
              </div>
              <div className="bg-slate-800/40 rounded-xl p-3 text-center">
                <Icon name="Wind" size={24} className="text-cyan-400 mx-auto mb-1" />
                <div className="text-sm text-gray-400">Ветер</div>
                <div className="text-lg font-bold text-white">{weather.wind_speed} м/с</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default WeatherWidget;