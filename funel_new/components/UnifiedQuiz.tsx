'use client'

import { useRef, useState } from 'react'
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
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Quiz answers
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [budgetPreference, setBudgetPreference] = useState(50)

  const stepData = [
    {
      step: 1,
      title: 'Вопросы',
      description: 'Ответь на несколько вопросов',
      icon: '📝',
    },
    {
      step: 2,
      title: 'Селфи',
      description: 'Загрузи селфи',
      icon: '📸',
    },
    {
      step: 3,
      title: 'В полный рост',
      description: 'Загрузи фото в полный рост',
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

        // УБИРАЕМ автоматический переход - пользователь сам нажмет кнопку
        // Автоматический переход вызывал конфликт с кнопкой "Продолжить"
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

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Защита от повторной отправки
    if (isSubmitting) {
      return
    }
    
    // Завершение квиза после загрузки всех фото
    const validFiles = selectedFiles.filter(f => f !== null && f !== undefined)
    if (currentStep === 3 && validFiles.length === 2 && age && gender) {
      setIsSubmitting(true)
      onComplete({
        files: validFiles as File[],
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
            <label className="question-label-compact">Возраст</label>
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
            <label className="question-label-compact">Пол</label>
            <div className="radio-group radio-group-compact">
              {[
                { value: 'male', label: 'Мужской' },
                { value: 'female', label: 'Женский' },
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (questionsCompleted) {
                setCurrentStep(2)
              }
            }}
            className="btn-primary"
            disabled={!questionsCompleted}
          >
            Продолжить
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
                  aria-label="Удалить фото"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="icon">{currentStepData.icon}</div>
                <p>{currentStepData.description}</p>
                <p className="upload-hint">Нажми, чтобы загрузить фото</p>
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
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Добавляем проверку, чтобы избежать двойного клика
                if (selectedFiles[0]) {
                  setCurrentStep(3)
                }
              }}
            >
              Продолжить
            </button>
          )}
        </div>
        </>
      ) : null}

      {/* Индикатор завершения фото */}
      {currentStep === 3 && selectedFiles.filter(f => f !== null && f !== undefined).length === 2 && (
        <div className="quiz-completed">
          <div className="completed-icon">✓</div>
          <p>Фото загружены</p>
          <button
            onClick={(e) => handleNext(e)}
            className="btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: '12px' }}
          >
            {isSubmitting ? 'Отправка...' : 'Продолжить'}
          </button>
        </div>
      )}
    </div>
  )
}
