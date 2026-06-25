# server/database

Основной пул подключений PostgreSQL с паттерном репозиториев на основе pg-promise.

## Обзор

Синглтон-сервис, инициализирующий пул подключений pg-promise с типизированными расширениями-репозиториями для всех основных доменных сущностей.

## Использование

```typescript
import { DatabaseModule, DatabaseService } from '@urgp/server/database';

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
```

## Основные экспорты

- `DatabaseService` — пул подключений с доступом к репозиториям

## Репозитории

`users`, `cases`, `questions`, `streets`, `renovationUsers`, `controlCases`, `controlOperations`, `controlClassificators`, `address`, `equity`, `sudir`, `letters`

## Конфигурация

| Переменная | Описание | По умолчанию |
|----------|-------------|---------|
| `PG_HOST` | Хост базы данных | `localhost` |
| `PG_PORT` | Порт базы данных | `5432` |
| `PG_DATABASE` | Имя базы данных | — |
| `PG_USER` | Пользователь БД | — |
| `PG_PASSWORD` | Пароль БД | — |

## Запуск тестов

Выполните `nx test server/database` для запуска unit-тестов через [Jest](https://jestjs.io).
