'use client'

import { Archetype } from '@/types/result'
import { ARCHETYPE_LABELS } from '@/lib/dictionaries'

interface ArchetypeExplanationProps {
  archetype: Archetype
}

const ARCHETYPE_STREETWEAR_EXPLANATIONS: Record<Archetype, { title: string; description: string[] }> = {
  rebel: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Бунтарь** требует самовыражения и свободы. Streetwear — это не просто одежда, это способ показать свою индивидуальность.',
      '**Почему именно streetwear?** Свободные силуэты дают тебе комфорт, смелые цвета подчеркивают твою смелость, а нестандартные решения отражают твой бунтарский дух.',
    ],
  },
  lover: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Любовник** выражает чувственность и элегантность. Streetwear в твоем исполнении приобретает особую притягательность.',
      '**Почему это работает?** Мягкие линии streetwear подчеркивают твою женственность, а качественные материалы создают образ, который привлекает внимание.',
    ],
  },
  explorer: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Исследователь** ценит функциональность и комфорт. Streetwear — это идеальное сочетание практичности и современного стиля.',
      '**Почему тебе это нужно?** Удобные силуэты не сковывают движения, качественные материалы выдерживают активный образ жизни, а стильный вид подчеркивает твою динамичность.',
    ],
  },
  creator: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Творец** ищет способы самовыражения. Streetwear дает тебе полную свободу для экспериментов и творческих решений.',
      '**Почему это важно?** Необычные сочетания позволяют создавать уникальные образы, креативные детали отражают твою художественную натуру, а универсальность дает простор для фантазии.',
    ],
  },
  ruler: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Правитель** требует качества и статусности. Streetwear премиум-класса подчеркивает твою уверенность и авторитет.',
      '**Почему это работает?** Качественные материалы говорят о твоем статусе, продуманные детали создают образ лидера, а современный стиль показывает, что ты идешь в ногу со временем.',
    ],
  },
  sage: {
    title: 'Подборка в стиле Streetwear',
    description: [
      'Твой архетип **Мудрец** ценит сдержанность и качество. Streetwear в интеллектуальной интерпретации создает образ думающего человека.',
      '**Почему это подходит?** Сдержанные цвета отражают твою мудрость, качественные ткани говорят о твоем вкусе, а классические линии streetwear создают образ, который внушает доверие.',
    ],
  },
}

export function ArchetypeExplanation({ archetype }: ArchetypeExplanationProps) {
  const content = ARCHETYPE_STREETWEAR_EXPLANATIONS[archetype]
  const archetypeLabel = ARCHETYPE_LABELS[archetype]

  return (
    <div className="archetype-explanation">
      <h3 className="archetype-explanation-title">
        {content.title}
      </h3>
      <div className="archetype-explanation-content">
        {content.description.map((paragraph, index) => (
          <p key={index} className="archetype-explanation-text">
            {paragraph.split('**').map((part, i) => 
              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
            )}
          </p>
        ))}
      </div>
    </div>
  )
}

