# server/letters

Сервис уведомлений о входящей корреспонденции.

## Обзор

Отслеживает резолюции по письмам (срочные, без изменений, невыполненные) и отправляет уведомления через Telegram. Включает поддержку cron-уведомлений (в настоящее время отключена).

## Использование

```typescript
import { LettersModule } from '@urgp/server/letters';

@Module({
  imports: [LettersModule],
})
export class AppModule {}
```

## Основные экспорты

- `LettersService` — логика отслеживания писем и отправки уведомлений
- `LettersController` — эндпоинты управления письмами (в настоящее время отключены)

## Зависимости

- `@urgp/server/database` — хранение данных о письмах
- `@urgp/server/telegram` — уведомления в Telegram
- `@nestjs/schedule` — cron-планирование

## Запуск тестов

Выполните `nx test server/letters` для запуска unit-тестов через [Jest](https://jestjs.io).
