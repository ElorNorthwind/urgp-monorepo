# server/dtw

Интеграция с картографическим сервисом Цифровой территориальной работы (ЦТР/DTW).

## Обзор

Загружает тайлы карт и управляет токенами аутентификации для API DTW Москвы. Возвращает изображения тайлов с автоматической повторной попыткой и запасным чёрным JPEG в случае ошибки.

## Использование

```typescript
import { DtwModule } from '@urgp/server/dtw';

@Module({
  imports: [DtwModule],
})
export class AppModule {}
```

## Основные экспорты

- `DtwService` — управление токенами и стриминг тайлов
- `DtwController` — эндпоинты для получения тайлов карт

## Зависимости

- `@urgp/server/database` — хранение данных
- `@urgp/server/auth` — `AccessTokenGuard`
- `@nestjs/cache-manager` — кэширование токенов (TTL 15 мин)

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `DTW_LOGIN` | Логин API DTW |
| `DTW_PASSWORD` | Пароль API DTW |

## Запуск тестов

Выполните `nx test server/dtw` для запуска unit-тестов через [Jest](https://jestjs.io).
