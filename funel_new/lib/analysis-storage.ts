/**
 * In-memory storage для результатов анализа
 * Хранит результаты по session_id с автоматической очисткой старых записей
 */

interface AnalysisResult {
  session_id: string
  status: 'processing' | 'completed' | 'error'
  result_url?: string
  error?: string
  createdAt: number
}

// Map для хранения результатов: session_id -> AnalysisResult
const resultsStorage = new Map<string, AnalysisResult>()

// TTL для результатов (10 минут)
const RESULT_TTL = 10 * 60 * 1000

// Очистка старых записей каждые 5 минут
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(resultsStorage.entries())
  for (const [sessionId, result] of entries) {
    if (now - result.createdAt > RESULT_TTL) {
      resultsStorage.delete(sessionId)
      console.log(`Cleaned up old result for session: ${sessionId}`)
    }
  }
}, 5 * 60 * 1000)

/**
 * Сохраняет результат анализа
 */
export function saveAnalysisResult(
  sessionId: string,
  status: 'completed' | 'error',
  resultUrl?: string,
  error?: string
): void {
  resultsStorage.set(sessionId, {
    session_id: sessionId,
    status,
    result_url: resultUrl,
    error,
    createdAt: Date.now(),
  })
  console.log(`Saved analysis result for session: ${sessionId}, status: ${status}`)
}

/**
 * Получает результат анализа по session_id
 */
export function getAnalysisResult(sessionId: string): AnalysisResult | null {
  const result = resultsStorage.get(sessionId)
  if (!result) {
    return null
  }

  // Проверяем TTL
  if (Date.now() - result.createdAt > RESULT_TTL) {
    resultsStorage.delete(sessionId)
    return null
  }

  return result
}

/**
 * Создает начальную запись для session_id (status: processing)
 */
export function createAnalysisSession(sessionId: string): void {
  resultsStorage.set(sessionId, {
    session_id: sessionId,
    status: 'processing',
    createdAt: Date.now(),
  })
  console.log(`Created analysis session: ${sessionId}`)
}

/**
 * Проверяет, существует ли сессия
 */
export function hasAnalysisSession(sessionId: string): boolean {
  return resultsStorage.has(sessionId)
}

