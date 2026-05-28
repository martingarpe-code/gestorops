# GestorOps — Informe de Contexto para Nueva Sesión
> Generado el 28/05/2026 — Para continuar el desarrollo sin perder contexto

---

## 1. ESTADO GENERAL DEL PROYECTO

### ¿Qué es GestorOps?
Aplicación web interna para gestión operativa de una agencia tecnológica/freelance.
Gestiona: clientes, proyectos, mantenimientos, incidencias, accesos técnicos, renovaciones, documentación, tareas e infraestructura.

### Stack técnico
- **Frontend/Backend:** Next.js 16.2.6 (App Router, Turbopack, TypeScript)
- **Auth + BD:** Supabase (PostgreSQL, RLS, Supabase Auth)
- **Estilos:** Tailwind v4 + shadcn/ui (Nova/Radix preset)
- **Despliegue:** Vercel (pendiente)
- **Tema:** Dark mode forzado (zinc-950 + indigo-500)

### Rutas del proyecto
- **GestorOps (web app):** `G:\Gestorops\`
- **Worker IA:** `G:\Gestorops-worker\`
- **Servidor local:** `http://localhost:3000`
- **Supabase proyecto:** `gestorops-dev` (ID: `ihwkxzjjzzcfhzvrzjne`)
- **Supabase URL:** `https://ihwkxzjjzzcfhzvrzjne.supabase.co`

---

## 2. CREDENCIALES Y CONFIGURACIÓN

### Archivo `G:\Gestorops\.env.local` (actual)
```
NEXT_PUBLIC_SUPABASE_URL=https://ihwkxzjjzzcfhzvrzjne.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlod2t4empqenpjZmh6dnJ6am5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDg3MjIsImV4cCI6MjA5NTM4NDcyMn0.fgEyaIoMEO3_BdGmRJNDr8UwwKK1UrNQDOlngecsN3U
ENCRYPTION_SECRET=gestorops-dev-secret-change-in-production-32chars
GITHUB_APP_ID=3895932
GITHUB_PRIVATE_KEY_PATH=G:\Gestorops-worker\gestorops.private-key.pem
```

### GitHub App — GestorOps
- **App ID:** `3895932`
- **App name:** `GestorOps`
- **Owner:** `@athenvapuzzles-creator`
- **Private Key:** `G:\Gestorops-worker\gestorops.private-key.pem`
- **Callback URLs:** `https://gestor.athenva.com/api/github/callback` + `http://localhost:3000/api/github/callback`
- **Permisos:** Contents: read/write, Pull requests: read/write
- **Webhook:** desactivado

### Supabase MCP
- Claude tiene acceso MCP al proyecto `gestorops-dev`
- Project ID: `ihwkxzjjzzcfhzvrzjne`

### Worker `G:\Gestorops-worker\.env` (pendiente de completar)
```
SUPABASE_URL=https://ihwkxzjjzzcfhzvrzjne.supabase.co
SUPABASE_SERVICE_KEY=   ← PENDIENTE (Supabase Dashboard > Settings > API > service_role)
ANTHROPIC_API_KEY=      ← PENDIENTE (console.anthropic.com)
GITHUB_APP_ID=3895932
GITHUB_PRIVATE_KEY_PATH=./gestorops.private-key.pem
WORKER_ID=worker-1
MAX_TURNS=25
```

---

## 3. MÓDULOS COMPLETADOS

### Bloque 0 — Fundación ✅
- Next.js 16 + Supabase Auth + shadcn/ui
- Layout con sidebar (240px), dark mode, design tokens
- `proxy.ts` (auth gate Next.js 16)
- Login con "Recordar email" y toggle signup
- TypeScript sin errores

### Bloque 1 — Núcleo Operativo ✅
Módulos con CRUD completo (lista + crear + detalle + editar + eliminar):
- `/clientes` — CRM interno con ficha detallada
- `/proyectos` — Gestión de proyectos con estados
- `/incidencias` — Incidencias con prioridad y estados
- `/renovaciones` — Control de vencimientos con cuenta atrás
- `/mantenimientos` — Contratos + registro mensual (6 meses)
- `/accesos` — Vault AES-256-GCM con reveal-on-demand
- `/dashboard` — Vista agregada con stats en tiempo real

### Bloque 2 — Profundidad Operativa ✅
- `/tareas` — Kanban (Pendiente/En curso/Hecho) con quick-move
- `/infraestructura` — Stack técnico agrupado por cliente
- `/documentacion` — Editor Markdown con preview en tiempo real
- `/historial` — Log cronológico agrupado por fecha
- **Command Palette** (`Ctrl+K`) — búsqueda global + acciones rápidas
- **Notificaciones** — badges en sidebar (incidencias, renovaciones, mant., tareas)

