# server/dm

Клиент Oracle для получения резолюций из системы Документоконтроля (DM).

## Обзор

Подключается к базе данных Oracle для получения данных по резолюциям DM и синхронизирует их в базу данных DGI Analytics PostgreSQL. Поддерживает краткосрочные, долгосрочные и невыполненные запросы с разбиением по диапазонам дат.

## Использование

```typescript
import { DmModule } from '@urgp/server/dm';

@Module({
  imports: [DmModule],
})
export class AppModule {}
```

## Основные экспорты

- `DmService` — выполнение запросов Oracle, форматирование результатов, синхронизация с аналитической БД
- `DmController` — эндпоинты для запуска синхронизации данных DM

## Зависимости

- `oracledb` — клиент Oracle (Thick mode с instant client)
- `@urgp/server/dgi-analytics` — целевая база данных для синхронизированных данных

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `DM_USERNAME` | Пользователь Oracle |
| `DM_PASSWORD` | Пароль Oracle |
| `DM_HOST` | Хост Oracle |
| `DM_PORT` | Порт Oracle |
| `DM_SERVICE_NAME` | Имя сервиса Oracle |
| `ORACLE_INSTANT_CLIENT_DIR` | Путь к библиотеке instant client |

## Особенности

- Oracle Thick mode с платформо-зависимыми путями к клиентским библиотекам
- Пул подключений (min: 2, max: 5)
- Корректное завершение через `OnModuleDestroy` и `BeforeApplicationShutdown`
- Разбиение по 10-дневным интервалам для долгосрочных запросов

## Запуск тестов

Выполните `nx test server/dm` для запуска unit-тестов через [Jest](https://jestjs.io).
