export type LookStyle = 
  | 'casual' 
  | 'classic' 
  | 'sporty' 
  | 'elegant' 
  | 'romantic' 
  | 'bohemian' 
  | 'streetwear'

export type Archetype = 
  | 'rebel'
  | 'lover'
  | 'explorer'
  | 'creator'
  | 'ruler'
  | 'sage'

export type UsageContext = 
  | 'work'
  | 'home'
  | 'sport'
  | 'evening'
  | 'casual'
  | 'beach'
  | 'street'

export type ColorSeason = 
  | 'bright_winter' | 'cool_winter' | 'deep_winter'
  | 'cool_summer' | 'light_summer' | 'soft_summer'
  | 'warm_spring' | 'light_spring' | 'bright_spring'
  | 'warm_autumn' | 'soft_autumn' | 'deep_autumn'

export interface Look {
  id: string
  name: string
  image: string // путь к изображению
  style: LookStyle
  color_season: ColorSeason
  usage_contexts: UsageContext[]
  archetype?: Archetype
  description?: string
  metrics?: {
    clicks: number
    ctr: number
    conversions: number
  }
  created_at: string
  updated_at: string
}

