#!/usr/bin/env python3
import bcrypt

# Тестируем текущий хеш
current_hash = "$2b$12$LQv3c1yqBwcXgRfTvNqFD.EqKhF5eMZWqP5rU8tXqYvKZJ5YqG8n2"
password = "admin123"

print(f"Testing password: {password}")
print(f"Current hash: {current_hash}")

try:
    result = bcrypt.checkpw(password.encode('utf-8'), current_hash.encode('utf-8'))
    print(f"Password matches: {result}")
except Exception as e:
    print(f"Error: {e}")

# Создаем новый корректный хеш
new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(f"\nNew correct hash for '{password}':")
print(new_hash.decode('utf-8'))

# Проверяем новый хеш
verify = bcrypt.checkpw(password.encode('utf-8'), new_hash)
print(f"New hash verification: {verify}")
