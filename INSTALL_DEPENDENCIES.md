# Установка зависимостей

## Шаг 1: Откройте терминал в папке проекта

Откройте командную строку (cmd) или PowerShell в папке проекта:
```
C:\Users\rapae\OneDrive\Рабочий стол\funel_ganza\funel_ganza
```

## Шаг 2: Установите зависимости

Выполните команду:

```bash
npm install
```

Эта команда установит все необходимые пакеты:
- Next.js 14.2.5
- React 18.3.1
- React DOM 18.3.1
- TypeScript 5.5.3
- И другие зависимости

## Шаг 3: Проверка установки

После установки должна появиться папка `node_modules` с установленными пакетами.

Проверьте установку:

```bash
npm list --depth=0
```

Должны быть видны установленные пакеты:
- next
- react
- react-dom
- typescript
- и другие

## Шаг 4: Запуск проекта

После установки зависимостей можно запустить проект:

```bash
npm run dev
```

Проект будет доступен по адресу: http://localhost:3000

## Если возникли проблемы

### Ошибка: "npm is not recognized"
- Убедитесь, что Node.js установлен
- Проверьте: `node --version` и `npm --version`

### Ошибка: "EACCES: permission denied"
- Запустите терминал от имени администратора
- Или используйте `sudo npm install` (на Linux/Mac)

### Ошибка: "Cannot find module"
- Удалите папку `node_modules` (если есть)
- Удалите файл `package-lock.json` (если есть)
- Выполните `npm install` заново

## Что установится

**Основные зависимости:**
- `next` - фреймворк Next.js
- `react` - библиотека React
- `react-dom` - React для DOM
- `react-facebook-pixel` - интеграция с Facebook Pixel

**Dev зависимости:**
- `typescript` - TypeScript компилятор
- `@types/node` - типы для Node.js
- `@types/react` - типы для React
- `@types/react-dom` - типы для React DOM

## После установки

1. ✅ Зависимости установлены
2. ✅ Можно запускать `npm run dev`
3. ✅ Можно собирать проект `npm run build`


