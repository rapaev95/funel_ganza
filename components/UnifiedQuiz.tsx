'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { BudgetSlider } from './BudgetSlider'
import { PhotoInstructions } from './PhotoInstructions'

interface UnifiedQuizProps {
  onComplete: (data: {
    files: File[]
    age: string
    gender: string
    budgetPreference: number
  }) => void
}

type Step = 1 | 2 | 3

export function UnifiedQuiz({ onComplete }: UnifiedQuizProps) {
  const t = useTranslations('quiz')
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null])
  
  // Quiz answers
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [budgetPreference, setBudgetPreference] = useState(50)

  const stepData = [
    {
      step: 1,
      title: t('step1Title'),
      description: t('step1Desc'),
      icon: '📝',
    },
    {
      step: 2,
      title: t('step2Title'),
      description: t('step2Desc'),
      icon: '📸',
    },
    {
      step: 3,
      title: t('step3Title'),
      description: t('step3Desc'),
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
      // Шаг 2 = индекс 0 (селфи), Шаг 3 = индекс 1 (полный рост)
      newFiles[currentStep - 2] = file
      setSelectedFiles(newFiles)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...previews]
        newPreviews[currentStep - 2] = reader.result as string
        setPreviews(newPreviews)

        // Автоматически переходим к следующему шагу после загрузки селфи
        if (currentStep === 2) {
          setTimeout(() => {
            setCurrentStep(3)
          }, 500)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newFiles = [...selectedFiles]
    // Шаг 2 = индекс 0 (селфи), Шаг 3 = индекс 1 (полный рост)
    newFiles[currentStep - 2] = null as any
    setSelectedFiles(newFiles.filter(f => f !== null))

    const newPreviews = [...previews]
    newPreviews[currentStep - 2] = null
    setPreviews(newPreviews)
  }

  const handleStepClick = (step: Step) => {
    if (step === 1) {
      // Шаг 1 (вопросы) всегда доступен
      setCurrentStep(step)
    } else if (step === 2) {
      // Шаг 2 (селфи) доступен после ответа на вопросы
      if (age && gender) {
        setCurrentStep(step)
      }
    } else if (step === 3) {
      // Шаг 3 (полный рост) доступен после загрузки селфи
      if (selectedFiles[0]) {
        setCurrentStep(step)
      }
    }
  }

  const handleNext = () => {
    // Завершение квиза после загрузки всех фото
    if (currentStep === 3 && selectedFiles.filter(f => f !== null && f !== undefined).length === 2) {
      onComplete({
        files: selectedFiles.filter(f => f !== null && f !== undefined) as File[],
        age,
        gender,
        budgetPreference,
      })
    }
  }

  const currentStepData = stepData[currentStep - 1]
  const photosCompleted = selectedFiles.filter(f => f !== null && f !== undefined).length === 2
  const questionsCompleted = !!(age && gender)

  return (
    <div className="quiz-photo-upload">
      {/* Прогресс-бар шагов */}
      <div className="quiz-steps">
        {stepData.map((step) => {
          let isDone = false
          if (step.step === 1) {
            isDone = questionsCompleted
          } else if (step.step === 2) {
            isDone = selectedFiles[0] !== null && selectedFiles[0] !== undefined
          } else if (step.step === 3) {
            isDone = selectedFiles[1] !== null && selectedFiles[1] !== undefined
          }

          const isActive = currentStep === step.step
          let isClickable = false
          if (step.step === 1) {
            isClickable = true // Вопросы всегда доступны
          } else if (step.step === 2) {
            isClickable = questionsCompleted // Селфи доступно после вопросов
          } else if (step.step === 3) {
            isClickable = selectedFiles[0] !== null && selectedFiles[0] !== undefined // Полный рост после селфи
          }

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

      {/* Контент текущего шага */}
      {currentStep === 1 ? (
        // Шаг 1: Вопросы
        <div className="quiz-questions-compact">
          {/* Возраст */}
          <div className="question-group-compact">
            <label className="question-label-compact">{t('questions.age')}</label>
            <div className="radio-group radio-group-compact">
              {['18-25', '26-35', '36-45', '45+'].map((ageOption) => (
                <label key={ageOption} className="radio-option radio-option-compact">
                  <input
                    type="radio"
                    name="age"
                    value={ageOption}
                    checked={age === ageOption}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <span>{ageOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Пол */}
          <div className="question-group-compact">
            <label className="question-label-compact">{t('questions.gender')}</label>
            <div className="radio-group radio-group-compact">
              {[
                { value: 'male', label: t('questions.genderMale') },
                { value: 'female', label: t('questions.genderFemale') },
              ].map((genderOption) => (
                <label key={genderOption.value} className="radio-option radio-option-compact">
                  <input
                    type="radio"
                    name="gender"
                    value={genderOption.value}
                    checked={gender === genderOption.value}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <span>{genderOption.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ползунок бюджета */}
          <div className="question-group-compact">
            <BudgetSlider value={budgetPreference} onChange={setBudgetPreference} />
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            className="btn-primary"
            disabled={!questionsCompleted}
          >
            {t('questions.continue')}
          </button>
        </div>
      ) : currentStep === 2 || currentStep === 3 ? (
        // Шаги 2-3: Загрузка фото
        <>
          <PhotoInstructions />
          <div className="quiz-upload-area">
          <div
            className={`upload-area ${selectedFiles[currentStep - 2] ? 'has-file' : ''}`}
            onClick={handleClick}
          >
            {previews[currentStep - 2] ? (
              <div className="photo-preview-wrapper">
                <img src={previews[currentStep - 2]!} alt={`Preview ${currentStep}`} />
                <button
                  className="remove-photo-btn"
                  onClick={handleRemove}
                  aria-label={t('removePhoto')}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="icon">{currentStepData.icon}</div>
                <p>{currentStepData.description}</p>
                <p className="upload-hint">{t('uploadHint')}</p>
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

          {/* Кнопка "Далее" после загрузки селфи */}
          {selectedFiles[0] && currentStep === 2 && (
            <button
              className="btn-next-step"
              onClick={() => setCurrentStep(3)}
            >
              {t('continueButton')}
            </button>
          )}
        </div>
        </>
      ) : null}

      {/* Индикатор завершения фото */}
      {currentStep === 3 && selectedFiles.filter(f => f !== null && f !== undefined).length === 2 && (
        <div className="quiz-completed">
          <div className="completed-icon">✓</div>
          <p>{t('photosCompleted')}</p>
          <button
            onClick={handleNext}
            className="btn-primary"
            style={{ marginTop: '12px' }}
          >
            {t('questions.continue')}
          </button>
        </div>
      )}
    </div>
  )
}

