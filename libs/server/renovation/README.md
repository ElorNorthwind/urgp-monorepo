# server/renovation

Управление данными программы реновации Москвы.

## Обзор

Управляет зданиями (старые/новые), квартирами, этапами, таймлайнами, отслеживанием дефектов и обменом сообщениями для программы реновации Москвы. Включает geo-JSON запросы, итоги по административным делениям и процессы согласования этапов.

## Использование

```typescript
import { RenovationModule } from '@urgp/server/renovation';

@Module({
  imports: [RenovationModule],
})
export class AppModule {}
```

## Основные экспорты

- `RenovationService` — 100+ методов для зданий, квартир, этапов, сообщений, дефектов, прогресса
- `RenovationSyncService` — синхронизация данных
- `RenovationController` — REST-эндпоинты с аутентификацией и кэшированием

## Зависимости

- `@urgp/server/dsa-dgi` — база данных реновации DSA-DGI
- `@urgp/server/database` — основная база данных УРЖП

## Особенности

- `AccessTokenGuard` для аутентифицированных эндпоинтов
- `CacheInterceptor` с декораторами `@CacheTTL` / `@CacheKey`
- `ZodValidationPipe` для валидации DTO
- Авторизация через CASL с помощью `defineVksAbilityFor`

## Запуск тестов

Выполните `nx test server/renovation` для запуска unit-тестов через [Jest](https://jestjs.io).
