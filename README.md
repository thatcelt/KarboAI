# KarboAI

[🇷🇺 Русская версия документации](./README.RU.md)

A powerful library for creating bots in the [KarboAI](https://karboai.com) application.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Advantages](#advantages)
- [KarboAI Class](#karboai-class)
  - [Constructor](#constructor)
  - [Getters](#getters)
  - [Public Methods](#public-methods)
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
- [Router Class](#router-class)
  - [Constructor](#router-constructor)
  - [Getters](#router-getters)
  - [Methods](#router-methods)
    - [pre()](#pre)
    - [on()](#on)
    - [command()](#command)
- [Schemas](#schemas)
- [Utilities](#utilities)
  - [bold()](#bold)
  - [italic()](#italic)
  - [centralize()](#centralize)
  - [code()](#code)
  - [strikethrough()](#strikethrough)
  - [underline()](#underline)
  - [hyperlink()](#hyperlink)
- [Logging](#logging)

## Installation

```bash
npm install karboai
```

## Quick Start

```typescript
import { KarboAI, Router } from 'karboai';

const karbo = new KarboAI({
  token: 'your-bot-token',
  id: 'your-bot-id',
  enableLogging: true,
});

const router = new Router();

router.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Hello! Welcome to KarboAI bot.');
});

router.on('message', async ({ karbo, message }) => {
  await karbo.text(message.chatId, `You said: ${message.content}`);
});

karbo.bind(router);
karbo.attach();
```

## Advantages

- **Type-safe** — Full TypeScript support with Zod schema validation for all API responses
- **WebSocket support** — Real-time message handling via socket.io-client
- **Router system** — Modular architecture with routers and middleware support
- **Middleware pipeline** — Pre-processing middleware for filtering and transforming events
- **Command handling** — Built-in command parser with `startsWith` matching
- **Logging** — Optional structured logging with pino
- **Error handling** — Comprehensive error types for all HTTP status codes
- **File uploads** — Multipart form data support for image uploads
- **Clean API** — Intuitive method names with camelCase conventions

## KarboAI Class

Main class for interacting with the KarboAI API.

### Constructor

```typescript
new KarboAI(config: KarboConfig)
```

**Parameters:**
- `config.token` — Bot authentication token
- `config.id` — Bot ID
- `config.enableLogging?` — Enable logging (default: `false`)

**Example:**
```typescript
const karbo = new KarboAI({
  token: 'your-bot-token',
  id: 'your-bot-id',
  enableLogging: true,
});
```

### Getters

#### `id`

Returns the bot's ID from the configuration.

```typescript
console.log(karbo.id); // 'your-bot-id'
```

### Public Methods

#### `me()`

Returns information about the bot.

**Returns:** `Promise<MeResponse>` — Object with `botId`, `name`, and `status`

**Example:**
```typescript
const botInfo = await karbo.me();
console.log(botInfo.name, botInfo.status);
```

#### `text(chatId, content, replyMessageId?)`

Sends a text message to a chat.

**Parameters:**
- `chatId` — Target chat ID
- `content` — Message text
- `replyMessageId?` — Optional message ID to reply to

**Returns:** `Promise<MessageResponse>` — Object with `messageId` and `createdAt`

**Example:**
```typescript
await karbo.text('chat-123', 'Hello world!');
await karbo.text('chat-123', 'Replying to message', 'msg-456');
```

#### `image(chatId, images, replyMessageId?)`

Sends images to a chat.

**Parameters:**
- `chatId` — Target chat ID
- `images` — Array of image URLs
- `replyMessageId?` — Optional message ID to reply to

**Returns:** `Promise<MessageResponse>` — Object with `messageId` and `createdAt`

**Example:**
```typescript
await karbo.image('chat-123', ['https://example.com/img1.jpg', 'https://example.com/img2.jpg']);
```

#### `upload(path)`

Uploads an image file and returns its URL.

**Parameters:**
- `path` — File path on disk

**Returns:** `Promise<string>` — Uploaded image URL

**Example:**
```typescript
const imageUrl = await karbo.upload('/path/to/image.png');
await karbo.image('chat-123', [imageUrl]);
```

#### `message(chatId, messageId)`

Retrieves a specific message from a chat.

**Parameters:**
- `chatId` — Chat ID
- `messageId` — Message ID

**Returns:** `Promise<Message>` — Message object

**Example:**
```typescript
const msg = await karbo.message('chat-123', 'msg-456');
console.log(msg.content, msg.author);
```

#### `members(chatId, limit?, offset?)`

Retrieves members of a chat.

**Parameters:**
- `chatId` — Chat ID
- `limit?` — Number of members to return (default: `100`)
- `offset?` — Offset for pagination (default: `0`)

**Returns:** `Promise<MembersResponse>` — Object with `items` array of `User`

**Example:**
```typescript
const members = await karbo.members('chat-123', 50, 0);
console.log(members.items);
```

#### `user(userId)`

Retrieves information about a user.

**Parameters:**
- `userId` — User ID

**Returns:** `Promise<User>` — User object

**Example:**
```typescript
const user = await karbo.user('user-123');
console.log(user);
```

#### `leave(chatId)`

Makes the bot leave a chat.

**Parameters:**
- `chatId` — Chat ID

**Returns:** `Promise<boolean>` — Success status

**Example:**
```typescript
const success = await karbo.leave('chat-123');
```

#### `kick(chatId, userId)`

Kicks a user from a chat.

**Parameters:**
- `chatId` — Chat ID
- `userId` — User ID to kick

**Returns:** `Promise<boolean>` — Success status

**Example:**
```typescript
const success = await karbo.kick('chat-123', 'user-456');
```

#### `attach(callback?)`

Connects to the KarboAI WebSocket and starts listening for events.

**Parameters:**
- `callback?` — Async function called after successful connection

**Example:**
```typescript
karbo.attach(async () => {
  console.log('Bot is now online and listening for messages');
});
```

#### `bind(...routers)`

Binds one or more routers to the dispatcher.

**Parameters:**
- `...routers` — Rest parameter of `Router` instances

**Example:**
```typescript
const mainRouter = new Router('main');
const adminRouter = new Router('admin');

mainRouter.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Hello!');
});

adminRouter.command('/ban', async ({ karbo, message }) => {
  // admin logic
});

karbo.bind(mainRouter, adminRouter);
```

## Router Class

Class for organizing event handlers into modular units.

### Constructor

```typescript
new Router(name?: string)
```

**Parameters:**
- `name?` — Router name (auto-generated if not provided)

**Example:**
```typescript
const router = new Router('my-router');
```

### Getters

#### `name`

Returns the router's name.

```typescript
console.log(router.name); // 'my-router'
```

#### `listeners`

Returns a `Map` of all registered event listeners.

```typescript
console.log(router.listeners); // Map<SocketEvent, Set<Listener>>
```

### Methods

#### `pre(middleware)`

Adds middleware that runs before event callbacks.

**Parameters:**
- `middleware` — Function that receives `KarboContext` and returns `Promise<boolean>`

**Example:**
```typescript
router.pre(async ({ message }) => {
  // Only process messages with content
  return message.content.length > 0;
});
```

#### `on(event, callback)`

Registers an event listener.

**Parameters:**
- `event` — Event type (`'message'` | `'join'` | `'leave'` | `'voiceStart'` | `'voiceEnd'` | `'sticker'`)
- `callback` — Async function receiving `KarboContext`

**Example:**
```typescript
router.on('message', async ({ karbo, message }) => {
  console.log(`New message in ${message.chatId}: ${message.content}`);
  await karbo.text(message.chatId, 'Got it!');
});

router.on('join', async ({ karbo, message }) => {
  await karbo.text(message.chatId, `Welcome, ${message.author.userId}!`);
});
```

#### `command(startsWith, callback)`

Registers a command handler that triggers when message content starts with the given string.

**Parameters:**
- `startsWith` — Command prefix to match
- `callback` — Async function receiving `KarboContext`

**Example:**
```typescript
router.command('/help', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Available commands: /start, /help');
});

router.command('/start', async ({ karbo, message }) => {
  await karbo.text(message.chatId, 'Welcome!');
});
```

## Schemas

The library exports several TypeScript types and Zod schemas:

- `KarboConfig` — Configuration for the KarboAI class
- `SendMessageConfig` — Configuration for sending messages
- `Message` — Message object structure
- `User`, `Author`, `Member` — User-related types
- `KarboContext` — Context passed to event callbacks

```typescript
import { KarboConfig, Message, KarboContext, User } from 'karboai';
```

## Utilities

Helper functions for formatting text in messages. All utilities are exported from the main package.

```typescript
import { bold, italic, centralize, code, strikethrough, underline, hyperlink } from 'karboai';
```

### `bold(text)`

Wraps text in bold formatting.

**Parameters:**
- `text` — Text to format

**Returns:** `string` — Formatted text with `**` markers

**Example:**
```typescript
await karbo.text('chat-123', bold('This is bold text'));
// Sends: **This is bold text**
```

### `italic(text)`

Wraps text in italic formatting.

**Parameters:**
- `text` — Text to format

**Returns:** `string` — Formatted text with `__` markers

**Example:**
```typescript
await karbo.text('chat-123', italic('This is italic text'));
// Sends: __This is italic text__
```

### `centralize(text)`

Centers text in the message.

**Parameters:**
- `text` — Text to center

**Returns:** `string` — Formatted text with `[C]` prefix

**Example:**
```typescript
await karbo.text('chat-123', centralize('Centered text'));
// Sends: [C]Centered text
```

### `code(text)`

Wraps text in inline code formatting.

**Parameters:**
- `text` — Text to format

**Returns:** `string` — Formatted text with backtick markers

**Example:**
```typescript
await karbo.text('chat-123', code('const x = 42'));
// Sends: `const x = 42`
```

### `strikethrough(text)`

Wraps text in strikethrough formatting.

**Parameters:**
- `text` — Text to format

**Returns:** `string` — Formatted text with `~~` markers

**Example:**
```typescript
await karbo.text('chat-123', strikethrough('This is deleted'));
// Sends: ~~This is deleted~~
```

### `underline(text)`

Wraps text in underline formatting.

**Parameters:**
- `text` — Text to format

**Returns:** `string` — Formatted text with `++` markers

**Example:**
```typescript
await karbo.text('chat-123', underline('Underlined text'));
// Sends: ++Underlined text++
```

### `hyperlink(text, url)`

Creates a hyperlink with display text.

**Parameters:**
- `text` — Display text for the link
- `url` — URL for the hyperlink

**Returns:** `string` — Formatted hyperlink

**Example:**
```typescript
await karbo.text('chat-123', hyperlink('Visit KarboAI', 'https://karboai.com'));
// Sends: [Visit KarboAI](https://karboai.com)
```

## Logging

Enable structured logging by setting `enableLogging: true` in the config:

```typescript
const karbo = new KarboAI({
  token: 'your-token',
  id: 'your-id',
  enableLogging: true,
});
```

Logs include HTTP requests, status codes, and incoming events.

---

**License:** MIT  
**Author:** celt_is_god  
**Repository:** [github.com/thatcelt/KarboAI](https://github.com/thatcelt/KarboAI)
