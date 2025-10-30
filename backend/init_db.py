from jose import jwt

SECRET_KEY = "RJ-hGtJpimsdF503yZ2y6TT9SKAVkC3YsvKpXG3cHPKUtMLcXUhIeptrv5Z0FXc5duadEe4tqpXlDNn4ci3zBg"
ALGORITHM = "HS256"

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImV4cCI6MTc2MTU1ODEzNiwidHlwZSI6InJlZnJlc2gifQ.xylJ544lt0cSNgnsB90u8-K0-sXXy31LwtYw--flgpc"  # paste your token
decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
print(decoded)
