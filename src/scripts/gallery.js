(function(HUDs, stylesheets, head, main, select) {

  // For each HUD,
  var hudsLength = HUDs.length;
  for (var x = 0; x < hudsLength; x++) {
    var hud = HUDs[x];
    var id = hud[0];
    var hasStyles = typeof hud[1] !== 'string';
    var name = hasStyles ? hud[1][0] : hud[1];
    var styles = hasStyles ? hud[1].slice(1) : [ name ];
    var stylesLength = styles.length;

    if (hasStyles) {
      for (var y = 1; y < stylesLength; y++) {
        styles[y] =
          styles[y] === null ?
            name :
            name + ' (' + styles[y] + ')';
      }
    }

    var link = document.createElement("link");
    link.disabled =
      (id === 'default' && location.pathname !== '/') ||
      !location.pathname.match(new RegExp('^\\/' + id + '\\/'));
    link.setAttribute('href', '/' + id + '/screen.css');
    link.setAttribute('hud-' + id);
    link.setAttribute('media', 'screen');
    link.setAttribute('rel', 'alternate stylesheet');
    link.setAttribute('title', name);
    link.setAttribute('type', 'text/css');
    head.appendChild(link);
    document.body.removeChild(stylesheets.item(stylesheets.length - 1));

    for (x = 0; x < stylesLength; x++) {
      var styleId =
        x === 0 ?
          id :
          id + '/' + x;
      var option = document.createElement("option");
      if (location.pathname === '/' + styleId) {
        option.setAttribute('selected', 'selected');
      }
      option.setAttribute('value', styleId);
      option.appendChild(document.createTextNode(name));
      select.appendChild(option);
    }
  }

  // onchange
  var change = function(id, alt) {
      if (typeof(id) != "string") {
        id = this.options[this.selectedIndex].getAttribute("value");
        if (id.match(/\-\-\-\d+$/)) {
          var alt = id.match(/\-\-\-(\d+)$/)[1];
          id = id.split(/\-\-\-/)[0];
        }
        else
          alt = false;
        market.setAttribute(
          "href",
          "http://steamcommunity.com/market/search?category_570_Hero%5B%5D=any&category_570_Slot%5B%5D=any&category_570_Type%5B%5D=tag_hud_skin&appid=570" + (id != "default" ? "&q=" + HUDs[id][HUDs[id][0] ? 0 : 1] : "")
        );
      }
      else if (typeof(alt) != "number")
        alt = false;
      document.getElementById(current).disabled = true;
      current = id + (alt ? "---" + alt : "");
      document.getElementById(current).disabled = false;
      //history.pushState({id: id, alt: alt, selectedIndex: this.selectedIndex}, HUDs[id][alt ? alt + 1 : 1], permalink.getAttribute("href"));
    };
  select.addEventListener("change", change);
  change('default');

  // popstate
  window.addEventListener(
    'popstate',
    function(event) {
      select.selectedIndex = event.state.selectedIndex;
      change(event.state.id, event.state.alt);
    }
  );

  // <select>
  main.appendChild(select);
})(
  process.env.HUDs,
  document.getElementsByTagName('link'),
  document.getElementsByTagName('head').item(0),
  document.getElementsByTagName('main').item(0),
  document.createElement("select")
);
