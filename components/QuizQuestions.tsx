'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { BudgetSlider } from './BudgetSlider'

interface QuizQuestionsProps {
  onComplete: (answers: {
    age: string
    gender: string
    budgetPreference: number
  }) => void
}

export function QuizQuestions({ onComplete }: QuizQuestionsProps) {
  const t = useTranslations()
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [budgetPreference, setBudgetPreference] = useState(50)

  const handleContinue = () => {
    if (age && gender) {
      onComplete({
        age,
        gender,
        budgetPreference,
      })
    }
  }

  const isComplete = age && gender

  return (
    <div className="quiz-questions">
      <div className="questions-header">
        <h2>{t('title')}</h2>
        <p className="questions-subtitle">{t('subtitle')}</p>
      </div>

      <div className="questions-content">
        {/* Возраст */}
        <div className="question-group">
          <label className="question-label">{t('age')}</label>
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
        <div className="question-group">
          <label className="question-label">{t('gender')}</label>
          <div className="radio-group radio-group-compact">
            {[
              { value: 'male', label: t('genderMale') },
              { value: 'female', label: t('genderFemale') },
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
        <div className="question-group">
          <BudgetSlider value={budgetPreference} onChange={setBudgetPreference} />
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="btn-primary"
        disabled={!isComplete}
      >
        {t('continue')}
      </button>
    </div>
  )
}

