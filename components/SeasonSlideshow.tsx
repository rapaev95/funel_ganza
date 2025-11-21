'use client'

import { useState, useEffect } from 'react'

interface SeasonSlideshowProps {
  season: string
  images: string[]
}

export function SeasonSlideshow({ season, images }: SeasonSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (images.length === 0 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [images.length, isPaused])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div
      className="slideshow-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slideshow-images">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Пример ${season} ${index + 1}`}
            className={`slideshow-image ${index === currentIndex ? 'active' : ''}`}
            loading="lazy"
          />
        ))}
      </div>
      <button
        className="slideshow-btn slideshow-prev"
        onClick={prev}
        aria-label="Предыдущее фото"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className="slideshow-btn slideshow-next"
        onClick={next}
        aria-label="Следующее фото"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`slideshow-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Перейти к фото ${index + 1}`}
          />
        ))}
      </div>
      <div className="slideshow-counter">
        <span className="current">{currentIndex + 1}</span> /{' '}
        <span className="total">{images.length}</span>
      </div>
    </div>
  )
}


