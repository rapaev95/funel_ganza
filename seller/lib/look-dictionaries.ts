import { LookStyle, ColorSeason, Archetype, UsageContext } from '@/types/look'

// Лейблы для стилей
export const LOOK_STYLE_LABELS: Record<LookStyle, string> = {
  casual: 'Повседневный',
  classic: 'Классика',
  sporty: 'Спортивный',
  elegant: 'Элегантный',
  romantic: 'Романтичный',
  bohemian: 'Бохо',
  streetwear: 'Уличный',
}

// Лейблы для архетипов (из funel_new)
export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  rebel: 'Бунтарь',
  lover: 'Любовник',
  explorer: 'Исследователь',
  creator: 'Творец',
  ruler: 'Правитель',
  sage: 'Мудрец',
}

// Иконки для архетипов
export const ARCHETYPE_ICONS: Record<Archetype, string> = {
  rebel: '🔥',
  lover: '💋',
  explorer: '🌍',
  creator: '🎨',
  ruler: '👑',
  sage: '📚',
}

// Лейблы для контекстов использования
export const USAGE_CONTEXT_LABELS: Record<UsageContext, string> = {
  work: 'Для работы',
  home: 'Домашний',
  sport: 'Спортивный',
  evening: 'Вечерний',
  casual: 'Casual',
  beach: 'Пляжный',
  street: 'Уличный',
}

// Иконки для контекстов использования
export const USAGE_CONTEXT_ICONS: Record<UsageContext, string> = {
  work: '💼',
  home: '🏠',
  sport: '⚽',
  evening: '🌆',
  casual: '👕',
  beach: '🏖️',
  street: '🧥',
}

// Лейблы для цветотипов (переиспользуем из funel_new)
export const COLOR_SEASON_LABELS: Record<ColorSeason, string> = {
  bright_winter: 'Яркая Зима',
  cool_winter: 'Холодная Зима',
  deep_winter: 'Глубокая Зима',
  cool_summer: 'Холодное Лето',
  light_summer: 'Светлое Лето',
  soft_summer: 'Мягкое Лето',
  warm_spring: 'Теплая Весна',
  light_spring: 'Светлая Весна',
  bright_spring: 'Яркая Весна',
  warm_autumn: 'Теплая Осень',
  soft_autumn: 'Мягкая Осень',
  deep_autumn: 'Глубокая Осень',
}

// Иконки для стилей (опционально)
export const LOOK_STYLE_ICONS: Record<LookStyle, string> = {
  casual: '👕',
  classic: '👔',
  sporty: '🏃',
  elegant: '💎',
  romantic: '🌹',
  bohemian: '🌸',
  streetwear: '👟',
}

// Минимальные требования для контекстов
export const USAGE_CONTEXT_MIN_REQUIREMENTS: Record<UsageContext, number> = {
  work: 2,
  casual: 2,
  street: 2,
  home: 1,
  sport: 1,
  evening: 1,
  beach: 1,
}

