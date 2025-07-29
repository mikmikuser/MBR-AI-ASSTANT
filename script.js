// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const tokenValue = document.getElementById('tokenValue');
const tokenHistory = document.getElementById('tokenHistory');

// Update UTC time
function updateTime() {
    const now = new Date();
    const formatted = now.toISOString()
        .replace('T', ' ')
        .replace(/\.\d+Z$/, '');
    currentTimeElement.textContent = `UTC: ${formatted}`;
}

setInterval(updateTime, 1000);
updateTime();

// Token generation
document.getElementById('generateToken').addEventListener('click', async () => {
    try {
        const token = await generateNewToken();
        tokenValue.textContent = token;
        await saveTokenToHistory(token);
        loadTokenHistory();
    } catch (error) {
        console.error('Token generation failed:', error);
        alert('Failed to generate token. Please try again.');
    }
});

// Copy token to clipboard
document.getElementById('copyToken').addEventListener('click', () => {
    const token = tokenValue.textContent;
    if (token && token !== 'Click generate to create token') {
        navigator.clipboard.writeText(token)
            .then(() => {
                const button = document.getElementById('copyToken');
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            })
            .catch(error => console.error('Copy failed:', error));
    }
});

// Token generation function
async function generateNewToken() {
    // Generate a secure token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Add timestamp
    const timestamp = Date.now();
    const finalToken = `${token}-${timestamp}`;
    
    return finalToken;
}

// Save token to history
async function saveTokenToHistory(token) {
    const history = JSON.parse(localStorage.getItem('tokens') || '[]');
    history.unshift({
        token,
        created: new Date().toISOString(),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    // Keep only last 5 tokens
    if (history.length > 5) history.pop();
    
    localStorage.setItem('tokens', JSON.stringify(history));
}

// Load token history
function loadTokenHistory() {
    const history = JSON.parse(localStorage.getItem('tokens') || '[]');
    tokenHistory.innerHTML = history.map(entry => `
        <li>
            <span class="token-value">${entry.token.slice(0, 20)}...</span>
            <span class="token-date">Created: ${new Date(entry.created).toLocaleDateString()}</span>
        </li>
    `).join('');
}

// Local storage check
if (typeof Storage === 'undefined') {
    alert('Local storage is not supported by your browser. Token history will not be saved.');
}

// Initial load of token history
loadTokenHistory();