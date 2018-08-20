const fs = require('fs');
const huds = require('../src/constants/huds');
const SiteMap = require('../helpers/site-map/index');

// huds.js
fs.writeSync(
  __dirname + '/../dist/huds.js',
  'var HUDs = ' + JSON.stringify(huds) + ';\n'
);

// sitemap.xml
new SiteMap('https://dota2huds.com/')
  .setDir(__dirname)
  .url('', 'monthly', 1, [
    '../dist/huds.js',
    'build.js'
  ])
  .urls(
    Object.keys(huds)
      .map(hud => [ hud, 'yearly', 0.5, [
        '../hud_skins/' + hud + '/icon.png',
        '../hud_skins/' + hud + '/scoreboard/daynight.png'
      ]])
  )
  .writeSync('../dist/sitemap.xml');
