const fs = require('fs');
const huds = require('../src/constants/huds');
const SiteMap = require('../helpers/site-map/index');

const hudsEntries = Object.entries(huds);



// CSS
const elements = Object.entries({
  'background-4-3': 'inventory/background_4_3.png',
  'background-wide': 'inventory/background_wide.png',
  'center-left': 'actionpanel/center_left.png',
  'center-left-wide': 'actionpanel/center_left_wide.png',
  'center-right': 'actionpanel/center_right.png',
  'light-4-3': 'actionpanel/light_4_3.png',
  'light-16-9': 'actionpanel/light_16_9.png',
  'light-16-10': 'actionpanel/light_16_10.png',
  'light-right-4-3': [ 'inventory/light_4_3.png', 'inventory/light_right_4_3.png' ],
  'light-right-16-9': [ 'inventory/light_16_9.png', 'inventory/light_right_16_9.png' ],
  'light-right-16-10': [ 'inventory/light_16_10.png', 'inventory/light_right_16_10.png' ],
  minimapborder: 'actionpanel/minimapborder.png',
  portrait: 'actionpanel/portrait.png',
  'portrait-bg': 'icon.png',
  'portrait-wide': 'actionpanel/portrait_wide.png',
  'rocks-4-3': 'inventory/rocks_4_3.png',
  'rocks-16-9': 'inventory/rocks_16_9.png',
  'rocks-16-10': 'inventory/rocks_16_10.png',
  spacer: 'inventory/spacer.png',
  'spacer-16-9': 'actionpanel/spacer_16_9.png',
  'spacer-16-10': 'actionpanel/spacer_16_10.png',
  'stash-lower': 'inventory/stash_lower.png',
  'stash-lower:hover': 'inventory/stash_active_lower.png',
  'stash-upper': 'inventory/stash_upper.png'
});

// Create CSS for an image by checking that it exists.
const cssIfFile = (element, hud, url, style = null) => {
  const styleUrl =
    style === null ?
      url :
      url.replace(/^(\w+)/, '$1/style' + style);
  return (
    fs.existsSync(__dirname + '/../hud_skins/' + hud + '/' + styleUrl) ?
      (style === null ? '' : '.style' + style + ' ') +
      '#' + element + '{background-image:url(/' + hud + '/' + styleUrl + ')}' :
      ''
  );
};

// For each HUD,
for (const [ hud, styles ] of hudsEntries) {

  let css = '';

  // Check each element for its respective image.
  for (const [ element, urls ] of elements) {

    // If this element's image path differs, find the one that exists.
    if (Array.isArray(urls)) {
      for (const url of urls) {
        const elementCss = cssIfFile(element, hud, url);
        if (elementCss !== '') {
          css += elementCss;
          break;
        }
      }
    }

    // If this element has only one image path,
    else {
      css += cssIfFile(element, hud, urls);
    }
  }

  // Mandatory day-night and topbar with default fallback.
  css += cssIfFile('day-night', hud, 'scoreboard/daynight.png') || cssIfFile('day-night', 'default', 'scoreboard/daynight.png');
  css += cssIfFile('topbar', hud, 'scoreboard/topbar.png') || cssIfFile('topbar', 'default', 'scoreboard/topbar.png');

  // If the HUD has styles,
  if (Array.isArray(styles)) {
    const stylesLength = styles.length;

    // Check each style for images.
    for (let style = 1; style < stylesLength; style++) {

      // For each element,
      for (const [ element, urls ] of elements) {

        // Check each image that element may have.
        if (Array.isArray(urls)) {
          for (const url of urls) {
            const elementCss = cssIfFile(element, hud, url, style);
            if (elementCss !== '') {
              css += elementCss;
              break;
            }
          }
        }

        // If that element has only one image, check only it.
        else {
          css += cssIfFile(element, hud, urls, style);
        }
      }
    }
  }

  fs.writeFileSync(
    __dirname + '/../build/' + hud + '.css',
    css
  );
}



