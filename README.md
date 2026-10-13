# Таверна

Браузерная игра: пошаговый экономический симулятор средневековой таверны.
React + TypeScript, игровой зал отрисовывается через Canvas API.

Учебный проект курса «Мидл фронтенд-разработчик».

> **Демо:** _ссылка появится после первого деплоя_
>
> **🎬 Видео с демонстрацией задач 7 и 8 спринтов:** https://drive.google.com/file/d/1eCJdXpFv5G_5UOGgsm7RLatYcGmPotOo/view?usp=sharing

![Зал таверны](docs/assets/game-screen-dark.png)

## Запуск проекта

Нужны Node.js `>= 22.12.0`, Yarn и Docker.

### Вариант 1: всё в Docker (как в проде)

```bash
node init.js            # создаёт .env из .env.sample и папку tmp/pgdata для базы
docker compose up --build
```

Поднимутся три сервиса: клиент с SSR, свой бэкенд и PostgreSQL.

- Клиент: http://localhost:3000
- Сервер: http://localhost:3001

### Вариант 2: локальная разработка

```bash
yarn bootstrap                 # обязательный шаг: зависимости + .env
docker compose up -d postgres  # серверу нужна база
yarn dev                       # клиент и сервер вместе, с hot reload
```

Запустить только одну часть: `yarn dev --scope=client` или `yarn dev --scope=server`.

### Вариант 3: production-сборка без Docker

```bash
yarn build
yarn preview --scope server
yarn preview --scope client
```

Порты и доступы к базе настраиваются в `.env` (шаблон — `.env.sample`).

## Что это за игра

Игрок управляет придорожной таверной шесть недель. Каждую неделю приходит происшествие,
на которое надо как-то ответить, и есть немного денег на три действия: починить стол,
нанять помощника, закупить провизию.

Репутация определяет, сколько гостей придёт. Она растёт медленно и падает быстро —
сэкономил на ремонте один раз, потерял поток гостей на три недели. Цель — дожить
до конца сезона не разорившись и набрать больше очков, чем другие в лидерборде.

Партия занимает 5–7 минут.

## Документация

| Файл | О чём |
|---|---|
| [docs/game-plan.md](docs/game-plan.md) | Что за игра, что видит игрок, как проходит партия |
| [docs/architecture.md](docs/architecture.md) | Слои, границы модулей, ограничения SSR |
| [docs/forum-api.md](docs/forum-api.md) | API форума: маршруты, авторизация, комментарии, ответы и реакции |
| [docs/contributing.md](docs/contributing.md) | Правила разработки, git, ревью и спринта |
| [AGENTS.md](AGENTS.md) | Инструкции для AI-помощников |

Актуальные задачи — на доске в GitHub Projects.

## Стек

| Слой | Технологии |
|---|---|
| Клиент | React, TypeScript, Redux Toolkit, React Router, Vite, SSR |
| Игра | Чистый TypeScript, Canvas API |
| Сервер | Node, Express, PostgreSQL, Sequelize |
| Инфраструктура | Lerna, Docker, Nginx, GitHub Actions, Yandex Cloud (прод), Vercel (превью PR) |

Авторизация, профиль и лидерборд — через готовое API курса.
Свой бэкенд отвечает только за форум и хранение тем оформления.

```
packages/client/    # фронтенд
packages/server/    # свой бэкенд: форум и темизация
docs/               # документация проекта
```

## Как мы работаем

- Ветка на задачу, мерж только через pull request
- Минимум один апрув, отсматриваем PR в течение суток
- CI обязан быть зелёным: линтер, тайпчек, тесты
- Задача закрыта после мержа, а не после «локально работает»
- Заморозка фич — середина седьмого спринта, дальше только багфиксы

Подробно — в [docs/contributing.md](docs/contributing.md): ветки, PR, ревью.

Перед первым PR прочитайте [docs/architecture.md](docs/architecture.md) —
там границы слоёв и ограничения SSR, которые проверяются на ревью.

Как запустить проект — в разделе [«Запуск проекта»](#запуск-проекта).

### Как добавить зависимости?
В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента 
```yarn lerna add {your_dep} --scope client```

Для сервера
```yarn lerna add {your_dep} --scope server```

И для клиента и для сервера
```yarn lerna add {your_dep}```


Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
```yarn lerna add {your_dep} --dev --scope server```


### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

```yarn test```

### Линтинг

```yarn lint```

### Форматирование prettier

```yarn format```

### Production build

Host builds use `INTERNAL_SERVER_URL=http://localhost:3001` from `.env.sample`,
so SSR can reach the backend when running `yarn preview --scope client` locally.
Docker Compose explicitly passes `http://server:${SERVER_PORT}` as a client build
argument; standalone Docker builds default to `http://server:3001`. This override
applies during compilation because Vite embeds the SSR backend URL in the bundle.

```yarn build```

И чтобы посмотреть что получилось


`yarn preview --scope client`
`yarn preview --scope server`

## Хуки
В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Ничего не работает

Заведите issue: что делали, что ожидали, что получилось, версия Node и вывод команды.
Разберёмся.

## Превью-деплой PR на Vercel

Каждый PR автоматически деплоится на Vercel, URL присылает бот. `root directory` —
`packages/client`.

Это **витрина для ревью, а не прод**: превью собирается статикой, без серверного рендера.
Продакшен живёт в Yandex Cloud, там же меряется Lighthouse.

## Production окружение в докере
Перед первым запуском выполните `node init.js`


`docker compose up` - запустит три сервиса
1. node, отдающий клиент с серверным рендером (client) — см. `d-client.Dockerfile`
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Nginx в этой связке пока не участвует: он появится в проде как reverse-proxy с SSL,
чтобы фронт, свой бэкенд и API курса жили на одном origin (задача 1.14).

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`
