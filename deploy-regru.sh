#!/bin/bash

# 🚀 Скрипт автоматического деплоя на REG.RU через FTP
# Использование: ./deploy-regru.sh

set -e

echo "🚀 Деплой на REG.RU"
echo "=================="

# Настройки FTP (ЗАМЕНИТЕ НА СВОИ!)
FTP_HOST="ftp.вашдомен.ru"
FTP_USER="ваш_логин"
FTP_PASS="ваш_пароль"
FTP_DIR="/public_html"

# Проверка наличия lftp
if ! command -v lftp &> /dev/null; then
    echo "❌ Ошибка: lftp не установлен"
    echo "Установите: sudo apt-get install lftp (Linux) или brew install lftp (Mac)"
    exit 1
fi

# Сборка проекта
echo "📦 Сборка проекта..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не найдена"
    exit 1
fi

echo "✅ Сборка завершена"

# Загрузка на FTP
echo "📤 Загрузка на сервер REG.RU..."

lftp -e "
set ftp:ssl-allow no
open $FTP_HOST
user $FTP_USER $FTP_PASS
lcd dist
cd $FTP_DIR
mirror --reverse --delete --verbose
bye
"

echo ""
echo "✅ Деплой завершён!"
echo "🌐 Проверьте сайт: https://вашдомен.ru"
echo ""
