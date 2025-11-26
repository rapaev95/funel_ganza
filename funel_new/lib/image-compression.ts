/**
 * Сжимает изображение на клиенте перед отправкой
 * @param file - исходный файл изображения
 * @param maxWidth - максимальная ширина (по умолчанию 1920px)
 * @param quality - качество JPEG (0.0 - 1.0, по умолчанию 0.8)
 * @returns Promise<File> - сжатый файл
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        // Создаем canvas для сжатия
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        // Рисуем изображение на canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // Конвертируем в Blob с сжатием
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'))
              return
            }
            
            // Создаем новый File из Blob
            const compressedFile = new File(
              [blob],
              file.name,
              {
                type: 'image/jpeg', // Всегда конвертируем в JPEG для лучшего сжатия
                lastModified: Date.now(),
              }
            )
            
            console.log(`Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
            resolve(compressedFile)
          },
          'image/jpeg', // Формат JPEG для лучшего сжатия
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image'))
      }
      
      if (e.target?.result) {
        img.src = e.target.result as string
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

/**
 * Сжимает массив изображений
 * @param files - массив файлов изображений
 * @param maxWidth - максимальная ширина
 * @param quality - качество JPEG
 * @returns Promise<File[]> - массив сжатых файлов
 */
export async function compressImages(
  files: File[],
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File[]> {
  return Promise.all(files.map(file => compressImage(file, maxWidth, quality)))
}

