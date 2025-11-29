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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching looks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch looks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ looks: looks || [] })
  } catch (error) {
    console.error('Error in GET /api/looks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // TODO: Добавить проверку авторизации и seller_id
    const { data: look, error } = await supabase
      .from('looks')
      .insert([{
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating look:', error)
      return NextResponse.json(
        { error: 'Failed to create look' },
        { status: 500 }
      )
    }

    return NextResponse.json({ look })
  } catch (error) {
    console.error('Error in POST /api/looks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

