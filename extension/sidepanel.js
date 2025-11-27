const statusEl = document.querySelector('#status');
const messagesEl = document.querySelector('#messages');
const formEl = document.querySelector('#chat-form');
const messageInput = document.querySelector('#message-input');
const template = document.querySelector('#message-template');

let backendUrl = '';

const formatTime = (date = new Date()) =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

const setStatus = (text, tone = 'info') => {
  statusEl.textContent = text;
  statusEl.dataset.tone = tone;
};

const createMessage = (author, content) => {
  const node = template.content.cloneNode(true);
  node.querySelector('.author').textContent = author;
  node.querySelector('.time').textContent = formatTime();
  node.querySelector('.content').textContent = content;
  return node;
};

const addMessage = (author, content) => {
  messagesEl.appendChild(createMessage(author, content));
  messagesEl.scrollTop = messagesEl.scrollHeight;
};

const loadBackendUrl = async () => {
  const stored = await chrome.storage.sync.get('backendUrl');
  backendUrl = stored.backendUrl || '';

  if (!backendUrl) {
    setStatus('Set a backend URL in the options page to start chatting.', 'warn');
    return;
  }

  setStatus(`Sending messages to ${backendUrl}`);
};

const handleError = (error) => {
  console.error(error);
  setStatus('Could not reach the backend. Check the URL and try again.', 'error');
};

const sendMessage = async (text) => {
  if (!backendUrl) {
    setStatus('Set a backend URL in the options page to start chatting.', 'warn');
    return;
  }

  setStatus('Waiting for the backend...');

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply || data.message || data.response || 'No response provided.';
    addMessage('Backend', reply);
    setStatus(`Last response received at ${formatTime()}`);
  } catch (error) {
    handleError(error);
    addMessage('Backend error', error.message || String(error));
  }
};

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage('You', text);
  messageInput.value = '';
  await sendMessage(text);
  messageInput.focus();
});

chrome.storage.sync.onChanged.addListener((changes) => {
  if (changes.backendUrl) {
    backendUrl = changes.backendUrl.newValue || '';
    if (backendUrl) {
      setStatus(`Sending messages to ${backendUrl}`);
    } else {
      setStatus('Set a backend URL in the options page to start chatting.', 'warn');
    }
  }
});

loadBackendUrl();
