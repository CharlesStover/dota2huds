const fs = require('fs');
const huds = require('../src/constants/huds');
const SiteMap = require('../helpers/site-map/index');

const hudsEntries = Object.entries(huds);



// Directories
fs.mkdirSync(__dirname + '/../build');
for (const [ hud, styles ] of hudsEntries) {
  fs.mkdirSync(__dirname + '/../build/' + hud);
  if (Array.isArray(styles)) {
    const stylesLength = styles.length;
    for (let style = 2; style < stylesLength; style++) {
      fs.mkdirSync(__dirname + '/../build/' + hud + '/' + (style - 1));
    }
  }
}



// CSS
const elements = Object.entries({
  'background-4-3': 'inventory/background_4_3.png',
  'background-wide': 'inventory/background_wide.png',
  'center-left': 'actionpanel/center_left.png',
  'center-left-wide': 'actionpanel/center_left_wide.png',
  'center-right': 'actionpanel/center_right.png',
  'day-night': 'scoreboard/daynight.png',
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
  'stash-upper': 'inventory/stash_upper.png',
  topbar: 'scoreboard/topbar.png'
});

// Create CSS for an image by checking that it exists.
const cssIfFile = (element, hud, url, style = 0) => {
  const styleUrl =
    style === 0 ?
      url :
      url.replace(/^(\w+)/, '$1/style' + style);
  return (
    fs.existsSync(__dirname + '/../hud_skins/' + hud + '/' + styleUrl) ?
      (style === 0 ? '' : '.style' + style + ' ') +
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
  if (!fs.existsSync(__dirname + '/../hud_skins/' + hud + '/scoreboard/daynight.png')) {
    css += cssIfFile('day-night', 'default', 'scoreboard/daynight.png');
  }
  if (!fs.existsSync(__dirname + '/../hud_skins/' + hud + '/scoreboard/topbar.png')) {
    css += cssIfFile('topbar', 'default', 'scoreboard/topbar.png');
  }

  // If the HUD has styles,
  if (Array.isArray(styles)) {
    const stylesLength = styles.length;

    // Check each style for images.
    for (let style = 2; style < stylesLength; style++) {

      // For each element,
      for (const [ element, urls ] of elements) {

        // Check each image that element may have.
        if (Array.isArray(urls)) {
          for (const url of urls) {
            const elementCss = cssIfFile(element, hud, url, style - 1);
            if (elementCss !== '') {
              css += elementCss;
              break;
            }
          }
        }

        // If that element has only one image, check only it.
        else {
          css += cssIfFile(element, hud, urls, style - 1);
        }
      }
    }
  }

  fs.writeFileSync(
    __dirname + '/../build/' + hud + '/screen.css',
    css + (
      hud === 'default' ||
      hud === 'diretide2013' ||
      hud === 'sample' ?
        '#market{display:none}' :
        ''
    ) + '\n'
  );
}



// HTML
const indexHtml = fs.readFileSync(__dirname + '/../src/index.html').toString()
  .replace(/\r?\n\s*/g, '')
  .replace(/<!\-\-.+?\-\->/g, '') + '\n';
for (const [ hudId, styles ] of hudsEntries) {
  if (hudId === 'default') {
    continue;
  }
  const hudName =
    Array.isArray(styles) ?
      styles[0] :
      styles;

  const index =
    indexHtml
      .replace(/\${FAVICON}/, hudId + '/icon.png')
      .replace(/\${HUD_ID}/g, hudId)
      .replace(/\${MARKET_QUERY}/, '&amp;q=' + encodeURIComponent(hudName));

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
        __dirname + '/../build/' + hudId + '/' + (style === 1 ? '' : (style - 1) + '/') + 'index.html',
        index
          .replace(
            /\${BODY_CLASS}/,
            style === 1 ?
              '' :
              ' class="style' + (style - 1) + '"'
          )
          .replace(
            /\${HUD_NAME}/,
            hudName +
            (
              styles[style] === null ?
                '' :
                ' (' + styles[style] + ')'
            )
          )
          .replace(
            /\${META_DESCRIPTION}/,
            'View a live render of the ' + hudName + ' HUD' +
            (
              styles[style] === null ?
                '' :
                ', ' + styles[style] + ' style'
            ) +
            '!'
          )
          .replace(
            /\${META_KEYWORDS}/,
            metaKeywords +
            (
              styles[style] === null ?
                '' :
                ', dota ' + styles[style] + ' hud' +
                ', dota ' + hudName + ' ' + styles[style] +
                ', dota ' + hudName + ' ' + styles[style] + ' hud' +
                ', dota 2 ' + styles[style] + ' hud' +
                ', dota 2 ' + hudName + ' ' + styles[style] +
                ', dota 2 ' + hudName + ' ' + styles[style] + ' hud' +
                ', ' + hudName + ' ' + styles[style] +
                ', ' + hudName + ' ' + styles[style] + ' hud'
            )
          )
          .replace(
            /\${TITLE}/,
            hudName +
            (styles[style] === null ? '' : ' (' + styles[style] + ')') +
            ' - Dota 2 HUDs'
          )
      );
    }
  }

  // Create a single page if there's only one style.
  else {
    fs.writeFileSync(
      __dirname + '/../build/' + hudId + '/index.html',
      index
        .replace(/\${BODY_CLASS}/, '')
        .replace(/\${HUD_NAME}/, hudName)
        .replace(/\${META_DESCRIPTION}/, 'View a live render of the ' + hudName + ' HUD!')
        .replace(/\${META_KEYWORDS}/, metaKeywords)
        .replace(/\${TITLE}/, hudName + ' - Dota 2 HUDs')
    );
  }
}

