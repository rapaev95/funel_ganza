import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ganza-ai-stylist.vercel.app'
  const seasons = ['winter', 'spring', 'summer', 'autumn']
  
  const routes: MetadataRoute.Sitemap = []
  
  // Add main pages for each locale
  routing.locales.forEach((locale: string) => {
    routes.push({
      url: locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 1,
    })
    
    // Add season pages for each locale
    seasons.forEach((season) => {
      routes.push({
        url: locale === routing.defaultLocale 
          ? `${baseUrl}/season/${season}`
          : `${baseUrl}/${locale}/season/${season}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })
    })
  })
  
  return routes
}

