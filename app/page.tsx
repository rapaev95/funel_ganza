import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function RootPage() {
  // Редирект на дефолтную локаль
  redirect(`/${routing.defaultLocale}`)
}

