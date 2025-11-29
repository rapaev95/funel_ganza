import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API ключ не предоставлен' },
        { status: 400 }
      )
    }

    // TODO: Реальная интеграция с WB API
    // Пример запроса к WB API:
    // const response = await fetch('https://suppliers-api.wildberries.ru/content/v1/cards/cursor/list', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     sort: { cursor: { limit: 100 } },
    //     filter: { withPhoto: -1 }
    //   })
    // })

    // Для демо возвращаем пустой массив
    // В реальности здесь будет парсинг ответа от WB API
    return NextResponse.json({
      products: [],
      message: 'Интеграция с WB API будет реализована позже'
    })
  } catch (error) {
    console.error('WB API error:', error)
    return NextResponse.json(
      { error: 'Ошибка при запросе к WB API' },
      { status: 500 }
    )
  }
}

