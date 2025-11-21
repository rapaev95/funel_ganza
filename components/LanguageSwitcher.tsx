'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { useState, useRef, useEffect } from 'react'
import { routing } from '@/i18n/routing'

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    // Получаем реальный путь из window.location.pathname
    if (typeof window === 'undefined') {
      setIsOpen(false)
      return
    }
    
    const currentPath = window.location.pathname
    
    // Сортируем локали по длине (от длинных к коротким), чтобы pt-BR обрабатывался до pt
    const sortedLocales = [...routing.locales].sort((a, b) => b.length - a.length)
    
    // Функция для удаления локали из пути
    const removeLocaleFromPath = (path: string): string => {
      let result = path
      
      // Удаляем локали в цикле, пока они есть
      let changed = true
      while (changed) {
        changed = false
        for (const loc of sortedLocales) {
          const localePrefix = `/${loc}`
          if (result.startsWith(`${localePrefix}/`)) {
            result = result.substring(localePrefix.length)
            changed = true
            break
          } else if (result === localePrefix) {
            result = '/'
            changed = true
            break
          }
        }
      }
      
      return result || '/'
    }
    
    // Убираем ВСЕ локали из пути
    let pathWithoutLocale = removeLocaleFromPath(currentPath)
    
    // Убеждаемся, что путь начинается с /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale
    }
    
    // Формируем новый путь с новой локалью
    let newPath: string
    if (newLocale === routing.defaultLocale) {
      // Для дефолтного языка (ru) не добавляем префикс
      newPath = pathWithoutLocale
    } else {
      // Для других языков добавляем префикс локали
      // Убеждаемся, что путь не начинается уже с этой локали
      if (pathWithoutLocale.startsWith(`/${newLocale}/`) || pathWithoutLocale === `/${newLocale}`) {
        // Если путь уже содержит новую локаль, убираем её и добавляем заново
        pathWithoutLocale = removeLocaleFromPath(pathWithoutLocale)
      }
      newPath = pathWithoutLocale === '/' ? `/${newLocale}` : `/${newLocale}${pathWithoutLocale}`
    }
    
    // Используем window.location для надежного переключения
    window.location.href = newPath
    setIsOpen(false)
  }

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="language-flag">{currentLanguage.flag}</span>
        <span className="language-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${locale === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
              aria-label={`Select ${lang.name}`}
            >
              <span className="language-flag">{lang.flag}</span>
              {locale === lang.code && <span className="language-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

