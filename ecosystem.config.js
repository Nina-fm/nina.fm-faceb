module.exports = {
  apps: [
    {
      name: "FaceB",
      port: "3000",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
  deploy: {
    // "production" is the environment name
    production: {
      user: "vince",
      host: ["flux.nina.fm"],
      ref: "origin/dev",
      repo: "git@github.com:Nina-fm/nina.fm-faceb.git",
      ssh_options: ["ForwardAgent=yes"],
      path: "/var/www/html/nina.fm-faceb",
      "post-deploy": "yarn && yarn build && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
}
