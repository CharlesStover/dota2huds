const fs = require('fs');
const yyyyMmDd = require('./yyyy-mm-dd');

const fileMTime = file =>
  fs.existsSync(file) ?
    fs.statSync(file).mtimeMs :
    0;

class SiteMap {

  constructor(loc) {
    this._loc = loc;
    this._sitemap = '';
  }

  toString() {
    return (
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        this._sitemap +
      '</urlset>\n'
    );
  }

  url(loc, lastmodFiles, changefreq, priority = 0.5) {
    const _lastmodFiles =
      Array.isArray(lastmodFiles) ?
        [ ...lastmodFiles ] :
        [ lastmodFiles ];
    const lastmods = _lastmodFiles.map(fileMTime);
    const lastmod = new Date(Math.max.apply(null, lastmods));
    this._sitemap +=
      '<url>' +
        '<loc>' + this._loc + loc + '</loc>' +
        '<lastmod>' + yyyyMmDd(lastmod) + '</lastmod>' +
        '<changefreq>' + changefreq + '</changefreq>' +
        '<priority>' +
          (priority === 1 ? '1.0' : priority) +
        '</priority>' +
      '</url>';
    return this;
  }

  urls(urls) {
    const urlsLength = urls.length;
    for (let x = 0; x < urlsLength; x++) {
      this.url(...urls[x]);
    }
    return this;
  }

  writeSync(pathName) {
    fs.writeFileSync(pathName, this.toString());
    return this;
  }
}

module.exports = SiteMap;
