// onlycampus/
// │── app/                         # Next.js App Router
// │   │── layout.tsx               # Root layout (Navbar, Theme, Providers)
// │   │── page.tsx                 # Landing page / Intro
// │   │
// │   ├── (auth)/                  # Public Auth Pages
// │   │   ├── login/
// │   │   │   └── page.tsx
// │   │   ├── register/
// │   │   │   └── page.tsx
// │   │   └── reset-password/
// │   │       └── page.tsx
// │   │
// │   ├── (dashboard)/             # Protected Area (role-based dashboards)
// │   │   ├── layout.tsx           # Dashboard layout
// │   │   ├── student/
// │   │   │   └── page.tsx
// │   │   ├── faculty/
// │   │   │   └── page.tsx
// │   │   └── admin/
// │   │       └── page.tsx
// │   │
// │   ├── groups/                  # Groups & Communication
// │   │   ├── page.tsx             # List all groups
// │   │   └── [groupId]/page.tsx   # Dynamic group chat
// │   │
// │   ├── video/                   # Video classes/meetings
// │   │   ├── schedule/page.tsx
// │   │   └── [meetingId]/page.tsx
// │   │
// │   ├── ai/                      # AI Assistant
// │   │   └── page.tsx
// │   │
// │   └── api/                     # Next.js API routes (server functions)
// │       ├── auth/[...nextauth].ts
// │       ├── groups/
// │       │   ├── create.ts
// │       │   └── [groupId]/messages.ts
// │       ├── video/
// │       │   └── join.ts
// │       └── ai/query.ts
// │
// │── components/                  # Reusable UI components
// │   ├── ui/                      # Shadcn or custom UI (Button, Card, Modal)
// │   ├── auth/                    # LoginForm, RegisterForm
// │   ├── dashboard/               # Sidebar, NavBar, Role-based widgets
// │   ├── chat/                    # ChatBox, MessageBubble, FileUploader
// │   ├── video/                   # VideoPlayer, ScheduleForm
// │   └── ai/                      # AIChatBox, SearchBar
// │
// │── lib/                         # Utility functions & config
// │   ├── auth.ts                  # NextAuth config
// │   ├── db.ts                    # MongoDB connection
// │   ├── socket.ts                # WebSocket (Socket.IO client/server)
// │   ├── ai.ts                    # LangChain/OpenAI helper
// │   └── video.ts                 # 100ms API wrapper
// │
// │── prisma/ or models/           # (Optional) Prisma/Mongoose models
// │   ├── user.ts
// │   ├── group.ts
// │   ├── message.ts
// │   ├── announcement.ts
// │   └── video.ts
// │
// │── public/                      # Static assets (logos, icons)
// │── styles/                      # Global CSS / Tailwind config
// │   ├── globals.css
// │   └── tailwind.config.ts
// │── middleware.ts                # Protect routes, role-based redirects
// │── package.json
// │── tsconfig.json






// npx tsc socket/server.ts --outDir socket/dist
// Then run Node on the compiled JS:

// bash
// Copy code
// node socket/dist/server.js
