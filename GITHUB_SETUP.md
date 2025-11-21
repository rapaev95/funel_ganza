# Инструкция по загрузке проекта на GitHub

## Проблема

Git был инициализирован в домашней директории вместо директории проекта. Нужно создать репозиторий правильно.

## Решение

### Вариант 1: Через встроенный терминал Cursor (рекомендуется)

1. Откройте встроенный терминал в Cursor (Terminal → New Terminal)
2. Убедитесь, что вы в директории проекта (должен быть виден путь к `funel_ganza`)
3. Выполните следующие команды:

```bash
# Удалите неправильный .git из домашней директории (если нужно)
Remove-Item -Path "$env:USERPROFILE\.git" -Recurse -Force -ErrorAction SilentlyContinue

# Инициализируйте git в текущей директории проекта
git init

# Добавьте все файлы проекта
git add .

# Создайте первый коммит
git commit -m "Initial commit: VIBELOOK AI Stylist project"

# Создайте репозиторий на GitHub и добавьте remote
# (замените YOUR_USERNAME и YOUR_REPO_NAME на свои)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Загрузите код на GitHub
git push -u origin main
```

### Вариант 2: Через GitHub Desktop или другой GUI

1. Установите GitHub Desktop (если еще не установлен)
2. Откройте GitHub Desktop
3. File → Add Local Repository
4. Выберите папку проекта (`funel_ganza`)
5. Если git не инициализирован, GitHub Desktop предложит это сделать
6. Создайте репозиторий на GitHub и опубликуйте код

### Вариант 3: Удалить .git и начать заново

```bash
# В терминале проекта удалите .git (если он неправильный)
Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue

# Инициализируйте git правильно
git init

# Добавьте файлы
git add .

# Коммит
git commit -m "Initial commit"

# Добавьте remote и пуш
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Что должно быть в .gitignore

Убедитесь, что `.gitignore` содержит:

```
node_modules/
.next/
.env*.local
.env
.cursor/
AppData/
.vscode/
*.log
```

## Создание репозитория на GitHub

1. Зайдите на https://github.com
2. Нажмите "+" → "New repository"
3. Название репозитория: `vibelook-ai-stylist` (или другое)
4. Описание: "VIBELOOK AI Stylist - Персональный AI-стилист"
5. Выберите Public или Private
6. НЕ добавляйте README, .gitignore или license (они уже есть)
7. Нажмите "Create repository"
8. Скопируйте URL репозитория и используйте его в команде `git remote add origin`

## Проверка

После загрузки проверьте:
- Все файлы проекта загружены
- `.gitignore` работает правильно
- Нет лишних файлов (node_modules, .next и т.д.)

