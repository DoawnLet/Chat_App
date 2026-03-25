# ChatApp Copilot Instructions

## Architecture Overview

This is a real-time chat application with a C# ASP.NET Core backend using Clean Architecture and a Next.js 15 frontend.

**Backend Layers:**

- `ChatApp.Domain`: Entities (User, Conversation, Message) inheriting `AuditableEntity`
- `ChatApp.Application`: Services, DTOs, abstractions (IRepositories, IServices)
- `ChatApp.Infrastructure`: EF Core repositories, services, AutoMapper profiles
- `ChatApp.Presentation`: Controllers, SignalR hubs, JWT auth with cookies

**Frontend Structure:**

- `interface_app/`: Next.js App Router with TypeScript
- Components in `src/components/`, services in `src/services/`
- Uses Tailwind CSS v4, Antd, Axios with cookie-based auth

## Key Patterns

- **Conversations**: Direct chats use `DirectKey` (min/max user IDs) for uniqueness; Groups have `Title` and `AvatarUrl`
- **Messages**: Sequential `Seq` per conversation, `ClientMessageId` for idempotency, `Body` as JSON string
- **Auth**: JWT tokens stored in httpOnly cookies; Axios interceptor adds Bearer header from cookie
- **Real-time**: SignalR hub at `/hubs/chat` for message pushes
- **Mappings**: AutoMapper profiles in `Infrastructure/ServiceContainer.cs` (e.g., `MapToFriendRequestProfile`)

## Workflows

- **Backend**: `cd ChatApp/ChatApp.Presentation && dotnet run` (runs on https with CORS for localhost:3000)
- **Frontend**: `cd interface_app && pnpm dev` (uses Turbopack, runs on localhost:3000)
- **Build**: `dotnet build` for backend, `pnpm build --turbopack` for frontend
- **Database**: SQL Server with EF migrations; schema in `Database/ChatApp.sql`

## Conventions

- Entity IDs are `Guid`; use `DateTimeOffset` for timestamps
- DTOs mirror entities but flattened (e.g., `ConversationDto` includes member info)
- Vietnamese comments and error messages in UI
- Client-side validation in forms; server returns `{ flag: boolean, message: string, data: T }`
- Environment: `NEXT_PUBLIC_API_URL` for frontend API base

## Examples

- **Create Direct Conversation**: Check `DirectKey = min(userA,userB) + max(userA,userB)` to avoid duplicates
- **Message Ordering**: Query `Messages.OrderBy(m => m.Seq)` within conversation
- **Login Flow**: POST `/api/Authentication/login` sets cookie; 401 redirects to `/auth/login`
- **SignalR**: Subscribe to hub for `MessagePush` events with conversation ID

Reference: `ChatApp.Domain/Entities/`, `interface_app/src/services/`, `Program.cs`
