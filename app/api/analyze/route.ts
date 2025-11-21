import { NextRequest, NextResponse } from 'next/server'
import { UTMData } from '@/types/utm'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageCount = parseInt(formData.get('image_count') as string) || 1
    const userId = formData.get('user_id') as string
    const firstName = formData.get('first_name') as string

    // Получаем все загруженные фото
    const images: string[] = []
    for (let i = 1; i <= imageCount; i++) {
      const file = formData.get(`image_${i}`) as File
      if (file) {
        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        const base64Image = `data:${file.type};base64,${base64}`
        images.push(base64Image)
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      )
    }

    // Get n8n webhook URL from environment
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://n8n-biqby-u59940.vm.elestio.app/webhook/upload-image'

    // Получаем ответы на вопросы
    const age = formData.get('age') as string
    const gender = formData.get('gender') as string
    const budgetPreference = formData.get('budget_preference') as string

    // Получаем UTM данные из FormData
    let utmData: UTMData = {}
    const utmDataString = formData.get('utm_data') as string
    if (utmDataString) {
      try {
        utmData = JSON.parse(utmDataString) as UTMData
      } catch (error) {
        console.error('Error parsing UTM data:', error)
        // Продолжаем с пустым объектом UTM
      }
    }

    // Send to n8n webhook
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images, // Массив из 2 фото (селфи + в полный рост)
        image_count: images.length,
        user_id: userId,
        first_name: firstName,
        age: age,
        gender: gender,
        budget_preference: budgetPreference ? parseInt(budgetPreference) : null,
        // UTM параметры
        utm_source: utmData?.utm_source || null,
        utm_medium: utmData?.utm_medium || null,
        utm_campaign: utmData?.utm_campaign || null,
        utm_content: utmData?.utm_content || null,
        utm_term: utmData?.utm_term || null,
        fbclid: utmData?.fbclid || null,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!n8nResponse.ok) {
      throw new Error('Failed to send to n8n')
    }

    const n8nData = await n8nResponse.json()

    // Return response (n8n should return the analysis result)
    // Facebook events are tracked on client side
    return NextResponse.json({
      success: true,
      data: n8nData,
    })
  } catch (error) {
    console.error('Error in analyze route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

