# Task Specification: TASK-023

> **Task ID**: `TASK-023`  
> **Title**: Real-Time Community Live Chat Room (WebSocket)  
> **Assignee**: `edith` (Backend) & `thor` (Mobile)  
> **Status**: `READY`  
> **Priority**: `P2`  
> **Complexity Tier**: `STANDARD`  
> **Dependencies**: `TASK-021` (Mobile System Integration - DONE)  

---

## 1. Context & Objective
Client Daniel requested an in-app community live chat room for club runners to connect, share run updates, discuss upcoming events, and motivate each other in real-time.

---

## 2. Scope & Technical Architecture

### 2.1 Database Schema Extensions (`edith` - Prisma)
* New `ChatMessage` model:
  - `id`: String @id @default(uuid())
  - `senderId`: String (references `User`)
  - `roomId`: String @default("global-fmc")
  - `content`: String @db.Text
  - `mediaUrl`: String?
  - `createdAt`: DateTime @default(now())
  - `updatedAt`: DateTime @updatedAt
* Indexes on `roomId` and `createdAt` for performant chronological history fetching.

### 2.2 Backend WebSockets & REST Gateway (`src/chat/`)
* **WebSocket Gateway (`@nestjs/websockets`, Socket.io)**:
  - Bearer JWT authentication handshake guard.
  - Room management: `joinRoom`, `leaveRoom`.
  - Message distribution: `sendMessage`, `newMessage` broadcast.
  - Real-time typing status: `userTyping`.
* **REST Endpoints**:
  - `GET /api/chat/messages?roomId=global-fmc&cursor=...`: Paginated chat history (loads 30 messages per batch).
  - `POST /api/chat/media`: Upload chat photo attachment.

### 2.3 Mobile Client UI & Flow (`thor` - Flutter)
* New **"Club Chat"** tab / screen in the mobile navigation.
* Athletic, high-contrast dark theme message bubbles (sender vs receiver).
* Display runner avatar, name, and FMC club membership badge on messages.
* Real-time socket event listener using `socket_io_client` with automatic reconnection.
* Optimistic UI message rendering for instant feedback.

---

## 3. Acceptance Criteria
- [ ] `ChatMessage` table created in PostgreSQL with proper relations and indexes.
- [ ] WebSocket Gateway authenticates JWT tokens and handles real-time broadcasting.
- [ ] REST pagination retrieves past messages cleanly with zero missing items.
- [ ] Mobile chat screen renders messages, handles typing indicators, and sends text/media.
- [ ] Unit tests for ChatGateway and ChatService passing.

