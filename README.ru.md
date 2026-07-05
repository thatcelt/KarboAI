# KarboAI SDK

[![npm version](https://img.shields.io/npm/v/karboai)](https://www.npmjs.com/package/karboai)
[![license](https://img.shields.io/npm/l/karboai)](https://github.com/thatcelt/KarboAI/blob/master/LICENSE)

🌐 [English](./README.md) | **Русский**

Мощный и гибкий TypeScript SDK для создания ботов в социальной сети [KarboAI](https://karboai.com). Предоставляет чистый API для отправки сообщений, обработки событий, управления чатами и создания интерактивных ботов с модульной маршрутизацией.

## Возможности

- **Типобезопасность** — полная поддержка TypeScript с Zod-валидацией каждого ответа API и сущности
- **Система роутеров** — модульная маршрутизация в стиле Express с поддержкой middleware для сообщений и кнопок
- **События в реальном времени** — WebSocket-система событий: сообщения, входы, выходы, голосовые чаты, звонки, кино и многое другое
- **Inline-кнопки** — богатые интерактивные кнопки с градиентами, анимациями, частицами и взаимодействиями swipe/tap
- **Поддержка медиа** — загрузка изображений, отправка картинок, обработка голосовых сообщений, видео-заметок и стикеров
- **Хелперы форматирования** — встроенные утилиты для жирного, курсива, подчёркивания, зачёркивания, кода, гиперссылок и центрирования текста
- **Настраиваемое логирование** — опциональное структурированное логирование на базе Pino с красивым выводом
- **Лёгкость** — минимум зависимостей, ESM-first, собран с помощью Bun

## Содержание

- [Установка](#установка)
- [Быстрый старт](#быстрый-старт)
- [Конфигурация](#конфигурация)
- [Методы клиента](#методы-клиента)
- [Роутер](#роутер)
- [События](#события)
- [Сущности](#сущности)
- [Хелперы форматирования](#хелперы-форматирования)
- [Inline-кнопки](#inline-кнопки)
- [Обработка ошибок](#обработка-ошибок)
- [Экспортируемые объекты](#экспортируемые-объекты)
- [Лицензия](#лицензия)

## Установка

```bash
# npm
npm install karboai

# bun
bun add karboai

# yarn
yarn add karboai

# pnpm
pnpm add karboai
```

### Требования

- Node.js 18+ или Bun
- TypeScript 5+ (peer-зависимость)

## Быстрый старт

```typescript
import { KarboAI, Router } from 'karboai';

const karbo = new KarboAI({
  token: 'YOUR_BOT_TOKEN',
  id: 'YOUR_BOT_ID',
  enableLogging: true,
});

const router = new Router('main');

// Обработка входящих сообщений
router.on('message', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: `Привет! Ты написал: ${message.content}`,
  });
});

// Обработка команд
router.command('/start', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Добро пожаловать! Я бот KarboAI 🤖',
  });
});

// Привязываем роутеры и подключаемся
karbo.bind(router);
karbo.attach();
```

## Конфигурация

Клиент `KarboAI` принимает объект `KarboConfig`:

| Свойство       | Тип       | Обязательный | По умолчанию | Описание                           |
| -------------- | --------- | ------------ | ------------ | ---------------------------------- |
| `token`        | `string`  | ✅            | —            | Токен бота из KarboAI              |
| `id`           | `string`  | ✅            | —            | ID пользователя бота               |
| `enableLogging`| `boolean` | ❌            | `false`      | Включить логирование запросов Pino |

```typescript
const karbo = new KarboAI({
  token: 'bot-token-here',
  id: 'bot-id-here',
  enableLogging: true,
});
```

## Методы клиента

### `me()`

Получить информацию о текущем боте.

```typescript
const me = await karbo.me();
// { botId: string, name: string, status: 'not_official' | 'official' | 'banned' }
```

### `text(builder)`

Отправить текстовое сообщение в чат.

```typescript
const messageId = await karbo.text({
  chatId: 'chat-id',
  content: 'Привет, мир!',
  replyMessageId: 'msg-id',       // опционально
  inlineButtons: [[button1]],      // опционально
});
```

| Параметр         | Тип               | Обязательный | Описание                    |
| ---------------- | ----------------- | ------------ | --------------------------- |
| `chatId`         | `string`          | ✅            | ID целевого чата            |
| `content`        | `string`          | ✅            | Текст сообщения             |
| `replyMessageId` | `string`          | ❌            | ID сообщения для ответа     |
| `inlineButtons`  | `InlineButton[][]`| ❌            | Ряды inline-кнопок          |

**Возвращает:** `Promise<string>` — ID отправленного сообщения.

### `image(builder)`

Отправить изображение в чат.

```typescript
const messageId = await karbo.image({
  chatId: 'chat-id',
  images: ['https://cdn.karboai.com/image.png'],
  caption: 'Смотри что нашёл!',          // опционально
  replyMessageId: 'msg-id',              // опционально
  inlineButtons: [[button1]],            // опционально
});
```

| Параметр         | Тип               | Обязательный | Описание                    |
| ---------------- | ----------------- | ------------ | --------------------------- |
| `chatId`         | `string`          | ✅            | ID целевого чата            |
| `images`         | `string[]`        | ✅            | Массив URL изображений      |
| `caption`        | `string`          | ❌            | Подпись к изображению       |
| `replyMessageId` | `string`          | ❌            | ID сообщения для ответа     |
| `inlineButtons`  | `InlineButton[][]`| ❌            | Ряды inline-кнопок          |

**Возвращает:** `Promise<string>` — ID отправленного сообщения.

### `upload(buffer, fileName?)`

Загрузить изображение на KarboAI и получить CDN-ссылку.

```typescript
const buffer = await fs.readFile('./photo.png');
const imageUrl = await karbo.upload(buffer, 'photo.png');

await karbo.image({
  chatId: 'chat-id',
  images: [imageUrl],
});
```

| Параметр   | Тип                    | Обязательный | По умолчанию  | Описание              |
| ---------- | ---------------------- | ------------ | ------------- | --------------------- |
| `buffer`   | `Buffer \| Uint8Array` | ✅            | —             | Байты файла           |
| `fileName` | `string`               | ❌            | `'file.png'`  | Имя с расширением     |

**Возвращает:** `Promise<string>` — URL загруженного изображения.

### `message(chatId, messageId)`

Получить конкретное сообщение из чата.

```typescript
const msg = await karbo.message('chat-id', 'message-id');
// Возвращает полную сущность Message
```

### `members(chatId, limit?, offset?)`

Получить участников чата с пагинацией.

```typescript
const members = await karbo.members('chat-id', 50, 0);
// Возвращает Member[]
```

| Параметр | Тип      | Обязательный | По умолчанию | Описание                    |
| -------- | -------- | ------------ | ------------ | --------------------------- |
| `chatId` | `string` | ✅            | —            | ID целевого чата            |
| `limit`  | `number` | ❌            | `100`        | Макс. кол-во за запрос      |
| `offset` | `number` | ❌            | `0`          | Смещение пагинации          |

**Возвращает:** `Promise<Member[]>`

### `user(userId, communityId?)`

Получить информацию о профиле пользователя.

```typescript
const user = await karbo.user('user-id');
const userInCommunity = await karbo.user('user-id', 42);
```

| Параметр      | Тип      | Обязательный | По умолчанию | Описание                     |
| ------------- | -------- | ------------ | ------------ | ---------------------------- |
| `userId`      | `string` | ✅            | —            | ID пользователя              |
| `communityId` | `number` | ❌            | `0`          | Контекст сообщества (опц.)   |

**Возвращает:** `Promise<User>`

### `leave(chatId)`

Покинуть чат.

```typescript
const ok = await karbo.leave('chat-id');
// true при успехе
```

### `kick(chatId, userId)`

Кикнуть пользователя из чата.

```typescript
const ok = await karbo.kick('chat-id', 'user-id');
// true при успехе
```

### `attach()`

Открыть WebSocket-соединение с KarboAI и начать получать события в реальном времени. Должен вызываться после `bind()`.

```typescript
karbo.bind(router);
karbo.attach();
```

### `bind(...routers)`

Привязать один или несколько экземпляров `Router` к диспетчеру.

```typescript
const mainRouter = new Router('main');
const adminRouter = new Router('admin');

karbo.bind(mainRouter, adminRouter);
```

## Роутер

Класс `Router` предоставляет модульный способ обработки входящих событий с поддержкой middleware.

```typescript
import { Router } from 'karboai';

const router = new Router('my-router'); // имя опционально
```

### `router.on(event, callback)`

Подписаться на событие.

```typescript
router.on('message', async ({ karbo, message }) => {
  console.log(`Новое сообщение в ${message.chatId}`);
});

router.on('join', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Добро пожаловать в чат!',
  });
});
```

### `router.command(startsWith, callback)`

Обработка сообщений, начинающихся с определённой строки (без учёта регистра).

```typescript
router.command('/help', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Доступные команды: /help, /start, /info',
  });
});
```

С дополнительным middleware:

```typescript
router.command('/admin', {
  middlewares: [async ({ message }) => {
    // Пропускаем только определённых пользователей
    return message.author.userId === 'admin-user-id';
  }],
}, async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Панель администратора',
  });
});
```

### `router.button(buttonId, callback)`

Обработка нажатий inline-кнопок по ID кнопки.

```typescript
router.button('approve', async ({ karbo, query }) => {
  await karbo.text({
    chatId: query.chatId,
    content: `Одобрено пользователем ${query.userId}`,
  });
});
```

С middleware:

```typescript
router.button('delete', {
  middlewares: [async ({ query }) => {
    return query.userId === 'admin-id';
  }],
}, async ({ karbo, query }) => {
  // Выполнится только если middleware вернул true
  await karbo.text({ chatId: query.chatId, content: 'Удалено!' });
});
```

### `router.use(middleware)`

Добавить глобальный middleware для всех обработчиков, зарегистрированных в этом роутере.

```typescript
// Логирование всех сообщений
router.use(async ({ message }) => {
  console.log(`[${message.chatId}] ${message.content}`);
  return true; // продолжить к обработчику
});
```

> **Примечание:** Верните `true` (или truthy-значение) из middleware, чтобы продолжить цепочку. Верните `false` (или falsy) — чтобы остановить.

## События

SDK поддерживает следующие события в реальном времени через WebSocket:

| Событие                  | Описание                          |
| ------------------------ | --------------------------------- |
| `message`                | Обычное сообщение в чате          |
| `join`                   | Пользователь вошёл в чат          |
| `leave`                  | Пользователь покинул чат          |
| `kicked`                 | Пользователь кикнут               |
| `dm`                     | Личное сообщение                  |
| `messageDeleted`         | Сообщение удалено автором         |
| `messageDeletedByAdmin`  | Сообщение удалено администратором |
| `voiceStart`             | Голосовой чат начат               |
| `voiceEnd`               | Голосовой чат завершён            |
| `backgroundChanged`      | Фон чата изменён                  |
| `userInvited`            | Пользователь приглашён в чат      |
| `botInvited`             | Бот приглашён в чат               |
| `actionBeer`             | Действие «пиво»                   |
| `actionKicked`           | Действие «кик»                    |
| `actionFight`            | Действие «драка»                  |
| `dmCallStarted`          | Звонок в ЛС начат                 |
| `dmCallDeclined`         | Звонок в ЛС отклонён              |
| `dmCallMissed`           | Звонок в ЛС пропущен              |
| `dmCallEnded`            | Звонок в ЛС завершён              |
| `cinemaStarted`          | Режим кино запущен                |
| `cinemaEnded`            | Режим кино завершён               |

## Сущности

Все сущности — это Zod-схемы с выведенными TypeScript-типами, экспортируемые для удобства.

### `Message`

```typescript
{
  messageId: string;
  chatId: string;
  content: string;
  createdTime: number;
  type: MessageType;
  communityId: number;
  chatType: ChatType;
  replyMessageId?: string | null;
  images?: string[];
  audio?: string | null;
  audioDurationMs?: number | null;
  waveform?: number[] | null;
  videoNote?: string | null;
  videoNoteDurationMs?: number | null;
  sticker?: string | null;
  transparent?: boolean;
  bubbleId?: string | null;
  bubbleVersion?: number;
  reactions?: Reaction[];
  author: Author;
}
```

### `User`

```typescript
{
  userId: string;
  nickname: string;
  role: Role;
  appRole: number;
  panelColor?: string;
  level: number;
  nicknameColor?: string;
  nicknameEmoji?: string;
  avatarFrame: Frame;
  avatar: string;
  shortInfo: string;
  bubbleId?: string;
}
```

### `Author`

```typescript
{
  userId: string;
  nickname: string;
  avatarUrl: string;
  role: Role;
  appRole: number;
  panelColor?: string | null;
  level: number;
  nicknameColor?: string | null;
  nicknameEmoji?: string | null;
  avatarFrame: Frame | null;
  isApiBot?: boolean;
}
```

### `Member`

```typescript
{
  userId: string;
  nickname: string;
  role: Role;
  appRole: number;
  panelColor?: string;
  level: number;
  nicknameColor?: string;
  nicknameEmoji?: string;
  avatarFrame: Frame;
  avatarUrl: string;
  memberStatus: 'joined' | 'invited';
  isApiBot: boolean;
}
```

### `Reaction`

```typescript
{
  reaction: string;
  isSticker: boolean;
  count: number;
  me: boolean;
}
```

### `InlineButton`

```typescript
{
  id: string;           // 1-64 символов
  label: string;        // 0-64 символа
  shape?: 'rectangle' | 'circle' | 'capsule';
  cornerRadius?: number;
  color: {
    hex: string;
    textHex: string;
    gradient?: {
      startHex: string;
      endHex: string;
      direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial';
    };
  };
  interaction?: {
    type: 'tap' | 'swipe';
    swipe?: { text: string; fillHex: string };
  };
  animations?: InlineButtonAnimation[];
  particles?: {
    type: 'spark' | 'confetti' | 'heart' | 'pixel' | 'smoke';
    colorHex: string;
    intensity?: number; // 1-5
  };
}
```

### Перечисления

```typescript
enum MessageType {
  Text = 0, Join = 1, Leave = 2, Kicked = 3, DM = 4,
  Deleted = 5, AdminDeleted = 6, VoiceStart = 7, VoiceEnd = 8,
  Background = 9, InvitedUser = 10, InvitedBot = 11,
  ActionBeer = 21, ActionKicked = 22, ActionFight = 23,
  DMCallStarted = 24, DMCallDeclined = 25, DMCallMissed = 26,
  DMCallEnded = 27, CinemaStarted = 28, CinemaEnded = 29,
}

enum ChatType {
  Public = 0, DM = 1, PM = 2, Private = 3,
}

enum Role {
  Regular = 0,
}
```

## Хелперы форматирования

SDK экспортирует вспомогательные функции для разметки KarboAI:

```typescript
import { bold, italic, underline, strikethrough, code, centralize, hyperlink } from 'karboai';

bold('важно');              // **важно**
italic('акцент');           // __акцент__
underline('подчёркнуто');   // ++подчёркнуто++
strikethrough('удалено');   // ~~удалено~~
code('console.log()');      // `console.log()`
centralize('по центру');    // [C]по центру
hyperlink('ссылка', 'https://example.com'); // [ссылка](https://example.com)
```

## Inline-кнопки

Inline-кнопки поддерживают богатую кастомизацию — цвета, градиенты, формы, анимации и частицы.

### Простая кнопка

```typescript
import { KarboAI, Router } from 'karboai';

const button = {
  id: 'like',
  label: 'Нравится ❤️',
  color: { hex: '#FF4444', textHex: '#FFFFFF' },
};

const router = new Router();

router.button('like', async ({ karbo, query }) => {
  await karbo.text({ chatId: query.chatId, content: 'Спасибо за лайк!' });
});

karbo.bind(router);

// Отправляем сообщение с кнопкой
await karbo.text({
  chatId: 'chat-id',
  content: 'Тебе нравится?',
  inlineButtons: [[button]],
});
```

### Кнопка с градиентом и анимацией

```typescript
const fancyButton = {
  id: 'premium',
  label: 'Премиум ✨',
  shape: 'capsule' as const,
  color: {
    hex: '#6C5CE7',
    textHex: '#FFFFFF',
    gradient: {
      startHex: '#6C5CE7',
      endHex: '#A29BFE',
      direction: 'horizontal' as const,
    },
  },
  animations: [{
    kind: 'neon' as const,
    colorHex: '#6C5CE7',
    speedMs: 1500,
  }],
  particles: {
    type: 'spark' as const,
    colorHex: '#FFD700',
    intensity: 3,
  },
};
```

### Кнопка со свайпом

```typescript
const swipeButton = {
  id: 'confirm',
  label: 'Свайп для подтверждения',
  color: { hex: '#00B894', textHex: '#FFFFFF' },
  interaction: {
    type: 'swipe' as const,
    swipe: { text: 'Подтвердить →', fillHex: '#00B894' },
  },
};
```

## Обработка ошибок

SDK выбрасывает экземпляры `KarboError` для ошибок API:

| Код  | Имя                       | Описание                                     |
| ---- | ------------------------- | -------------------------------------------- |
| 400  | `KarboAI.BadRequest`      | Пустое сообщение, контент слишком длинный, слишком много изображений |
| 401  | `KarboAI.Unauthorized`    | Неверный токен бота                          |
| 403  | `KarboAI.Forbidden`       | Доступ запрещён                              |
| 404  | `KarboAI.NotFound`        | Контент не существует                        |
| 413  | `KarboAI.FileTooLarge`    | Файл превышает лимит размера                 |
| 429  | `KarboAI.TooManyRequests` | Превышен лимит запросов                      |

```typescript
import { KarboAI } from 'karboai';

try {
  await karbo.text({ chatId: 'chat-id', content: 'Привет' });
} catch (error) {
  if (error instanceof Error && error.name === 'KarboAI.Unauthorized') {
    console.error('Неверный токен!');
  }
}
```

## Экспортируемые объекты

### Классы

| Экспорт    | Описание                                 |
| ---------- | ---------------------------------------- |
| `KarboAI`  | Главный класс клиента                    |
| `Router`   | Роутер событий с поддержкой middleware   |

### Схемы (Zod)

| Экспорт                         | Описание                              |
| ------------------------------- | ------------------------------------- |
| `MessageSchema`                 | Схема сущности сообщения              |
| `UserSchema`                    | Схема сущности пользователя           |
| `AuthorSchema`                  | Схема сущности автора                 |
| `BaseUserSchema`                | Схема базового пользователя           |
| `ChatSchema`                    | Схема сущности чата                   |
| `FrameSchema`                   | Схема рамки аватара                   |
| `InlineButtonSchema`            | Схема inline-кнопки                   |
| `MemberSchema`                  | Схема участника чата                  |
| `ReactionSchema`                 | Схема реакции                         |
| `MeResponseSchema`              | Схема ответа информации о боте        |
| `SendMessageResponseSchema`     | Схема ответа отправки сообщения       |
| `UploadMediaResponseSchema`     | Схема ответа загрузки                 |
| `GetMembersResponseSchema`      | Схема ответа получения участников     |
| `ActionResponseSchema`          | Схема ответа действия (кик/выход)     |
| `InteractionCallbackQuerySchema`| Схема запроса нажатия кнопки          |

### Перечисления

| Экспорт       | Описание                          |
| ------------- | --------------------------------- |
| `MessageType` | Перечисление типов сообщений      |
| `ChatType`    | Перечисление типов чатов          |
| `Role`        | Перечисление ролей пользователей  |

### Вспомогательные функции

| Экспорт          | Описание                                |
| ---------------- | --------------------------------------- |
| `bold`           | Обернуть текст в жирный                 |
| `italic`         | Обернуть текст в курсив                 |
| `underline`      | Обернуть текст в подчёркивание          |
| `strikethrough`  | Обернуть текст в зачёркивание           |
| `code`           | Обернуть текст в инлайн-код             |
| `centralize`     | Центрировать текст                      |
| `hyperlink`      | Создать гиперссылку                     |

### Типы

| Экспорт                 | Описание                                   |
| ----------------------- | ------------------------------------------ |
| `KarboConfig`           | Конфигурация клиента                       |
| `MessageBuilder`        | Билдер обычного сообщения                  |
| `TextBuilder`           | Билдер текстового сообщения                |
| `ImageBuilder`          | Билдер сообщения с изображением            |
| `Message`               | Тип сущности сообщения                     |
| `User`                  | Тип сущности пользователя                  |
| `Author`                | Тип сущности автора                        |
| `BaseUser`              | Тип базового пользователя                  |
| `Chat`                  | Тип сущности чата                          |
| `Frame`                 | Тип рамки аватара                          |
| `InlineButton`          | Тип inline-кнопки                          |
| `Member`                | Тип участника чата                         |
| `Reaction`              | Тип реакции                                |
| `MessageContext`        | Контекст, передаваемый в обработчик сообщений |
| `InteractionContext`    | Контекст, передаваемый в обработчик кнопок |
| `MessageCallback`       | Тип функции обработчика сообщения          |
| `InteractionCallback`   | Тип функции обработчика кнопки             |
| `SocketMessageEvent`    | Объединение всех имён событий              |
| `MeResponse`            | Тип ответа информации о боте               |

## Лицензия

MIT © [thatcelt](https://github.com/thatcelt)
