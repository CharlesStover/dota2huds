const fs = require('fs');
const huds = require('../src/constants/huds');
const SiteMap = require('../helpers/site-map/index');

// huds.js
fs.writeSync(__dirname + '/../dist/huds.js', JSON.stringify(huds));

// sitemap.xml
new SiteMap('https://dota2huds.com/')
  .url('', [ __dirname + '/../src/build.js' ], 'monthly', 1)
  .urls(
    Object.keys(huds)
      .map(hud => [
        hud,
        [
          __dirname + '/../src/hud_skins/' + hud + '/icon.png',
          __dirname + '/../src/hud_skins/' + hud + '/scoreboard/daynight.png'
        ],
        'yearly',
        0.5
      ])
  )
  .writeSync(__dirname + '/../dist/sitemap.xml');
