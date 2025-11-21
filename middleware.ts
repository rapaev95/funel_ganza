import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // МИНИМАЛЬНАЯ ВЕРСИЯ: Просто пропускаем всё
  return NextResponse.next();
}

// УПРОЩЕННЫЙ MATCHER: только корень
export const config = {
  matcher: '/'
};

