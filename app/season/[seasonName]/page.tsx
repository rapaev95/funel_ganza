'use client'

import { useParams, useRouter } from 'next/navigation'
import { SeasonSlideshow } from '@/components/SeasonSlideshow'
import { trackFacebookEvent } from '@/lib/facebook'

const seasonData: Record<string, {
  title: string
  subtitle: string
  description: string
  idealColors: { color: string; name: string }[]
  avoidColors: { color: string; name: string }[]
  products: {
    image: string
    name: string
    article: string
    price: string
    oldPrice: string
    link: string
    badge?: string
  }[]
  images: string[]
}> = {
  winter: {
    title: 'Зима',
    subtitle: 'Контрастная, яркая, холодная',
    description:
      'Зимний цветотип отличается высокой контрастностью между кожей, волосами и глазами. Вам идеально подходят чистые, насыщенные и холодные оттенки.',
    idealColors: [
      { color: '#000000', name: 'Черный' },
      { color: '#FFFFFF', name: 'Белый' },
      { color: '#DC143C', name: 'Алый' },
      { color: '#4B0082', name: 'Индиго' },
      { color: '#FF1493', name: 'Фуксия' },
      { color: '#00CED1', name: 'Бирюза' },
      { color: '#8B008B', name: 'Пурпурный' },
      { color: '#C0C0C0', name: 'Серебро' },
    ],
    avoidColors: [
      { color: '#D2691E', name: 'Оранжевый' },
      { color: '#F0E68C', name: 'Желтый' },
      { color: '#DEB887', name: 'Бежевый' },
      { color: '#CD853F', name: 'Коричневый' },
    ],
    products: [
      {
        image: '/foto/hoodie_winter_black_1763654928840.png',
        name: 'Худи черное базовое',
        article: '123456789',
        price: '2 990 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/123456789/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_winter_white_1763654938882.png',
        name: 'Худи белое оверсайз',
        article: '987654321',
        price: '3 290 ₽',
        oldPrice: '5 000 ₽',
        link: 'https://www.wildberries.ru/catalog/987654321/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_red_1763654946152.png',
        name: 'Худи алое premium',
        article: '456789123',
        price: '3 790 ₽',
        oldPrice: '5 500 ₽',
        link: 'https://www.wildberries.ru/catalog/456789123/detail.aspx',
        badge: 'НОВИНКА',
      },
      {
        image: '/foto/hoodie_winter_purple_1763654954729.png',
        name: 'Худи индиго с принтом',
        article: '789123456',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/789123456/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_fuchsia_1763654961856.png',
        name: 'Худи фуксия яркое',
        article: '321654987',
        price: '2 890 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/321654987/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_turquoise_1763654968921.png',
        name: 'Худи бирюзовое casual',
        article: '654987321',
        price: '3 190 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/654987321/detail.aspx',
      },
    ],
    images: [
      '/foto/цветотипы/winter/47163.jpg',
      '/foto/цветотипы/winter/8C0A1326.jpg',
    ],
  },
  spring: {
    title: 'Весна',
    subtitle: 'Светлая, теплая, яркая',
    description:
      'Весенний цветотип характеризуется светлой кожей с теплым подтоном, светлыми волосами и яркими глазами. Вам подходят свежие, теплые и яркие оттенки.',
    idealColors: [
      { color: '#FFD700', name: 'Золотой' },
      { color: '#FFE4B5', name: 'Персиковый' },
      { color: '#FF69B4', name: 'Розовый' },
      { color: '#98FB98', name: 'Светло-зеленый' },
      { color: '#87CEEB', name: 'Небесно-голубой' },
      { color: '#FFA500', name: 'Оранжевый' },
      { color: '#FFB6C1', name: 'Лососевый' },
      { color: '#F0E68C', name: 'Лимонный' },
    ],
    avoidColors: [
      { color: '#000000', name: 'Черный' },
      { color: '#4B0082', name: 'Темно-фиолетовый' },
      { color: '#8B0000', name: 'Темно-красный' },
      { color: '#2F4F4F', name: 'Темно-серый' },
    ],
    products: [
      {
        image: '/foto/hoodie_spring_golden_1763655035253.png',
        name: 'Худи золотое',
        article: '111222333',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/111222333/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_spring_lemon_1763655050411.png',
        name: 'Худи лимонное',
        article: '222333444',
        price: '2 990 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/222333444/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_mint_1763655027539.png',
        name: 'Худи мятное',
        article: '333444555',
        price: '3 290 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/333444555/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_peach_1763655020213.png',
        name: 'Худи персиковое',
        article: '444555666',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/444555666/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_salmon_1763655059391.png',
        name: 'Худи лососевое',
        article: '555666777',
        price: '2 890 ₽',
        oldPrice: '4 000 ₽',
        link: 'https://www.wildberries.ru/catalog/555666777/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_skyblue_1763655043039.png',
        name: 'Худи небесно-голубое',
        article: '666777888',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/666777888/detail.aspx',
      },
    ],
    images: [
      '/foto/цветотипы/spring/47163.jpg',
      '/foto/цветотипы/spring/8C0A1326.jpg',
    ],
  },
  summer: {
    title: 'Лето',
    subtitle: 'Мягкая, прохладная, приглушенная',
    description:
      'Летний цветотип отличается мягкой, прохладной кожей, светлыми или пепельными волосами и светлыми глазами. Вам подходят приглушенные, прохладные и пастельные оттенки.',
    idealColors: [
      { color: '#E6E6FA', name: 'Лавандовый' },
      { color: '#F0F8FF', name: 'Пудровый' },
      { color: '#B0C4DE', name: 'Пыльно-голубой' },
      { color: '#DDA0DD', name: 'Сливовый' },
      { color: '#F5DEB3', name: 'Пыльная роза' },
      { color: '#C0C0C0', name: 'Серебристо-серый' },
      { color: '#98D8C8', name: 'Мятный' },
      { color: '#D3D3D3', name: 'Светло-серый' },
    ],
    avoidColors: [
      { color: '#FF4500', name: 'Ярко-оранжевый' },
      { color: '#FFD700', name: 'Золотой' },
      { color: '#8B0000', name: 'Темно-красный' },
      { color: '#000000', name: 'Чистый черный' },
    ],
    products: [
      {
        image: '/foto/hoodie_summer_dustyblue_1763655123474.png',
        name: 'Худи пыльно-голубое',
        article: '777888999',
        price: '3 290 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/777888999/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_summer_dustyrose_1763655132489.png',
        name: 'Худи пыльная роза',
        article: '888999000',
        price: '2 990 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/888999000/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_gray_1763655139461.png',
        name: 'Худи серое',
        article: '999000111',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/999000111/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_lavender_1763655116333.png',
        name: 'Худи лавандовое',
        article: '000111222',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/000111222/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_lilac_1763655146526.png',
        name: 'Худи сиреневое',
        article: '111222333',
        price: '2 890 ₽',
        oldPrice: '4 000 ₽',
        link: 'https://www.wildberries.ru/catalog/111222333/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_powder_1763655154273.png',
        name: 'Худи пудровое',
        article: '222333444',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/222333444/detail.aspx',
      },
    ],
    images: [
      '/foto/цветотипы/summer/47163.jpg',
      '/foto/цветотипы/summer/8C0A1326.jpg',
    ],
  },
  autumn: {
    title: 'Осень',
    subtitle: 'Теплая, насыщенная, землистая',
    description:
      'Осенний цветотип характеризуется теплой кожей с золотистым подтоном, рыжими или каштановыми волосами и теплыми глазами. Вам подходят насыщенные, теплые и землистые оттенки.',
    idealColors: [
      { color: '#8B4513', name: 'Коричневый' },
      { color: '#D2691E', name: 'Терракотовый' },
      { color: '#CD853F', name: 'Бежевый' },
      { color: '#A0522D', name: 'Рыжий' },
      { color: '#8B7355', name: 'Оливковый' },
      { color: '#B8860B', name: 'Золотистый' },
      { color: '#DAA520', name: 'Горчичный' },
      { color: '#8B4513', name: 'Шоколадный' },
    ],
    avoidColors: [
      { color: '#0000FF', name: 'Ярко-синий' },
      { color: '#FF00FF', name: 'Фуксия' },
      { color: '#FFFFFF', name: 'Чистый белый' },
      { color: '#C0C0C0', name: 'Серебристый' },
    ],
    products: [
      {
        image: '/foto/hoodie_autumn_terracotta_1763655227161.png',
        name: 'Худи терракотовое',
        article: '333444555',
        price: '3 290 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/333444555/detail.aspx',
        badge: 'ХИТ',
      },
    ],
    images: [
      '/foto/цветотипы/autumn/47163.jpg',
      '/foto/цветотипы/autumn/8C0A1326.jpg',
    ],
  },
}

