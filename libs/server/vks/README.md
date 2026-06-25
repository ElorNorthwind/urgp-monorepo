# server/vks

Метрики качества многоканального обслуживания из систем QMS и Анкетолог.

## Обзор

Агрегирует данные обращений, опросы операторов/клиентов, записи бронирования и метрики качества из API QMS и Анкетолог. Управляет кейсами ВКС с обновлением аналитики по расписанию четыре раза в день.

## Использование

```typescript
import { VksModule } from '@urgp/server/vks';

@Module({
  imports: [VksModule],
})
export class AppModule {}
```

## Основные экспорты

- `VksService` — 200+ методов для обращений, опросов, метрик качества, автоматической синхронизации
- `VksController` — REST-эндпоинты с аутентификацией, кэшированием и Zod-валидацией

## Зависимости

- `@urgp/server/database` — хранение обращений/опросов
- `@urgp/server/dgi-analytics` — аналитические запросы
- `@nestjs/axios` — API-запросы

## Конфигурация

QMS API: `http://10.126.177.23/qms/restapi/reports`
Анкетолог API: `https://ep-pos.mos.ru/apiv2`

## Особенности

- Cron: `0 45 7,11,17,19 * * *` (4 раза в день)
- `AccessTokenGuard` + `CacheInterceptor`
- Zod-валидация (`vksCasesQuerySchema`, `qmsQuerySchema`)
- Обработка XLSX-отчётов

## Запуск тестов

Выполните `nx test server/vks` для запуска unit-тестов через [Jest](https://jestjs.io).
