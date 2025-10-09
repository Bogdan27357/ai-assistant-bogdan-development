import bcrypt

password = "admin123"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
print(f"Password hash for '{password}':")
print(hashed.decode('utf-8'))
