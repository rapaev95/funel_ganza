'use client'

import { useTranslations } from 'next-intl'

export function Loader() {
  const t = useTranslations()
  
  return (
    <div className="screen">
      <div className="loader"></div>
      <p>{t('loader.analyzing')}</p>
    </div>
  )
}

