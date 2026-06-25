# server/dsa-dgi

Подключение к PostgreSQL для данных программы реновации/модернизации DSA-DGI.

## Обзор

Предоставляет пул подключений к базе данных для программы реновации, включая запросы данных и отслеживание состояния синхронизации.

## Использование

```typescript
import { DsaDgiModule, DsaDgiService } from '@urgp/server/dsa-dgi';

@Module({
  imports: [DsaDgiModule],
})
export class AppModule {}
```

## Основные экспорты

- `DsaDgiService` — пул подключений с расширениями-репозиториями `renovation` и `renovationSync`

## Конфигурация

| Переменная | Описание | По умолчанию |
|----------|-------------|---------|
| `DSA_DGI_HOST` | Хост | `localhost` |
| `DSA_DGI_PORT` | Порт | `5432` |
| `DSA_DGI_USER` | Пользователь | — |
| `DSA_DGI_PASSWORD` | Пароль | — |
| `DSA_DGI_DATABASE` | Имя базы данных | — |

## Запуск тестов

Выполните `nx test server/dsa-dgi` для запуска unit-тестов через [Jest](https://jestjs.io).
