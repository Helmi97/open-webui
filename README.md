# OpenWebUI Chrome Extension 👋

Bring Open WebUI into Chrome so you can chat with your models without leaving the page.

## What it does
- Connects to the same backends you already use (Ollama or any OpenAI-compatible API).
- Keeps chats, files, and RAG snippets together with full Markdown and LaTeX rendering.
- Supports voice, images, and multimodal prompts with configurable providers.
- Respects roles and permissions you define in Open WebUI.
- Works on desktop and mobile with responsive UI and PWA support.

![Open WebUI Demo](./demo.gif)

## Quick start
1. Run or pick an Open WebUI backend.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev -- --host`.
4. Open `http://localhost:5173/?backend=http://localhost:8080` (replace with your backend).

### Production build
1. `npm install`
2. `npm run build`
3. Serve the `build/` directory with any static host or CDN.
4. Provide your backend via `?backend=<url>` or set `VITE_WEBUI_BACKEND_URL` before building.

### Docker
```bash
docker build -t open-webui-frontend .
docker run -d -p 3000:80 -e VITE_WEBUI_BACKEND_URL=https://api.example.com open-webui-frontend
```

## Troubleshooting
- If the UI cannot reach your backend, verify the `backend` query parameter or `VITE_WEBUI_BACKEND_URL` setting.
- When hosting behind a path prefix, ensure requests rewrite to `index.html` so routes resolve.

## License
This project includes code under the Open WebUI License and prior contributions under their original licenses. See [LICENSE](./LICENSE) and [LICENSE_HISTORY](./LICENSE_HISTORY) for details.

## Support
Questions or ideas? Open an issue or join our [Discord](https://discord.gg/5rJgQTnV4s).
