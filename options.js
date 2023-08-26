// Saves options to chrome.storage
const saveOptions = () => {
    const RAPID_API_KEY = document.getElementById('api_key_text_box').value;


    chrome.storage.sync.set(
        { RAPID_API_KEY: RAPID_API_KEY},
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        }
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        { RAPID_API_KEY: ''},
        (items) => {
            items.RAPID_API_KEY;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);