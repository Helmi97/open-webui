import { browser, dev } from '$app/environment';
import { base } from '$app/paths';
// import { version } from '../../package.json';

export const APP_NAME = 'Open WebUI';

const BACKEND_PARAM_KEYS = ['backend', 'backend_url', 'backendUrl'];
const BACKEND_STORAGE_KEY = 'webui:backend-url';

const normalizeUrl = (url: string) => url.replace(/\/+$/, '');

const getBackendBaseUrl = () => {
        if (!browser) return '';

        const params = new URLSearchParams(window.location.search);
        const paramUrl = BACKEND_PARAM_KEYS.map((key) => params.get(key)).find(Boolean)?.trim();
        const envUrl = (import.meta.env.VITE_WEBUI_BACKEND_URL as string | undefined)?.trim();
        const storedUrl = localStorage.getItem(BACKEND_STORAGE_KEY) ?? '';
        const fallbackUrl = dev ? `http://${location.hostname}:8080` : window.location.origin;

        const resolvedUrl = normalizeUrl(paramUrl || envUrl || storedUrl || fallbackUrl);

        if (paramUrl) {
                localStorage.setItem(BACKEND_STORAGE_KEY, resolvedUrl);
        }

        return resolvedUrl;
};

export const APP_BASE_URL = base || '';
export const WEBUI_BASE_URL = getBackendBaseUrl();
export const WEBUI_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1`;

export const OLLAMA_API_BASE_URL = `${WEBUI_BASE_URL}/ollama`;
export const OPENAI_API_BASE_URL = `${WEBUI_BASE_URL}/openai`;
export const AUDIO_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/audio`;
export const IMAGES_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/images`;
export const RETRIEVAL_API_BASE_URL = `${WEBUI_BASE_URL}/api/v1/retrieval`;

export const WEBUI_VERSION = APP_VERSION;
export const WEBUI_BUILD_HASH = APP_BUILD_HASH;
export const REQUIRED_OLLAMA_VERSION = '0.1.16';

export const SUPPORTED_FILE_TYPE = [
	'application/epub+zip',
	'application/pdf',
	'text/plain',
	'text/csv',
	'text/xml',
	'text/html',
	'text/x-python',
	'text/css',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/octet-stream',
	'application/x-javascript',
	'text/markdown',
	'audio/mpeg',
	'audio/wav',
	'audio/ogg',
	'audio/x-m4a'
];

export const SUPPORTED_FILE_EXTENSIONS = [
	'md',
	'rst',
	'go',
	'py',
	'java',
	'sh',
	'bat',
	'ps1',
	'cmd',
	'js',
	'ts',
	'css',
	'cpp',
	'hpp',
	'h',
	'c',
	'cs',
	'htm',
	'html',
	'sql',
	'log',
	'ini',
	'pl',
	'pm',
	'r',
	'dart',
	'dockerfile',
	'env',
	'php',
	'hs',
	'hsc',
	'lua',
	'nginxconf',
	'conf',
	'm',
	'mm',
	'plsql',
	'perl',
	'rb',
	'rs',
	'db2',
	'scala',
	'bash',
	'swift',
	'vue',
	'svelte',
	'doc',
	'docx',
	'pdf',
	'csv',
	'txt',
	'xls',
	'xlsx',
	'pptx',
	'ppt',
	'msg'
];

export const PASTED_TEXT_CHARACTER_LIMIT = 1000;

// Source: https://kit.svelte.dev/docs/modules#$env-static-public
// This feature, akin to $env/static/private, exclusively incorporates environment variables
// that are prefixed with config.kit.env.publicPrefix (usually set to PUBLIC_).
// Consequently, these variables can be securely exposed to client-side code.
