module.exports = {
  apps: [
    {
      name: "nina-face-b",
      port: "3002",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
}
