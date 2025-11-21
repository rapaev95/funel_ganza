'use client'

import { useRef, useState } from 'react'

interface PhotoUploadProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
}

export function PhotoUpload({ onFileSelect, selectedFile }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <div
        className={`upload-area ${selectedFile ? 'has-file' : ''}`}
        onClick={handleClick}
      >
        {preview ? (
          <img src={preview} alt="Preview" />
        ) : (
          <>
            <div className="icon">📸</div>
            <p>{selectedFile ? `Выбрано: ${selectedFile.name}` : 'Нажми, чтобы выбрать фото'}</p>
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
    </>
  )
}


