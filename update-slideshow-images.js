const fs = require('fs');
const path = require('path');

// Путь к папке с цветотипами
const colorTypesDir = path.join(__dirname, 'фото', 'цветотипы');

// Сопоставление папок с HTML файлами
const seasonMapping = {
    'winter': 'season_winter.html',
    'spring': 'season_spring.html',
    'summer': 'season_summer.html',
    'autumn': 'season_autumn.html'
};

// Функция для получения всех изображений из папки
function getImagesFromFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        console.log(`Папка не найдена: ${folderPath}`);
        return [];
    }

    const files = fs.readdirSync(folderPath);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    return files
        .filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        })
        .map(file => `фото/цветотипы/${path.basename(folderPath)}/${file}`);
}

// Функция для обновления HTML файла
function updateHtmlFile(htmlFile, images, seasonName) {
    const htmlPath = path.join(__dirname, htmlFile);

    if (!fs.existsSync(htmlPath)) {
        console.log(`HTML файл не найден: ${htmlPath}`);
        return;
    }

    let content = fs.readFileSync(htmlPath, 'utf8');

    // Создаем JSON строку с изображениями
    const imagesJson = JSON.stringify(images);

    // Регулярное выражение для поиска data-images атрибута
    const dataImagesRegex = /data-images='[^']*'/;

    if (dataImagesRegex.test(content)) {
        // Заменяем существующий атрибут
        content = content.replace(dataImagesRegex, `data-images='${imagesJson}'`);
    } else {
        // Если атрибут не найден, ищем div с id="season-slideshow" и добавляем
        const slideshowDivRegex = /(<div id="season-slideshow"[^>]*)/;
        if (slideshowDivRegex.test(content)) {
            content = content.replace(
                slideshowDivRegex,
                `$1 data-images='${imagesJson}'`
            );
        }
    }

    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`✅ Обновлен ${htmlFile}: ${images.length} изображений`);
}

// Основная функция
function updateAllSeasons() {
    console.log('🔄 Сканирование папок с изображениями...\n');

    for (const [folder, htmlFile] of Object.entries(seasonMapping)) {
        const folderPath = path.join(colorTypesDir, folder);
        const images = getImagesFromFolder(folderPath);

        if (images.length > 0) {
            const seasonNames = {
                'winter': 'Зима',
                'spring': 'Весна',
                'summer': 'Лето',
                'autumn': 'Осень'
            };
            updateHtmlFile(htmlFile, images, seasonNames[folder]);
        } else {
            console.log(`⚠️  Нет изображений в папке: ${folder}`);
        }
    }

    console.log('\n✨ Готово! Все HTML файлы обновлены.');
}

// Запуск
updateAllSeasons();
