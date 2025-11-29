import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Получаем все луки текущего пользователя
    // TODO: Добавить проверку авторизации и фильтрацию по seller_id
    const { data: looks, error } = await supabase
      .from('looks')
      .select('*')

    if (error) {
      console.error('Error fetching looks for stats:', error)
      return NextResponse.json(
        { error: 'Failed to fetch looks' },
        { status: 500 }
      )
    }

    const looksData = looks || []

    // Подсчет статистики
    const archetypes = [
      'rebel', 'lover', 'explorer', 'creator', 'ruler', 'sage'
    ]
    const completedArchetypes = archetypes.filter(archetype =>
      looksData.some((look: any) => look.archetype === archetype)
    ).length

    const usageContexts = ['work', 'home', 'sport', 'evening', 'casual', 'beach', 'street']
    const contextProgress = usageContexts.map(context => {
      const count = looksData.filter((look: any) =>
        look.usage_contexts && look.usage_contexts.includes(context)
      ).length
      const minRequired = context === 'work' || context === 'casual' || context === 'street' ? 2 : 1
      return {
        context,
        count,
        minRequired,
        completed: count >= minRequired
      }
    })
    const completedContexts = contextProgress.filter(c => c.completed).length

    const colorSeasons = [
      'bright_winter', 'cool_winter', 'deep_winter',
      'cool_summer', 'light_summer', 'soft_summer',
      'warm_spring', 'light_spring', 'bright_spring',
      'warm_autumn', 'soft_autumn', 'deep_autumn'
    ]
    const completedColorSeasons = colorSeasons.filter(season =>
      looksData.some((look: any) => look.color_season === season)
    ).length

    const totalItems = archetypes.length + usageContexts.length + colorSeasons.length
    const completedItems = completedArchetypes + completedContexts + completedColorSeasons
    const progressPercentage = Math.round((completedItems / totalItems) * 100)

    return NextResponse.json({
      progressPercentage,
      archetypes: {
        total: archetypes.length,
        completed: completedArchetypes
      },
      contexts: {
        total: usageContexts.length,
        completed: completedContexts,
        details: contextProgress
      },
      colorSeasons: {
        total: colorSeasons.length,
        completed: completedColorSeasons
      }
    })
  } catch (error) {
    console.error('Error in GET /api/looks/stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

