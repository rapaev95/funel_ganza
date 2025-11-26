export type ColorTemperature = 'cool' | 'warm' | 'neutral'
export type ColorSeason = 
  | 'bright_winter' 
  | 'cool_winter' 
  | 'deep_winter' 
  | 'cool_summer' 
  | 'light_summer' 
  | 'soft_summer' 
  | 'warm_spring' 
  | 'light_spring' 
  | 'bright_spring' 
  | 'warm_autumn' 
  | 'soft_autumn' 
  | 'deep_autumn'

export type ContrastLevel = 'high' | 'medium' | 'low'
export type FaceShape = 'oval' | 'round' | 'square' | 'rectangle' | 'triangle' | 'inverted_triangle' | 'diamond'
export type BodySilhouette = 'V' | 'A' | 'H' | 'X' | 'O' | 'I'
export type HairColor = 
  | 'black' 
  | 'dark_brown' 
  | 'brown' 
  | 'light_brown' 
  | 'dark_blonde' 
  | 'ash_blonde' 
  | 'cool_blonde' 
  | 'platinum_blonde' 
  | 'red' 
  | 'copper' 
  | 'grey'
export type Archetype = 'rebel' | 'lover' | 'explorer' | 'creator' | 'ruler' | 'sage'
export type Gender = 'male' | 'female'
export type Age = 'old' | 'young'

export interface ResultParams {
  color_temperature?: ColorTemperature
  color_season?: ColorSeason
  contrast_level?: ContrastLevel
  face_shape?: FaceShape
  body_silhouette?: BodySilhouette
  hair_color?: HairColor
  archetype?: Archetype
  gender?: Gender
  age?: Age
}

export interface ColorPalette {
  recommended: string[] // HEX цвета (8-12)
  avoid: string[] // HEX цвета (6-8)
}

export interface BlockContent {
  title: string
  subtitle?: string
  description: string[] // 6-8 строк
}

