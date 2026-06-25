# server/telegram

Telegram-бот для уведомлений, связанных с реновацией.

## Обзор

Управляет Telegram-ботом, отправляющим уведомления о резолюциях, этапах, кейсах и письмах пользователям и в каналы.

## Использование

```typescript
import { TelegramModule, TelegramService } from '@urgp/server/telegram';

@Module({
  imports: [TelegramModule],
})
export class AppModule {}
```

## Основные экспорты

- `TelegramService` — жизненный цикл бота, отправка сообщений, уведомления о резолюциях/этапах/кейсах/письмах

## Зависимости

- `grammy` — фреймворк Telegram Bot API
- `@urgp/server/database` — поиск chat ID пользователей

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | Токен бота |
| `TELEGRAM_LETTERS_CHAT_ID` | ID канала для уведомлений о письмах |

## Особенности

- Хук жизненного цикла `OnModuleDestroy` для корректного завершения бота
- Экранирование символов Markdown для безопасности сообщений

## Запуск тестов

Выполните `nx test server/telegram` для запуска unit-тестов через [Jest](https://jestjs.io).
