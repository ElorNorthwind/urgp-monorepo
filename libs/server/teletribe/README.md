# server/teletribe

Интеграция с аналитикой колл-центра Teletribe с регулярной синхронизацией данных.

## Обзор

Загружает записи звонков горячей линии, статистику исходящих вызовов и данные опросов из системы отчётности Teletribe. Выполняет задачи синхронизации по расписанию дважды в день и отправляет отчёты по электронной почте.

## Использование

```typescript
import { TeletribeModule } from '@urgp/server/teletribe';

@Module({
  imports: [TeletribeModule],
})
export class AppModule {}
```

## Основные экспорты

- `TeletribeService` — загрузка отчётов (горячая линия, исходящие, опросы), аутентификация, cron-синхронизация
- `TeletribeController` — эндпоинт ручного запуска отчётов

## Зависимости

- `@urgp/server/database` — хранение данных
- `@urgp/server/dgi-analytics` — база данных аналитики
- `@urgp/server/email` — отправка отчётов по почте
- `@nestjs/schedule` — cron-планирование

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `TELETRIBE_LOGIN` | Логин Teletribe |
| `TELETRIBE_PASSWORD` | Пароль Teletribe |

## Особенности

- Cron: `0 5 6,17 * * *` (6:05 и 17:05 ежедневно)
- Управление сессиями на основе cookies
- Обработка XLSX-отчётов

## Запуск тестов

Выполните `nx test server/teletribe` для запуска unit-тестов через [Jest](https://jestjs.io).
