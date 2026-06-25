# server/dgi-analytics

Подключение к PostgreSQL для данных аналитики ДГИ (репозитории VKS и DM).

## Обзор

Предоставляет отдельный пул подключений к базе данных для запросов данных по контролю исполнительских решений и аналитики документооборота.

## Использование

```typescript
import { DgiAnalyticsModule, DgiAnalyticsService } from '@urgp/server/dgi-analytics';

@Module({
  imports: [DgiAnalyticsModule],
})
export class AppModule {}
```

## Основные экспорты

- `DgiAnalyticsService` — пул подключений с расширениями-репозиториями `dm` и `vks`

## Конфигурация

| Переменная | Описание | По умолчанию |
|----------|-------------|---------|
| `DGI_ANALYTICS_PG_HOST` | Хост | `localhost` |
| `DGI_ANALYTICS_PG_PORT` | Порт | `9696` |
| `DGI_ANALYTICS_PG_DATABASE` | Имя базы данных | — |
| `DGI_ANALYTICS_PG_USER` | Пользователь | — |
| `DGI_ANALYTICS_PG_PASSWORD` | Пароль | — |

## Запуск тестов

Выполните `nx test server/dgi-analytics` для запуска unit-тестов через [Jest](https://jestjs.io).
