<!-- 247b3183-d0c4-4e24-a314-a0e7a22db628 d7b7151a-6fc3-4e2d-a984-d0b74693c529 -->
# План: Исправление 404 - добавление Root Layout

## Диагностика: 100% подтверждено

**Проблема найдена:**

- В `app/` НЕТ `layout.tsx` (корневой layout)
- Есть только `app/[locale]/layout.tsx` (nested layout)
- Next.js App Router ТРЕБУЕТ корневой `app/layout.tsx`

**Почему это дает 404:**

- Без `app/layout.tsx` Next.js НЕ создает роуты
- Билд проходит (код валидный)
- Runtime → все страницы 404

**tsconfig.json** - правильный, не исключает app/

---

## Решение: Создать app/layout.tsx

### Вариант 1: Минимальный Root Layout (для теста)

Создать `app/layout.tsx`:

```typescript
import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
```

**Цель:** Проверить, что app/ виден Vercel

**Ожидаемый результат:**

- `/ru/` → загружается (app/[locale] работает)
- `/` → либо работает, либо редирект нужен

---

### Вариант 2: Правильный Root Layout с редиректом

Создать `app/layout.tsx`:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

export const metadata = {
  title: 'VIBELOOK AI Stylist',
}
```

И создать `app/page.tsx` с редиректом:

```typescript
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/ru')
}
```

**Цель:** Корректная структура + автоматический редирект

**Ожидаемый результат:**

- `/` → редирект на `/ru/`
- `/ru/` → загружается главная
- Middleware больше не нужен!

---

## Рекомендуемая последовательность

### Шаг 1: Создать минимальный Root Layout

Файл: `app/layout.tsx`

```typescript
import { ReactNode } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
```

**Деплой и тест:**

- Проверить `/ru/` → должна загрузиться!

### Шаг 2: Добавить редирект (если Шаг 1 работает)

Файл: `app/page.tsx`

```typescript
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/ru')
}
```

**Деплой и тест:**

- `/` → автоматически идет на `/ru/`

### Шаг 3: Вернуть middleware (опционально)

Если нужна более сложная логика роутинга, вернуть `middleware.ts`

---

## Байесовское обновление вероятностей

**Исходные гипотезы:**

- H1: middleware проблема
- H2: структура app/ проблема
- H3: tsconfig исключает app
- H4: GitHub ветка неправильная
- H5: next-intl plugin проблема

**После диагностики:**

- P(H2: нет app/layout.tsx) = 1.0 ✅ ПОДТВЕРЖДЕНО
- P(H1: middleware) = 0.5 (был падение 500, но 404 из-за H2)
- P(H5: next-intl) = 0.05 (не влияет на создание роутов)
- P(H3: tsconfig) = 0.0 (проверено, правильный)
- P(H4: GitHub) = 0.0 (app/ есть локально и в репо)

**Прогноз:**

- P(успех после добавления app/layout.tsx) = 0.95

---

## Что НЕ делаем

- ❌ Не трогаем next-intl (не причина 404)
- ❌ Не меняем tsconfig (он правильный)
- ❌ Не переделываем на ONE LOCALE (не нужно)

Просто добавляем **1 файл** - `app/layout.tsx`

### To-dos

- [ ] Создать app/layout.tsx с минимальным содержимым
- [ ] Деплой и проверка /ru/ работает ли
- [ ] Создать app/page.tsx с редиректом на /ru
- [ ] Деплой и проверка / редиректит на /ru/