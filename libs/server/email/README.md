# server/email

IMAP-клиент для чтения писем из почтового ящика и извлечения кодов аутентификации.

## Обзор

Подключается к почтовому ящику по IMAP для чтения непрочитанных писем с поддержкой извлечения 4-значных кодов аутентификации Teletribe из тела сообщений.

## Использование

```typescript
import { EmailModule, EmailService } from '@urgp/server/email';

@Module({
  imports: [EmailModule],
})
export class AppModule {}
```

## Основные экспорты

- `EmailService` — IMAP-операции (чтение непрочитанных, извлечение кодов авторизации, пометка как прочитанное)
- `EmailController` — эндпоинт получения писем (маршрут: `/imap`)

## Зависимости

- `imap` — клиент протокола IMAP
- `postal-mime` — парсинг писем
- `@urgp/server/dgi-analytics` — модуль аналитики

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `EMAIL_USER` | Имя пользователя IMAP |
| `EMAIL_PASSWORD` | Пароль IMAP |
| `EMAIL_HOST` | Хост IMAP-сервера |
| `EMAIL_PORT` | Порт IMAP-сервера |

## Запуск тестов

Выполните `nx test server/email` для запуска unit-тестов через [Jest](https://jestjs.io).
