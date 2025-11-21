# AI Coding Agent Instructions

## Architecture Overview

This is a **Next.js 15.5.4 social media application** using the App Router with TypeScript. The app features a posts feed with user interactions (like, bookmark, comment) and authentication.

### Core Technology Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **HTTP Client**: Axios with interceptors
- **UI Library**: Radix UI + Lucide React icons
- **State**: Local component state (useState)

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Route group for authenticated pages
│   ├── (auth)/            # Route group for auth pages
│   ├── globals.css        # Tailwind v4 with custom variables
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── [Feature]/        # Feature-specific components
├── services/             # API service layer
│   └── [feature]/
│       ├── [feature].service.ts    # API calls
│       └── [feature].types.ts      # TypeScript interfaces
├── lib/                  # Shared utilities
│   ├── axios.ts         # HTTP client with interceptors
│   └── utils.ts         # Helper functions
└── hooks/               # Custom React hooks
```

## Key Patterns & Conventions

### 1. Component Communication
**Use callback props for parent-child communication**, never refs unless absolutely necessary:

```tsx
// ✅ Good: Callback pattern
interface CreatePostProps {
  onPostCreated?: (newPost: Post) => void;
}

// ❌ Avoid: Ref pattern (causes complexity)
const postListRef = useRef<{ addNewPost: (post: Post) => void }>(null);
```

### 2. Service Layer Pattern
**All API calls go through service files** with typed interfaces:

```typescript
// services/user_info/post.service.ts
export const postService = {
  async getPosts(pageNumber: number = 1, pageSize: number = 10): Promise<PostListResponse> {
    const response = await axiosConnected.get("/api/Post/get-posts", {
      params: { pageNumber, pageSize },
    });
    return response.data;
  },
};
```

### 3. TypeScript Interfaces
**Define interfaces in `.types.ts` files** colocated with services:

```typescript
// services/user_info/post.types.ts
export interface Post {
  id: string;
  content: string;
  imageUrl?: string;
  author: User;
  likesCount: number;
  isLiked: boolean;
}
```

### 4. Authentication & HTTP
**Cookie-based auth with axios interceptors**:

```typescript
// lib/axios.ts - Extract token from cookies
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
```

### 5. Vietnamese Language
**All user-facing text and comments are in Vietnamese**:
- UI labels: `"Đăng nhập"`, `"Thích"`, `"Bình luận"`
- Error messages: `"Không thể tải bài đăng"`
- Comments: `// Xử lý lỗi khi toggle like`

### 6. Styling Conventions
**Tailwind v4 with CSS custom properties**:

```css
/* globals.css */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

**Use semantic color classes**:
```tsx
className="bg-card border border-border text-foreground"
```

### 7. Error Handling
**Use custom error extraction function**:

```typescript
// lib/axios.ts
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    return data?.message || data?.detail || "Đã có lỗi xảy ra";
  }
  return "Đã có lỗi xảy ra";
}
```

### 8. Image Handling
**Configure remote patterns in next.config.ts**:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "ui-avatars.com" },
    { protocol: "https", hostname: "i.pinimg.com" },
  ],
},
```

## Development Workflow

### Building & Running
```bash
# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Common Tasks

**Adding a new API endpoint**:
1. Add interface to `[feature].types.ts`
2. Add method to `[feature].service.ts`
3. Use in component with error handling

**Creating a new component**:
1. Use `"use client"` if it uses hooks
2. Accept callback props for parent communication
3. Use Vietnamese for user-facing text
4. Follow Tailwind semantic classes

**Adding authentication**:
1. Check for token in cookies via axios interceptor
2. Redirect to `/auth/login` on 401 errors
3. Use `withCredentials: true` for cookie auth

## Code Quality Standards

### TypeScript
- Strict mode enabled - no `any` types
- Path aliases: `@/*` for clean imports
- Interface naming: PascalCase with descriptive names

### Component Patterns
- Functional components with hooks
- Explicit return types for complex functions
- Vietnamese comments for business logic

### API Integration
- All requests through service layer
- Typed request/response interfaces
- Consistent error handling patterns

### Styling
- shadcn/ui components for consistency
- Dark mode support with CSS variables
- Responsive design with Tailwind breakpoints

## File Naming Conventions
- Components: `PascalCase.tsx`
- Services: `[feature].service.ts`
- Types: `[feature].types.ts`
- Utilities: `kebab-case.ts`

## Key Files to Reference
- `src/lib/axios.ts` - HTTP client setup
- `src/services/user_info/post.types.ts` - Data models
- `src/components/CreatePost.tsx` - Form handling pattern
- `src/app/(main)/layout.tsx` - Route group structure
- `tailwind.config.ts` - (if exists) Tailwind configuration</content>
<parameter name="filePath">d:\CSharp_UpSpeed\ChatAppProject\interface_app\.github\copilot-instructions.md