'use client'

import { useParams, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { SeasonSlideshow } from '@/components/SeasonSlideshow'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { trackFacebookEvent } from '@/lib/facebook'

const seasonData: Record<string, {
  title: Record<string, string>
  subtitle: Record<string, string>
  description: Record<string, string>
  idealColors: { color: string; name: Record<string, string> }[]
  avoidColors: { color: string; name: Record<string, string> }[]
  products: {
    image: string
    name: Record<string, string>
    article: string
    price: string
    oldPrice: string
    link: string
    badge?: string
  }[]
  images: string[]
}> = {
  winter: {
    title: {
      ru: 'Зима',
      kz: 'Қыс',
      en: 'Winter',
      'pt-BR': 'Inverno'
    },
    subtitle: {
      ru: 'Контрастная, яркая, холодная',
      kz: 'Контрастты, жарқын, суық',
      en: 'Contrasting, bright, cool',
      'pt-BR': 'Contrastante, brilhante, frio'
    },
    description: {
      ru: 'Зимний цветотип отличается высокой контрастностью между кожей, волосами и глазами. Вам идеально подходят чистые, насыщенные и холодные оттенки.',
      kz: 'Қыс түс типі тері, шаш және көз арасындағы жоғары контрастпен ерекшеленеді. Сізге таза, қанық және суық түстер сәйкес келеді.',
      en: 'Winter color type is characterized by high contrast between skin, hair and eyes. Pure, saturated and cool shades are perfect for you.',
      'pt-BR': 'O tipo de cor invernal é caracterizado por alto contraste entre pele, cabelo e olhos. Tons puros, saturados e frios são perfeitos para você.'
    },
    idealColors: [
      { color: '#000000', name: { ru: 'Черный', kk: 'Қара', en: 'Black', 'pt-BR': 'Preto' } },
      { color: '#FFFFFF', name: { ru: 'Белый', kk: 'Ақ', en: 'White', 'pt-BR': 'Branco' } },
      { color: '#DC143C', name: { ru: 'Алый', kk: 'Қызыл', en: 'Scarlet', 'pt-BR': 'Escarlate' } },
      { color: '#4B0082', name: { ru: 'Индиго', kk: 'Индиго', en: 'Indigo', 'pt-BR': 'Anil' } },
      { color: '#FF1493', name: { ru: 'Фуксия', kk: 'Фуксия', en: 'Fuchsia', 'pt-BR': 'Fúcsia' } },
      { color: '#00CED1', name: { ru: 'Бирюза', kk: 'Көгілдір', en: 'Turquoise', 'pt-BR': 'Turquesa' } },
      { color: '#8B008B', name: { ru: 'Пурпурный', kk: 'Қызылкүрең', en: 'Purple', 'pt-BR': 'Roxo' } },
      { color: '#C0C0C0', name: { ru: 'Серебро', kk: 'Күміс', en: 'Silver', 'pt-BR': 'Prata' } },
    ],
    avoidColors: [
      { color: '#D2691E', name: { ru: 'Оранжевый', kk: 'Қызғылт', en: 'Orange', 'pt-BR': 'Laranja' } },
      { color: '#F0E68C', name: { ru: 'Желтый', kk: 'Сары', en: 'Yellow', 'pt-BR': 'Amarelo' } },
      { color: '#DEB887', name: { ru: 'Бежевый', kk: 'Беж', en: 'Beige', 'pt-BR': 'Bege' } },
      { color: '#CD853F', name: { ru: 'Коричневый', kk: 'Қоңыр', en: 'Brown', 'pt-BR': 'Marrom' } },
    ],
    products: [
      {
        image: '/foto/hoodie_winter_black_1763654928840.png',
        name: { ru: 'Худи черное базовое', kk: 'Қара базалық худи', en: 'Black basic hoodie', 'pt-BR': 'Moletom preto básico' },
        article: '123456789',
        price: '2 990 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/123456789/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_winter_white_1763654938882.png',
        name: { ru: 'Худи белое оверсайз', kk: 'Ақ оверсайз худи', en: 'White oversize hoodie', 'pt-BR': 'Moletom branco oversized' },
        article: '987654321',
        price: '3 290 ₽',
        oldPrice: '5 000 ₽',
        link: 'https://www.wildberries.ru/catalog/987654321/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_red_1763654946152.png',
        name: { ru: 'Худи алое premium', kk: 'Қызыл премиум худи', en: 'Scarlet premium hoodie', 'pt-BR': 'Moletom escarlate premium' },
        article: '456789123',
        price: '3 790 ₽',
        oldPrice: '5 500 ₽',
        link: 'https://www.wildberries.ru/catalog/456789123/detail.aspx',
        badge: 'НОВИНКА',
      },
      {
        image: '/foto/hoodie_winter_purple_1763654954729.png',
        name: { ru: 'Худи индиго с принтом', kk: 'Индиго принтті худи', en: 'Indigo printed hoodie', 'pt-BR': 'Moletom anil estampado' },
        article: '789123456',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/789123456/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_fuchsia_1763654961856.png',
        name: { ru: 'Худи фуксия яркое', kk: 'Жарқын фуксия худи', en: 'Bright fuchsia hoodie', 'pt-BR': 'Moletom fúcsia brilhante' },
        article: '321654987',
        price: '2 890 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/321654987/detail.aspx',
      },
      {
        image: '/foto/hoodie_winter_turquoise_1763654968921.png',
        name: { ru: 'Худи бирюзовое casual', kk: 'Көгілдір кэжуал худи', en: 'Turquoise casual hoodie', 'pt-BR': 'Moletom turquesa casual' },
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
    title: {
      ru: 'Весна',
      kz: 'Көктем',
      en: 'Spring',
      'pt-BR': 'Primavera'
    },
    subtitle: {
      ru: 'Светлая, теплая, яркая',
      kz: 'Жарық, жылы, жарқын',
      en: 'Light, warm, bright',
      'pt-BR': 'Claro, quente, brilhante'
    },
    description: {
      ru: 'Весенний цветотип характеризуется светлой кожей с теплым подтоном, светлыми волосами и яркими глазами. Вам подходят свежие, теплые и яркие оттенки.',
      kz: 'Көктем түс типі жылы реңкті жеңіл тері, жеңіл шаш және жарқын көздермен сипатталады. Сізге жаңа, жылы және жарқын түстер сәйкес келеді.',
      en: 'Spring color type is characterized by light skin with warm undertone, light hair and bright eyes. Fresh, warm and bright shades suit you.',
      'pt-BR': 'O tipo de cor primaveril é caracterizado por pele clara com subtom quente, cabelo claro e olhos brilhantes. Tons frescos, quentes e brilhantes combinam com você.'
    },
    idealColors: [
      { color: '#FFD700', name: { ru: 'Золотой', kk: 'Алтын', en: 'Gold', 'pt-BR': 'Dourado' } },
      { color: '#FFE4B5', name: { ru: 'Персиковый', kk: 'Шабдалы', en: 'Peach', 'pt-BR': 'Pêssego' } },
      { color: '#FF69B4', name: { ru: 'Розовый', kk: 'Қызғылт', en: 'Pink', 'pt-BR': 'Rosa' } },
      { color: '#98FB98', name: { ru: 'Светло-зеленый', kk: 'Ашық жасыл', en: 'Light green', 'pt-BR': 'Verde claro' } },
      { color: '#87CEEB', name: { ru: 'Небесно-голубой', kk: 'Аспан көк', en: 'Sky blue', 'pt-BR': 'Azul céu' } },
      { color: '#FFA500', name: { ru: 'Оранжевый', kk: 'Қызғылт', en: 'Orange', 'pt-BR': 'Laranja' } },
      { color: '#FFB6C1', name: { ru: 'Лососевый', kk: 'Лосось', en: 'Salmon', 'pt-BR': 'Salmão' } },
      { color: '#F0E68C', name: { ru: 'Лимонный', kk: 'Лимон', en: 'Lemon', 'pt-BR': 'Limão' } },
    ],
    avoidColors: [
      { color: '#000000', name: { ru: 'Черный', kk: 'Қара', en: 'Black', 'pt-BR': 'Preto' } },
      { color: '#4B0082', name: { ru: 'Темно-фиолетовый', kk: 'Қара қызылкүрең', en: 'Dark purple', 'pt-BR': 'Roxo escuro' } },
      { color: '#8B0000', name: { ru: 'Темно-красный', kk: 'Қара қызыл', en: 'Dark red', 'pt-BR': 'Vermelho escuro' } },
      { color: '#2F4F4F', name: { ru: 'Темно-серый', kk: 'Қара сұр', en: 'Dark gray', 'pt-BR': 'Cinza escuro' } },
    ],
    products: [
      {
        image: '/foto/hoodie_spring_golden_1763655035253.png',
        name: { ru: 'Худи золотое', kk: 'Алтын худи', en: 'Gold hoodie', 'pt-BR': 'Moletom dourado' },
        article: '111222333',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/111222333/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_spring_lemon_1763655050411.png',
        name: { ru: 'Худи лимонное', kk: 'Лимон худи', en: 'Lemon hoodie', 'pt-BR': 'Moletom limão' },
        article: '222333444',
        price: '2 990 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/222333444/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_mint_1763655027539.png',
        name: { ru: 'Худи мятное', kk: 'Жалбыз худи', en: 'Mint hoodie', 'pt-BR': 'Moletom menta' },
        article: '333444555',
        price: '3 290 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/333444555/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_peach_1763655020213.png',
        name: { ru: 'Худи персиковое', kk: 'Шабдалы худи', en: 'Peach hoodie', 'pt-BR': 'Moletom pêssego' },
        article: '444555666',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/444555666/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_salmon_1763655059391.png',
        name: { ru: 'Худи лососевое', kk: 'Лосось худи', en: 'Salmon hoodie', 'pt-BR': 'Moletom salmão' },
        article: '555666777',
        price: '2 890 ₽',
        oldPrice: '4 000 ₽',
        link: 'https://www.wildberries.ru/catalog/555666777/detail.aspx',
      },
      {
        image: '/foto/hoodie_spring_skyblue_1763655043039.png',
        name: { ru: 'Худи небесно-голубое', kk: 'Аспан көк худи', en: 'Sky blue hoodie', 'pt-BR': 'Moletom azul céu' },
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
    title: {
      ru: 'Лето',
      kz: 'Жаз',
      en: 'Summer',
      'pt-BR': 'Verão'
    },
    subtitle: {
      ru: 'Мягкая, прохладная, приглушенная',
      kz: 'Жұмсақ, салқын, басылған',
      en: 'Soft, cool, muted',
      'pt-BR': 'Suave, frio, suave'
    },
    description: {
      ru: 'Летний цветотип отличается мягкой, прохладной кожей, светлыми или пепельными волосами и светлыми глазами. Вам подходят приглушенные, прохладные и пастельные оттенки.',
      kz: 'Жаз түс типі жұмсақ, салқын тері, жеңіл немесе күлгін шаш және жеңіл көздермен ерекшеленеді. Сізге басылған, салқын және пастельді түстер сәйкес келеді.',
      en: 'Summer color type is distinguished by soft, cool skin, light or ashy hair and light eyes. Muted, cool and pastel shades suit you.',
      'pt-BR': 'O tipo de cor de verão é distinguido por pele suave e fria, cabelo claro ou acinzentado e olhos claros. Tons suaves, frios e pastéis combinam com você.'
    },
    idealColors: [
      { color: '#E6E6FA', name: { ru: 'Лавандовый', kk: 'Лаванда', en: 'Lavender', 'pt-BR': 'Lavanda' } },
      { color: '#F0F8FF', name: { ru: 'Пудровый', kk: 'Пудра', en: 'Powder', 'pt-BR': 'Pó' } },
      { color: '#B0C4DE', name: { ru: 'Пыльно-голубой', kk: 'Шаңды көк', en: 'Dusty blue', 'pt-BR': 'Azul poeirento' } },
      { color: '#DDA0DD', name: { ru: 'Сливовый', kk: 'Алхоры', en: 'Plum', 'pt-BR': 'Ameixa' } },
      { color: '#F5DEB3', name: { ru: 'Пыльная роза', kk: 'Шаңды қызғылт', en: 'Dusty rose', 'pt-BR': 'Rosa poeirenta' } },
      { color: '#C0C0C0', name: { ru: 'Серебристо-серый', kk: 'Күміс сұр', en: 'Silver gray', 'pt-BR': 'Cinza prateado' } },
      { color: '#98D8C8', name: { ru: 'Мятный', kk: 'Жалбыз', en: 'Mint', 'pt-BR': 'Menta' } },
      { color: '#D3D3D3', name: { ru: 'Светло-серый', kk: 'Ашық сұр', en: 'Light gray', 'pt-BR': 'Cinza claro' } },
    ],
    avoidColors: [
      { color: '#FF4500', name: { ru: 'Ярко-оранжевый', kk: 'Жарқын қызғылт', en: 'Bright orange', 'pt-BR': 'Laranja brilhante' } },
      { color: '#FFD700', name: { ru: 'Золотой', kk: 'Алтын', en: 'Gold', 'pt-BR': 'Dourado' } },
      { color: '#8B0000', name: { ru: 'Темно-красный', kk: 'Қара қызыл', en: 'Dark red', 'pt-BR': 'Vermelho escuro' } },
      { color: '#000000', name: { ru: 'Чистый черный', kk: 'Таза қара', en: 'Pure black', 'pt-BR': 'Preto puro' } },
    ],
    products: [
      {
        image: '/foto/hoodie_summer_dustyblue_1763655123474.png',
        name: { ru: 'Худи пыльно-голубое', kk: 'Шаңды көк худи', en: 'Dusty blue hoodie', 'pt-BR': 'Moletom azul poeirento' },
        article: '777888999',
        price: '3 290 ₽',
        oldPrice: '4 700 ₽',
        link: 'https://www.wildberries.ru/catalog/777888999/detail.aspx',
        badge: 'ХИТ',
      },
      {
        image: '/foto/hoodie_summer_dustyrose_1763655132489.png',
        name: { ru: 'Худи пыльная роза', kk: 'Шаңды қызғылт худи', en: 'Dusty rose hoodie', 'pt-BR': 'Moletom rosa poeirenta' },
        article: '888999000',
        price: '2 990 ₽',
        oldPrice: '4 200 ₽',
        link: 'https://www.wildberries.ru/catalog/888999000/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_gray_1763655139461.png',
        name: { ru: 'Худи серое', kk: 'Сұр худи', en: 'Gray hoodie', 'pt-BR': 'Moletom cinza' },
        article: '999000111',
        price: '3 190 ₽',
        oldPrice: '4 500 ₽',
        link: 'https://www.wildberries.ru/catalog/999000111/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_lavender_1763655116333.png',
        name: { ru: 'Худи лавандовое', kk: 'Лаванда худи', en: 'Lavender hoodie', 'pt-BR': 'Moletom lavanda' },
        article: '000111222',
        price: '3 490 ₽',
        oldPrice: '4 900 ₽',
        link: 'https://www.wildberries.ru/catalog/000111222/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_lilac_1763655146526.png',
        name: { ru: 'Худи сиреневое', kk: 'Күлгін худи', en: 'Lilac hoodie', 'pt-BR': 'Moletom lilás' },
        article: '111222333',
        price: '2 890 ₽',
        oldPrice: '4 000 ₽',
        link: 'https://www.wildberries.ru/catalog/111222333/detail.aspx',
      },
      {
        image: '/foto/hoodie_summer_powder_1763655154273.png',
        name: { ru: 'Худи пудровое', kk: 'Пудра худи', en: 'Powder hoodie', 'pt-BR': 'Moletom pó' },
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
    title: {
      ru: 'Осень',
      kz: 'Күз',
      en: 'Autumn',
      'pt-BR': 'Outono'
    },
    subtitle: {
      ru: 'Теплая, насыщенная, землистая',
      kz: 'Жылы, қанық, топырақты',
      en: 'Warm, saturated, earthy',
      'pt-BR': 'Quente, saturado, terroso'
    },
    description: {
      ru: 'Осенний цветотип характеризуется теплой кожей с золотистым подтоном, рыжими или каштановыми волосами и теплыми глазами. Вам подходят насыщенные, теплые и землистые оттенки.',
      kz: 'Күз түс типі алтын реңкті жылы тері, қызыл немесе қоңыр шаш және жылы көздермен сипатталады. Сізге қанық, жылы және топырақты түстер сәйкес келеді.',
      en: 'Autumn color type is characterized by warm skin with golden undertone, red or chestnut hair and warm eyes. Saturated, warm and earthy shades suit you.',
      'pt-BR': 'O tipo de cor outonal é caracterizado por pele quente com subtom dourado, cabelo ruivo ou castanho e olhos quentes. Tons saturados, quentes e terrosos combinam com você.'
    },
    idealColors: [
      { color: '#8B4513', name: { ru: 'Коричневый', kk: 'Қоңыр', en: 'Brown', 'pt-BR': 'Marrom' } },
      { color: '#D2691E', name: { ru: 'Терракотовый', kk: 'Терракота', en: 'Terracotta', 'pt-BR': 'Terracota' } },
      { color: '#CD853F', name: { ru: 'Бежевый', kk: 'Беж', en: 'Beige', 'pt-BR': 'Bege' } },
      { color: '#A0522D', name: { ru: 'Рыжий', kk: 'Қызыл', en: 'Red', 'pt-BR': 'Ruivo' } },
      { color: '#8B7355', name: { ru: 'Оливковый', kk: 'Зәйтүн', en: 'Olive', 'pt-BR': 'Azeitona' } },
      { color: '#B8860B', name: { ru: 'Золотистый', kk: 'Алтын', en: 'Golden', 'pt-BR': 'Dourado' } },
      { color: '#DAA520', name: { ru: 'Горчичный', kk: 'Горчица', en: 'Mustard', 'pt-BR': 'Mostarda' } },
      { color: '#8B4513', name: { ru: 'Шоколадный', kk: 'Шоколад', en: 'Chocolate', 'pt-BR': 'Chocolate' } },
    ],
    avoidColors: [
      { color: '#0000FF', name: { ru: 'Ярко-синий', kk: 'Жарқын көк', en: 'Bright blue', 'pt-BR': 'Azul brilhante' } },
      { color: '#FF00FF', name: { ru: 'Фуксия', kk: 'Фуксия', en: 'Fuchsia', 'pt-BR': 'Fúcsia' } },
      { color: '#FFFFFF', name: { ru: 'Чистый белый', kk: 'Таза ақ', en: 'Pure white', 'pt-BR': 'Branco puro' } },
      { color: '#C0C0C0', name: { ru: 'Серебристый', kk: 'Күміс', en: 'Silver', 'pt-BR': 'Prata' } },
    ],
    products: [
      {
        image: '/foto/hoodie_autumn_terracotta_1763655227161.png',
        name: { ru: 'Худи терракотовое', kk: 'Терракота худи', en: 'Terracotta hoodie', 'pt-BR': 'Moletom terracota' },
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
  const t = useTranslations()
  const locale = useLocale() as 'ru' | 'kz' | 'en' | 'pt-BR'
  const seasonName = (params.seasonName as string)?.toLowerCase()
  const season = seasonData[seasonName]

  if (!season) {
    return (
      <div className="container">
        <div className="screen">
          <h1>Season not found</h1>
          <button onClick={() => router.push(`/${locale}`)} className="btn-primary">
            {locale === 'ru' ? 'На главную' : locale === 'kz' ? 'Басты бетке' : locale === 'en' ? 'Home' : 'Início'}
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
        <LanguageSwitcher />
        <div className="season-header">
          <div className="brand-name">{t('common.brand')}</div>
          <h1 className="season-title">
            {locale === 'ru' ? 'Цветотип' : locale === 'kz' ? 'Түс типі' : locale === 'en' ? 'Color type' : 'Tipo de cor'}{' '}
            <span className="highlight">{season.title[locale]}</span>
          </h1>
          <p className="season-subtitle">{season.subtitle[locale]}</p>
        </div>

        <div className="season-visual">
          <SeasonSlideshow season={season.title[locale]} images={season.images} />
        </div>

        <div className="season-description">
          <h3>
            {locale === 'ru' ? 'Описание цветотипа' : 
             locale === 'kz' ? 'Түс типінің сипаттамасы' : 
             locale === 'en' ? 'Color type description' : 
             'Descrição do tipo de cor'}
          </h3>
          <p>{season.description[locale]}</p>
        </div>

        <div className="color-section">
          <h3>
            {locale === 'ru' ? '✅ Ваши идеальные цвета' : 
             locale === 'kz' ? '✅ Сіздің мінсіз түстеріңіз' : 
             locale === 'en' ? '✅ Your ideal colors' : 
             '✅ Suas cores ideais'}
          </h3>
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
                <span>{item.name[locale]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="color-section avoid">
          <h3>
            {locale === 'ru' ? '❌ Избегайте этих цветов' : 
             locale === 'kz' ? '❌ Бұл түстерден аулақ болыңыз' : 
             locale === 'en' ? '❌ Avoid these colors' : 
             '❌ Evite essas cores'}
          </h3>
          <div className="color-grid">
            {season.avoidColors.map((item, index) => (
              <div key={index} className="color-item">
                <div className="color-circle" style={{ background: item.color }} />
                <span>{item.name[locale]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="products-section">
          <h2>
            {locale === 'ru' ? 'Рекомендуемые худи для вас' : 
             locale === 'kz' ? 'Сізге ұсынылатын худи' : 
             locale === 'en' ? 'Recommended hoodies for you' : 
             'Moletons recomendados para você'}
          </h2>
          <p className="products-subtitle">
            {locale === 'ru' ? 'Подобрано специально под ваш цветотип' : 
             locale === 'kz' ? 'Сіздің түс типіңізге арнайы таңдалған' : 
             locale === 'en' ? 'Selected specifically for your color type' : 
             'Selecionado especificamente para seu tipo de cor'}
          </p>

          <div className="products-grid">
            {season.products.map((product, index) => (
              <div key={index} className="product-card-wb">
                <div className="product-image">
                  <img src={product.image} alt={product.name[locale]} />
                  {product.badge && (
                    <div className={`product-badge ${product.badge === 'НОВИНКА' ? 'new' : ''}`}>
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="product-info-wb">
                  <h4>{product.name[locale]}</h4>
                  <p className="product-article">
                    {locale === 'ru' ? 'Артикул' : locale === 'kz' ? 'Артикул' : locale === 'en' ? 'Article' : 'Artigo'}: {product.article}
                  </p>
                  <div className="product-price-block">
                    <span className="product-price">{product.price}</span>
                    <span className="product-old-price">{product.oldPrice}</span>
                  </div>
                  <a
                    href={product.link}
                    className="btn-buy-wb"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleBuyClick(product.name[locale], product.price)}
                  >
                    {locale === 'ru' ? 'Купить на WB' : 
                     locale === 'kz' ? 'WB-де сатып алу' : 
                     locale === 'en' ? 'Buy on WB' : 
                     'Comprar no WB'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => router.back()} className="btn-back">
          {locale === 'ru' ? '← Назад к результатам' : 
           locale === 'kz' ? '← Нәтижелерге оралу' : 
           locale === 'en' ? '← Back to results' : 
           '← Voltar aos resultados'}
        </button>
      </div>
    </div>
  )
}