export default function SeasonPage() {
  const params = useParams()
  const router = useRouter()
  const seasonName = (params.seasonName as string)?.toLowerCase()
  const season = seasonData[seasonName]

  if (!season) {
    return (
      <div className="container">
        <div className="screen">
          <h1>Сезон не найден</h1>
          <button onClick={() => router.push('/')} className="btn-primary">
            На главную
          </button>
        </div>
      </div>
    )
  }

  const handleBuyClick = (productName: string, price: string) => {
    trackFacebookEvent('Purchase', {
      content_name: productName,
      value: parseInt(price.replace(/\s/g, '').replace('₽', '')),
      currency: 'RUB',
    })
  }

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="glow-effect glow-top"></div>
      <div className="glow-effect glow-bottom"></div>
      <div className="season-page">
        <div className="season-header">
          <div className="brand-name">VIBELOOK</div>
          <h1 className="season-title">
            Цветотип <span className="highlight">{season.title}</span>
          </h1>
          <p className="season-subtitle">{season.subtitle}</p>
        </div>

        <div className="season-visual">
          <SeasonSlideshow season={season.title} images={season.images} />
        </div>

        <div className="season-description">
          <h3>Описание цветотипа</h3>
          <p>{season.description}</p>
        </div>

        <div className="color-section">
          <h3>✅ Ваши идеальные цвета</h3>
          <div className="color-grid">
            {season.idealColors.map((item, index) => (
              <div key={index} className="color-item">
                <div
                  className="color-circle"
                  style={{
                    background: item.color,
                    border: item.color === '#FFFFFF' ? '2px solid #333' : 'none',
                  }}
                />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="color-section avoid">
          <h3>❌ Избегайте этих цветов</h3>
          <div className="color-grid">
            {season.avoidColors.map((item, index) => (
              <div key={index} className="color-item">
                <div className="color-circle" style={{ background: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="products-section">
          <h2>Рекомендуемые худи для вас</h2>
          <p className="products-subtitle">Подобрано специально под ваш цветотип</p>

          <div className="products-grid">
            {season.products.map((product, index) => (
              <div key={index} className="product-card-wb">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.badge && (
                    <div className={`product-badge ${product.badge === 'НОВИНКА' ? 'new' : ''}`}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="product-info-wb">
                  <h4>{product.name}</h4>
                  <p className="product-article">Артикул: {product.article}</p>
                  <div className="product-price-block">
                    <span className="product-price">{product.price}</span>
                    <span className="product-old-price">{product.oldPrice}</span>
                  </div>
                  <a
                    href={product.link}
                    className="btn-buy-wb"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleBuyClick(product.name, product.price)}
                  >
                    Купить на WB
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => router.back()} className="btn-back">
          ← Назад к результатам
        </button>
      </div>
    </div>
  )
}

