'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface QuizPhotoUploadProps {
  onFilesSelect: (files: File[]) => void
  selectedFiles: File[]
}

type Step = 1 | 2

export function QuizPhotoUpload({ onFilesSelect, selectedFiles }: QuizPhotoUploadProps) {
  const t = useTranslations()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<(string | null)[]>([null, null])

  const stepData = [
    {
      step: 1,
      title: t('quiz.step1Title'),
      description: t('quiz.step1Desc'),
      icon: '📸',
    },
    {
      step: 2,
      title: t('quiz.step2Title'),
      description: t('quiz.step2Desc'),
      icon: '👤',
    },
  ]

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFiles = [...selectedFiles]
      newFiles[currentStep - 1] = file
      onFilesSelect(newFiles)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...previews]
        newPreviews[currentStep - 1] = reader.result as string
        setPreviews(newPreviews)

        // Автоматически переходим к следующему шагу, если это не последний
        if (currentStep < 2) {
          setTimeout(() => {
            setCurrentStep((currentStep + 1) as Step)
          }, 500)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newFiles = [...selectedFiles]
    newFiles[currentStep - 1] = null as any
    onFilesSelect(newFiles.filter(f => f !== null))

    const newPreviews = [...previews]
    newPreviews[currentStep - 1] = null
    setPreviews(newPreviews)
  }

  const handleStepClick = (step: Step) => {
    if (selectedFiles[step - 1] || step <= currentStep) {
      setCurrentStep(step)
    }
  }

  const currentStepData = stepData[currentStep - 1]
  const isCompleted = selectedFiles.filter(f => f !== null && f !== undefined).length === 2

  return (
    <div className="quiz-photo-upload">
      {/* Прогресс-бар шагов */}
      <div className="quiz-steps">
        {stepData.map((step, index) => {
          const isActive = currentStep === step.step
          const isDone = selectedFiles[step.step - 1] !== null && selectedFiles[step.step - 1] !== undefined
          const isClickable = isDone || step.step <= currentStep

          return (
            <div
              key={step.step}
              className={`quiz-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''} ${isClickable ? 'clickable' : ''}`}
              onClick={() => isClickable && handleStepClick(step.step as Step)}
            >
              <div className="step-number">
                {isDone ? '✓' : step.step}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                {isActive && <div className="step-description">{step.description}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Область загрузки текущего шага */}
      <div className="quiz-upload-area">
        <div
          className={`upload-area ${selectedFiles[currentStep - 1] ? 'has-file' : ''}`}
          onClick={handleClick}
        >
          {previews[currentStep - 1] ? (
            <div className="photo-preview-wrapper">
              <img src={previews[currentStep - 1]!} alt={`Preview ${currentStep}`} />
              <button
                className="remove-photo-btn"
                onClick={handleRemove}
                aria-label="Удалить фото"
              >
                ×
              </button>
            </div>
          ) : (
            <>
              <div className="icon">{currentStepData.icon}</div>
              <p>{currentStepData.description}</p>
              <p className="upload-hint">{t('quiz.uploadHint')}</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Кнопка "Далее" после загрузки первого фото */}
        {selectedFiles[0] && currentStep === 1 && (
          <button
            className="btn-next-step"
            onClick={() => setCurrentStep(2)}
          >
            {t('quiz.continueButton')}
          </button>
        )}
      </div>

      {/* Индикатор завершения */}
      {isCompleted && (
        <div className="quiz-completed">
          <div className="completed-icon">✓</div>
          <p>{t('quiz.completed')}</p>
        </div>
      )}
    </div>
  )
}

