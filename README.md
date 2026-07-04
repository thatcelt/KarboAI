# KarboAI SDK

[![npm version](https://img.shields.io/npm/v/karboai)](https://www.npmjs.com/package/karboai)
[![license](https://img.shields.io/npm/l/karboai)](https://github.com/thatcelt/KarboAI/blob/master/LICENSE)

🌐 **English** | [Русский](./README.ru.md)

A powerful and flexible TypeScript SDK for building bots on the [KarboAI](https://karboai.com) social network. Provides a clean API for sending messages, handling events, managing chats, and building interactive bot experiences with a router-based architecture.

## Features

- **Type-safe** — full TypeScript support with Zod-validated schemas for every API response and entity
- **Router system** — modular, Express-like routing with middleware support for messages and button interactions
- **Real-time events** — WebSocket-powered event system covering messages, joins, leaves, voice, calls, cinema, and more
- **Inline buttons** — rich interactive buttons with gradients, animations, particles, and swipe/tap interactions
- **Media support** — upload images, send image messages, handle voice notes, video notes, and stickers
- **Text formatting helpers** — built-in utilities for bold, italic, underline, strikethrough, code, hyperlinks, and centered text
- **Configurable logging** — optional Pino-based structured logging with pretty-print output
- **Lightweight** — minimal dependencies, ESM-first, built with Bun

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Client Methods](#client-methods)
- [Router](#router)
- [Events](#events)
- [Entities](#entities)
- [Text Formatting Helpers](#text-formatting-helpers)
- [Inline Buttons](#inline-buttons)
- [Error Handling](#error-handling)
- [Exported Objects](#exported-objects)
- [License](#license)

## Installation

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

### Requirements

- Node.js 18+ or Bun
- TypeScript 5+ (peer dependency)

## Quick Start

```typescript
import { KarboAI, Router } from 'karboai';

const karbo = new KarboAI({
  token: 'YOUR_BOT_TOKEN',
  id: 'YOUR_BOT_ID',
  enableLogging: true,
});

const router = new Router('main');

// Handle incoming messages
router.on('message', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: `Hello! You said: ${message.content}`,
  });
});

// Handle commands
router.command('/start', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Welcome! I am a KarboAI bot 🤖',
  });
});

// Bind routers and connect
karbo.bind(router);
karbo.attach();
```

## Configuration

The `KarboAI` client accepts a `KarboConfig` object:

| Property       | Type      | Required | Default | Description                        |
| -------------- | --------- | -------- | ------- | ---------------------------------- |
| `token`        | `string`  | ✅        | —       | Bot token from KarboAI             |
| `id`           | `string`  | ✅        | —       | Bot user ID                        |
| `enableLogging`| `boolean` | ❌        | `false` | Enable Pino-based request logging  |

```typescript
const karbo = new KarboAI({
  token: 'bot-token-here',
  id: 'bot-id-here',
  enableLogging: true,
});
```

## Client Methods

### `me()`

Get information about the current bot.

```typescript
const me = await karbo.me();
// { botId: string, name: string, status: 'not_official' | 'official' | 'banned' }
```

### `text(builder)`

Send a text message to a chat.

```typescript
const messageId = await karbo.text({
  chatId: 'chat-id',
  content: 'Hello, world!',
  replyMessageId: 'msg-id',       // optional
  inlineButtons: [[button1]],      // optional
});
```

| Parameter        | Type              | Required | Description               |
| ---------------- | ----------------- | -------- | ------------------------- |
| `chatId`         | `string`          | ✅        | Target chat ID            |
| `content`        | `string`          | ✅        | Message text              |
| `replyMessageId` | `string`          | ❌        | Message ID to reply to    |
| `inlineButtons`  | `InlineButton[][]`| ❌        | Rows of inline buttons    |

**Returns:** `Promise<string>` — the sent message ID.

### `image(builder)`

Send an image message to a chat.

```typescript
const messageId = await karbo.image({
  chatId: 'chat-id',
  images: ['https://cdn.karboai.com/image.png'],
  caption: 'Check this out!',       // optional
  replyMessageId: 'msg-id',         // optional
  inlineButtons: [[button1]],       // optional
});
```

| Parameter        | Type              | Required | Description                    |
| ---------------- | ----------------- | -------- | ------------------------------ |
| `chatId`         | `string`          | ✅        | Target chat ID                 |
| `images`         | `string[]`        | ✅        | Array of image URLs            |
| `caption`        | `string`          | ❌        | Text caption for the image     |
| `replyMessageId` | `string`          | ❌        | Message ID to reply to         |
| `inlineButtons`  | `InlineButton[][]`| ❌        | Rows of inline buttons         |

**Returns:** `Promise<string>` — the sent message ID.

### `upload(buffer, fileName?)`

Upload an image to KarboAI and get a CDN URL.

```typescript
const buffer = await fs.readFile('./photo.png');
const imageUrl = await karbo.upload(buffer, 'photo.png');

await karbo.image({
  chatId: 'chat-id',
  images: [imageUrl],
});
```

| Parameter  | Type                    | Required | Default    | Description          |
| ---------- | ----------------------- | -------- | ---------- | -------------------- |
| `buffer`   | `Buffer \| Uint8Array`  | ✅        | —          | Raw file bytes       |
| `fileName` | `string`                | ❌        | `'file.png'`| Name with extension |

**Returns:** `Promise<string>` — the uploaded image URL.

### `message(chatId, messageId)`

Fetch a specific message from a chat.

```typescript
const msg = await karbo.message('chat-id', 'message-id');
// Returns a full Message entity
```

### `members(chatId, limit?, offset?)`

Get members of a chat with pagination.

```typescript
const members = await karbo.members('chat-id', 50, 0);
// Returns Member[]
```

| Parameter | Type     | Required | Default | Description           |
| --------- | -------- | -------- | ------- | --------------------- |
| `chatId`  | `string` | ✅        | —       | Target chat ID        |
| `limit`   | `number` | ❌        | `100`   | Max items per request |
| `offset`  | `number` | ❌        | `0`     | Pagination offset     |

**Returns:** `Promise<Member[]>`

### `user(userId, communityId?)`

Get user profile information.

```typescript
const user = await karbo.user('user-id');
const userInCommunity = await karbo.user('user-id', 42);
```

| Parameter     | Type     | Required | Default | Description                    |
| ------------- | -------- | -------- | ------- | ------------------------------ |
| `userId`      | `string` | ✅        | —       | Target user ID                 |
| `communityId` | `number` | ❌        | `0`     | Community context (optional)   |

**Returns:** `Promise<User>`

### `leave(chatId)`

Leave a chat.

```typescript
const ok = await karbo.leave('chat-id');
// true if successful
```

### `kick(chatId, userId)`

Kick a user from a chat.

```typescript
const ok = await karbo.kick('chat-id', 'user-id');
// true if successful
```

### `attach()`

Open a WebSocket connection to KarboAI and start receiving real-time events. Must be called after `bind()`.

```typescript
karbo.bind(router);
karbo.attach();
```

### `bind(...routers)`

Bind one or more `Router` instances to the dispatcher.

```typescript
const mainRouter = new Router('main');
const adminRouter = new Router('admin');

karbo.bind(mainRouter, adminRouter);
```

## Router

The `Router` class provides a modular way to handle incoming events with middleware support.

```typescript
import { Router } from 'karboai';

const router = new Router('my-router'); // name is optional
```

### `router.on(event, callback)`

Subscribe to a socket event.

```typescript
router.on('message', async ({ karbo, message }) => {
  console.log(`New message in ${message.chatId}`);
});

router.on('join', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Welcome to the chat!',
  });
});
```

### `router.command(startsWith, callback)`

Handle messages that start with a specific string (case-insensitive).

```typescript
router.command('/help', async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Available commands: /help, /start, /info',
  });
});
```

With additional middleware:

```typescript
router.command('/admin', {
  pipes: [async ({ message }) => {
    // Only allow specific users
    return message.author.userId === 'admin-user-id';
  }],
}, async ({ karbo, message }) => {
  await karbo.text({
    chatId: message.chatId,
    content: 'Admin panel',
  });
});
```

### `router.button(buttonId, callback)`

Handle inline button presses by button ID.

```typescript
router.button('approve', async ({ karbo, query }) => {
  await karbo.text({
    chatId: query.chatId,
    content: `Approved by ${query.userId}`,
  });
});
```

With middleware:

```typescript
router.button('delete', {
  pipes: [async ({ query }) => {
    return query.userId === 'admin-id';
  }],
}, async ({ karbo, query }) => {
  // Only runs if middleware returns true
  await karbo.text({ chatId: query.chatId, content: 'Deleted!' });
});
```

### `router.pipe(middleware)`

Add a global middleware to all listeners registered on this router.

```typescript
// Log all messages
router.pipe(async ({ message }) => {
  console.log(`[${message.chatId}] ${message.content}`);
  return true; // continue to handler
});
```

> **Note:** Return `true` (or truthy) from middleware to continue to the next middleware / callback. Return `false` (or falsy) to stop the chain.

## Events

The SDK supports the following real-time events via WebSocket:

| Event               | Description                     |
| ------------------- | ------------------------------- |
| `message`           | Regular chat message            |
| `join`              | User joined the chat            |
| `leave`             | User left the chat              |
| `kicked`            | User was kicked                 |
| `dm`                | Direct message                  |
| `messageDeleted`    | Message deleted by author       |
| `messageDeletedByAdmin` | Message deleted by admin    |
| `voiceStart`        | Voice chat started              |
| `voiceEnd`          | Voice chat ended                |
| `backgroundChanged` | Chat background changed         |
| `userInvited`       | User invited to chat            |
| `botInvited`        | Bot invited to chat             |
| `actionBeer`        | Beer action                     |
| `actionKicked`      | Kick action                     |
| `actionFight`       | Fight action                    |
| `dmCallStarted`     | DM call started                 |
| `dmCallDeclined`    | DM call declined                |
| `dmCallMissed`      | DM call missed                  |
| `dmCallEnded`       | DM call ended                   |
| `cinemaStarted`     | Cinema mode started             |
| `cinemaEnded`       | Cinema mode ended               |

## Entities

All entities are Zod schemas with inferred TypeScript types, exported for your convenience.

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
  id: string;           // 1-64 chars
  label: string;        // 0-64 chars
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

### Enums

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

## Text Formatting Helpers

The SDK exports helper functions for KarboAI's markup syntax:

```typescript
import { bold, italic, underline, strikethrough, code, centralize, hyperlink } from 'karboai';

bold('important');         // **important**
italic('emphasis');        // __emphasis__
underline('underlined');   // ++underlined++
strikethrough('removed');  // ~~removed~~
code('console.log()');     // `console.log()`
centralize('centered');    // [C]centered
hyperlink('click', 'https://example.com'); // [click](https://example.com)
```

## Inline Buttons

Inline buttons support rich customization — colors, gradients, shapes, animations, and particles.

### Basic button

```typescript
import { KarboAI, Router } from 'karboai';

const button = {
  id: 'like',
  label: 'Like ❤️',
  color: { hex: '#FF4444', textHex: '#FFFFFF' },
};

const router = new Router();

router.button('like', async ({ karbo, query }) => {
  await karbo.text({ chatId: query.chatId, content: 'Thanks for the like!' });
});

karbo.bind(router);

// Send a message with a button
await karbo.text({
  chatId: 'chat-id',
  content: 'Do you like this?',
  inlineButtons: [[button]],
});
```

### Button with gradient and animation

```typescript
const fancyButton = {
  id: 'premium',
  label: 'Go Premium ✨',
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

### Swipe button

```typescript
const swipeButton = {
  id: 'confirm',
  label: 'Slide to confirm',
  color: { hex: '#00B894', textHex: '#FFFFFF' },
  interaction: {
    type: 'swipe' as const,
    swipe: { text: 'Confirm →', fillHex: '#00B894' },
  },
};
```

## Error Handling

The SDK throws `KarboError` instances for API errors:

| Code | Name                    | Description                              |
| ---- | ----------------------- | ---------------------------------------- |
| 400  | `KarboAI.BadRequest`    | Empty message, content too long, too many images |
| 401  | `KarboAI.Unauthorized`  | Invalid bot token                        |
| 403  | `KarboAI.Forbidden`     | Access denied                            |
| 404  | `KarboAI.NotFound`      | Content doesn't exist                    |
| 413  | `KarboAI.FileTooLarge`  | File exceeds size limit                  |
| 429  | `KarboAI.TooManyRequests` | Rate limit exceeded                    |

```typescript
import { KarboAI } from 'karboai';

try {
  await karbo.text({ chatId: 'chat-id', content: 'Hello' });
} catch (error) {
  if (error instanceof Error && error.name === 'KarboAI.Unauthorized') {
    console.error('Invalid token!');
  }
}
```

## Exported Objects

### Classes

| Export     | Description                                |
| ---------- | ------------------------------------------ |
| `KarboAI`  | Main client class                          |
| `Router`   | Event router with middleware support       |

### Schemas (Zod)

| Export                        | Description                        |
| ----------------------------- | ---------------------------------- |
| `MessageSchema`               | Message entity schema              |
| `UserSchema`                  | User entity schema                 |
| `AuthorSchema`                | Author entity schema               |
| `BaseUserSchema`              | Base user entity schema            |
| `ChatSchema`                  | Chat entity schema                 |
| `FrameSchema`                 | Avatar frame schema                |
| `InlineButtonSchema`          | Inline button schema               |
| `MemberSchema`                | Chat member schema                 |
| `ReactionSchema`              | Reaction schema                    |
| `MeResponseSchema`            | Bot info response schema           |
| `SendMessageResponseSchema`   | Send message response schema       |
| `UploadMediaResponseSchema`   | Upload response schema             |
| `GetMembersResponseSchema`    | Get members response schema        |
| `ActionResponseSchema`        | Action (kick/leave) response schema|
| `InteractionCallbackQuerySchema` | Button press query schema       |

### Enums

| Export        | Description                |
| ------------- | -------------------------- |
| `MessageType` | Message type enum          |
| `ChatType`    | Chat type enum             |
| `Role`        | User role enum             |

### Helper Functions

| Export           | Description                          |
| ---------------- | ------------------------------------ |
| `bold`           | Wrap text in bold markup             |
| `italic`         | Wrap text in italic markup           |
| `underline`      | Wrap text in underline markup        |
| `strikethrough`  | Wrap text in strikethrough markup    |
| `code`           | Wrap text in inline code markup      |
| `centralize`     | Center text                          |
| `hyperlink`      | Create a hyperlink                   |

### Types

| Export                  | Description                              |
| ----------------------- | ---------------------------------------- |
| `KarboConfig`           | Client configuration                     |
| `MessageBuilder`        | Generic message builder                  |
| `TextBuilder`           | Text message builder                     |
| `ImageBuilder`          | Image message builder                    |
| `Message`               | Message entity type                      |
| `User`                  | User entity type                         |
| `Author`                | Author entity type                       |
| `BaseUser`              | Base user entity type                    |
| `Chat`                  | Chat entity type                         |
| `Frame`                 | Avatar frame type                        |
| `InlineButton`          | Inline button type                       |
| `Member`                | Chat member type                         |
| `Reaction`              | Reaction type                            |
| `MessageContext`        | Context passed to message handlers       |
| `InteractionContext`    | Context passed to button handlers        |
| `MessageCallback`       | Message handler function type            |
| `InteractionCallback`   | Button handler function type             |
| `SocketMessageEvent`    | Union of all event names                 |
| `MeResponse`            | Bot info response type                   |

## License

MIT © [thatcelt](https://github.com/thatcelt)
