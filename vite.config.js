import { fileURLToPath } from "url";
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { crx } from '@crxjs/vite-plugin'

// import manifest from './manifest.json'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const manifest = {
  "manifest_version": 3,
  "name": "My New Tab Extension",
  "description": "A custom new tab page built with Vite and React.",
  "version": "1.0.0",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": ["storage"],
  "chrome_url_overrides": {
    "newtab": "index.html"
  },
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';"
  },
  
}


export default defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});