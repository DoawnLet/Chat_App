# ChatApp Backend - Quy trinh hoat dong

Tai lieu nay mo ta cach backend cua du an `ChatApp` dang van hanh dua tren source code hien tai.

## 1) Tong quan kien truc

Backend duoc tach thanh 4 project:

- `ChatApp.Presentation`: API Controllers, `Program.cs`, SignalR Hub.
- `ChatApp.Application`: DTOs, abstraction (interfaces), cau hinh dung chung (JWT, middleware).
- `ChatApp.Infrastructure`: service xu ly nghiep vu, repository, EF Core DbContext, MediatR handlers.
- `ChatApp.Domain`: entities va enum nghiep vu.

Luong tong quat:

1. Client goi HTTP API hoac SignalR.
2. `Presentation` nhan request va xac dinh user tu JWT.
3. Request duoc chuyen vao `Infrastructure` service/handler thong qua interface.
4. `Infrastructure` thao tac DB thong qua `AppDbContext`.
5. Ket qua map sang DTO va tra ve client.
6. Rieng message chat se publish qua `IMessageBus` de day realtime bang SignalR.

## 2) Khoi dong va middleware pipeline

File khoi dong chinh: `ChatApp.Presentation/Program.cs`.

He thong thuc hien:

- Dang ky MVC Controllers, Swagger, CORS (`AllowFrontend` cho `http://localhost:3000`).
- Dang ky DI qua:
  - `AddInfrastructureService(...)`
  - `AddApplicationService(...)`
- Dang ky `IMessageBus` -> `SignalRMessageBus`.
- Bat SignalR Hub tai endpoint: `/hubs/chat`.
- Bat middleware:
  - `UseInfrastructurePolicy()` (global exception middleware).
  - `UseSwagger()`, `UseCors(...)`, `UseCookiePolicy()`.
  - `UseAuthentication()` va `UseAuthorization()`.

## 3) Xac thuc va phan quyen

### Login/Register

Controller: `AuthenticationController`

- `POST /api/Authentication/register`:
  - goi `IAuthenticationService.RegisterAsync`.
  - kiem tra trung `handle`, `email`.
  - hash password bang BCrypt.
  - luu user vao bang `Users`.

- `POST /api/Authentication/login`:
  - goi `IAuthenticationService.LoginAsync`.
  - verify password bang BCrypt.
  - tao JWT + tao `Device` + `RefreshToken`.
  - set cookie `token` de frontend gui kem cho cac request sau.

### JWT

File: `ChatApp.Application/DependencyInjection/JWTAuthenticationScheme.cs`

- JWT Bearer duoc cau hinh validate issuer, audience, signing key.
- Lay token theo 2 cach:
  - Request HTTP thong thuong: tu cookie `token`.
  - Ket noi SignalR (`/hubs`): tu query string `access_token`.
- Cac controller co `[Authorize]` se bat buoc co token hop le.

## 4) Tang du lieu (EF Core)

File: `ChatApp.Infrastructure/Data/AppDbContext.cs`.

DbContext quan ly cac bang chinh:

- `Users`, `Devices`, `RefreshTokens`
- `Contacts`
- `Conversations`, `ConversationMembers`
- `Messages`, `MessageAttachments`, `MediaObjects`
- `MessageReceipts`, `MessageReactions`, `NotificationTokens`

Diem quan trong:

- Cau hinh khoa/chis so/quan he trong `OnModelCreating`.
- Co idempotency index cho message:
  - (`ConversationId`, `SenderId`, `ClientMessageId`) la unique.
- Tu dong cap nhat `CreatedAt`, `UpdatedAt` trong `SaveChanges/SaveChangesAsync`.

## 5) Quy trinh nghiep vu chinh

### 5.1 Quan ly ban be (Contact)

Controller: `ContactController` -> Service: `ContactService`.

Chuc nang:

- Gui loi moi ket ban.
- Chap nhan/tu choi loi moi.
- Lay danh sach ban be, pending, sent, blocked (co paging).
- Block/unblock user.
- Xoa ban be.

Du lieu quan he luu trong bang `Contacts` voi `ContactStatus` (Pending/Accepted/Blocked...).

### 5.2 Quan ly hoi thoai (Conversation)

Controller: `ConversationController` -> Service: `ConversationService`.

Chuc nang:

- Tao direct conversation:
  - chi cho phep voi user da la ban be.
  - dung `DirectKey` de tranh tao trung cuoc tro chuyen 1-1.
- Tao group conversation.
- Cap nhat/xoa group.
- Them/xoa thanh vien, cap role thanh vien.
- Mute/unmute hoi thoai.
- Lay chi tiet hoi thoai va danh sach hoi thoai cua user.

### 5.3 Gui va lay tin nhan (Message)

Controller: `MessageController` su dung MediatR:

- `POST /api/conversations/{conversationId}/messages`
  -> `SendMessageCommand` -> `SendMessageHandler`.
- `GET /api/conversations/{conversationId}/messages`
  -> `ListMessageQuery` -> `ListMessageHandler`.

`SendMessageHandler` se:

1. Validate request (`ClientMessageId`, noi dung).
2. Kiem tra idempotency theo (`ConversationId`, `ClientMessageId`).
3. Kiem tra sender co la thanh vien conversation khong.
4. Tinh `Seq` tiep theo trong conversation.
5. Luu message.
6. Cap nhat `LastMessageAt`, `LastMessageId` cua conversation.
7. Publish event qua `IMessageBus`.

## 6) Realtime voi SignalR

Thanh phan:

- Hub: `ChatHub`
- Message bus: `SignalRMessageBus`

Co che:

- Client join group theo conversation:
  - `conv:{conversationId}`
- Khi co tin nhan moi, `SignalRMessageBus` goi:
  - `_hub.Clients.Group(...).MessageCraete(...)`
- Tat ca client dang join group conversation se nhan duoc su kien message moi theo thoi gian thuc.

## 7) Vi du luong end-to-end: gui tin nhan

1. User login, backend set cookie `token`.
2. Frontend goi `POST /api/conversations/{id}/messages`.
3. JWT middleware xac thuc user.
4. `MessageController` lay userId tu claims.
5. MediatR chuyen command sang `SendMessageHandler`.
6. Handler luu DB + cap nhat conversation.
7. Handler publish event qua `IMessageBus`.
8. SignalR push message moi den cac client trong group `conv:{id}`.
9. API tra `MessageDto` cho client vua gui.

## 8) Ghi chu van hanh

- CORS hien tai cho phep frontend local `http://localhost:3000`.
- Swagger dang bat de test API.
- Global exception middleware da dang ky qua `UseSharedPolices()`.
- Co hosted service `ConversationUnmuteService` (dang ky trong DI) de ho tro logic mute theo thoi gian.

---

Neu can, co the bo sung tiep:

- So do sequence (login, tao conversation, gui message).
- Bang API endpoint day du theo tung module.
- Huong dan deploy backend va bien moi truong (`appsettings`).
