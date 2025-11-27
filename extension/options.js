const form = document.querySelector('#options-form');
const backendInput = document.querySelector('#backend-url');
const status = document.querySelector('#options-status');

const load = async () => {
  const stored = await chrome.storage.sync.get('backendUrl');
  if (stored.backendUrl) {
    backendInput.value = stored.backendUrl;
  }
};

const save = async (value) => {
  await chrome.storage.sync.set({ backendUrl: value });
  status.textContent = 'Saved! The side panel will use this URL for new messages.';
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const value = backendInput.value.trim();
  if (!value) {
    status.textContent = 'Please provide a backend URL.';
    backendInput.focus();
    return;
  }

  try {
    new URL(value);
  } catch {
    status.textContent = 'That is not a valid URL.';
    backendInput.focus();
    return;
  }

  await save(value);
});

load();