### Bloque 3 — Calidad y Polish ✅
- `/analitica` — MRR, incidencias/mes, proyectos por estado, top clientes
- `/configuracion` — Datos de cuenta, stats sistema, exportación CSV
- Exportación CSV: `/api/export/[table]` para 6 tablas
- `lib/activity.ts` — logging automático de acciones
- `app/error.tsx` + `app/not-found.tsx` — páginas de error personalizadas

### Fase 0 Integración Claude Code ✅ (parcialmente)
- **6 tablas en Supabase:** `repositories`, `ai_tasks`, `ai_task_runs`, `ai_task_logs`, `ai_task_artifacts`, `approvals`
- **Módulo `/ia`:** lista de tareas, crear nueva, detalle con logs/informe/artefactos, panel de aprobación
- **Panel repositorios** en ficha de proyecto (`/proyectos/[id]`)
- **Worker completo** en `G:\Gestorops-worker/`

### Bug fixes y mejoras UX ✅
- Toasts de éxito/error (sonner) en todas las acciones CRUD
- `<DeleteButton>` con dialog de confirmación en los 9 módulos
- Breadcrumbs en todas las páginas de detalle/editar
- `router.back()` en lugar de `history.back()` en todos los formularios
- `revalidatePath('...', 'layout')` en todas las acciones
- Filtro de búsqueda + tabs de estado en lista de Clientes
- Sidebar header clickable para abrir Command Palette
- Detección automática `⌘K` (Mac) vs `Ctrl K` (Windows)

---

## 4. ESTRUCTURA DE ARCHIVOS CLAVE

```
G:\Gestorops\
├── app/
│   ├── (auth)/login/          ← Login + signup
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← Shell con sidebar + ToastHandler
│   │   ├── dashboard/          ← Dashboard principal
│   │   ├── clientes/           ← CRM + [id]/ + nuevo/ + [id]/editar/
│   │   ├── proyectos/          ← Proyectos + repos conectados
│   │   ├── mantenimientos/     ← Contratos + registro mensual
│   │   ├── incidencias/
│   │   ├── accesos/            ← Vault cifrado
│   │   ├── renovaciones/
│   │   ├── documentacion/      ← Editor Markdown
│   │   ├── tareas/             ← Kanban
│   │   ├── infraestructura/
│   │   ├── historial/          ← Activity log
│   │   ├── analitica/
│   │   ├── configuracion/      ← Exportación CSV
│   │   └── ia/                 ← Módulo Claude Code
│   ├── api/
│   │   ├── export/[table]/     ← CSV export
│   │   └── github/             ← (pendiente: webhook + callback)
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                     ← shadcn/ui components
│   ├── layout/                 ← Sidebar, CommandPalette, SidebarNav
│   ├── shared/                 ← PageHeader, StatusBadge, DeleteButton, ToastHandler, ListFilter
│   ├── clientes/ proyectos/ incidencias/ renovaciones/
│   ├── mantenimientos/ accesos/ tareas/ infraestructura/
│   ├── documentacion/          ← DocEditor + MarkdownRenderer
│   ├── configuracion/          ← ExportButtons
│   └── ia/                     ← NewTaskForm, TaskDetailView, ConnectRepoForm
├── lib/
│   ├── supabase/               ← client.ts, server.ts, middleware.ts, types.ts
│   ├── crypto.ts               ← AES-256-GCM encrypt/decrypt
│   └── activity.ts             ← logActivity() helper
├── types/
│   ├── index.ts                ← tipos base
│   └── database.ts             ← tipos generados de Supabase
├── proxy.ts                    ← Auth gate Next.js 16
└── .env.local                  ← Credenciales (NO commitear)

G:\Gestorops-worker\
├── src/
│   ├── index.js                ← Polling loop
│   ├── worker.js               ← Task lifecycle
│   ├── prompts.js              ← Prompts para 8 tipos de tarea
│   └── github.js               ← GitHub App JWT + tokens
├── gestorops.private-key.pem   ← Private Key GitHub App (NO commitear)
├── Dockerfile
├── railway.json
├── package.json
└── .env                        ← Pendiente SUPABASE_SERVICE_KEY + ANTHROPIC_API_KEY
```

---

## 5. BASE DE DATOS — TABLAS EN SUPABASE

### Tablas del sistema principal (Bloque 1-3)
`clients`, `projects`, `maintenances`, `maintenance_entries`, `incidents`,
`technical_accesses`, `access_log`, `renewals`, `infrastructure_items`,
`documents`, `tasks`, `activity_log`

### Tablas de integración IA (Fase 0)
`repositories`, `ai_tasks`, `ai_task_runs`, `ai_task_logs`,
`ai_task_artifacts`, `approvals`

**Todas con RLS habilitado** — política `authenticated_full_access` para usuarios autenticados.

---

## 6. USUARIO Y AUTH

