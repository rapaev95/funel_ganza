import React from 'react'

/**
 * Парсит текст с маркерами **текст** и преобразует их в JSX с <strong>
 * Пример: "Это **важный** текст" -> "Это <strong>важный</strong> текст"
 */
export function parseBoldText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Добавляем текст до маркера
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    // Добавляем жирный текст
    parts.push(<strong key={match.index}>{match[1]}</strong>)
    lastIndex = regex.lastIndex
  }

  // Добавляем оставшийся текст
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return parts.length > 0 ? <>{parts}</> : text
}

