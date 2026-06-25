# server/geo-db

Подключение к PostgreSQL для географических и московских данных.

## Обзор

Обёртка pg-promise с пользовательскими расширениями-репозиториями для запросов географических данных, служащая слоем данных для геопространственных сервисов.

## Использование

```typescript
import { GeoDbModule, GeoDbService } from '@urgp/server/geo-db';

@Module({
  imports: [GeoDbModule],
})
export class AppModule {}
```

## Основные экспорты

- `GeoDbService` — типизированный доступ к базе данных с расширением `DataMosRepository`

## Конфигурация

| Переменная | Описание | По умолчанию |
|----------|-------------|---------|
| `GEO_PG_HOST` | Хост | — |
| `GEO_PG_PORT` | Порт | `5432` |
| `GEO_PG_DATABASE` | Имя базы данных | — |
| `GEO_PG_USER` | Пользователь | — |
| `GEO_PG_PASSWORD` | Пароль | — |

## Запуск тестов

Выполните `nx test server/geo-db` для запуска unit-тестов через [Jest](https://jestjs.io).
