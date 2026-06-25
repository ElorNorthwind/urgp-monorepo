# server/dadata

HTTP-клиент для API подсказок DaData.

## Обзор

Выполняет запросы к API подсказок DaData для преобразования адресных строк в ФИАС GUID с оценкой уверенности. Автоматически ограничивает область поиска Москвой.

## Использование

```typescript
import { DaDataModule } from '@urgp/server/dadata';

@Module({
  imports: [DaDataModule],
})
export class AppModule {}
```

## Основные экспорты

- `DaDataService` — метод `getFiasGuidByAddressString()`, возвращающий ФИАС GUID и уровень уверенности
- `DaDataController` — эндпоинт `GET /by-address?q=<query>`

## Зависимости

- `@nestjs/axios` — HTTP-запросы

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `DADATA_KEY1` | API-ключ DaData |

Базовый URL: `http://suggestions.dadata.ru/suggestions/api/4_1/rs`

## Запуск тестов

Выполните `nx test server/dadata` для запуска unit-тестов через [Jest](https://jestjs.io).
