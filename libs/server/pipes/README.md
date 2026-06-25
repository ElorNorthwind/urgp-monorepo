# server/pipes

Пользовательский NestJS-пайп валидации на основе Zod-схем.

## Обзор

Предоставляет переиспользуемый `ZodValidationPipe`, который валидирует данные запросов по Zod-схемам и выбрасывает `BadRequestException` при ошибке валидации.

## Использование

```typescript
import { ZodValidationPipe } from '@urgp/server/pipes';

@UsePipes(new ZodValidationPipe(mySchema))
@Post()
create(@Body() dto: MyDto) {}
```

## Основные экспорты

- `ZodValidationPipe` — реализация `PipeTransform` для валидации по Zod-схемам

## Зависимости

- `zod` — библиотека валидации схем

## Запуск тестов

Выполните `nx test server/pipes` для запуска unit-тестов через [Jest](https://jestjs.io).
