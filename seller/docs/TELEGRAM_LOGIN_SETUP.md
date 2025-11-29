# Инструкция по настройке Telegram Login Widget

## Проблема: "Bot domain invalid"

Эта ошибка возникает, когда домен вашего приложения не привязан к боту в BotFather.

## Пошаговая инструкция

### Шаг 1: Открыть BotFather в Telegram

1. Откройте Telegram
2. Найдите бота [@BotFather](https://t.me/BotFather)
3. Отправьте команду `/start`

### Шаг 2: Создать бота (если еще не создан)

1. Отправьте команду `/newbot`
2. Введите имя бота (например: `Vibelook Seller Bot`)
3. Введите username бота (например: `vibelook_seller_bot`)
4. **Сохраните токен**, который выдаст BotFather (например: `7976655354:AAEYrKQ6WI0asMaaHLEFZQHI3YfWPXRYo90`)

**Рекомендации:**
- Установите аватар бота, соответствующий логотипу вашего сайта
- Название бота должно отражать связь с вашим сайтом
- Это повысит доверие пользователей при авторизации

### Шаг 3: Привязать домен к боту

1. Отправьте команду `/setdomain` в BotFather
2. Выберите вашего бота из списка
3. Введите домен вашего приложения:
   - **Для локальной разработки:** `localhost`
   - **Для продакшена:** ваш домен (например: `seller.vibelook.com` или `vibelook.com`)
   - **Важно:** вводите только домен, без `http://` или `https://`
4. Подтвердите выбор

### Шаг 4: Настроить переменные окружения

Создайте файл `.env.local` в корне проекта `seller/`:

```env
# Telegram Bot Token (получен от BotFather на шаге 2)
TELEGRAM_BOT_TOKEN=7976655354:AAEYrKQ6WI0asMaaHLEFZQHI3YfWPXRYo90

# Telegram Bot Username (без @, указан на шаге 2)
NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME=vibelook_seller_bot

# Supabase (опционально, для хранения данных пользователей)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Шаг 5: Перезапустить приложение

После настройки переменных окружения:

```bash
cd seller
npm run dev
```

## Как работает виджет

### Встраивание виджета

Виджет встраивается через скрипт с атрибутами:

```html
<script async 
  src="https://telegram.org/js/telegram-widget.js?22" 
  data-telegram-login="vibelook_seller_bot" 
  data-size="large" 
  data-onauth="onTelegramAuth(user)" 
  data-request-access="write">
</script>
```

### Параметры виджета

- `data-telegram-login` - username бота (без @)
- `data-size` - размер кнопки: `large`, `medium`, `small`
- `data-onauth` - функция обратного вызова при авторизации
- `data-request-access` - запрашивать ли доступ к сообщениям: `write` или не указывать

### Получение данных авторизации

После успешной авторизации виджет вызывает функцию `onTelegramAuth(user)` с объектом:

```javascript
{
  id: 123456789,
  first_name: "Иван",
  last_name: "Иванов",
  username: "ivan_ivanov",
  photo_url: "https://...",
  auth_date: 1234567890,
  hash: "abc123..."
}
```

### Проверка подлинности данных

Данные проверяются на сервере путем сравнения `hash` с HMAC-SHA-256 подписью:

1. Формируется `data-check-string` из всех полей (кроме `hash`), отсортированных по алфавиту
2. Вычисляется `secret_key = SHA256(bot_token)`
3. Вычисляется `calculated_hash = HMAC_SHA256(data_check_string, secret_key)`
4. Сравнивается `calculated_hash` с полученным `hash`

Также проверяется `auth_date` - данные не должны быть старше 24 часов.

## Проверка работы

1. Откройте страницу авторизации: `http://localhost:3001/auth`
2. Должна появиться кнопка "Login with Telegram"
3. При нажатии должно открыться окно подтверждения авторизации
4. После подтверждения вы должны быть перенаправлены на `/dashboard`

## Решение проблем

### Ошибка "Bot domain invalid"

**Причина:** Домен не привязан к боту в BotFather

**Решение:**
1. Откройте BotFather и отправьте `/setdomain`
2. Выберите вашего бота
3. Введите домен: `localhost` (для разработки) или ваш домен (для продакшена)
4. Убедитесь, что домен введен без `http://` или `https://`
5. Перезапустите приложение

### Виджет не отображается

**Причина:** Скрипт Telegram Widget не загружается или неправильно настроен

**Решение:**
1. Проверьте консоль браузера (F12) на наличие ошибок
2. Убедитесь, что `NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME` установлен правильно (без @)
3. Проверьте, что домен привязан к боту через `/setdomain`
4. Убедитесь, что скрипт `https://telegram.org/js/telegram-widget.js?22` доступен

### Ошибка "Неверная подпись данных"

**Причина:** Неверный токен бота или проблемы с проверкой подписи

**Решение:**
1. Проверьте, что `TELEGRAM_BOT_TOKEN` установлен правильно
2. Убедитесь, что токен соответствует боту, указанному в `NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME`
3. Проверьте логи сервера на наличие ошибок
4. Убедитесь, что токен не истек (получите новый через `/token` в BotFather)

### Виджет показывает "Bot domain invalid" после настройки

**Причина:** Кэш браузера или неправильный домен

**Решение:**
1. Очистите кэш браузера (Ctrl+Shift+Delete)
2. Проверьте, что домен в BotFather совпадает с доменом приложения
3. Для локальной разработки используйте `localhost`, а не `127.0.0.1`
4. Убедитесь, что приложение запущено на правильном порту

## Команды BotFather для справки

- `/start` - Начать работу с BotFather
- `/newbot` - Создать нового бота
- `/mybots` - Список ваших ботов
- `/token` - Получить токен бота
- `/setdomain` - Привязать домен к боту для Login Widget
- `/setname` - Изменить имя бота
- `/setdescription` - Установить описание бота
- `/setuserpic` - Установить аватар бота

## Дополнительная информация

- [Официальная документация Telegram Login Widget](https://core.telegram.org/widgets/login)
- [BotFather документация](https://core.telegram.org/bots#6-botfather)
- [Пример проверки авторизации (PHP)](https://core.telegram.org/widgets/login#checking-authorization)

## Пример кода для проверки авторизации

Наш сервер уже реализует проверку подлинности в `app/api/auth/telegram/route.ts`:

```typescript
function verifyTelegramAuth(user: TelegramUser): boolean {
  const { hash, ...userData } = user
  const dataCheckString = Object.keys(userData)
    .sort()
    .map(key => `${key}=${userData[key]}`)
    .join('\n')

  const secretKey = crypto
    .createHash('sha256')
    .update(BOT_TOKEN)
    .digest()

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  // Проверяем, что данные не старше 24 часов
  const authDate = user.auth_date * 1000
  const now = Date.now()
  if (now - authDate > 24 * 60 * 60 * 1000) {
    return false
  }

  return calculatedHash === hash
}
```


