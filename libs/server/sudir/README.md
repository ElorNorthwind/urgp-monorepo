# server/sudir

Аутентификация в СУДИР/СЭДО с поддержкой proof-of-work.

## Обзор

Обеспечивает многошаговую OAuth-подобную аутентификацию в системе СУДИР Москвы, включая решение proof-of-work, кэширование сессий и управление cookies.

## Использование

```typescript
import { SudirModule } from '@urgp/server/sudir';

@Module({
  imports: [SudirModule],
})
export class AppModule {}
```

## Основные экспорты

- `SudirService` — генерация PoW, вход в СЭДО с цепочкой редиректов, кэширование сессий
- `SudirController` — эндпоинты PoW и входа

## Зависимости

- `@urgp/server/database` — хранение данных пользователей
- `@nestjs/cache-manager` — кэширование сессий
- `node-html-parser` — парсинг HTML-форм

## Конфигурация

| Переменная | Описание | По умолчанию |
|----------|-------------|---------|
| `EDO_SESSION_TTL` | TTL кэша сессий (минуты) | `5` |

## Запуск тестов

Выполните `nx test server/sudir` для запуска unit-тестов через [Jest](https://jestjs.io).
