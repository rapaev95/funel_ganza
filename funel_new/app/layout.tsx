import { ReactNode } from 'react'
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { FacebookPixel } from '@/components/FacebookPixel'

export const metadata: Metadata = {
  title: 'GANZA Funnel',
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
          start_param?: string
        }
        startParam?: string
        expand: () => void
        ready: () => void
      }
    }
    fbq: (...args: any[]) => void
    _fbq: any
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '989549929881045'

  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
        {pixelId && (
          <Script
            id="facebook-pixel-init"
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
        )}
      </head>
      <body>
        {children}
        <FacebookPixel />
      </body>
    </html>
  )
}