fs.writeFileSync(
  __dirname + '/../build/index.html',
  indexHtml
    .replace(/\${BODY_CLASS}/, '')
    .replace(/\${FAVICON}/, 'favicon.ico')
    .replace(/\${HUD_ID}/g, 'default')
    .replace(/\${HUD_NAME}/, 'Default')
    .replace(/\${MARKET_QUERY}/, '')
    .replace(/\${META_DESCRIPTION}/, 'Try before you buy! View a live render of all the Dota 2 HUDs!')
    .replace(/\${META_KEYWORDS}/, 'dota 2 hud gallery, dota 2 hud skins, dota 2 huds, dota hud gallery, dota hud skins, dota huds')
    .replace(/\${TITLE}/, 'Dota 2 HUDs')
);



// screen.css
fs.writeFileSync(
  __dirname + '/../build/screen.css',
  (
    fs.readFileSync(__dirname + '/../src/styles/resolutions.css').toString() +
    fs.readFileSync(__dirname + '/../src/styles/screen.css').toString()
  )
    .replace(/\r?\n\s*/g, '')
    .replace(/\/\*.+?\*\//g, '')
    .replace(/;}/g, '}') + '\n'
);



// script.js
const hudEntriesSort = ([ hudId1, hudName1 ], [ hudId2, hudName2 ]) =>
  hudId1 === 'default' ?
    -1 :
    hudId2 === 'default' ?
      1 :
      (Array.isArray(hudName1) ? hudName1[0] : hudName1).toLowerCase() <
      (Array.isArray(hudName2) ? hudName2[0] : hudName2).toLowerCase() ?
        -1 :
        1;
fs.writeFileSync(
  __dirname + '/../build/script.js',
  fs.readFileSync(__dirname + '/../src/scripts/resize.js').toString() +
  fs.readFileSync(__dirname + '/../src/scripts/gallery.js').toString()
    .replace(/process\.env\.HUDs/, JSON.stringify(hudsEntries.sort(hudEntriesSort))) + '\n'
);



// sitemap.xml
fs.writeFileSync(
  __dirname + '/../build/sitemap.xml',
  new SiteMap('https://dota2huds.com/')
    .setDir(__dirname)
    .urls(
      Object.keys(huds)
        .map(hud =>
          hud === 'default' ?
            [
              '',
              'monthly',
              1.0,
              [ 'build.js' ]
            ] :
            [
              hud + '/',
              'yearly',
              0.5,
              [
                '../hud_skins/' + hud + '/icon.png',
                '../hud_skins/' + hud + '/scoreboard/daynight.png'
              ]
            ]
        )
    )
);
