# server/control

Система управления обращениями и операциями с процессами согласования, диспетчеризацией задач и авторизацией на основе CASL.

## Обзор

Управляет сущностями системы контроля — обращениями, операциями, классификаторами — с автоматическим планированием напоминаний, созданием диспетчерских задач и ролевым управлением доступом через CASL.

## Использование

```typescript
import { ControlModule } from '@urgp/server/control';

@Module({
  imports: [ControlModule],
})
export class AppModule {}
```

## Основные экспорты

- `ControlCasesService` — CRUD обращений с автоматическими напоминаниями/диспетчеризацией и процессами согласования
- `ControlOperationsService` — создание операций/диспетчерских задач, завершение, планирование напоминаний
- `ControlClassificatorsService` — управление иерархией классификаторов и цепочками согласования
- Контроллеры: `ControlCasesController`, `ControlOperationsController`, `ControlClassificatorsController`

## Зависимости

- `@urgp/server/database` — постоянное хранилище данных
- `@urgp/server/telegram` — уведомления в Telegram (в настоящее время отключены)
- `@nestjs/cache-manager` — кэширование классификаторов

## Особенности

- Авторизация через CASL с помощью `defineControlAbilityFor`
- Инвалидация кэша после операций записи
- `AccessTokenGuard` на всех эндпоинтах

## Запуск тестов

Выполните `nx test server/control` для запуска unit-тестов через [Jest](https://jestjs.io).
