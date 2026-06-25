# server/entities

Общие определения TypeScript/Zod-схем для сущностей внешней аутентификации.

## Обзор

Библиотека данных (без NestJS-модуля), предоставляющая Zod-схемы, DTO и TypeScript-типы для управления сессиями и учётными данными СЭДО и РСМ.

## Использование

```typescript
import { EdoCredentials, RsmSession, SessionLookup } from '@urgp/server/entities';
```

## Основные экспорты

- Zod-схемы и выведенные типы для учётных данных, токенов и сессий СЭДО/РСМ
- Дискриминированные union-типы для управления сессиями
- Поиск сессий по `userId` и `orgId`

## Зависимости

- `zod` — валидация схем

## Запуск тестов

Выполните `nx test server/entities` для запуска unit-тестов через [Jest](https://jestjs.io).
