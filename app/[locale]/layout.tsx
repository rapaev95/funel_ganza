import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import '../globals.css'
import { FacebookPixel } from '@/components/FacebookPixel'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  weight: ['700', '900'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'VIBELOOK AI Stylist - Персональный AI-стилист',
  description: 'Узнай свой цветотип и получи персональные рекомендации по стилю',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale })
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '989549929881045'

  return (
    <>
      <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      {/* Facebook Pixel */}
      {pixelId && (
        <>
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
      <div className={`${inter.variable} ${playfair.variable}`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <FacebookPixel />
        </NextIntlClientProvider>
      </div>
    </>
  )
}

