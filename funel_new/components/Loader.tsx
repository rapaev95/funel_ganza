'use client'

export function Loader() {
  return (
    <div className="screen">
      <div className="loader"></div>
      <p>Анализируем твои фото...</p>
      <p className="text-secondary" style={{ marginTop: '10px', fontSize: '14px' }}>
        Это может занять несколько минут
      </p>
    </div>
  )
}
