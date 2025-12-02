# 💬 ChatApp: Real-Time Chat Application

[![.NET](https://img.shields.io/badge/.NET-8.0-blue)](https://dotnet.microsoft.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🌟 Tổng quan

ChatApp là một ứng dụng chat thời gian thực hiện đại, được xây dựng với kiến trúc Clean Architecture backend bằng C# ASP.NET Core và frontend responsive sử dụng Next.js 15. Ứng dụng hỗ trợ cả chat cá nhân (1-1) và nhóm, quản lý bạn bè, và tin nhắn tức thời với cập nhật real-time qua SignalR.

## 🏗️ Kiến trúc

### Backend (C# ASP.NET Core)

- **🧱 Clean Architecture Layers**:
  - **Domain**: Các entity cốt lõi như `User`, `Conversation`, `Message` kế thừa từ `AuditableEntity`
  - **Application**: DTOs, interfaces dịch vụ (`IServices`, `IRepositories`), logic validation
  - **Infrastructure**: Implementations EF Core, repositories database, AutoMapper profiles
  - **Presentation**: API controllers, SignalR hubs, JWT authentication với cookie-based sessions
- **🗄️ Database**: SQL Server với Entity Framework migrations
- **🔐 Authentication**: JWT tokens lưu trong httpOnly cookies, tự động refresh
- **⚡ Real-time Communication**: SignalR hub tại `/hubs/chat` cho push messages live

### Frontend (Next.js 15)

- **🚀 Framework**: Next.js App Router với TypeScript đảm bảo type safety
- **🎨 UI/UX**: Tailwind CSS v4 cho styling, Ant Design components
- **🌐 Networking**: Axios với interceptors tự động xử lý token từ cookies
- **🛣️ Routing**: Routes chuyên dụng cho authentication (`/auth`), danh sách chat (`/chat`), và chat chi tiết (`/chat/[id]`)

## ✨ Tính năng chính

### 💬 Conversations

- **👥 Direct chats**: Với tự động deduplication sử dụng `DirectKey` (min/max user IDs)
- **👨‍👩‍👧‍👦 Group chats**: Với title và avatar tùy chỉnh
- **👥 Member management**: Thêm/xóa thành viên, phân quyền (Owner/Admin/Member)

### 📨 Messaging

- **🔢 Sequential ordering**: Với field `Seq`
- **🔄 Idempotent sends**: Sử dụng `ClientMessageId`
- **📄 JSON-based bodies**: Hỗ trợ text, images, files
- **👍 Reactions, attachments, receipts**: Tương tác đầy đủ

### 👫 Friend System

- **📤 Send/receive requests**: Lời mời kết bạn
- **✅ Accept/reject/block**: Xử lý yêu cầu
- **📋 Friend list management**: Quản lý danh sách bạn

### ⚡ Real-time Updates

- **📡 Instant delivery**: Tin nhắn và cập nhật conversation qua SignalR
- **🔒 Security**: JWT authentication, role-based permissions, validation input

## 🛠️ Công nghệ sử dụng

| Component     | Technology                                                            |
| ------------- | --------------------------------------------------------------------- |
| **Backend**   | .NET 8, Entity Framework Core, SQL Server, SignalR, AutoMapper, Polly |
| **Frontend**  | Next.js 15, React 19, TypeScript, Tailwind CSS v4, Ant Design, Axios  |
| **Dev Tools** | VS Code, Turbopack (build nhanh), ESLint (code quality)               |

## 🚀 Cách chạy

### Backend

```bash
cd ChatApp/ChatApp.Presentation
dotnet run
```

> Chạy trên HTTPS với CORS enabled cho `http://localhost:3000`

### Frontend

```bash
cd interface_app
pnpm dev
```

> Chạy trên `http://localhost:3000` với Turbopack

### Build Commands

- **Backend**: `dotnet build`
- **Frontend**: `pnpm build --turbopack`

## 📋 Quy ước dự án

- **🆔 IDs**: Tất cả entities sử dụng `Guid` cho định danh unique
- **⏰ Timestamps**: `DateTimeOffset` cho xử lý thời gian UTC-aware
- **📤 API Responses**: Format nhất quán `{ flag: boolean, message: string, data: T }`
- **💬 Comments**: Comments bằng tiếng Việt trong code
- **✅ Validation**: Cả client-side và server-side
- **🌍 Environment**: `NEXT_PUBLIC_API_URL` cho base URL API frontend

## 🗃️ Schema Database

| Entity            | Fields                                                                |
| ----------------- | --------------------------------------------------------------------- |
| **Users**         | Handle, display name, avatar, email, password hash                    |
| **Conversations** | Type (Direct/Group), title, avatar, direct key (deduplication)        |
| **Messages**      | Conversation ID, sender ID, sequence number, body (JSON), attachments |
| **Contacts**      | Friend requests và relationships với status tracking                  |

---

<div align="center">

**Made with ❤️ by [DoawnLet](https://github.com/DoawnLet)**

⭐ Star this repo if you find it useful!

</div>
