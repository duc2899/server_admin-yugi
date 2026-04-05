module.exports = {
  apps: [
    {
      name: "server-yugi",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        CORS_ORIGIN: "https://yugi-manager.vercel.app"
      },
    },
    {
      name: "cloudflared",
      script: "C:\\Users\\ADMIN\\cloudflared\\cloudflared.exe",
      args: "tunnel run yugi-tunnel",
      autorestart: true,
    },
  ],
};