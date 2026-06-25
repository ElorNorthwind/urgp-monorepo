# server/external-auth

Оркестрация аутентификации для внешних систем (СЭДО и РСМ).

## Обзор

Управляет генерацией токенов, кэшированием сессий и поиском учётных данных для интеграций с внешними системами. Экспортирует предварительно сконфигурированные HTTP-модули для API СЭДО и РСМ.

## Использование

```typescript
import { ExternalAuthModule } from '@urgp/server/external-auth';

@Module({
  imports: [ExternalAuthModule],
})
export class AppModule {}
```

## Основные экспорты

- `ExternalAuthService` — оркестрация аутентификации с поддержкой свежих и кэшированных сессий
- `ExternalTokenService` — генерация токенов для внешних систем
- `ExternalSessionsService` — управление сессиями в памяти
- `EdoApiModule` / `RsmApiModule` — предварительно сконфигурированные HTTP-модули

## Зависимости

- `@urgp/server/database` — хранение учётных данных
- `@urgp/server/entities` — схемы учётных данных/сессий
- `@nestjs/axios` — HTTP-клиенты

## Запуск тестов

Выполните `nx test server/external-auth` для запуска unit-тестов через [Jest](https://jestjs.io).
