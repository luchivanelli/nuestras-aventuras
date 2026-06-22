# 💕 Nuestra Lista de Aventuras

## ⚡ Setup rápido (3 pasos)

```bash
# 1. Instalar dependencias (esto también corre `prisma generate` automáticamente)
npm install

# 2. Crear las tablas en Neon
npx prisma db push

# 3. Correr la app
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) e ingresá la fecha especial 💕

---

## ⚠️ Si ves el error "Cannot find module '.prisma/client/default'"

Significa que el cliente de Prisma no fue generado. Corré:

```bash
npx prisma generate
```

Y luego volvé a correr `npm run dev`.

---

## 🔧 Variables de entorno

El archivo `.env.local` ya tiene la conexión a Neon configurada. No necesitás cambiar nada.

---

## 📁 Estructura

```
app/
  actions/plans.ts   ← Server Actions (CRUD con Prisma + Neon)
  page.tsx           ← Entry point
components/
  Login.tsx          ← Pantalla de acceso con la fecha especial
  Sidebar.tsx        ← Navegación desktop + mobile
  plans/             ← Lista de planes, formulario, modal de completar
  memories/          ← Álbum de recuerdos
  dashboard/         ← Estadísticas de la relación
  calendar/          ← Vista mensual de planes
lib/
  prisma.ts          ← Cliente Prisma singleton (adapter Neon)
  store.ts           ← Hook del cliente (llama Server Actions)
  types.ts           ← Tipos TypeScript + config de categorías
prisma/
  schema.prisma      ← Modelos Plan y Memory
```

## 🛠 Stack

- **Next.js 16** — App Router + Server Actions
- **Prisma 7** — ORM con Driver Adapter (sin binario nativo, usa WASM)
- **Neon** — PostgreSQL serverless (sa-east-1)
- **Tailwind CSS v4**
- **TypeScript**
