const tg = window.Telegram.WebApp;
tg.expand();

// Elements
const screenUpload = document.getElementById('screen-upload');
const screenLoader = document.getElementById('screen-loader');
const screenResult = document.getElementById('screen-result');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const btnAnalyze = document.getElementById('btn-analyze');
const btnRetry = document.getElementById('btn-retry');

// Config - REPLACE WITH YOUR N8N WEBHOOK URLs
const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';
const FB_EVENT_WEBHOOK_URL = 'YOUR_FB_EVENT_WEBHOOK_URL_HERE'; // For Facebook Conversion API

let selectedFile = null;

// Upload Interaction
uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        uploadArea.classList.add('has-file');
        uploadArea.querySelector('p').innerText = `Selected: ${selectedFile.name}`;
        btnAnalyze.disabled = false;
    }
});

// Function to send Facebook Event
async function sendFacebookEvent() {
    try {
        const user = tg.initDataUnsafe?.user;
        const eventData = {
            user_data: {
                name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
                email: user?.username ? `${user.username}@telegram.user` : '',
                phone: '',
                client_ip_address: '',
                client_user_agent: navigator.userAgent,
                facebook_click_id: '',
                facebook_browser_id: ''
            },
            event_name: 'Purchase',
            event_time: new Date().toISOString(),
            custom_data: {
                value: 127.9,
                currency: 'USD'
            },
            action_source: 'website',
            event_source_url: window.location.href
        };

        await fetch(FB_EVENT_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });

        console.log('Facebook event sent successfully');
    } catch (error) {
        console.error('Error sending Facebook event:', error);
        // Don't block the main flow if FB event fails
    }
}

// Analyze Action
btnAnalyze.addEventListener('click', async () => {
    if (!selectedFile) return;

    showScreen('loader');

    try {
        // Convert to Base64
        const base64 = await toBase64(selectedFile);

        // Send Facebook Event (don't wait for response)
        sendFacebookEvent();

        // Send to n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64,
                user_id: tg.initDataUnsafe?.user?.id,
                first_name: tg.initDataUnsafe?.user?.first_name
            })
        });

        const data = await response.json();

        // Show Result
        displayResult(data);
        showScreen('result');

    } catch (error) {
        console.error('Error:', error);
        alert('Ошибка анализа. Попробуйте позже.');
        showScreen('upload');
    }
});

btnRetry.addEventListener('click', () => {
    selectedFile = null;
    fileInput.value = '';
    uploadArea.classList.remove('has-file');
    uploadArea.querySelector('p').innerText = 'Нажми, чтобы выбрать фото';
    btnAnalyze.disabled = true;
    showScreen('upload');
});

// Helpers
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${screenName}`).classList.add('active');
}

function displayResult(data) {
    // data = { season: "Winter", product_image: "url", product_link: "url", description: "text" }
    document.getElementById('result-season').innerText = data.season || 'Unknown';
    document.getElementById('result-desc').innerText = data.description || 'Отличный выбор!';
    document.getElementById('product-image').src = data.product_image || 'https://via.placeholder.com/300';
    document.getElementById('btn-buy').href = data.product_link || '#';

    // Dynamic price if available
    if (data.price) {
        document.getElementById('product-price').innerText = data.price;
    }
}

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
