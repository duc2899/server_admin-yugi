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