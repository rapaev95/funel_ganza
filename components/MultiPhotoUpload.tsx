'use client'

import { useRef, useState } from 'react'

interface MultiPhotoUploadProps {
  onFilesSelect: (files: File[]) => void
  selectedFiles: File[]
}

export function MultiPhotoUpload({ onFilesSelect, selectedFiles }: MultiPhotoUploadProps) {
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null])

  const handleClick = (index: number) => {
    fileInputRefs[index].current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFiles = [...selectedFiles]
      newFiles[index] = file
      onFilesSelect(newFiles)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...previews]
        newPreviews[index] = reader.result as string
        setPreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const newFiles = [...selectedFiles]
    newFiles[index] = null as any
    onFilesSelect(newFiles.filter(f => f !== null))

    const newPreviews = [...previews]
    newPreviews[index] = null
    setPreviews(newPreviews)
  }

  const photoLabels = [
    'Фото 1: Лицо анфас',
    'Фото 2: Лицо в профиль',
    'Фото 3: Фото по пояс',
  ]

  return (
    <div className="multi-photo-upload">
      {[0, 1, 2].map((index) => (
        <div key={index} className="photo-upload-item">
          <label className="photo-label">{photoLabels[index]}</label>
          <div
            className={`upload-area ${selectedFiles[index] ? 'has-file' : ''}`}
            onClick={() => handleClick(index)}
          >
            {previews[index] ? (
              <div className="photo-preview-wrapper">
                <img src={previews[index]!} alt={`Preview ${index + 1}`} />
                <button
                  className="remove-photo-btn"
                  onClick={(e) => handleRemove(index, e)}
                  aria-label="Удалить фото"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="icon">📸</div>
                <p>Нажми, чтобы выбрать фото</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRefs[index]}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, index)}
            style={{ display: 'none' }}
          />
        </div>
      ))}
    </div>
  )
}


