# Инструкции по созданию базы данных Supabase для Seller Dashboard

Этот документ содержит все SQL миграции и инструкции по настройке базы данных Supabase.

**⚠️ ВАЖНО:** Мы работаем в **существующем проекте Supabase** (B2C проект Vibelook). Все таблицы для Seller Dashboard будут добавлены в ту же базу данных.

---

## 1. Предварительные требования

### 1.1. Проверка существующего проекта Supabase

Мы используем **текущий проект Supabase** из B2C приложения (`funel_new`).

1. Открыть существующий проект в Supabase Dashboard
2. Убедиться, что у вас есть доступ к проекту
3. Проверить, что проект активен и работает

### 1.2. Получение ключей (если еще не сохранены)

Ключи уже должны быть в переменных окружения B2C проекта, но для проверки:

1. В проекте перейти в Settings → API
2. Проверить/сохранить следующие значения:
   - **Project URL**: `https://xxxxx.supabase.co` (используется в `SUPABASE_URL`)
   - **anon public key**: (используется в `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key**: (используется в `SUPABASE_SERVICE_ROLE_KEY`, НЕ использовать в клиенте!)

### 1.3. Проверка существующих таблиц

**Перед применением миграций** выполните проверку существующих таблиц:

```sql
-- Проверить существующие таблицы в базе данных
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Ожидаемые существующие таблицы B2C:**
- `sessions` - сессии пользователей B2C
- Возможно другие таблицы для B2C функциональности

**Новые таблицы для Seller Dashboard (будут созданы):**
- `sellers` - селлеры
- `products` - товары селлеров
- `looks` - луки
- `campaigns` - рекламные кампании
- `posts` - посты для автопостинга
- `metrics_aggregate` - метрики
- `brand_awareness_index` - индекс узнаваемости
- `audience_profile_aggregate` - профиль аудитории
- `look_generation_packages` - пакеты генераций
- `subscriptions` - подписки
- `transactions` - транзакции

### 1.4. Проверка существующих ENUM типов

Проверьте, какие ENUM типы уже существуют:

```sql
-- Проверить существующие ENUM типы
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
ORDER BY typname;
```

Если какие-то ENUM типы уже существуют, они будут пропущены при создании (см. раздел 2.1).

---

## 2. Создание типов (ENUM)

Выполнить все SQL команды в SQL Editor (Database → SQL Editor → New query).

### 2.1. Создание всех ENUM типов

**Важно:** Используем безопасное создание ENUM типов. Если тип уже существует, команда будет пропущена.

```sql
-- Тарифные планы
DO $$ BEGIN
    CREATE TYPE tariff_plan AS ENUM ('trial', 'start', 'pro', 'enterprise');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Источник товара
DO $$ BEGIN
    CREATE TYPE product_source AS ENUM ('wb', 'ozon', 'manual');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Категория товара
DO $$ BEGIN
    CREATE TYPE product_category AS ENUM ('top', 'bottom', 'shoes', 'accessory', 'outerwear', 'dress', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Пол
DO $$ BEGIN
    CREATE TYPE gender AS ENUM ('male', 'female', 'unisex');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Возрастная группа
DO $$ BEGIN
    CREATE TYPE age_group AS ENUM ('adult', 'teen', 'kids');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Стиль
DO $$ BEGIN
    CREATE TYPE style_tag AS ENUM ('streetwear', 'minimalism', 'classic_modern', 'boho', 'athleisure', 'romantic_soft', 'rock_soft_grunge');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Контекст использования
DO $$ BEGIN
    CREATE TYPE usage_context AS ENUM ('work', 'home', 'sport', 'evening', 'casual', 'beach', 'street');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Цель кампании
DO $$ BEGIN
    CREATE TYPE campaign_goal AS ENUM ('sales', 'test_ctr');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Статус кампании
DO $$ BEGIN
    CREATE TYPE campaign_status AS ENUM ('draft', 'running', 'paused', 'finished', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Статус поста
DO $$ BEGIN
    CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'posted', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Платформа для поста
DO $$ BEGIN
    CREATE TYPE post_platform AS ENUM ('instagram', 'facebook', 'vk', 'telegram', 'pinterest', 'yandex_dzen', 'tiktok');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Тип транзакции
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('topup', 'campaign_spend', 'package_purchase');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
```

**Проверка после создания:**
```sql
-- Убедиться, что все типы созданы
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
AND typname IN (
    'tariff_plan', 'product_source', 'product_category', 'gender', 
    'age_group', 'style_tag', 'usage_context', 'campaign_goal', 
    'campaign_status', 'post_status', 'post_platform', 'transaction_type'
)
ORDER BY typname;
```

---

## 3. Миграция 001: Таблица sellers

**⚠️ ВАЖНО:** Перед созданием проверьте, что таблица `sellers` не существует:

```sql
-- Проверка существования таблицы
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'sellers'
);
```

Если таблица уже существует, пропустите эту миграцию или используйте `CREATE TABLE IF NOT EXISTS`.

```sql
-- Создание таблицы sellers (безопасное создание)
CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Telegram
    tg_user_id TEXT UNIQUE NOT NULL,
    
    -- Профиль
    brand_name TEXT,
    contact_email TEXT,
    logo_url TEXT,
    
    -- Тариф
    tariff_plan tariff_plan NOT NULL DEFAULT 'trial',
    trial_ends_at TIMESTAMPTZ,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- API ключи (хранятся в JSONB)
    wb_api_keys JSONB DEFAULT '[]'::jsonb,
    ozon_api_keys JSONB DEFAULT '[]'::jsonb,
    
    -- Баланс и лимиты
    balance_rub NUMERIC(10, 2) NOT NULL DEFAULT 0,
    free_look_generations_left INTEGER NOT NULL DEFAULT 5,
    
    -- Ссылки
    wb_seller_link TEXT,
    ozon_seller_link TEXT,
    
    -- Настройки
    allow_cross_looks BOOLEAN NOT NULL DEFAULT FALSE
);

-- Индексы (создаются только если не существуют)
CREATE INDEX IF NOT EXISTS idx_sellers_tg_user_id ON sellers(tg_user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_tariff_plan ON sellers(tariff_plan);
CREATE INDEX IF NOT EXISTS idx_sellers_trial_ends_at ON sellers(trial_ends_at) WHERE trial_ends_at IS NOT NULL;

-- Функция для обновления updated_at (создается один раз, используется для всех таблиц)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для обновления updated_at (создается только если не существует)
DROP TRIGGER IF EXISTS update_sellers_updated_at ON sellers;
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE sellers IS 'Таблица селлеров';
COMMENT ON COLUMN sellers.tg_user_id IS 'Telegram user ID для авторизации и уведомлений';
COMMENT ON COLUMN sellers.wb_api_keys IS 'Массив объектов {name, api_key} для WB API';
COMMENT ON COLUMN sellers.ozon_api_keys IS 'Массив объектов {name, api_key} для Ozon API';
COMMENT ON COLUMN sellers.free_look_generations_left IS 'Остаток бесплатных генераций луков (по умолчанию 5)';
```

---

## 4. Миграция 002: Таблица products

```sql
-- Создание таблицы products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Источник
    source product_source NOT NULL,
    source_sku TEXT,
    nm_id TEXT, -- для WB
    product_id TEXT, -- для Ozon
    
    -- Основная информация
    title TEXT NOT NULL,
    description TEXT,
    
    -- Характеристики
    category product_category NOT NULL,
    gender gender NOT NULL,
    age_group age_group NOT NULL,
    color TEXT,
    
    -- Цены
    price_original NUMERIC(10, 2) NOT NULL,
    price_with_discount NUMERIC(10, 2),
    
    -- Размеры
    size_chart JSONB DEFAULT '{}'::jsonb, -- полные замеры (ОГ/ОТ/ОБ, длина и т.д.)
    size_range TEXT, -- короткая форма, например "XS-XL"
    
    -- Медиа
    image_urls JSONB DEFAULT '[]'::jsonb, -- массив URL изображений
    
    -- Стили (массив строк из style_tag)
    style_tags JSONB DEFAULT '[]'::jsonb,
    
    -- Статус
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    allow_cross_looks BOOLEAN NOT NULL DEFAULT FALSE
);

-- Индексы
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_source ON products(source);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_style_tags ON products USING GIN(style_tags);
CREATE INDEX idx_products_nm_id ON products(nm_id) WHERE nm_id IS NOT NULL;
CREATE INDEX idx_products_product_id ON products(product_id) WHERE product_id IS NOT NULL;

-- Триггер для обновления updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE products IS 'Таблица товаров';
COMMENT ON COLUMN products.size_chart IS 'Полные замеры в формате JSON: {"XS": {"chest": 90, "waist": 70, ...}, ...}';
COMMENT ON COLUMN products.style_tags IS 'Массив стилей: ["streetwear", "minimalism", ...]';
COMMENT ON COLUMN products.allow_cross_looks IS 'Разрешить использование товара в луках других селлеров';
```

---

## 5. Миграция 003: Таблица looks

```sql
-- Создание таблицы looks
CREATE TABLE looks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Товары в луке (массив UUID)
    product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Медиа
    main_image_url TEXT NOT NULL,
    video_url TEXT,
    
    -- Характеристики
    style_tags JSONB DEFAULT '[]'::jsonb, -- массив стилей
    usage_contexts JSONB DEFAULT '[]'::jsonb, -- массив контекстов
    
    -- Варианты
    is_unisex_variant_male BOOLEAN NOT NULL DEFAULT FALSE,
    is_unisex_variant_female BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Публикация
    is_published BOOLEAN NOT NULL DEFAULT FALSE
);

-- Индексы
CREATE INDEX idx_looks_seller_id ON looks(seller_id);
CREATE INDEX idx_looks_is_published ON looks(is_published);
CREATE INDEX idx_looks_style_tags ON looks USING GIN(style_tags);
CREATE INDEX idx_looks_usage_contexts ON looks USING GIN(usage_contexts);
CREATE INDEX idx_looks_created_at ON looks(created_at DESC);

-- Триггер для обновления updated_at
CREATE TRIGGER update_looks_updated_at BEFORE UPDATE ON looks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE looks IS 'Таблица луков (комплектов одежды)';
COMMENT ON COLUMN looks.product_ids IS 'Массив UUID товаров в луке';
COMMENT ON COLUMN looks.style_tags IS 'Массив стилей лука';
COMMENT ON COLUMN looks.usage_contexts IS 'Массив контекстов использования: ["work", "casual", ...]';
```

---

## 6. Миграция 004: Таблица campaigns

```sql
-- Создание таблицы campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Основная информация
    name TEXT NOT NULL,
    look_ids JSONB NOT NULL, -- минимум 3 для тестов
    
    -- Параметры кампании
    goal campaign_goal NOT NULL,
    budget_rub NUMERIC(10, 2) NOT NULL CHECK (budget_rub >= 5000),
    status campaign_status NOT NULL DEFAULT 'draft',
    
    -- Даты
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    
    -- Платформы и трекинг
    ads_platforms JSONB DEFAULT '[]'::jsonb, -- список площадок
    tracking_params JSONB DEFAULT '{}'::jsonb, -- UTM метки
    external_campaign_ids JSONB DEFAULT '{}'::jsonb -- ID кампаний в рекламных системах
);

-- Индексы
CREATE INDEX idx_campaigns_seller_id ON campaigns(seller_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_goal ON campaigns(goal);
CREATE INDEX idx_campaigns_started_at ON campaigns(started_at) WHERE started_at IS NOT NULL;

-- Триггер для обновления updated_at
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE campaigns IS 'Таблица рекламных кампаний';
COMMENT ON COLUMN campaigns.look_ids IS 'Массив UUID луков (минимум 3 для test_ctr)';
COMMENT ON COLUMN campaigns.ads_platforms IS 'Массив платформ: ["facebook", "vk", "yandex", "tiktok"]';
COMMENT ON COLUMN campaigns.tracking_params IS 'UTM метки: {"utm_source": "vibelook", "utm_medium": "cpc", ...}';
COMMENT ON COLUMN campaigns.external_campaign_ids IS 'ID кампаний в рекламных системах: {"facebook": "123", "vk": "456", ...}';
```

---

## 7. Миграция 005: Таблица posts

```sql
-- Создание таблицы posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    look_id UUID NOT NULL REFERENCES looks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Платформы
    platforms JSONB NOT NULL DEFAULT '[]'::jsonb, -- список платформ
    
    -- Статус
    status post_status NOT NULL DEFAULT 'draft',
    
    -- Даты
    scheduled_at TIMESTAMPTZ,
    posted_at TIMESTAMPTZ,
    
    -- Контент
    post_text TEXT,
    
    -- Внешние ID
    external_post_ids JSONB DEFAULT '{}'::jsonb -- ID постов в соцсетях
);

-- Индексы
CREATE INDEX idx_posts_seller_id ON posts(seller_id);
CREATE INDEX idx_posts_look_id ON posts(look_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX idx_posts_posted_at ON posts(posted_at) WHERE posted_at IS NOT NULL;

-- Триггер для обновления updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE posts IS 'Таблица постов для автопостинга';
COMMENT ON COLUMN posts.platforms IS 'Массив платформ: ["instagram", "facebook", "vk", ...]';
COMMENT ON COLUMN posts.external_post_ids IS 'ID постов в соцсетях: {"instagram": "123", "facebook": "456", ...}';
```

---

## 8. Миграция 006: Таблица metrics_aggregate

```sql
-- Создание таблицы metrics_aggregate
CREATE TABLE metrics_aggregate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    look_id UUID REFERENCES looks(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    
    -- Метрики
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    ctr NUMERIC(5, 4) NOT NULL DEFAULT 0, -- CTR в процентах (0.0000 - 100.0000)
    spent_rub NUMERIC(10, 2) NOT NULL DEFAULT 0,
    transitions_to_mp INTEGER NOT NULL DEFAULT 0, -- переходы на WB/Ozon
    cpa_to_mp NUMERIC(10, 2) -- CPA перехода на маркетплейс
);

-- Индексы
CREATE INDEX idx_metrics_seller_id ON metrics_aggregate(seller_id);
CREATE INDEX idx_metrics_look_id ON metrics_aggregate(look_id) WHERE look_id IS NOT NULL;
CREATE INDEX idx_metrics_campaign_id ON metrics_aggregate(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX idx_metrics_date ON metrics_aggregate(date);
CREATE UNIQUE INDEX idx_metrics_unique ON metrics_aggregate(seller_id, COALESCE(look_id, '00000000-0000-0000-0000-000000000000'::uuid), COALESCE(campaign_id, '00000000-0000-0000-0000-000000000000'::uuid), date);

-- Комментарии
COMMENT ON TABLE metrics_aggregate IS 'Агрегированные метрики по лукам и кампаниям';
COMMENT ON COLUMN metrics_aggregate.ctr IS 'CTR в процентах (0.00 - 100.00)';
COMMENT ON COLUMN metrics_aggregate.transitions_to_mp IS 'Количество переходов на маркетплейсы (WB/Ozon)';
```

---

## 9. Миграция 007: Таблица brand_awareness_index

```sql
-- Создание таблицы brand_awareness_index
CREATE TABLE brand_awareness_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Метрики узнаваемости
    wb_search_volume INTEGER NOT NULL DEFAULT 0,
    yandex_wordstat_volume INTEGER NOT NULL DEFAULT 0,
    
    -- Рекомендации
    recommendation_text TEXT
);

-- Индексы
CREATE INDEX idx_brand_awareness_seller_id ON brand_awareness_index(seller_id);
CREATE INDEX idx_brand_awareness_date ON brand_awareness_index(date);
CREATE UNIQUE INDEX idx_brand_awareness_unique ON brand_awareness_index(seller_id, date);

-- Комментарии
COMMENT ON TABLE brand_awareness_index IS 'Индекс узнаваемости бренда (WB + Яндекс Wordstat)';
COMMENT ON COLUMN brand_awareness_index.recommendation_text IS 'Текстовая интерпретация и рекомендации';
```

---

## 10. Миграция 008: Таблица audience_profile_aggregate

```sql
-- Создание таблицы audience_profile_aggregate
CREATE TABLE audience_profile_aggregate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- 'week' или 'month'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Распределения (JSONB объекты)
    height_distribution JSONB DEFAULT '{}'::jsonb, -- {"150-160": 10, "160-170": 25, ...}
    size_distribution JSONB DEFAULT '{}'::jsonb, -- {"S": 15, "M": 30, "L": 20, ...}
    color_season_distribution JSONB DEFAULT '{}'::jsonb, -- {"bright_winter": 5, "deep_autumn": 10, ...}
    archetype_distribution JSONB DEFAULT '{}'::jsonb -- {"romantic": 8, "classic": 12, ...}
);

-- Индексы
CREATE INDEX idx_audience_seller_id ON audience_profile_aggregate(seller_id);
CREATE INDEX idx_audience_period ON audience_profile_aggregate(period_start, period_end);
CREATE UNIQUE INDEX idx_audience_unique ON audience_profile_aggregate(seller_id, period, period_start, period_end);

-- Комментарии
COMMENT ON TABLE audience_profile_aggregate IS 'Агрегированный профиль аудитории';
COMMENT ON COLUMN audience_profile_aggregate.height_distribution IS 'Распределение по росту в см';
COMMENT ON COLUMN audience_profile_aggregate.size_distribution IS 'Распределение по размерам одежды';
COMMENT ON COLUMN audience_profile_aggregate.color_season_distribution IS 'Распределение по цветотипам';
COMMENT ON COLUMN audience_profile_aggregate.archetype_distribution IS 'Распределение по архетипам';
```

---

## 11. Миграция 009: Таблица look_generation_packages

```sql
-- Создание таблицы look_generation_packages
CREATE TABLE look_generation_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    look_count INTEGER NOT NULL CHECK (look_count > 0),
    price_rub NUMERIC(10, 2) NOT NULL CHECK (price_rub > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_packages_is_active ON look_generation_packages(is_active);

-- Триггер для обновления updated_at
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON look_generation_packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE look_generation_packages IS 'Пакеты генераций луков для покупки';
COMMENT ON COLUMN look_generation_packages.look_count IS 'Количество луков в пакете (например, 20)';

-- Вставка начальных данных
INSERT INTO look_generation_packages (look_count, price_rub, is_active) VALUES
    (20, 1000.00, TRUE),
    (50, 2000.00, TRUE),
    (100, 3500.00, TRUE);
```

---

## 12. Миграция 010: Таблица subscriptions

```sql
-- Создание таблицы subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    tariff_plan tariff_plan NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    yookassa_subscription_id TEXT,
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_subscriptions_seller_id ON subscriptions(seller_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_ends_at ON subscriptions(ends_at) WHERE ends_at IS NOT NULL;

-- Триггер для обновления updated_at
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Комментарии
COMMENT ON TABLE subscriptions IS 'Подписки селлеров на тарифы';
COMMENT ON COLUMN subscriptions.yookassa_subscription_id IS 'ID подписки в YooKassa для автоплатежей';
```

---

## 13. Миграция 011: Таблица transactions

```sql
-- Создание таблицы transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount_rub NUMERIC(10, 2) NOT NULL,
    description TEXT,
    yookassa_payment_id TEXT,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    package_id UUID REFERENCES look_generation_packages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_transactions_seller_id ON transactions(seller_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_yookassa_payment_id ON transactions(yookassa_payment_id) WHERE yookassa_payment_id IS NOT NULL;

-- Комментарии
COMMENT ON TABLE transactions IS 'История транзакций (пополнения, списания)';
COMMENT ON COLUMN transactions.amount_rub IS 'Сумма (положительная для пополнений, отрицательная для списаний)';
COMMENT ON COLUMN transactions.campaign_id IS 'ID кампании, если транзакция связана с рекламой';
COMMENT ON COLUMN transactions.package_id IS 'ID пакета, если транзакция связана с покупкой пакета генераций';
```

---

## 14. Миграция 012: Row Level Security (RLS) политики

### 14.1. Включение RLS на всех таблицах

```sql
-- Включить RLS на всех таблицах
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE looks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_aggregate ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_awareness_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_profile_aggregate ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE look_generation_packages ENABLE ROW LEVEL SECURITY;
```

### 14.2. Функция для получения seller_id из JWT

```sql
-- Функция для получения seller_id из JWT токена
CREATE OR REPLACE FUNCTION auth.seller_id()
RETURNS UUID AS $$
BEGIN
    -- Предполагаем, что в JWT есть поле seller_id или tg_user_id
    -- Нужно настроить в зависимости от реализации аутентификации
    RETURN (SELECT id FROM sellers WHERE tg_user_id = auth.jwt() ->> 'tg_user_id');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 14.3. Политики для таблицы sellers

```sql
-- Селлер может читать только свою запись
CREATE POLICY "Sellers can view own record"
    ON sellers FOR SELECT
    USING (id = auth.seller_id());

-- Селлер может обновлять только свою запись
CREATE POLICY "Sellers can update own record"
    ON sellers FOR UPDATE
    USING (id = auth.seller_id());
```

### 14.4. Политики для таблицы products

```sql
-- Селлер может читать только свои товары
CREATE POLICY "Sellers can view own products"
    ON products FOR SELECT
    USING (seller_id = auth.seller_id());

-- Селлер может создавать только свои товары
CREATE POLICY "Sellers can create own products"
    ON products FOR INSERT
    WITH CHECK (seller_id = auth.seller_id());

-- Селлер может обновлять только свои товары
CREATE POLICY "Sellers can update own products"
    ON products FOR UPDATE
    USING (seller_id = auth.seller_id());

-- Селлер может удалять только свои товары
CREATE POLICY "Sellers can delete own products"
    ON products FOR DELETE
    USING (seller_id = auth.seller_id());
```

### 14.5. Политики для таблицы looks

```sql
-- Селлер может читать только свои луки
CREATE POLICY "Sellers can view own looks"
    ON looks FOR SELECT
    USING (seller_id = auth.seller_id());

-- Селлер может создавать только свои луки
CREATE POLICY "Sellers can create own looks"
    ON looks FOR INSERT
    WITH CHECK (seller_id = auth.seller_id());

-- Селлер может обновлять только свои луки
CREATE POLICY "Sellers can update own looks"
    ON looks FOR UPDATE
    USING (seller_id = auth.seller_id());

-- Селлер может удалять только свои луки
CREATE POLICY "Sellers can delete own looks"
    ON looks FOR DELETE
    USING (seller_id = auth.seller_id());
```

### 14.6. Политики для таблицы campaigns

```sql
-- Селлер может читать только свои кампании
CREATE POLICY "Sellers can view own campaigns"
    ON campaigns FOR SELECT
    USING (seller_id = auth.seller_id());

-- Селлер может создавать только свои кампании
CREATE POLICY "Sellers can create own campaigns"
    ON campaigns FOR INSERT
    WITH CHECK (seller_id = auth.seller_id());

-- Селлер может обновлять только свои кампании
CREATE POLICY "Sellers can update own campaigns"
    ON campaigns FOR UPDATE
    USING (seller_id = auth.seller_id());
```

### 14.7. Политики для таблицы posts

```sql
-- Селлер может читать только свои посты
CREATE POLICY "Sellers can view own posts"
    ON posts FOR SELECT
    USING (seller_id = auth.seller_id());

-- Селлер может создавать только свои посты
CREATE POLICY "Sellers can create own posts"
    ON posts FOR INSERT
    WITH CHECK (seller_id = auth.seller_id());

-- Селлер может обновлять только свои посты
CREATE POLICY "Sellers can update own posts"
    ON posts FOR UPDATE
    USING (seller_id = auth.seller_id());

-- Селлер может удалять только свои посты
CREATE POLICY "Sellers can delete own posts"
    ON posts FOR DELETE
    USING (seller_id = auth.seller_id());
```

### 14.8. Политики для таблицы metrics_aggregate

```sql
-- Селлер может читать только свои метрики
CREATE POLICY "Sellers can view own metrics"
    ON metrics_aggregate FOR SELECT
    USING (seller_id = auth.seller_id());
```

### 14.9. Политики для таблицы brand_awareness_index

```sql
-- Селлер может читать только свои данные
CREATE POLICY "Sellers can view own brand awareness"
    ON brand_awareness_index FOR SELECT
    USING (seller_id = auth.seller_id());
```

### 14.10. Политики для таблицы audience_profile_aggregate

```sql
-- Селлер может читать только свои данные
CREATE POLICY "Sellers can view own audience profile"
    ON audience_profile_aggregate FOR SELECT
    USING (seller_id = auth.seller_id());
```

### 14.11. Политики для таблицы subscriptions

```sql
-- Селлер может читать только свои подписки
CREATE POLICY "Sellers can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (seller_id = auth.seller_id());
```

### 14.12. Политики для таблицы transactions

```sql
-- Селлер может читать только свои транзакции
CREATE POLICY "Sellers can view own transactions"
    ON transactions FOR SELECT
    USING (seller_id = auth.seller_id());
```

### 14.13. Политики для таблицы look_generation_packages

```sql
-- Все могут читать активные пакеты
CREATE POLICY "Anyone can view active packages"
    ON look_generation_packages FOR SELECT
    USING (is_active = TRUE);
```

---

## 15. Инструкции по применению миграций

### 15.1. Через Supabase Dashboard (рекомендуется)

**⚠️ ВАЖНО:** Мы работаем в **существующем проекте Supabase** (B2C). Все миграции применяются в ту же базу данных.

1. Открыть **существующий проект** в Supabase Dashboard
2. Перейти в **Database → SQL Editor**
3. Нажать **"New query"**
4. **Перед применением каждой миграции:**
   - Проверить существование таблицы (см. раздел 1.3)
   - Убедиться, что нет конфликтов имен
5. Скопировать SQL код миграции
6. Вставить в редактор
7. Нажать **"Run"** или `Ctrl+Enter`
8. Проверить результат выполнения
9. Если есть ошибки - проверить логи и исправить

**Порядок применения:**
1. Сначала: Раздел 2 - Создание ENUM типов
2. Затем: Миграции 001-011 по порядку (sellers, products, looks, и т.д.)
3. После всех таблиц: Раздел 14 - RLS политики
4. В конце: Раздел 16 - Storage buckets

**Важно:** 
- Применять миграции по порядку (001, 002, 003, ...)
- Использовать `CREATE TABLE IF NOT EXISTS` для безопасности
- Проверять существование перед созданием индексов и триггеров

### 15.2. Через Supabase CLI

1. Установить Supabase CLI:
```bash
npm install -g supabase
```

2. Инициализировать проект:
```bash
supabase init
```

3. Создать файлы миграций в `supabase/migrations/`:
   - `001_create_enums.sql`
   - `002_create_sellers.sql`
   - `003_create_products.sql`
   - и т.д.

4. Применить миграции:
```bash
supabase db push
```

### 15.3. Проверка успешности применения

После каждой миграции проверить:

1. **Таблицы созданы:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

2. **Индексы созданы:**
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

3. **RLS включен:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 15.4. Откат миграций

Если нужно откатить миграцию:

1. Создать SQL скрипт для удаления:
```sql
-- Пример отката таблицы
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
-- и т.д.
```

2. Выполнить в SQL Editor

**Внимание:** Откат может привести к потере данных!

---

## 16. Настройка Storage (Supabase Storage)

### 16.1. Создание buckets

1. Перейти в Storage в Supabase Dashboard
2. Создать следующие buckets:

#### Bucket: `product-images`
- **Name**: `product-images`
- **Public**: `true` (для публичного доступа к изображениям)
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket: `look-images`
- **Name**: `look-images`
- **Public**: `true`
- **File size limit**: 10 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp`

#### Bucket: `look-videos`
- **Name**: `look-videos`
- **Public**: `true`
- **File size limit**: 50 MB
- **Allowed MIME types**: `video/mp4, video/webm`

#### Bucket: `brand-logos`
- **Name**: `brand-logos`
- **Public**: `true`
- **File size limit**: 2 MB
- **Allowed MIME types**: `image/jpeg, image/png, image/webp, image/svg+xml`

### 16.2. Настройка политик доступа для Storage

#### Политики для product-images

```sql
-- Все могут читать изображения товаров
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Только авторизованные пользователи могут загружать
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' 
    AND auth.role() = 'authenticated'
);

-- Владелец может обновлять/удалять
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
);
```

Аналогично настроить политики для остальных buckets.

---

## 17. Тестовые данные (seed.sql)

### 17.1. Создание тестового селлера

```sql
-- Вставить тестового селлера
INSERT INTO sellers (
    tg_user_id,
    brand_name,
    contact_email,
    tariff_plan,
    trial_ends_at,
    free_look_generations_left
) VALUES (
    '123456789', -- заменить на реальный tg_user_id для тестирования
    'Test Brand',
    'test@example.com',
    'trial',
    NOW() + INTERVAL '14 days',
    5
) RETURNING id;
```

### 17.2. Создание тестовых товаров

```sql
-- Вставить тестовые товары (заменить seller_id на реальный)
INSERT INTO products (
    seller_id,
    source,
    title,
    category,
    gender,
    age_group,
    price_original,
    size_range,
    image_urls,
    style_tags
) VALUES (
    'YOUR_SELLER_ID_HERE', -- заменить на реальный seller_id
    'manual',
    'Тестовый товар 1',
    'top',
    'unisex',
    'adult',
    1999.00,
    'S-XL',
    '["https://example.com/image1.jpg"]'::jsonb,
    '["streetwear", "minimalism"]'::jsonb
),
(
    'YOUR_SELLER_ID_HERE',
    'manual',
    'Тестовый товар 2',
    'bottom',
    'female',
    'adult',
    2499.00,
    'XS-L',
    '["https://example.com/image2.jpg"]'::jsonb,
    '["romantic_soft", "boho"]'::jsonb
);
```

### 17.3. Создание тестовых пакетов генераций

Пакеты уже созданы в миграции 009, но можно добавить дополнительные:

```sql
INSERT INTO look_generation_packages (look_count, price_rub, is_active) VALUES
    (10, 500.00, TRUE),
    (30, 1500.00, TRUE);
```

### 17.4. Инструкции по использованию seed данных

1. **Для разработки:**
   - Использовать тестовые данные для проверки функциональности
   - Не использовать в production!

2. **Для тестирования:**
   - Создать отдельного тестового селлера
   - Использовать тестовые API ключи
   - Очищать данные после тестов

3. **Очистка тестовых данных:**
```sql
-- Удалить все тестовые данные (ОСТОРОЖНО!)
DELETE FROM transactions WHERE seller_id = 'YOUR_SELLER_ID';
DELETE FROM posts WHERE seller_id = 'YOUR_SELLER_ID';
DELETE FROM campaigns WHERE seller_id = 'YOUR_SELLER_ID';
DELETE FROM looks WHERE seller_id = 'YOUR_SELLER_ID';
DELETE FROM products WHERE seller_id = 'YOUR_SELLER_ID';
DELETE FROM sellers WHERE id = 'YOUR_SELLER_ID';
```

---

## 18. Дополнительные функции и триггеры

### 18.1. Функция для автоматического старта trial

```sql
-- Функция для автоматического старта trial при создании seller
CREATE OR REPLACE FUNCTION start_trial_period()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.trial_ends_at IS NULL AND NEW.tariff_plan = 'trial' THEN
        NEW.trial_ends_at := NOW() + INTERVAL '14 days';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_start_trial
    BEFORE INSERT ON sellers
    FOR EACH ROW
    EXECUTE FUNCTION start_trial_period();
```

### 18.2. Функция для проверки минимального количества луков в кампании

```sql
-- Функция для проверки минимального количества луков для test_ctr
CREATE OR REPLACE FUNCTION check_campaign_look_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.goal = 'test_ctr' AND jsonb_array_length(NEW.look_ids) < 3 THEN
        RAISE EXCEPTION 'Для теста CTR требуется минимум 3 лука';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_campaign_look_count
    BEFORE INSERT OR UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION check_campaign_look_count();
```

---

## 19. Рекомендации по производительности

1. **Регулярно обновлять статистику:**
```sql
ANALYZE sellers;
ANALYZE products;
ANALYZE looks;
ANALYZE campaigns;
ANALYZE metrics_aggregate;
```

2. **Мониторить размер таблиц:**
```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

3. **Проверять индексы:**
```sql
SELECT 
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan;
```

---

## 20. Резервное копирование

### Рекомендации:
1. Настроить автоматическое резервное копирование в Supabase Dashboard
2. Регулярно экспортировать данные:
```sql
-- Экспорт таблицы (пример)
COPY sellers TO '/tmp/sellers_backup.csv' CSV HEADER;
```
3. Хранить резервные копии в безопасном месте

---

## 21. Troubleshooting

### Проблема: Ошибка при создании таблицы
- Проверить, что все ENUM типы созданы
- Проверить синтаксис SQL
- Проверить права доступа
- Проверить, что таблица не существует (использовать `CREATE TABLE IF NOT EXISTS`)
- Проверить конфликты имен с существующими таблицами B2C

### Проблема: Ошибка "type already exists" при создании ENUM
- Это нормально, если ENUM уже существует
- Используйте `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;` для безопасного создания
- Или проверьте существование перед созданием

### Проблема: RLS блокирует доступ
- Проверить функцию `auth.seller_id()` - она должна корректно извлекать `tg_user_id` из JWT
- Проверить JWT токен - убедиться, что `tg_user_id` присутствует в токене
- Проверить политики RLS - убедиться, что они созданы для всех таблиц
- Временно отключить RLS для отладки: `ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;` (только для тестирования!)

### Проблема: Ошибки с foreign keys
- Проверить, что все связанные таблицы созданы
- Проверить порядок создания таблиц (сначала родительские, потом дочерние)
- Проверить существование записей в связанных таблицах
- Проверить типы данных в foreign key (должны совпадать)

### Проблема: Конфликт имен таблиц с B2C
- Если таблица с таким именем уже существует в B2C, используйте другое имя
- Или проверьте, можно ли переиспользовать существующую таблицу
- Пример: если `products` уже используется в B2C, рассмотрите `seller_products`

### Проблема: Ошибки при создании индексов
- Проверить, что таблица существует
- Проверить, что индекс не существует (использовать `CREATE INDEX IF NOT EXISTS`)
- Проверить синтаксис индекса

### Проблема: Ошибки при создании триггеров
- Проверить, что функция существует
- Проверить, что триггер не существует (использовать `DROP TRIGGER IF EXISTS`)
- Проверить синтаксис триггера

---

## 22. Дополнительные ресурсы

- Supabase документация: https://supabase.com/docs
- PostgreSQL документация: https://www.postgresql.org/docs/
- Row Level Security: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

---

## 23. Чеклист применения миграций

Используйте этот чеклист для отслеживания прогресса:

- [ ] Проверены существующие таблицы в базе данных
- [ ] Проверены существующие ENUM типы
- [ ] Созданы все ENUM типы (раздел 2)
- [ ] Создана таблица `sellers` (миграция 001)
- [ ] Создана таблица `products` (миграция 002)
- [ ] Создана таблица `looks` (миграция 003)
- [ ] Создана таблица `campaigns` (миграция 004)
- [ ] Создана таблица `posts` (миграция 005)
- [ ] Создана таблица `metrics_aggregate` (миграция 006)
- [ ] Создана таблица `brand_awareness_index` (миграция 007)
- [ ] Создана таблица `audience_profile_aggregate` (миграция 008)
- [ ] Создана таблица `look_generation_packages` (миграция 009)
- [ ] Создана таблица `subscriptions` (миграция 010)
- [ ] Создана таблица `transactions` (миграция 011)
- [ ] Включен RLS на всех таблицах (миграция 012)
- [ ] Создана функция `auth.seller_id()` (миграция 012)
- [ ] Созданы все RLS политики (миграция 012)
- [ ] Созданы Storage buckets (раздел 16)
- [ ] Настроены политики доступа для Storage (раздел 16)
- [ ] Созданы дополнительные функции и триггеры (раздел 18)
- [ ] Проверена успешность всех миграций (раздел 15.3)
- [ ] Созданы тестовые данные (раздел 17, опционально)

---

## 24. Важные замечания для работы в существующем проекте

1. **Использование тех же ключей:**
   - В `seller-dashboard` используйте те же `SUPABASE_URL` и ключи, что и в B2C проекте (`funel_new`)
   - Переменные окружения уже должны быть настроены

2. **Изоляция данных:**
   - RLS политики обеспечивают изоляцию данных между B2C пользователями и селлерами
   - B2C таблицы (`sessions` и др.) не пересекаются с таблицами Seller Dashboard

3. **Общие функции:**
   - Функция `update_updated_at_column()` может использоваться для всех таблиц (B2C и Seller Dashboard)
   - Если она уже существует, не нужно создавать заново

4. **Storage:**
   - Можно использовать существующие buckets или создать отдельные
   - Рекомендуется использовать отдельные buckets для изоляции

5. **Мониторинг:**
   - Следите за размером базы данных
   - Регулярно проверяйте производительность запросов
   - Используйте индексы для оптимизации

