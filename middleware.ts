import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // МИНИМАЛЬНАЯ ВЕРСИЯ: Просто пропускаем всё
  // Если это работает - middleware сам по себе OK
  // Если не работает - проблема в Edge Runtime или matcher
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/(ru|kk|en|pt-BR)(/.*)?'
  ]
};

