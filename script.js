// Firebase configuration
const firebaseConfig = {
    // Your Firebase config here
    // Get this from Firebase Console
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM Elements
const currentTimeElement = document.getElementById('current-time');
const loginSection = document.getElementById('loginSection');
const tokenSection = document.getElementById('tokenSection');
const userNameElement = document.getElementById('userName');
const userAvatarElement = document.getElementById('userAvatar');
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

// Authentication state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        loginSection.classList.add('hidden');
        tokenSection.classList.remove('hidden');
        userNameElement.textContent = user.displayName || user.email;
        userAvatarElement.src = user.photoURL || 'default-avatar.png';
        loadTokenHistory(user.uid);
    } else {
        // User is signed out
        loginSection.classList.remove('hidden');
        tokenSection.classList.add('hidden');
    }
});

// Social login handlers
document.getElementById('googleLogin').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(handleAuthError);
});

document.getElementById('githubLogin').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();
    auth.signInWithPopup(provider).catch(handleAuthError);
});

document.getElementById('fbLogin').addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider).catch(handleAuthError);
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().catch(handleAuthError);
});

// Token generation
document.getElementById('generateToken').addEventListener('click', async () => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');

        const token = await generateNewToken(user.uid);
        tokenValue.textContent = token;
        await saveTokenToHistory(user.uid, token);
        loadTokenHistory(user.uid);
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
async function generateNewToken(userId) {
    // Generate a secure token
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Add timestamp and user identifier
    const timestamp = Date.now();
    const finalToken = `${token}-${timestamp}-${userId.slice(0, 8)}`;
    
    return finalToken;
}

// Save token to history (using localStorage for demo)
async function saveTokenToHistory(userId, token) {
    const history = JSON.parse(localStorage.getItem(`tokens_${userId}`) || '[]');
    history.unshift({
        token,
        created: new Date().toISOString(),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });
    
    // Keep only last 5 tokens
    if (history.length > 5) history.pop();
    
    localStorage.setItem(`tokens_${userId}`, JSON.stringify(history));
}

// Load token history
function loadTokenHistory(userId) {
    const history = JSON.parse(localStorage.getItem(`tokens_${userId}`) || '[]');
    tokenHistory.innerHTML = history.map(entry => `
        <li>
            <span class="token-value">${entry.token.slice(0, 20)}...</span>
            <span class="token-date">Created: ${new Date(entry.created).toLocaleDateString()}</span>
        </li>
    `).join('');
}

// Error handler
function handleAuthError(error) {
    console.error('Auth error:', error);
    alert(`Authentication error: ${error.message}`);
}

// Local storage check
if (typeof Storage === 'undefined') {
    alert('Local storage is not supported by your browser. Token history will not be saved.');
}
