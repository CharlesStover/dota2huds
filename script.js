(function(){
  var bottom = document.getElementById('bottom');
  var toptop = document.getElementById('top');
  var resize = function() {
    var z = Math.floor(document.body.clientWidth / (document.body.clientWidth / document.body.clientHeight <= 4/3 ? 2134 : 2560) * 10000) / 10000;
    bottom.style.mozTransform = 'scale(' + z + ')';
    bottom.style.msTransform = 'scale(' + z + ')';
    bottom.style.oTransform = 'scale(' + z + ')';
    bottom.style.transform = 'scale(' + z + ')';
    bottom.style.webkitTransform = 'scale(' + z + ')';
    toptop.style.mozTransform = 'scale(' + z + ')';
    toptop.style.msTransform = 'scale(' + z + ')';
    toptop.style.oTransform = 'scale(' + z + ')';
    toptop.style.transform = 'scale(' + z + ')';
    toptop.style.webkitTransform = 'scale(' + z + ')';
  };
  resize();
  window.addEventListener('resize', resize);
})();
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
})([["default","Default"],["alliance",["Alliance","Normal","Rainy"]],["antiquity","Antiquity"],["zodiac_hud","Azure Constellation"],["bts_summit","Beyond the Summit"],["black_monolith","Black Monolith"],["brawl_basher","Brawl Basher"],["brewery","Brewery"],["tarantula","Brood Hunter"],["diretide","Cruel Diretide"],["crystalmana","Crystallized Mana"],["curiosity_hud","Curiosity"],["d2cls5_hud","D2CL Season 5"],["cold_depths","Deepest Depths"],["demonichud","Demonic Essence"],["free_to_play","Depth of Field"],["detonation","Detonation"],["weplay","Dim Forest"],["dire","Direstone"],["diretide2013","Diretide (2013)"],["donbass_cup_hud","DonBass Cup Season 3"],["_hud_skin__donbass_cup","DonBass Cup Season 3 (Copy)"],["dac_2015","Dota 2 Asia Championship"],["dc_dayhud",["DotaCinema","Dark","Bright"]],["dragon_scale","Dragon Scale"],["driftwood","Driftwood"],["dark_forest","Elder Bark"],["empower","Empowered"],["esl_one_hud_fortress","ESL One Fortress"],["eswc_diamond","ESWC Diamond"],["evil_genius_hud","Evil Geniuses"],["familiar_woods",["Familiar Woods","Woodsy","Shagbark!"]],["force_of_spirit","Force of Spirit"],["frozen_touch","Frozen Touch"],["ferocious","Furnace"],["gear_tooth","Gear Tooth"],["ghostly_silence","Ghostly Silence"],["golden_treasures","Golden Treasures"],["green_ural","Green Ural"],["dotapit_s3_hud","Hearth of the Pit"],["hellfire","Hellfire"],["fireborn_hud",["HUD of the Burning Scale","Default","Poison","Fire","Ice"]],["dancing_butterfly_loading_screen","i-League Season 2"],["spirit_stones","Imbued Stone"],["iron_cage","Iron Cage"],["iron_thorn","Iron Thorn"],["jollyroger",["Jolly Roger","Davy Jones","Landlubber"]],["jungle_ruin","Jungle Ruin"],["livingindarkness","Living in Darkness"],["menace","Malice"],["mana_pool","Mana Pool"],["bane_delirium","Midnight Terror"],["stronghold","MLG Stronghold"],["armory","MLG Stronghold (Copy)"],["nature","Nature"],["necropolis","Necropolis"],["new_bloom","New Bloom"],["od","Omen"],["portal","Portal"],["starladder","Powered Star"],["radiantentity","Radiant Entity"],["radiant","Radiant Ore"],["redwarrior_hud","Red Warrior"],["eslbrazil_hud","Rei da Mesa"],["reign_of_maelrawn_hud_-_fgcl","Reign of Maelrawn"],["royal_crypt_hud","Royal Crypt"],["sample","Sample"],["hud_sandsofluxor","Sands of Luxor"],["dreamleague",["Scions of the Sky",null,"Alternative Style"]],["sltvx","SLTV Star Series X"],["winter","Snows of Frostivus"],["hud_springessence","Spring Essence"],["premier_league","Stone Ruin"],["esp_surge_hud","Surge"],["power_surge","Surge (Copy)"],["team_empire_hud","Team Empire"],["techlabs2014","Techlabs Moscow Cup 2014"],["crystal_wings","Tempest Wing"],["temple_wall","Temple"],["sacredmemories_hud","Temple of the Sacred Memories"],["the_international_2015","The International 2015 HUD"],["the_international_2016","The International 2016 HUD"],["bts3_hud","The Summit 3"],["three_virtues","Three Virtues"],["thunder_spirit","Thunder Spirit"],["timber_fury","Timber Fury"],["titan_hud","Titan"],["undying_hud","Tombstone"],["quake","Tremor"],["ti4","Triumph"],["underwater","Underwater"],["ti3","Valor"],["steelseries_bamboo","Vermilion"],["vici_gaming","ViCi Gaming"],["virtus_pro","Virtus.Pro"],["guardian_angel","Winged Guardian"]]);

