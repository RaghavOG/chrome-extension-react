// vite.config.js
import { fileURLToPath } from "url";
import path from "path";
import react from "file:///C:/Users/Raghav%20Singla/Desktop/complete/extension-react/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/Raghav%20Singla/Desktop/complete/extension-react/node_modules/vite/dist/node/index.js";
import { crx } from "file:///C:/Users/Raghav%20Singla/Desktop/complete/extension-react/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/Raghav%20Singla/Desktop/complete/extension-react/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var manifest = {
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
  }
};
var vite_config_default = defineConfig({
  plugins: [react(), crx({ manifest })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSYWdoYXYgU2luZ2xhXFxcXERlc2t0b3BcXFxcY29tcGxldGVcXFxcZXh0ZW5zaW9uLXJlYWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxSYWdoYXYgU2luZ2xhXFxcXERlc2t0b3BcXFxcY29tcGxldGVcXFxcZXh0ZW5zaW9uLXJlYWN0XFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9SYWdoYXYlMjBTaW5nbGEvRGVza3RvcC9jb21wbGV0ZS9leHRlbnNpb24tcmVhY3Qvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBmaWxlVVJMVG9QYXRoIH0gZnJvbSBcInVybFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXG5cbi8vIGltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0Lmpzb24nXG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbmNvbnN0IG1hbmlmZXN0ID0ge1xuICBcIm1hbmlmZXN0X3ZlcnNpb25cIjogMyxcbiAgXCJuYW1lXCI6IFwiTXkgTmV3IFRhYiBFeHRlbnNpb25cIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkEgY3VzdG9tIG5ldyB0YWIgcGFnZSBidWlsdCB3aXRoIFZpdGUgYW5kIFJlYWN0LlwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImljb25zXCI6IHtcbiAgICBcIjE2XCI6IFwiaWNvbnMvaWNvbjE2LnBuZ1wiLFxuICAgIFwiNDhcIjogXCJpY29ucy9pY29uNDgucG5nXCIsXG4gICAgXCIxMjhcIjogXCJpY29ucy9pY29uMTI4LnBuZ1wiXG4gIH0sXG4gIFwicGVybWlzc2lvbnNcIjogW1wic3RvcmFnZVwiXSxcbiAgXCJjaHJvbWVfdXJsX292ZXJyaWRlc1wiOiB7XG4gICAgXCJuZXd0YWJcIjogXCJpbmRleC5odG1sXCJcbiAgfSxcbiAgXCJjb250ZW50X3NlY3VyaXR5X3BvbGljeVwiOiB7XG4gICAgXCJleHRlbnNpb25fcGFnZXNcIjogXCJzY3JpcHQtc3JjICdzZWxmJzsgb2JqZWN0LXNyYyAnc2VsZic7XCJcbiAgfSxcbiAgXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCksIGNyeCh7IG1hbmlmZXN0IH0pXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFxVyxTQUFTLHFCQUFxQjtBQUNuWSxPQUFPLFVBQVU7QUFDakIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsV0FBVztBQUo2TSxJQUFNLDJDQUEyQztBQVFsUixJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTSxXQUFXO0FBQUEsRUFDZixvQkFBb0I7QUFBQSxFQUNwQixRQUFRO0FBQUEsRUFDUixlQUFlO0FBQUEsRUFDZixXQUFXO0FBQUEsRUFDWCxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsZUFBZSxDQUFDLFNBQVM7QUFBQSxFQUN6Qix3QkFBd0I7QUFBQSxJQUN0QixVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0EsMkJBQTJCO0FBQUEsSUFDekIsbUJBQW1CO0FBQUEsRUFDckI7QUFFRjtBQUdBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQUEsRUFDcEMsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
