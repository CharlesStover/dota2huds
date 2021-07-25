(function(HUDs) {
  var currentHud =
    location.pathname === '/dota2huds/' ?
      'default' :
      location.pathname.match(/^\/dota2huds\/(.+?)\/(?:\d+\/)?$/)[1];

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
        hudEntry[1][styleId + 1] === null ?
          '' :
          ' (' + hudEntry[1][styleId + 1] + ')'
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
        '/dota2huds/' :
        '/dota2huds/' + hudUrl + '/'
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

    // Create a stylesheet for this HUD, if it wasn't eagerly loaded.
    if (id !== currentHud) {
      var link = document.createElement("link");
      link.disabled =
        (id === 'default' && location.pathname !== '/dota2huds/') ||
        (id !== 'default' && location.pathname.substring(11, id.length + 11) !== id);
      link.setAttribute('href', '/dota2huds/' + id + '/screen.css');
      link.setAttribute('id', 'hud-' + id);
      link.setAttribute('media', 'screen');
      link.setAttribute('rel', 'alternate stylesheet');
      link.setAttribute('title', name);
      link.setAttribute('type', 'text/css');
      head.appendChild(link);
    }

    // For each style of the HUD,
    for (var y = 0; y < stylesLength; y++) {
      var styleId =
        y === 0 ?
          id :
          id + '/' + y;

      // Create an <option>
      var option = document.createElement('option');
      if (location.pathname === '/dota2huds/' + styleId + '/') {
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

  // <select>
  var main = document.getElementsByTagName('main').item(0).getElementsByTagName('section').item(0);
  main.insertBefore(select, main.lastChild);
  select.focus();

  window.addEventListener(
    'popstate',
    function() {
      var hudUrl = location.pathname.substring(11, location.pathname.length - 1);
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
