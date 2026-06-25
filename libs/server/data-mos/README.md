# server/data-mos

Синхронизация региональных данных Москвы из API open.mos.ru.

## Обзор

Загружает и пакетно обновляет адреса и транспортные станции Москвы (ж/д, МЦД, метро) с портала открытых данных с логикой повторных попыток и постраничной загрузкой.

## Использование

```typescript
import { DataMosModule } from '@urgp/server/data-mos';

@Module({
  imports: [DataMosModule],
})
export class AppModule {}
```

## Основные экспорты

- `DataMosService` — пакетный upsert адресов (1000 строк/пакет) и транспортных станций с логикой повторных попыток
- `DataMosController` — эндпоинты для запуска обновления адресов/станций

## Зависимости

- `@urgp/server/geo-db` — географическая база данных для upsert-операций
- `@nestjs/axios` — запросы к API open.mos.ru

## Конфигурация

| Переменная | Описание |
|----------|-------------|
| `OPEN_MOS_KEY` | API-ключ для open.mos.ru |

Базовый URL: `https://apidata.mos.ru/v1/datasets`

## Запуск тестов

Выполните `nx test server/data-mos` для запуска unit-тестов через [Jest](https://jestjs.io).
