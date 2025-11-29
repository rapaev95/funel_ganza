'use client'

import { useTheme } from '@/lib/theme-context'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Переключить тему"
      title={theme === 'dark' ? 'Переключить на Vibelook' : 'Переключить на темную'}
    >
      <div className="theme-toggle-inner">
        <span className={`theme-icon ${theme === 'dark' ? 'active' : ''}`}>
          🌙
        </span>
        <span className={`theme-icon ${theme === 'vibelook' ? 'active' : ''}`}>
          ✨
        </span>
      </div>
    </button>
  )
}