// HTML
const indexHtml = fs.readFileSync(__dirname + '/../src/index.html').toString();
for (const [ hudId, styles ] of hudsEntries) {
  const hudName =
    Array.isArray(styles) ?
      styles[0] :
      styles;

  const index =
    indexHtml
      .replace(/${HUD_ID}/, hudId)
      .replace(
        /${MARKET_LINK}/,
        '<a href="http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&amp;category_570_Slot%5B%5D=any&amp;category_570_Type%5B%5D=tag_hud_skin&amp;appid=570&amp;q=' + encodeURIComponent(hudName) + '" id="market" rel="nofollow noopener noreferrer" target="_blank">market</a>'
      );

  const metaKeywords =
    'dota ' + hudName + ', ' +
    'dota ' + hudName + ' hud, ' +
    'dota 2 ' + hudName + ', ' +
    'dota 2 ' + hudName + ' hud, ' +
    hudName + ', ' +
    hudName + ' hud';

  // Create a page for each style.
  if (Array.isArray(styles)) {
    const stylesLength = styles.length;
    for (let style = 1; style < stylesLength; style++) {
      fs.writeFileSync(
        __dirname + '/../build/' + hudId + (style > 1 ? '/' + style : ''),
        index
          .replace(/${BODY_CLASS}/, ' class="style' + style + '"')
          .replace(/${META_DESCRIPTION}/, 'the ' + hudName + ' HUD, ' + styles[style] + ' style')
          .replace(
            /${META_KEYWORDS}/,
            metaKeywords + ', ' +
            'dota ' + styles[style] + ', ' +
            'dota ' + styles[style] + ' hud, ' +
            'dota ' + hudName + ' ' + styles[style] + ', ' +
            'dota ' + hudName + ' ' + styles[style] + ' hud, ' +
            'dota 2 ' + styles[style] + ', ' +
            'dota 2 ' + styles[style] + ' hud, ' +
            'dota 2 ' + hudName + ' ' + styles[style] + ', ' +
            'dota 2 ' + hudName + ' ' + styles[style] + ' hud, ' +
            styles[style] + ', ' +
            styles[style] + ' hud, ' +
            hudName + ' ' + styles[style] + ', ' +
            hudName + ' ' + styles[style] + ' hud'
          )
          .replace(/${TITLE}/, hudName + '(' + styles[style] + ') - ')
      );
    }
  }

  // Create a single page if there's only one style.
  else {
    fs.writeFileSync(
      __dirname + '/../build/' + hudId,
      index
        .replace(/${BODY_CLASS}/, '')
        .replace(/${META_DESCRIPTION}/, 'the ' + hudName + ' HUD')
        .replace(/${META_KEYWORDS}/, metaKeywords)
        .replace(/${TITLE}/, hudName + ' - ')
    );
  }
}

fs.writeFileSync(
  __dirname + '/../build/index.html',
  indexHtml
    .replace(/${BODY_CLASS}/, '')
    .replace(/${HUD_ID}/, 'default')
    .replace(/${MARKET_LINK}/, '')
    .replace(/${META_DESCRIPTION}/, 'all the Dota 2 HUDs')
    .replace(/${META_KEYWORDS}/, 'dota 2 hud gallery, dota 2 hud skins, dota 2 huds, dota hud gallery, dota hud skins, dota huds')
    .replace(/${TITLE}/, '')
);



// huds.js
fs.writeFileSync(
  __dirname + '/../build/huds.js',
  'var HUDs = ' + JSON.stringify(huds) + ';\n'
);



// sitemap.xml
fs.writeFileSync(
  __dirname + '/../build/sitemap.xml',
  new SiteMap('https://dota2huds.com/')
    .setDir(__dirname)
    .url('', 'monthly', 1, [
      '../src/constants/huds.js',
      'build.js'
    ])
    .urls(
      Object.keys(huds)
        .map(hud => [ hud, 'yearly', 0.5, [
          '../hud_skins/' + hud + '/icon.png',
          '../hud_skins/' + hud + '/scoreboard/daynight.png'
        ]])
    )
);
