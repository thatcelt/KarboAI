# KarboAI — Русская документация

[🇬🇧 English documentation](./README.md)

Библиотека для создания ботов в приложении [KarboAI](https://karboai.com).

## Содержание

- [Установка](#установка)
- [Быстрый старт](#быстрый-старт)
- [Преимущества](#преимущества)
- [Класс KarboAI](#класс-karboai)
  - [Конструктор](#конструктор)
  - [Геттеры](#геттеры)
  - [Публичные методы](#публичные-методы)
    - [me()](#me)
    - [text()](#text)
    - [image()](#image)
    - [upload()](#upload)
    - [message()](#message)
    - [members()](#members)
    - [user()](#user)
    - [leave()](#leave)
    - [kick()](#kick)
    - [attach()](#attach)
    - [bind()](#bind)
- [Класс Router](#класс-router)
  - [Конструктор](#конструктор-router)
  - [Геттеры](#геттеры-router)
  - [Методы](#методы-router)
    - [pre()](#pre)
    - [on()](#on)
    - [command()](#command)
- [Схемы](#схемы)
- [Логирование](#логирование)

## Установка

```bash
npm install karboai
```

## Быстрый старт

```typescript
import { KarboAI, Router } from 'karboai';

const karbo = new KarboAI({
  token: 'ваш-токен-бота',
  id: 'ваш-id-бота',
  enableLogging: true,
});

const router = new Router();

router.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Привет! Добро пожаловать в KarboAI бот.');
});

router.on('message', async ({ karbo, message }) => {
  await karbo.text(message.chatId, `Вы сказали: ${message.content}`);
});

karbo.bind(router);
karbo.attach();
```

## Преимущества

- **Типизация** — Полная поддержка TypeScript с валидацией Zod-схемами всех ответов API
- **WebSocket** — Обработка сообщений в реальном времени через socket.io-client
- **Система роутеров** — Модульная архитектура с поддержкой роутеров и промежуточного ПО
- **Middleware** — Конвейер промежуточного ПО для фильтрации и обработки событий
- **Команды** — Встроенный парсер команд с поиском по префиксу
- **Логирование** — Опциональное структурированное логирование через pino
- **Обработка ошибок** — Исчерпывающие типы ошибок для всех HTTP-статусов
- **Загрузка файлов** — Поддержка multipart/form-data для загрузки изображений
- **Чистый API** — Интуитивные имена методов в camelCase

## Класс KarboAI

Основной класс для взаимодействия с API KarboAI.

### Конструктор

```typescript
new KarboAI(config: KarboConfig)
```

**Параметры:**
- `config.token` — Токен аутентификации бота
- `config.id` — ID бота
- `config.enableLogging?` — Включить логирование (по умолчанию: `false`)

**Пример:**
```typescript
const karbo = new KarboAI({
  token: 'ваш-токен-бота',
  id: 'ваш-id-бота',
  enableLogging: true,
});
```

### Геттеры

#### `id`

Возвращает ID бота из конфигурации.

```typescript
console.log(karbo.id); // 'ваш-id-бота'
```

### Публичные методы

#### `me()`

Возвращает информацию о боте.

**Возвращает:** `Promise<MeResponse>` — Объект с полями `botId`, `name`, `status`

**Пример:**
```typescript
const botInfo = await karbo.me();
console.log(botInfo.name, botInfo.status);
```

#### `text(chatId, content, replyMessageId?)`

Отправляет текстовое сообщение в чат.

**Параметры:**
- `chatId` — ID целевого чата
- `content` — Текст сообщения
- `replyMessageId?` — Опциональный ID сообщения для ответа

**Возвращает:** `Promise<MessageResponse>` — Объект с `messageId` и `createdAt`

**Пример:**
```typescript
await karbo.text('chat-123', 'Привет, мир!');
await karbo.text('chat-123', 'Отвечаю на сообщение', 'msg-456');
```

#### `image(chatId, images, replyMessageId?)`

Отправляет изображения в чат.

**Параметры:**
- `chatId` — ID целевого чата
- `images` — Массив URL-адресов изображений
- `replyMessageId?` — Опциональный ID сообщения для ответа

**Возвращает:** `Promise<MessageResponse>` — Объект с `messageId` и `createdAt`

**Пример:**
```typescript
await karbo.image('chat-123', ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
```

#### `upload(path)`

Загружает файл изображения и возвращает его URL.

**Параметры:**
- `path` — Путь к файлу на диске

**Возвращает:** `Promise<string>` — URL загруженного изображения

**Пример:**
```typescript
const imageUrl = await karbo.upload('/путь/к/изображению.png');
await karbo.image('chat-123', [imageUrl]);
```

#### `message(chatId, messageId)`

Получает конкретное сообщение из чата.

**Параметры:**
- `chatId` — ID чата
- `messageId` — ID сообщения

**Возвращает:** `Promise<Message>` — Объект сообщения

**Пример:**
```typescript
const msg = await karbo.message('chat-123', 'msg-456');
console.log(msg.content, msg.author);
```

#### `members(chatId, limit?, offset?)`

Получает участников чата.

**Параметры:**
- `chatId` — ID чата
- `limit?` — Количество участников (по умолчанию: `100`)
- `offset?` — Смещение для пагинации (по умолчанию: `0`)

**Возвращает:** `Promise<MembersResponse>` — Объект с массивом `items` типа `User`

**Пример:**
```typescript
const members = await karbo.members('chat-123', 50, 0);
console.log(members.items);
```

#### `user(userId)`

Получает информацию о пользователе.

**Параметры:**
- `userId` — ID пользователя

**Возвращает:** `Promise<User>` — Объект пользователя

**Пример:**
```typescript
const user = await karbo.user('user-123');
console.log(user);
```

#### `leave(chatId)`

Заставляет бота покинуть чат.

**Параметры:**
- `chatId` — ID чата

**Возвращает:** `Promise<boolean>` — Статус успешности

**Пример:**
```typescript
const success = await karbo.leave('chat-123');
```

#### `kick(chatId, userId)`

Выгоняет пользователя из чата.

**Параметры:**
- `chatId` — ID чата
- `userId` — ID пользователя для выгона

**Возвращает:** `Promise<boolean>` — Статус успешности

**Пример:**
```typescript
const success = await karbo.kick('chat-123', 'user-456');
```

#### `attach(callback?)`

Подключается к WebSocket KarboAI и начинает прослушивать события.

**Параметры:**
- `callback?` — Асинхронная функция, вызываемая после успешного подключения

**Пример:**
```typescript
karbo.attach(async () => {
  console.log('Бот теперь онлайн и слушает сообщения');
});
```

#### `bind(...routers)`

Привязывает один или несколько роутеров к диспетчеру.

**Параметры:**
- `...routers` — Rest-параметр с экземплярами `Router`

**Пример:**
```typescript
const mainRouter = new Router('main');
const adminRouter = new Router('admin');

mainRouter.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Привет!');
});

adminRouter.command('/ban', async ({ karbo, message }) => {
  // логика администратора
});

karbo.bind(mainRouter, adminRouter);
```

## Класс Router

Класс для организации обработчиков событий в модульные единицы.

### Конструктор

```typescript
new Router(name?: string)
```

**Параметры:**
- `name?` — Имя роутера (генерируется автоматически, если не указано)

**Пример:**
```typescript
const router = new Router('my-router');
```

### Геттеры

#### `name`

Возвращает имя роутера.

```typescript
console.log(router.name); // 'my-router'
```

#### `listeners`

Возвращает `Map` всех зарегистрированных обработчиков событий.

```typescript
console.log(router.listeners); // Map<SocketEvent, Set<Listener>>
```

### Методы

#### `pre(middleware)`

Добавляет промежуточное ПО, выполняемое до вызова callback'ов событий.

**Параметры:**
- `middleware` — Функция, принимающая `KarboContext` и возвращающая `Promise<boolean>`

**Пример:**
```typescript
router.pre(async ({ message }) => {
  // Обрабатывать только сообщения с содержимым
  return message.content.length > 0;
});
```

#### `on(event, callback)`

Регистрирует обработчик события.

**Параметры:**
- `event` — Тип события (`'message'` | `'join'`)
- `callback` — Асинхронная функция, принимающая `KarboContext`

**Пример:**
```typescript
router.on('message', async ({ karbo, message }) => {
  console.log(`Новое сообщение в ${message.chatId}: ${message.content}`);
  await karbo.text(message.chatId, 'Понял!');
});

router.on('join', async ({ karbo, message }) => {
  await karbo.text(message.chatId, `Добро пожаловать, ${message.author.userId}!`);
});
```

#### `command(startsWith, callback)`

Регистрирует обработчик команд, срабатывающий когда содержимое сообщения начинается с указанной строки.

**Параметры:**
- `startsWith` — Префикс команды для сопоставления
- `callback` — Асинхронная функция, принимающая `KarboContext`

**Пример:**
```typescript
router.command('/help', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Доступные команды: /start, /help');
});

router.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Добро пожаловать!');
});
```

## Схемы

Библиотека экспортирует несколько TypeScript-типов и Zod-схем:

- `KarboConfig` — Конфигурация для класса KarboAI
- `SendMessageConfig` — Конфигурация для отправки сообщений
- `Message` — Структура объекта сообщения
- `User`, `Author`, `Member` — Типы, связанные с пользователями
- `KarboContext` — Контекст, передаваемый в callback'и событий

```typescript
import { KarboConfig, Message, KarboContext, User } from 'karboai';
```

## Логирование

Включите структурированное логирование, установив `enableLogging: true` в конфигурации:

```typescript
const karbo = new KarboAI({
  token: 'ваш-токен',
  id: 'ваш-id',
  enableLogging: true,
});
```

Логи включают HTTP-запросы, коды статусов и входящие события.

---

**Лицензия:** MIT  
**Автор:** celt_is_god  
**Репозиторий:** [github.com/thatcelt/KarboAI](https://github.com/thatcelt/KarboAI)
