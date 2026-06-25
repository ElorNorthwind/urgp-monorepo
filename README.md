## О репозитории

Монорепозиторий с внутренними ИТ-решениями УРЖП.
Этой стороной к пользователю.

# Использование

Проект представляет собой монорепозиторий, управляемый с помощью **Nx**.
Все команды выполняются из корневой директории проекта.

| Команда             | Описание                                                                                                       |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm start`         | Запускает **сервер** и **клиентскую часть** основных модулей проекта в режиме разработки (параллельно).        |
| `npm run start:dm`  | Запускает **серверную часть** модулей для получения данных из Документоконтроля (Oracle) для проектного офиса. |
| `npm run start:geo` | Запускает **серверную часть** модулей для получения данных для геолокационных служб управления информатизации. |
| `npm run build`     | Собирает **все** модули проекта: `server`, `client`, `dm-api`, `geo-api`.                                      |

# Структура проекта

## Приложения (Apps)

| Приложение                 | Адрес клиента | Адрес эндпоинтов | Dev-команда |
| -------------------------- | ------------- | ---------------- | ----------- |
| Дашборд Р                  | /renovation   | /api/renovation/ | start       |
| Контроль обратной связи    | /control      | /api/control/    | start       |
| Поиск адресов ФИАС         | /address      | /api/address/    | start       |
| Отчёты ВКС + ГЛ            | /vks          | /api/vks/        | start       |
| Долевое строительство      | /equity       | /api/equity/     | start       |
| XML для Росреестра         | /xml          | -                | start       |
| Сервис внешней авторизации | -             | /api/sudir/      | start       |
| Сервис синхронизации DM    | -             | /api/dm/         | start:dm    |
| Сервис синхронизации Geo   | -             | /api/geo/        | start:geo   |

## Функциональные модули сервера

| Модуль                                                       | Описание                                                                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| [address](libs/server/address/README.md)                     | Модуль парсинга неформализованных списков почтовых адресов а для поиска через API ФИАС, dadata и opendata |
| [auth](libs/server/auth/README.md)                           | Модуль авторизации монорепозитория, поддерживает стратегии local и JWT                                    |
| [control](libs/server/control/README.md)                     | Модуль запросов для клиентской части приложения по контролю рассмотрения заявок, жалоб и обратной связи   |
| [dadata](libs/server/dadata/README.md)                       | Модуль получения информации с портала dadata                                                              |
| [data-mos](libs/server/data-mos/README.md)                   | Модуль получения информации с портала открытых данных                                                     |
| [database](libs/server/database/README.md)                   | Модуль взаимодействия с основной базой данных проекта                                                     |
| [dgi-analytics](libs/server/dgi-analytics/README.md)         | Модуль взаимодействия с базой данных аналитики проектного офиса (наполняется сервисом синхронизации DM)   |
| [dm](libs/server/dm/README.md)                               | Модуль получения данных из внешней БД Документоконтроля                                                   |
| [dsa-dgi](libs/server/dsa-dgi/README.md)                     | Модуль взаимодействия с БД отдела статистики и аналитики УВЖУ                                             |
| [dtw](libs/server/dtw/README.md)                             | Модуль получения картографической подложки из внешнего контура ЦД                                         |
| [edo](libs/server/edo/README.md)                             | Модуль парсинга документов СЭДО в машиночитаемый вид (**WIP**)                                            |
| [email](libs/server/email/README.md)                         | Модуль взаимодействия с электронной почтой                                                                |
| [entities](libs/server/entities/README.md)                   | Модуль кэширования внешних сессий (**deprecated**)                                                        |
| [equity](libs/server/equity/README.md)                       | Модуль запросов для клиентской части приложения Долевого строительства                                    |
| [external-auth](libs/server/external-auth/README.md)         | Модуль получения внешних сессий (**deprecated**)                                                          |
| [fias](libs/server/fias/README.md)                           | Модуль взаимодействия с API ФИАС                                                                          |
| [geo-db](libs/server/geo-db/README.md)                       | Модуль взаимодействия с базой данных Сектор геоинформационных систем                                      |
| [letters](libs/server/letters/README.md)                     | Модуль оповещений о входящих обращениях в СЭДО (**deprecated**)                                           |
| [llm](libs/server/llm/README.md)                             | Модуль взаимодействия с внешними языковыми моделями                                                       |
| [pipes](libs/server/pipes/README.md)                         | Модуль нестандартных стратегий валидации запросов                                                         |
| [renovation](libs/server/renovation/README.md)               | Модуль запросов для клиентской части Дашборда Р                                                           |
| [rsm](libs/server/rsm/README.md)                             | Модуль парсинга данных из АИС РСМ 2.0 (**deprecated**)                                                    |
| [sudir](libs/server/sudir/README.md)                         | Модуль авторизации в СУДИР                                                                                |
| [telegram](libs/server/telegram/README.md)                   | Модуль взаимодействия с ботом в Telegramm (**deprecated**)                                                |
| [teletribe](libs/server/teletribe/README.md)                 | Модуль получения данных IP-телефонии Горячей линии                                                        |
| [vks](libs/server/vks/README.md)                             | Модуль получения данных с пульта записи на онлайн-консультации                                            |

# Технологический стак репозитория

## Общие технические решения

- Типизация: [TypeScript](<[https://www.npmjs.com/](https://www.typescriptlang.org/)>)
- Пакетный менеджер: [npm](https://www.npmjs.com/)
- Платформа монорепозитоия: [NxJS](https://nx.dev/)
- Валидация данных: [zod](https://zod.dev/)
- Методология организации файлов: [FSD](https://fsd.how/docs/get-started/overview/)
- Авторизация: [CASL](https://casl.js.org/v7/en/)
- Работа с датами: [date-fns](https://date-fns.org/)

## Клиентская часть

- Библиотека: [React](https://react.dev/)
- Маршрутизация: [Tanstack Router](https://tanstack.com/router/latest)
- Глобальные состояния: [Redux Toolkit](https://redux-toolkit.js.org/)
- Получение данных: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- Стилизация: [Tailwind](https://tailwindcss.com/)
- Безголовые компоненты: [RadixUI](https://www.radix-ui.com/) / [Shadcn](https://ui.shadcn.com/)
- Таблицы данных: [Tanstack Table](https://tanstack.com/table/latest)
- Виртуализация: [Tanstack Virtual](https://tanstack.com/virtual/latest)
- Графики: [Recharts](https://ui.shadcn.com/charts/area)
- Формы: [React Hook Form](https://react-hook-form.com/)

## Серверная часть

- Фреймворк: [NestJS](https://nestjs.com/)
- Взаимодействие с БД: [pg-promise](https://github.com/vitaly-t/pg-promise)
- Аутентификация: [Passport JS](https://www.passportjs.org/)
- Внешние HTTP-запросы: [axios](https://axios.rest/)

## База Данных

- СУБД: [PostgreSQL 14+](https://www.postgresql.org/)
- Гео данные: [PostGIS](https://postgis.net/)
- Векторы: [pgvector](https://github.com/pgvector/pgvector)
- Обёртка внешних данных: [postgres_fwd](https://www.postgresql.org/docs/current/postgres-fdw.html)

## Тестирование (RIP)

- E2E-Тесты: [Cypress](https://www.cypress.io/)
- Unit-Тесты: [Jest](https://jestjs.io/)
  > "Технический долг" - негативный термин. Я предпочитаю "code now, pay later".
