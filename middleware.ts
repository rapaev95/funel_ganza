import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Пропускаем статику, API и внутренние пути Next.js
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') || // Все файлы с расширениями (.png, .jpg, etc.)
    pathname.startsWith('/foto')
  ) {
    return NextResponse.next();
  }

  // Если уже есть локаль в пути - пропускаем
  if (pathname.match(/^\/(ru|kk|en|pt-BR)/)) {
    return NextResponse.next();
  }

  // Для корневого пути "/" - редирект на дефолтную локаль "/ru"
  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/ru';
    return NextResponse.redirect(url);
  }

  // Для других путей без локали - добавляем дефолтную локаль
  const url = request.nextUrl.clone();
  url.pathname = `/ru${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/',
    '/(ru|kk|en|pt-BR)(/.*)?'
  ]
};

