# server/auth

Модуль JWT-аутентификации с refresh-токенами, локальной стратегией входа и хранением в cookies.

## Обзор

Обеспечивает аутентификацию пользователей через стратегии Passport.js (local, JWT access, JWT refresh), хеширование паролей argon2, управление токенами через cookies и поддержку имперсонации администратором.

## Использование

```typescript
import { AuthModule, AccessTokenGuard } from '@urgp/server/auth';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

## Основные экспорты

- `AuthService` — валидация пользователей, генерация JWT, управление cookies, смена/сброс пароля
- `AuthController` — эндпоинты входа, регистрации, обновления токенов, выхода
- `AccessTokenGuard` — защита эндпоинтов, требующих аутентификации
- `RefreshTokenGuard` — для эндпоинтов обновления токенов
- `DsaStaticTokenGuard` — валидация статического токена DSA API
- `AccessTokenStrategy` / `RefreshTokenStrategy` / `LocalStrategy` — стратегии Passport

## Зависимости

- `@urgp/server/database` — хранение учётных данных пользователей
- `@nestjs/jwt` — генерация JWT-токенов
- `@nestjs/passport` — стратегии аутентификации

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `JWT_ACCESS_SECRET` | Секрет подписи access-токена |
| `JWT_REFRESH_SECRET` | Секрет подписи refresh-токена |
| `DOMAIN` | Домен для cookies (по умолчанию пустая строка) |
| `NODE_ENV` | Управляет детализацией сообщений об ошибках |

## Запуск тестов

Выполните `nx test server/auth` для запуска unit-тестов через [Jest](https://jestjs.io).
