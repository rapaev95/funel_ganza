const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'фото');
const destDir = path.join(__dirname, '..', 'public', 'фото');

// Создаем папку public если её нет
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✓ Папка public создана');
}

// Функция для копирования директории
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Копируем файлы
if (fs.existsSync(sourceDir)) {
  console.log('📁 Копирование файлов из фото в public/фото...');
  copyDir(sourceDir, destDir);
  console.log('✓ Файлы скопированы в public/фото/');
  
  // Удаляем исходную папку
  console.log('🗑️  Удаление исходной папки фото...');
  fs.rmSync(sourceDir, { recursive: true, force: true });
  console.log('✅ Готово! Папка фото перемещена в public/фото/');
} else {
  console.log('❌ Папка фото не найдена!');
  if (fs.existsSync(destDir)) {
    console.log('ℹ️  Папка public/фото уже существует. Возможно, файлы уже перемещены.');
  }
  process.exit(1);
}