- **Email:** `athenvapuzzles@gmail.com` (confirmado manualmente via SQL)
- **Supabase:** email confirmation desactivada manualmente (ejecutar UPDATE en auth.users si se crean nuevos usuarios)
- **Sidebar footer:** muestra email del usuario + botón logout

---

## 7. COMANDOS ÚTILES

```powershell
# Arrancar el servidor de desarrollo
cd G:\Gestorops
npm run dev

# Verificar TypeScript
npx tsc --noEmit

# Ver logs del servidor (preview)
# Usar mcp__Claude_Preview__preview_logs

# Railway CLI (instalado)
railway --version  # 4.65.0
railway login
railway up
```

---

## 8. PENDIENTE — PRÓXIMOS PASOS

### Inmediato (Fase 1 MVP IA)
1. **Obtener `SUPABASE_SERVICE_KEY`**
   - Supabase Dashboard → Settings → API → Legacy keys → `service_role`
   - Añadir a `G:\Gestorops-worker\.env`

2. **Obtener `ANTHROPIC_API_KEY`**
   - console.anthropic.com → API Keys
   - Añadir a `G:\Gestorops-worker\.env`

3. **Desplegar worker en Railway**
   - `cd G:\Gestorops-worker && railway login && railway up`
   - Configurar variables de entorno en Railway dashboard
   - Variables necesarias: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_APP_ID`, `GITHUB_PRIVATE_KEY` (inline con \n)

4. **Instalar GitHub App en un repositorio de prueba**
   - GitHub → Settings → Applications → Configure "GestorOps"
   - Seleccionar el repo de prueba
   - Copiar `installation_id` al registro en la tabla `repositories`

5. **Conectar primer repo desde GestorOps**
   - Ir a un proyecto en el gestor
   - Usar el formulario "Conectar repositorio"
   - Lanzar tarea "Analizar proyecto"

### Pendiente Fase 1-2
- Ruta API `/api/github/webhook` para recibir eventos de GitHub
- Ruta API `/api/github/callback` para OAuth de instalación
- Supabase Realtime en `/ia/[id]` para logs en tiempo real
- Polling automático en la vista de tarea activa

### Pendiente futuro
- Sidebar colapsable (Bloque 2 pendiente)
- Analítica avanzada
- Deploy en `gestor.athenva.com` (configurar DNS Vercel)
- Configurar `ENCRYPTION_SECRET` con valor seguro para producción

---

## 9. ARQUITECTURA DE LA INTEGRACIÓN IA

```
GestorOps (Next.js) → ai_tasks (Supabase) → Worker (Railway) → Claude Code → resultados → ai_task_artifacts
```

**Flujo de una tarea:**
1. Usuario pulsa "Lanzar tarea" en `/ia/nueva`
2. Se crea registro en `ai_tasks` con status `queued`
3. Worker (Railway) hace polling cada 10s y recoge la tarea
4. Worker clona el repo (GitHub App token), inyecta contexto del gestor
5. Claude Code analiza/ejecuta la tarea
6. Resultados guardados en `ai_task_artifacts` y `ai_task_logs`
7. Usuario revisa en `/ia/[id]` — puede aprobar/rechazar si nivel >= 3

**Niveles de autonomía:**
- N1: Solo lectura + informe
- N2: Propuesta + plan de acción
- N3: Crea rama + modifica código (requiere aprobación)
- N4: Abre PR (requiere confirmación adicional)
- N5: Operaciones preautorizadas de bajo riesgo

---

## 10. DOMINIO Y DESPLIEGUE

- `athenva.com` — Landing de la agencia
- `ops.athenva.com` — AthenvaOps (otro proyecto)
- `gestor.athenva.com` — **GestorOps** (pendiente configurar DNS)
- `martingarrido.dev` — Portfolio personal

**Para desplegar GestorOps en Vercel:**
1. `vercel --prod` desde `G:\Gestorops`
2. Configurar dominio `gestor.athenva.com` en Vercel
3. Añadir registro DNS CNAME en el proveedor del dominio
4. Configurar variables de entorno en Vercel (mismo contenido que .env.local)

---

## 11. NOTAS IMPORTANTES

- **`proxy.ts`** (no `middleware.ts`) — Next.js 16 renombró el archivo de middleware
- **Tailwind v4** — sin `tailwind.config.ts`, configuración en CSS con `@theme`
- **shadcn/ui v4** — preset `radix-nova`, colores en oklch
- **`cross-env NODE_OPTIONS=--use-system-ca`** en scripts npm — necesario para SSL corporativo
- **Clave JWT legacy** (`eyJ...`) para Supabase — la `sb_publishable_` no es compatible con `@supabase/ssr`
- **`revalidatePath('/ruta', 'layout')`** — siempre con scope `'layout'` para actualizar sidebar
- **AES-256-GCM** para vault de accesos — clave derivada de `ENCRYPTION_SECRET`
