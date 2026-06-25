# server/llm

Сервис интеграции с LLM, поддерживающий Yandex GPT и Gigachat.

## Обзор

Обеспечивает генерацию текста, создание эмбеддингов, классификацию документов и семантическое ранжирование с использованием Yandex GPT (основной) и Sber Gigachat (заглушка) API.

## Использование

```typescript
import { GptModule } from '@urgp/server/llm';

@Module({
  imports: [GptModule],
})
export class AppModule {}
```

## Основные экспорты

- `GptService` — генерация текста, эмбеддинги, пакетное ранжирование вопросов, классификация документов
- `YandexGptService` — клиент API Yandex Cloud LLM с управлением токенами
- `GigachatService` — клиент Sber Gigachat (заглушка, возвращает `NOT_IMPLEMENTED`)
- `GptController` — тестовые эндпоинты

## Зависимости

- `@urgp/server/database` — хранение/извлечение вопросов
- `@urgp/server/edo` — извлечение текста из документов
- `@nestjs/axios` — HTTP-запросы

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `YANDEX_FOLDER_ID` | ID папки Yandex Cloud |
| `GIGACHAT_AUTH` | Base64-учётные данные Gigachat |

## Особенности

- Асинхронные операции на основе RxJS с пакетированием (10 элементов, задержка 1.1 сек)
- Кэширование токенов с отслеживанием срока действия

## Запуск тестов

Выполните `nx test server/llm` для запуска unit-тестов через [Jest](https://jestjs.io).
