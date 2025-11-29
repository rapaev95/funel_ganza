# Скрипт для копирования переменных окружения из funel_new в seller
# Использование: .\scripts\copy-env.ps1

$sourceEnv = "..\funel_new\.env.development.local"
$targetEnv = ".env.local"

if (-not (Test-Path $sourceEnv)) {
    Write-Host "Файл $sourceEnv не найден!" -ForegroundColor Red
    exit 1
}

Write-Host "Читаю переменные из $sourceEnv..." -ForegroundColor Yellow

# Читаем исходный файл
$envContent = Get-Content $sourceEnv

# Переменные, которые нужно скопировать
$neededVars = @(
    "TELEGRAM_BOT_TOKEN",
    "NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SUPABASE_URL"
)

$newContent = @()
$newContent += "# Copied from funel_new/.env.development.local"
$newContent += "# Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$newContent += ""

$foundVars = @{}

# Ищем нужные переменные
foreach ($line in $envContent) {
    $trimmedLine = $line.Trim()
    
    # Пропускаем пустые строки и комментарии
    if ([string]::IsNullOrWhiteSpace($trimmedLine) -or $trimmedLine.StartsWith("#")) {
        continue
    }
    
    # Проверяем, содержит ли строка нужную переменную
    foreach ($var in $neededVars) {
        if ($trimmedLine.StartsWith("$var=")) {
            $foundVars[$var] = $true
            $newContent += $line
            Write-Host "  Найдено: $var" -ForegroundColor Green
            break
        }
    }
}

# Проверяем, какие переменные не найдены
$missingVars = @()
foreach ($var in $neededVars) {
    if (-not $foundVars.ContainsKey($var)) {
        $missingVars += $var
    }
}

# Добавляем недостающие переменные с комментариями
if ($missingVars.Count -gt 0) {
    $newContent += ""
    $newContent += "# Переменные, которые нужно заполнить вручную:"
    foreach ($var in $missingVars) {
        if ($var -eq "NEXT_PUBLIC_TELEGRAM_WIDGET_BOT_USERNAME") {
            $newContent += "$var=vibelook_bot"
        } else {
            $newContent += "# $var=your-value-here"
        }
    }
}

# Записываем в целевой файл
$newContent | Out-File -FilePath $targetEnv -Encoding utf8

Write-Host ""
Write-Host "Файл $targetEnv создан!" -ForegroundColor Green
Write-Host "Найдено переменных: $($foundVars.Count)/$($neededVars.Count)" -ForegroundColor Cyan

if ($missingVars.Count -gt 0) {
    Write-Host "Недостающие переменные:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "  - $var" -ForegroundColor Yellow
    }
}

