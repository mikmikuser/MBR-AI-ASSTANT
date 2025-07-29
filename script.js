// Constants and Variables
const UPDATE_INTERVAL = 1000; // 1 second

// DOM Elements
const timeElement = document.getElementById('current-time');
const userElement = document.getElementById('currentUser');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const responseArea = document.getElementById('responseArea');
const modelSelect = document.getElementById('modelSelect');

// Update current time
function updateTime() {
    const now = new Date();
    const formattedTime = now.toISOString()
        .replace('T', ' ')
        .replace(/\.\d+Z$/, '');
    timeElement.textContent = `UTC: ${formattedTime}`;
}

// Initialize time and start update interval
updateTime();
setInterval(updateTime, UPDATE_INTERVAL);

// AI Response Generator (Example functionality)
async function generateAIResponse() {
    const models = {
        'gpt4': 'GPT-4',
        'gpt3': 'GPT-3.5',
        'codex': 'Codex'
    };
    
    const selectedModel = models[modelSelect.value];
    responseArea.textContent = 'Generating response...';
    
    try {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        responseArea.textContent = `Response generated using ${selectedModel}: \n` +
            'This is a sample AI response. In a real implementation, ' +
            'this would be connected to your Godot AI Assistant backend.';
            
    } catch (error) {
        responseArea.textContent = 'Error generating response. Please try again.';
        console.error('Generation error:', error);
    }
}

// Clear response area
function clearResponse() {
    responseArea.textContent = 'Waiting for input...';
}

// Event Listeners
generateBtn.addEventListener('click', generateAIResponse);
clearBtn.addEventListener('click', clearResponse);

// Model selection change handler
modelSelect.addEventListener('change', () => {
    console.log(`AI model changed to: ${modelSelect.value}`);
});

// Error Handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error: ', msg, '\nURL: ', url, '\nLine: ', lineNo, '\nColumn: ', columnNo, '\nError object: ', error);
    return false;
};

// Initialize user display
document.addEventListener('DOMContentLoaded', () => {
    // You can replace this with actual user authentication
    userElement.textContent = 'mikmikuser';
});

// Add simple keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + G to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        generateAIResponse();
    }
    // Ctrl/Cmd + L to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        clearResponse();
    }
});