const http = require('http');
const app = require('express')();

app.get('/sitemap.xml', (req, res) => {
  res.status(200).send('yes');
});

/*
RewriteRule ([\+\-\d\w]+)/style(\d+)?\.css$ hud.css.php?hud=$1&style=$2 [L,NC]
RewriteRule ^huds\.js$ huds.js.php [L,NC]
RewriteRule ^global\.css$ global.css.php [L,NC]
RewriteRule \.png$ optimize.png.php [L,NC]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule .+\/(?:index\.html)? index.php [L,NC]

app.get('/')
*/

http.createServer(app).listen(80);
