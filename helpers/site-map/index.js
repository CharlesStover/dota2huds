const fs = require('fs');
const yyyyMmDd = require('./yyyy-mm-dd');

class SiteMap {

  constructor(loc) {
    this._dir = './';
    this._loc = loc;
    this._sitemap = '';
    this.fileMTime = this.fileMTime.bind(this);
  }

  fileMTime(file) {
    return (
      fs.existsSync(this._dir + file) ?
        fs.statSync(this._dir + file).mtimeMs :
        0
    );
  }

  setDir(dir) {
    this._dir = dir + '/';
    return this;
  }

  toString() {
    return (
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
        this._sitemap +
      '</urlset>\n'
    );
  }

  url(loc, changefreq, priority = 0.5, lastmodFiles = []) {
    const _lastmodFiles =
      Array.isArray(lastmodFiles) ?
        [ ...lastmodFiles ] :
        [ lastmodFiles ];
    const lastmods = _lastmodFiles.map(this.fileMTime);
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
}

module.exports = SiteMap;
