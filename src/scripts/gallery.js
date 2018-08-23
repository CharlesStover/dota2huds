(function(HUDs) {
  var currentHud =
    location.pathname === '/' ?
      'default' :
      location.pathname.match(/^\/(.+?)\/(?:\d+\/)?$/)[1];

  var market = document.getElementById('market');
  var changeHud = function(hudUrl) {
    var hud = hudUrl.match(/^(.+?)(?:\/(\d+))?$/);
    var hudId = hud[1];
    var styleId = hud[2] ? parseInt(hud[2], 10) : null;
    var hudEntry = HUDs.find(
      function(_hudEntry) {
        return _hudEntry[0] === hudId;
      }
    );
    var hudName =
      typeof hudEntry[1] === 'string' ?
        hudEntry[1] :
        hudEntry[1][0];
    var styleName =
      hudName + (
        typeof hudEntry[1] === 'string' ||
        hudEntry[1][styleId] === null ?
          '' :
          ' (' + hudEntry[1][styleId] + ')'
      );
    document.title =
      hudId === 'default' ?
        'Dota 2 HUDs' :
        styleName + ' - Dota 2 HUDs';
    document.getElementById('hud-' + currentHud).disabled = true;
    document.getElementById('hud-' + hudId).disabled = false;
    document.body.className =
      styleId ?
        'style' + styleId :
        '';
    market.setAttribute(
      'href',
      'http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&category_570_Slot%5B%5D=any&category_570_Type%5B%5D=tag_hud_skin&appid=570&q=' +
      encodeURIComponent(hudName)
    );
    currentHud = hudId;
    return [ hudId, styleName ];
  };

  // Build a <select>
  var select = document.createElement('select');
  select.addEventListener('change', function(e) {
    var hudUrl = this.options[this.selectedIndex].getAttribute('value');
    var hud = changeHud(hudUrl);
    var hudId = hud[0];
    var styleName = hud[1];
    history.pushState(
      null,
      hudId === 'default' ?
        'Dota 2 HUDs' :
        styleName + ' - Dota 2 HUDs',
      hudId === 'default' ?
        '/' :
        '/' + hudUrl + '/'
    );
  });

  // For each HUD,
  var head = document.getElementsByTagName('head').item(0);
  var hudsLength = HUDs.length;
  for (var x = 0; x < hudsLength; x++) {
    var hud = HUDs[x];
    var id = hud[0];
    var hasStyles = typeof hud[1] !== 'string';
    var name = hasStyles ? hud[1][0] : hud[1];
    var styles = hasStyles ? hud[1].slice(1) : [ name ];
    var stylesLength = styles.length;

    // Generate the style name.
    if (hasStyles) {
      for (var y = 0; y < stylesLength; y++) {
        styles[y] =
          styles[y] === null ?
            name :
            name + ' (' + styles[y] + ')';
      }
    }

    // Create a stylesheet for this HUD.
    var link = document.createElement("link");
    link.disabled =
      (id === 'default' && location.pathname !== '/') ||
      (id !== 'default' && location.pathname.substring(1, id.length + 1) !== id);
    link.setAttribute('href', '/' + id + '/screen.css');
    link.setAttribute('id', 'hud-' + id);
    link.setAttribute('media', 'screen');
    link.setAttribute('rel', 'alternate stylesheet');
    link.setAttribute('title', name);
    link.setAttribute('type', 'text/css');
    head.appendChild(link);

    // For each style of the HUD,
    for (var y = 0; y < stylesLength; y++) {
      var styleId =
        y === 0 ?
          id :
          id + '/' + y;

      // Create an <option>
      var option = document.createElement('option');
      if (location.pathname === '/' + styleId + '/') {
        option.setAttribute('selected', 'selected');
      }
      option.setAttribute('value', styleId);
      option.appendChild(document.createTextNode(
        id === 'default' ?
          'Select a HUD' :
          styles[y]
      ));
      select.appendChild(option);
    }
  }

  // Remove the below-the-fold stylesheet.
  var stylesheets = document.getElementsByTagName('link');
  document.body.removeChild(stylesheets.item(stylesheets.length - 1));

  // <select>
  var main = document.getElementsByTagName('main').item(0).getElementsByTagName('section').item(0);
  main.insertBefore(select, main.lastChild);

  window.addEventListener(
    'popstate',
    function() {
      var hudUrl = location.pathname.substring(1, location.pathname.length - 1);
      var options = select.getElementsByTagName('option');
      var optionsLength = options.length;
      for (var x = 0; x < optionsLength; x++) {
        if (options.item(x).getAttribute('value') === hudUrl) {
          select.selectedIndex = x;
          break;
        }
      }
      changeHud(hudUrl);
    }
  );
})(process.env.HUDs);
