# server/equity

Управление объектами долевого строительства с авторизацией на основе CASL и кэшированием.

## Обзор

CRUD-операции для объектов долевого строительства, заявок, операций и таймлайнов с ролевым управлением доступом и кэшированием ответов.

## Использование

```typescript
import { EquityModule } from '@urgp/server/equity';

@Module({
  imports: [EquityModule],
})
export class AppModule {}
```

## Основные экспорты

- `EquityService` — CRUD объектов, заявки, операции, управление таймлайном
- `EquityController` — REST-эндпоинты с авторизацией и кэшированием

## Зависимости

- `@urgp/server/database` — хранение данных
- `@urgp/server/auth` — `AccessTokenGuard`
- `@urgp/server/pipes` — `ZodValidationPipe`
- `@urgp/shared/entities` — общие DTO и определения прав доступа

## Особенности

- Авторизация через CASL с помощью `defineEquityAbilityFor`
- `CacheInterceptor` с TTL (1 мин для данных, 1 час для классификаторов)
- Валидация запросов через Zod-схемы

## Запуск тестов

Выполните `nx test server/equity` для запуска unit-тестов через [Jest](https://jestjs.io).
